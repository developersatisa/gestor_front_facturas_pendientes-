// Datos de ejemplo para el sistema de gestión

export const mockEmpresas = [
  {
    id: 1,
    nombre: 'Logística Global',
    cif: 'B12345678',
    facturasPendientes: 3,
    montoTotal: 7350.00,
    consultorAsignado: 'María García'
  },
  {
    id: 2,
    nombre: 'Tech Solutions S.L.',
    cif: 'B87654321',
    facturasPendientes: 2,
    montoTotal: 4700.00,
    consultorAsignado: 'Carlos López'
  },
  {
    id: 3,
    nombre: 'Consultoría Creativa',
    cif: 'B11223344',
    facturasPendientes: 1,
    montoTotal: 2100.00,
    consultorAsignado: 'Ana Martínez'
  },
  {
    id: 4,
    nombre: 'Marketing Innovador',
    cif: 'B55667788',
    facturasPendientes: 1,
    montoTotal: 850.50,
    consultorAsignado: null
  }
]

export const mockConsultores = [
  {
    id: 1,
    nombre: 'María García'
  },
  {
    id: 2,
    nombre: 'Carlos López'
  },
  {
    id: 3,
    nombre: 'Ana Martínez'
  },
  {
    id: 4,
    nombre: 'Pedro Sánchez'
  }
]

export const mockFacturas = {
  1: [ // Logística Global
    {
      id: 1,
      numero: 'FAC-2024-001',
      vencimiento: '2024-02-15',
      monto: 3500.00,
      estado: 'pendiente'
    },
    {
      id: 2,
      numero: 'FAC-2024-002',
      vencimiento: '2024-02-20',
      monto: 2500.00,
      estado: 'pendiente'
    },
    {
      id: 3,
      numero: 'FAC-2024-003',
      vencimiento: '2024-02-25',
      monto: 1350.00,
      estado: 'pendiente'
    }
  ],
  2: [ // Tech Solutions S.L.
    {
      id: 4,
      numero: 'FAC-2024-004',
      vencimiento: '2024-02-18',
      monto: 3000.00,
      estado: 'pendiente'
    },
    {
      id: 5,
      numero: 'FAC-2024-005',
      vencimiento: '2024-02-22',
      monto: 1700.00,
      estado: 'pendiente'
    }
  ],
  3: [ // Consultoría Creativa
    {
      id: 6,
      numero: 'FAC-2024-006',
      vencimiento: '2024-02-28',
      monto: 2100.00,
      estado: 'pendiente'
    }
  ],
  4: [ // Marketing Innovador
    {
      id: 7,
      numero: 'FAC-2024-007',
      vencimiento: '2024-02-30',
      monto: 850.50,
      estado: 'pendiente'
    }
  ]
}

export const mockAcciones = {
  1: [ // Logística Global
    {
      id: 1,
      fecha: '2024-01-20',
      autor: 'María García',
      tipo: 'Email',
      descripcion: 'Envío de recordatorio de pago pendiente',
      aviso: '2024-01-25'
    },
    {
      id: 2,
      fecha: '2024-01-18',
      autor: 'María García',
      tipo: 'Llamada',
      descripcion: 'Contacto telefónico para confirmar recepción de facturas',
      aviso: null
    }
  ],
  2: [ // Tech Solutions S.L.
    {
      id: 3,
      fecha: '2024-01-19',
      autor: 'Carlos López',
      tipo: 'Visita',
      descripcion: 'Reunión presencial para revisar situación de pagos',
      aviso: '2024-01-22'
    }
  ],
  3: [], // Consultoría Creativa - sin acciones
  4: []  // Marketing Innovador - sin acciones
}

export const mockAvisos = [
  {
    id: 1,
    empresa: 'Logística Global',
    fecha: '2024-01-25',
    tipo: 'Recordatorio de pago',
    descripcion: 'Vencimiento de factura FAC-2024-001'
  },
  {
    id: 2,
    empresa: 'Tech Solutions S.L.',
    fecha: '2024-01-22',
    tipo: 'Seguimiento',
    descripcion: 'Revisión de situación de pagos'
  }
] 