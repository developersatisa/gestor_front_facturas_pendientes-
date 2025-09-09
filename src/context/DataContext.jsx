import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api, { facturasAPI, historialAPI, consultoresAPI, registroAPI } from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de un DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [consultores, setConsultores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const hasLoaded = useRef(false);

  // Estado global de red (badge Header)
  const [apiBusy, setApiBusy] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [apiLastOk, setApiLastOk] = useState(null);

  // Adaptar datos de la API a la UI
  const procesarDatosClientes = (clientesData) => {
    return clientesData.map((cliente) => ({
      id: cliente.idcliente,
      nombre: cliente.nombre_cliente?.trim() || 'Sin nombre',
      cif: cliente.cif_cliente?.trim() || 'Sin CIF',
      cif_empresa: cliente.cif_cliente?.trim() || 'Sin CIF empresa',
      idcliente: cliente.idcliente?.trim() || '',
      facturasPendientes: cliente.numero_facturas || 0,
      montoTotal: parseFloat(cliente.monto_debe) || 0,
      consultorAsignado: null,
    }));
  };

  const cargarDatos = async () => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    try {
      setLoading(true);
      setError(null);

      const [respClientes, respAsign] = await Promise.all([
        facturasAPI.getClientesConResumen(),
        consultoresAPI.listAsignaciones().catch(() => ({ data: [] })),
      ]);

      const clientesData = respClientes.data || [];
      const empresasProcesadas = procesarDatosClientes(clientesData);

      const asignaciones = Array.isArray(respAsign.data) ? respAsign.data : [];
      const mapAsign = new Map();
      for (const a of asignaciones) {
        mapAsign.set(String(a.idcliente), a);
      }
      const empresasConAsign = empresasProcesadas.map((e) => {
        const key = String(e.id) || String(e.idcliente);
        let asign = mapAsign.get(key);
        if (!asign && key) {
          const n = parseInt(key, 10);
          if (!Number.isNaN(n)) asign = mapAsign.get(String(n));
        }
        return asign ? { ...e, consultorAsignado: asign.consultor_nombre } : e;
      });

      setEmpresas(empresasConAsign);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error cargando datos del servidor:', err);
      let errorMessage = 'Error al cargar los datos del servidor.';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'La solicitud tardó más de 5 minutos en responder. El servidor está procesando un gran volumen de empresas. Intenta nuevamente o contacta al administrador si el problema persiste.';
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = 'No se puede conectar al backend. Verifica que esté ejecutándose en http://127.0.0.1:8000';
      } else if (err.response) {
      } else if (err.response) {
        errorMessage = 'Error del servidor: ' + String(err.response.status) + ' - ' + (err.response.statusText || '');
      } else if (err.request) {
        errorMessage = 'No se recibio respuesta del servidor. Verifica la URL y el endpoint.';
      } else {
        errorMessage = 'Error de conexion: ' + String(err.message || '');
      }
      setError(errorMessage);
      // No usar datos mock: mantener vacÃ­o para evitar confusiones
      setEmpresas([]);
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const recargarDatos = () => {
    hasLoaded.current = false;
    cargarDatos();
  };

  // Consultores
  const cargarConsultores = async () => {
    try {
      const { data } = await consultoresAPI.list(false);
      setConsultores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando consultores:', error);
      setConsultores([]);
    }
  };

  const addConsultor = async (consultor) => {
    const payload = {
      nombre: consultor.nombre,
      estado: consultor.estado || 'activo',
    };
    await consultoresAPI.create(payload);
    await cargarConsultores();
  };

  const updateConsultor = async (id, updatedData) => {
    const payload = {
      nombre: updatedData.nombre,
      estado: updatedData.estado || 'activo',
    };
    await consultoresAPI.update(id, payload);
    await cargarConsultores();
  };

  const deleteConsultor = async (id) => {
    await consultoresAPI.remove(id);
    await cargarConsultores();
  };

  // AsignaciÃ³n
  const asignarConsultorACliente = async (idcliente, consultorId) => {
    await consultoresAPI.asignar({ idcliente: parseInt(idcliente, 10), consultor_id: parseInt(consultorId, 10) });
    const c = consultores.find((x) => String(x.id) === String(consultorId));
    if (c) {
      setEmpresas((prev) =>
        prev.map((e) => (String(e.id) === String(idcliente) || String(e.idcliente) === String(idcliente)) ? { ...e, consultorAsignado: c.nombre } : e)
      );
    }
  };

  // Facturas de empresa
  const getFacturasEmpresa = async (empresaId) => {
    try {
      const response = await facturasAPI.getFacturasCliente(empresaId);
      const facturasData = Array.isArray(response.data) ? response.data : [];
      return facturasData.map((factura, idx) => {
        const venc = factura && factura.vencimiento ? String(factura.vencimiento) : '';
        const fecRec = factura && factura.fecha_reclamacion ? String(factura.fecha_reclamacion) : '';
        const importeNum = Number(factura?.importe) || 0;
        const pagoNum = Number(factura?.pago) || 0;
        const pendienteNum = Number(typeof factura?.pendiente === 'number' ? factura.pendiente : importeNum - pagoNum);
        return {
          id: factura?.asiento ?? `${factura?.tipo || 'X'}-${idx}`,
          numero: `${factura?.tipo || 'X'}-${factura?.asiento ?? idx}`,
          nombre_factura: factura?.nombre_factura || null,
          vencimiento: venc ? venc.split('T')[0] : '',
          monto: importeNum,
          estado: factura.estado || (factura.check_pago === 1 ? 'pagado' : 'pendiente'),
          tipo: factura.tipo,
          sociedad: factura.sociedad,
          sociedad_nombre: factura.sociedad_nombre || null,
          tercero: factura.tercero,
          forma_pago: factura.forma_pago,
          nivel_reclamacion: factura.nivel_reclamacion,
          fecha_reclamacion: fecRec ? fecRec.split('T')[0] : '',
          check_pago: factura.check_pago,
          moneda: factura.moneda,
          colectivo: factura.colectivo,
          planta: factura.planta,
          pago: pagoNum,
          pendiente: pendienteNum > 0 ? pendienteNum : 0,
          sentido: factura.sentido,
        };
      });
    } catch (err) {
      console.error('Error cargando facturas de empresa:', err);
      return [];
    }
  };

  // Historial
  const getHistorialFactura = async ({ tercero, tipo, asiento }) => {
    try {
      const { data } = await historialAPI.list({ tercero, tipo, asiento, limit: 100 });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error obteniendo historial:', err);
      return [];
    }
  };

  const registrarEventoHistorial = async (payload) => {
    try {
      const { data } = await historialAPI.add(payload);
      return data;
    } catch (err) {
      console.error('Error registrando evento de historial:', err);
      throw err;
    }
  };

  // Acciones
  const getAcciones = async ({ idcliente, tercero, tipo, asiento, limit = 200 }) => {
    try {
      const { data } = await registroAPI.listAcciones({ idcliente, tercero, tipo, asiento, limit });
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error obteniendo acciones:', err);
      return [];
    }
  };

  const registrarAccion = async ({ idcliente, tercero, tipo, asiento, accion_tipo, descripcion, aviso, usuario }) => {
    try {
      const { data } = await registroAPI.addAccion({ idcliente, tercero, tipo, asiento, accion_tipo, descripcion, aviso, usuario });
      return data;
    } catch (err) {
      console.error('Error registrando acciÃ³n:', err);
      throw err;
    }
  };

  useEffect(() => {
    const run = async () => {
      await Promise.all([cargarConsultores(), cargarDatos()]);
    };
    run();
  }, []);

  useEffect(() => {
    const reqId = api.interceptors.request.use((cfg) => {
      setApiBusy((c) => c + 1);
      return cfg;
    });
    const resId = api.interceptors.response.use(
      (resp) => {
        setApiBusy((c) => Math.max(0, c - 1));
        setApiError(null);
        setApiLastOk(Date.now());
        return resp;
      },
      (err) => {
        setApiBusy((c) => Math.max(0, c - 1));
        const msg = err?.response ? (String(err.response.status) + (err.response.statusText ? ' ' + err.response.statusText : '')) : (err?.message || 'Error de conexion');
        setApiError(msg);
        return Promise.reject(err);
      }
    );
    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, []);

  const value = {
    empresas,
    consultores,
    loading,
    error,
    dataLoaded,
    recargarDatos,
    getFacturasEmpresa,
    asignarConsultorACliente,
    getHistorialFactura,
    registrarEventoHistorial,
    getAcciones,
    registrarAccion,
    addConsultor,
    updateConsultor,
    deleteConsultor,
    apiBusy,
    apiError,
    apiLastOk,
};

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;








