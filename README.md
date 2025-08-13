# Atisa - Sistema de Gestión de Facturas Frontend

Aplicación web moderna para la gestión de empresas con facturas pendientes, asignación de consultores y seguimiento de acciones. Desarrollada con React + Vite + TailwindCSS en modo oscuro.

## 🚀 Características

- **Dashboard Interactivo**: Métricas en tiempo real y visualización de datos
- **Gestión de Empresas**: Filtros, asignación de consultores y seguimiento
- **CRUD de Consultores**: Mantenimiento completo de consultores
- **Gestión de Facturas**: Por empresa con búsqueda y filtros
- **Seguimiento de Acciones**: Registro de acciones con avisos
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Modo Oscuro**: Interfaz moderna y elegante

## 🛠️ Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **TailwindCSS** - Framework CSS utility-first
- **React Router** - Navegación entre páginas
- **Lucide React** - Iconos modernos y ligeros

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd facturas-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx              # Navegación global
│   ├── Card.jsx                # Tarjeta base
│   ├── SearchBar.jsx           # Buscador
│   ├── EmpresaCard.jsx         # Tarjeta de empresa
│   ├── ConsultorItem.jsx       # Item de consultor
│   ├── FacturaCard.jsx         # Tarjeta de factura
│   ├── AsignarConsultorModal.jsx
│   ├── ConsultorModal.jsx
│   ├── FacturaModal.jsx
│   └── AccionForm.jsx
├── pages/              # Páginas principales
│   ├── Dashboard.jsx           # Cuadro de mandos
│   ├── Empresas.jsx            # Gestión de empresas
│   ├── Consultores.jsx         # CRUD de consultores
│   └── FacturasEmpresa.jsx     # Facturas por empresa
├── data/               # Datos de ejemplo
│   └── mockData.js
├── App.jsx             # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🧭 Navegación

### Rutas Disponibles

- `/` - **Dashboard**: Cuadro de mandos con métricas
- `/empresas` - **Empresas**: Gestión de empresas con facturas pendientes
- `/consultores` - **Consultores**: Mantenimiento de consultores
- `/empresas/:id/facturas` - **Facturas**: Gestión de facturas por empresa

### Header Global

- **Logo Atisa**: Con diseño corporativo y tagline
- **Navegación**: Enlaces con estados activos y hover
- **Tema Oscuro**: Fondo `bg-gray-800` con bordes sutiles

## 📊 Dashboard

### Métricas Principales

1. **Total Empresas** - Icono edificio azul
2. **Facturas Pendientes** - Icono documento amarillo  
3. **Monto Total Adeudado** - Icono euro rojo

### Secciones

- **Próximos Avisos**: Lista de avisos programados
- **Deuda por Empresa**: Barras de progreso proporcionales

## 🏢 Gestión de Empresas

### Funcionalidades

- **Filtros**: Búsqueda por nombre/CIF y consultor
- **Tarjetas**: Información completa de cada empresa
- **Acciones**: Asignar consultor y gestionar facturas
- **Estados**: Visualización de consultor asignado

### Datos Mostrados

- Nombre y CIF de la empresa
- Número de facturas pendientes
- Monto total adeudado
- Consultor asignado

## 👥 Mantenimiento de Consultores

### CRUD Completo

- **Crear**: Modal para añadir nuevos consultores
- **Leer**: Lista con iconos y información
- **Actualizar**: Modal de edición
- **Eliminar**: Confirmación antes de eliminar

## 📂 Gestión de Facturas

### Por Empresa

- **Lista de Facturas**: Con búsqueda y filtros
- **Acciones**: Editar y eliminar facturas
- **Información**: Número, vencimiento y monto

### Seguimiento de Acciones

- **Registro**: Por consultor asignado
- **Tipos**: Email, Llamada, Visita, Otro
- **Avisos**: Fechas opcionales de seguimiento
- **Historial**: Cronología de acciones

## 🎨 Diseño y Estilos

### Modo Oscuro

- **Fondo Principal**: `bg-gray-900`
- **Contenedores**: `bg-gray-800` con bordes `border-gray-700`
- **Texto**: `text-white` y `text-gray-400`
- **Montos**: `text-red-400` para destacar

### Componentes

- **Botones**: Clases `btn-primary`, `btn-secondary`, `btn-danger`
- **Inputs**: Clase `input-field` con focus states
- **Modales**: Overlay con backdrop blur
- **Cards**: Bordes redondeados y sombras

### Responsive

- **Grid**: Adaptativo con `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Flexbox**: Layouts flexibles
- **Espaciado**: Sistema de spacing de Tailwind

## 🚀 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Ejecutar linter

## 🔧 Configuración

### TailwindCSS

- **Modo Oscuro**: Configurado por defecto
- **Colores**: Paleta personalizada con teal como primario
- **Fuentes**: Inter como fuente principal
- **Animaciones**: Transiciones suaves

### Vite

- **Puerto**: 5173 por defecto
- **HMR**: Hot Module Replacement activado
- **Optimización**: Build optimizado para producción

## 📱 Funcionalidades Principales

### Dashboard
- Métricas en tiempo real
- Gráficos de deuda por empresa
- Avisos programados

### Empresas
- Filtros avanzados
- Asignación de consultores
- Navegación a facturas

### Consultores
- CRUD completo
- Validaciones
- Confirmaciones

### Facturas
- Gestión por empresa
- Búsqueda y filtros
- Seguimiento de acciones

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Dependencias**: `npm install` para reinstalar
2. **Puerto ocupado**: Cambiar en `vite.config.js`
3. **Estilos**: Verificar `tailwind.config.js`

### Desarrollo

- **Hot Reload**: Cambios automáticos en desarrollo
- **Console**: Logs para debugging
- **React DevTools**: Para inspección de componentes

## 📄 Licencia

Este proyecto es propiedad de Atisa y está destinado para uso interno.

## 👥 Desarrollo

Para contribuir al desarrollo:
1. Crear una rama feature
2. Realizar cambios
3. Crear pull request
4. Revisión de código

---

**Desarrollado para Atisa** 🏢 