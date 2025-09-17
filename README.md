# 🏢 Atisa - Sistema de Gestión de Facturas Frontend

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0.0-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Atisa%20Internal-green.svg)](LICENSE)

> **Sistema web moderno y robusto para la gestión integral de facturas pendientes, empresas y consultores de ATISA**

## 📋 Tabla de Contenidos

- [🎯 Descripción del Proyecto](#-descripción-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [🏗️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [📱 Funcionalidades Detalladas](#-funcionalidades-detalladas)
- [🎨 Sistema de Diseño](#-sistema-de-diseño)
- [📚 Documentación de la API](#-documentación-de-la-api)
- [🧪 Testing y Calidad](#-testing-y-calidad)
- [🤝 Contribución y Desarrollo](#-contribución-y-desarrollo)
- [📄 Licencia](#-licencia)

## 🎯 Descripción del Proyecto

**Atisa - Sistema de Gestión de Facturas Frontend** es una aplicación web empresarial desarrollada para optimizar y automatizar la gestión de facturas pendientes de los clientes de ATISA. El sistema proporciona una interfaz moderna e intuitiva para que los equipos de consultoría puedan gestionar eficientemente el seguimiento de pagos, la asignación de consultores y el control de acciones comerciales.

### 🎯 Objetivos del Sistema

- **Automatización**: Reducir procesos manuales en la gestión de facturas
- **Visibilidad**: Proporcionar métricas en tiempo real del estado de cobros
- **Eficiencia**: Optimizar la asignación y seguimiento de consultores
- **Control**: Mantener un registro histórico de todas las acciones comerciales
- **Reportes**: Generar insights para la toma de decisiones estratégicas

## ✨ Características Principales

### 🎛️ **Dashboard Inteligente**
- **Métricas en Tiempo Real**: KPIs actualizados automáticamente
- **Gráficos Interactivos**: Visualización de deuda por empresa
- **Alertas Proactivas**: Sistema de notificaciones para vencimientos
- **Resumen Ejecutivo**: Vista consolidada para la dirección

### 🏢 **Gestión Integral de Empresas**
- **Base de Datos Centralizada**: Información completa de clientes
- **Filtros Avanzados**: Búsqueda por múltiples criterios
- **Asignación Inteligente**: Distribución automática de consultores
- **Seguimiento de Estado**: Control del ciclo de vida de cada cuenta

### 👥 **Administración de Consultores**
- **CRUD Completo**: Creación, lectura, actualización y eliminación
- **Perfiles Personalizados**: Información detallada de cada consultor
- **Asignaciones Dinámicas**: Gestión flexible de carteras
- **Métricas de Rendimiento**: Seguimiento de KPIs por consultor

### 📊 **Gestión de Facturas**
- **Control de Vencimientos**: Seguimiento automático de fechas
- **Estados de Pago**: Tracking del ciclo de cobro
- **Historial Completo**: Auditoría de todas las transacciones
- **Alertas Inteligentes**: Notificaciones basadas en reglas de negocio

### 📋 **Sistema de Acciones**
- **Registro de Actividades**: Log de todas las interacciones comerciales
- **Tipos de Acción**: Email, llamada, visita, reunión, etc.
- **Programación de Seguimientos**: Recordatorios automáticos
- **Historial de Comunicaciones**: Trazabilidad completa

### 🎨 **Interfaz de Usuario**
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Modo Oscuro**: Interfaz moderna y elegante
- **Navegación Intuitiva**: UX optimizada para usuarios empresariales
- **Accesibilidad**: Cumplimiento de estándares WCAG

## 🛠️ Stack Tecnológico

### **Frontend Core**
- **React 18.2.0** - Biblioteca de interfaz de usuario moderna
- **Vite 5.0.0** - Build tool ultra-rápido y moderno
- **React Router 6.8.0** - Enrutamiento declarativo y eficiente

### **Estilos y UI**
- **TailwindCSS 3.3.0** - Framework CSS utility-first
- **CSS Modules** - Estilos modulares y encapsulados
- **Responsive Design** - Mobile-first approach

### **Gestión de Estado**
- **React Context API** - Estado global de la aplicación
- **Custom Hooks** - Lógica reutilizable y testeable
- **Local State** - Estado local de componentes

### **Utilidades y Herramientas**
- **Lucide React** - Iconografía moderna y consistente
- **Date-fns** - Manipulación de fechas robusta
- **ESLint + Prettier** - Calidad y formato de código

### **Desarrollo y Build**
- **Node.js 18+** - Runtime de JavaScript
- **npm 9+** - Gestor de paquetes
- **Git** - Control de versiones

## 🚀 Instalación y Configuración

### 📋 **Requisitos Previos**

- **Node.js**: Versión 18.0.0 o superior
- **npm**: Versión 9.0.0 o superior
- **Git**: Para clonar el repositorio
- **Navegador Moderno**: Chrome 90+, Firefox 88+, Safari 14+

### 🔧 **Instalación Paso a Paso**

#### 1. **Clonar el Repositorio**
```bash
# Clonar desde GitHub
git clone https://github.com/developersatisa/gestor_front_facturas_pendientes-.git

# Navegar al directorio del proyecto
cd gestor_front_facturas_pendientes-
```

#### 2. **Instalar Dependencias**
```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
npm list --depth=0
```

#### 3. **Configuración del Entorno**
```bash
# Crear archivo de variables de entorno (si es necesario)
cp .env.example .env

# Editar variables de entorno
nano .env
```

#### 4. **Ejecutar en Modo Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm run dev

# El proyecto estará disponible en:
# http://localhost:5173
```

#### 5. **Verificar Funcionamiento**
- Abrir navegador en `http://localhost:5173`
- Verificar que el dashboard se carga correctamente
- Comprobar que no hay errores en la consola

### 🚀 **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con HMR
npm run build        # Build de producción optimizado
npm run preview      # Vista previa del build de producción

# Calidad de Código
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Corregir errores de linting automáticamente
npm run format       # Formatear código con Prettier

# Testing (cuando esté implementado)
npm run test         # Ejecutar tests unitarios
npm run test:watch   # Tests en modo watch
npm run test:coverage # Tests con reporte de cobertura
```

## 🏗️ Arquitectura del Proyecto

### 📁 **Estructura de Directorios**

```
facturas_frontend/
├── 📁 public/                    # Archivos estáticos
│   ├── logo-atisa.png           # Logo corporativo
│   └── favicon.ico              # Icono del navegador
├── 📁 src/                       # Código fuente principal
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── 📁 ui/               # Componentes de UI base
│   │   │   ├── Button.jsx       # Botones reutilizables
│   │   │   ├── Card.jsx         # Tarjetas base
│   │   │   ├── Input.jsx        # Campos de entrada
│   │   │   └── Modal.jsx        # Modales base
│   │   ├── 📁 business/         # Componentes de negocio
│   │   │   ├── EmpresaCard.jsx  # Tarjeta de empresa
│   │   │   ├── ConsultorItem.jsx # Item de consultor
│   │   │   └── FacturaCard.jsx  # Tarjeta de factura
│   │   ├── 📁 forms/            # Formularios
│   │   │   ├── ConsultorFormModal.jsx
│   │   │   ├── FacturaModal.jsx
│   │   │   └── AccionModal.jsx
│   │   └── 📁 layout/           # Componentes de layout
│   │       ├── Header.jsx       # Navegación principal
│   │       ├── Sidebar.jsx      # Barra lateral (si existe)
│   │       └── Footer.jsx       # Pie de página
│   ├── 📁 pages/                # Páginas principales
│   │   ├── Dashboard.jsx        # Página principal
│   │   ├── Empresas.jsx         # Gestión de empresas
│   │   ├── Consultores.jsx      # CRUD de consultores
│   │   └── FacturasEmpresa.jsx  # Facturas por empresa
│   ├── 📁 context/              # Contextos de React
│   │   ├── DataContext.jsx      # Contexto de datos globales
│   │   └── ThemeContext.jsx     # Contexto del tema
│   ├── 📁 hooks/                # Custom hooks
│   │   ├── useConfirm.js        # Hook para confirmaciones
│   │   └── useEstadisticas.js   # Hook para estadísticas
│   ├── 📁 services/             # Servicios y API
│   │   ├── api.js               # Cliente HTTP principal
│   │   ├── empresasService.js   # Servicios de empresas
│   │   ├── consultoresService.js # Servicios de consultores
│   │   └── facturasService.js   # Servicios de facturas
│   ├── 📁 utils/                # Utilidades y helpers
│   │   ├── constants.js         # Constantes de la aplicación
│   │   ├── formatters.js        # Formateadores de datos
│   │   └── validators.js        # Validaciones
│   ├── 📁 styles/               # Estilos globales
│   │   ├── index.css            # Estilos principales
│   │   └── components.css       # Estilos de componentes
│   ├── App.jsx                  # Componente raíz
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── 📁 docs/                     # Documentación
├── 📁 tests/                    # Tests (cuando esté implementado)
├── .eslintrc.js                 # Configuración de ESLint
├── .prettierrc                  # Configuración de Prettier
├── tailwind.config.js           # Configuración de TailwindCSS
├── vite.config.js               # Configuración de Vite
├── package.json                  # Dependencias y scripts
└── README.md                    # Este archivo
```

### 🔄 **Flujo de Datos**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Custom Hooks  │    │   Context API   │
│                 │◄──►│                 │◄──►│                 │
│  (UI Layer)     │    │  (Logic Layer)  │    │ (State Layer)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Services      │    │     Utils       │    │   External API  │
│                 │    │                 │    │                 │
│  (API Layer)    │    │ (Helper Layer)  │    │  (Data Source)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🧩 **Patrones de Diseño**

- **Component Composition**: Composición de componentes reutilizables
- **Custom Hooks**: Lógica de negocio encapsulada
- **Context Pattern**: Estado global compartido
- **Service Layer**: Separación de responsabilidades
- **Container/Presentational**: Separación de lógica y presentación

## 📌 Estado actual del frontend (resumen)

- Dashboard:
  - Card “Deuda por Cliente” alimentada por `sociedades_con_montos` de `/api/estadisticas`.
  - “Próximos Avisos” ocupa toda la fila superior.
  - “Historial: Facturas más vencidas” con paginación (5 por página).
- Vista “Empresas”:
  - Cada card muestra las sociedades y su deuda (top 3), con “+N más” si aplica.
  - Filtros activos: buscador y consultor; sin filtro por sociedad.
- Vista “Facturas por empresa”:
  - Select moderno de sociedades, alineado al toggle “Ambos / Solo facturas / Solo abonos”, mostrando deuda y nº de facturas por sociedad.
  - Crear/editar/eliminar facturas deshabilitado (sin botón, sin iconos, sin modal).
  - Acciones: “Fecha de aviso” obligatoria y mensajes de error inline; “Acción registrada por” es un select de consultores (por defecto, el consultor asignado, editable).
- Header: el indicador de red permite “probar conexión” al backend.

## 📱 Funcionalidades Detalladas

### 🎛️ **Dashboard Principal**

#### **Métricas en Tiempo Real**
- **Total de Empresas**: Contador dinámico con icono corporativo
- **Facturas Pendientes**: Número total de facturas sin pagar
- **Monto Total Adeudado**: Suma de todas las deudas pendientes
- **Consultores Activos**: Número de consultores asignados

#### **Gráficos y Visualizaciones**
- **Deuda por Empresa**: Gráfico de barras proporcional
- **Evolución Temporal**: Línea de tiempo de cobros
- **Distribución por Consultor**: Gráfico circular de asignaciones
- **Alertas de Vencimiento**: Notificaciones de fechas críticas

#### **Widgets Interactivos**
- **Próximos Avisos**: Lista de recordatorios programados
- **Actividad Reciente**: Últimas acciones realizadas
- **Empresas Críticas**: Clientes con mayor riesgo de impago

### 🏢 **Gestión de Empresas**

#### **Listado y Filtros**
- **Búsqueda por Nombre**: Filtrado en tiempo real
- **Filtro por CIF**: Búsqueda por identificación fiscal
- **Filtro por Consultor**: Agrupación por responsable
- **Filtro por Estado**: Activas, inactivas, en mora

#### **Información de Empresa**
- **Datos Básicos**: Nombre, CIF, dirección, contacto
- **Información Financiera**: Límite de crédito, saldo actual
- **Consultor Asignado**: Responsable de la cuenta
- **Estado de la Cuenta**: Activa, suspendida, cancelada

#### **Acciones Disponibles**
- **Asignar Consultor**: Cambio de responsable
- **Ver Facturas**: Navegación a historial de facturas
- **Editar Datos**: Modificación de información
- **Crear Acción**: Registro de actividad comercial

### 👥 **Administración de Consultores**

#### **Gestión CRUD**
- **Crear Consultor**: Formulario completo de registro
- **Editar Perfil**: Modificación de datos personales
- **Eliminar Consultor**: Proceso con confirmación
- **Ver Historial**: Acciones realizadas por consultor

#### **Perfil del Consultor**
- **Información Personal**: Nombre, email, teléfono
- **Datos Profesionales**: Especialización, experiencia
- **Cartera Asignada**: Empresas bajo su responsabilidad
- **Métricas de Rendimiento**: KPIs individuales

#### **Asignaciones**
- **Distribución Automática**: Algoritmo de asignación
- **Reasignación Manual**: Cambios por administrador
- **Balanceo de Carga**: Equilibrio de carteras
- **Historial de Cambios**: Trazabilidad de asignaciones

### 📊 **Gestión de Facturas**

#### **Control de Facturas**
- **Número de Factura**: Identificación única
- **Fecha de Emisión**: Día de creación
- **Fecha de Vencimiento**: Plazo de pago
- **Monto**: Importe a cobrar
- **Estado**: Pendiente, pagada, vencida, cancelada

#### **Seguimiento de Pagos**
- **Recordatorios Automáticos**: Notificaciones programadas
- **Escalación**: Elevación a niveles superiores
- **Negociación**: Registro de acuerdos de pago
- **Historial de Comunicaciones**: Trazabilidad completa

#### **Reportes y Analytics**
- **Aging Report**: Análisis por antigüedad de deuda
- **Tendencias de Cobro**: Evolución temporal
- **Análisis por Consultor**: Rendimiento individual
- **Predicciones**: Estimaciones de cobro futuro

### 📋 **Sistema de Acciones**

#### **Tipos de Acción**
- **Email**: Comunicaciones electrónicas
- **Llamada Telefónica**: Contacto directo
- **Visita Comercial**: Reunión presencial
- **Reunión Virtual**: Videoconferencia
- **Seguimiento**: Recordatorio programado
- **Otros**: Acciones personalizadas

#### **Programación**
- **Fecha de Acción**: Cuándo se realizó
- **Fecha de Seguimiento**: Cuándo hacer seguimiento
- **Prioridad**: Alta, media, baja
- **Estado**: Pendiente, en progreso, completada

#### **Registro y Seguimiento**
- **Notas**: Comentarios y observaciones
- **Resultado**: Consecuencia de la acción
- **Próximos Pasos**: Plan de acción futuro
- **Adjuntos**: Documentos relacionados

## 🎨 Sistema de Diseño

### 🎨 **Paleta de Colores**

#### **Colores Principales**
- **Primary**: `#0f766e` (Teal-800) - Acciones principales
- **Secondary**: `#64748b` (Slate-500) - Elementos secundarios
- **Accent**: `#f59e0b` (Amber-500) - Destacados y alertas

#### **Colores de Estado**
- **Success**: `#10b981` (Emerald-500) - Operaciones exitosas
- **Warning**: `#f59e0b` (Amber-500) - Advertencias
- **Error**: `#ef4444` (Red-500) - Errores y alertas críticas
- **Info**: `#3b82f6` (Blue-500) - Información general

#### **Colores de Fondo (Modo Oscuro)**
- **Background**: `#111827` (Gray-900) - Fondo principal
- **Surface**: `#1f2937` (Gray-800) - Superficies de componentes
- **Card**: `#374151` (Gray-700) - Tarjetas y contenedores
- **Border**: `#4b5563` (Gray-600) - Bordes y separadores

### 🔤 **Tipografía**

#### **Jerarquía de Textos**
- **Heading 1**: `text-4xl font-bold` - Títulos principales
- **Heading 2**: `text-3xl font-semibold` - Subtítulos
- **Heading 3**: `text-2xl font-medium` - Secciones
- **Body Large**: `text-lg` - Texto de párrafo
- **Body**: `text-base` - Texto normal
- **Body Small**: `text-sm` - Texto pequeño
- **Caption**: `text-xs` - Texto de apoyo

#### **Fuentes**
- **Primary**: `Inter` - Fuente principal del sistema
- **Monospace**: `JetBrains Mono` - Código y datos técnicos
- **Fallback**: `system-ui, sans-serif` - Fuentes del sistema

### 🧩 **Componentes Base**

#### **Botones**
```css
/* Botón Primario */
.btn-primary {
  @apply bg-teal-800 hover:bg-teal-700 text-white px-4 py-2 rounded-lg 
         transition-colors duration-200 font-medium;
}

/* Botón Secundario */
.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg 
         transition-colors duration-200 font-medium;
}

/* Botón de Peligro */
.btn-danger {
  @apply bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg 
         transition-colors duration-200 font-medium;
}
```

#### **Campos de Entrada**
```css
.input-field {
  @apply bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg
         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
         placeholder-gray-400 transition-all duration-200;
}
```

#### **Tarjetas**
```css
.card {
  @apply bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg
         hover:shadow-xl transition-shadow duration-200;
}
```

### 📱 **Responsive Design**

#### **Breakpoints**
- **Mobile**: `< 768px` - Diseño móvil optimizado
- **Tablet**: `768px - 1024px` - Layout intermedio
- **Desktop**: `> 1024px` - Diseño completo

#### **Grid System**
```css
/* Grid Responsive */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* Flexbox Responsive */
.flex-responsive {
  @apply flex flex-col md:flex-row gap-4;
}
```

#### **Navegación Móvil**
- **Hamburger Menu**: Menú colapsable en móviles
- **Touch Friendly**: Elementos táctiles optimizados
- **Gestos**: Swipe y tap gestures
- **Off-canvas**: Menús laterales deslizables


## 📚 Documentación de la API

### 🔌 **Endpoints Principales**

#### **Empresas**
```javascript
// GET /api/empresas
// Obtener lista de empresas con filtros
GET /api/empresas?search=nombre&consultor=id&estado=activa

// POST /api/empresas
// Crear nueva empresa
POST /api/empresas
{
  "nombre": "Empresa Ejemplo",
  "cif": "B12345678",
  "email": "contacto@empresa.com",
  "telefono": "+34 123 456 789"
}

// PUT /api/empresas/:id
// Actualizar empresa existente
PUT /api/empresas/123
{
  "nombre": "Empresa Actualizada",
  "consultor_id": 456
}

// DELETE /api/empresas/:id
// Eliminar empresa
DELETE /api/empresas/123
```

#### **Consultores**
```javascript
// GET /api/consultores
// Obtener lista de consultores
GET /api/consultores

// POST /api/consultores
// Crear nuevo consultor
POST /api/consultores
{
  "nombre": "Juan Pérez",
  "email": "juan.perez@atisa.com",
  "telefono": "+34 987 654 321",
  "especializacion": "PYMEs"
}

// PUT /api/consultores/:id
// Actualizar consultor
PUT /api/consultores/456
{
  "especializacion": "Grandes Empresas"
}
```

#### **Facturas**
```javascript
// GET /api/empresas/:id/facturas
// Obtener facturas de una empresa
GET /api/empresas/123/facturas?estado=pending

// POST /api/facturas
// Crear nueva factura
POST /api/facturas
{
  "empresa_id": 123,
  "numero": "F-2024-001",
  "fecha_emision": "2024-01-15",
  "fecha_vencimiento": "2024-02-15",
  "monto": 1500.00,
  "concepto": "Servicios de consultoría"
}

// PUT /api/facturas/:id
// Actualizar factura
PUT /api/facturas/789
{
  "estado": "pagada",
  "fecha_pago": "2024-02-10"
}
```

#### **Acciones**
```javascript
// GET /api/acciones
// Obtener acciones con filtros
GET /api/acciones?consultor=456&tipo=llamada&fecha_desde=2024-01-01

// POST /api/acciones
// Crear nueva acción
POST /api/acciones
{
  "empresa_id": 123,
  "consultor_id": 456,
  "tipo": "llamada",
  "fecha_accion": "2024-01-20",
  "fecha_seguimiento": "2024-01-27",
  "notas": "Cliente interesado en plan de pagos",
  "resultado": "acuerdo_pendiente"
}
```

### 📊 **Modelos de Datos**

#### **Empresa**
```javascript
{
  id: number,
  nombre: string,
  cif: string,
  email: string,
  telefono: string,
  direccion: string,
  consultor_id: number,
  estado: 'activa' | 'suspendida' | 'cancelada',
  limite_credito: number,
  saldo_actual: number,
  fecha_creacion: Date,
  fecha_actualizacion: Date
}
```

#### **Consultor**
```javascript
{
  id: number,
  nombre: string,
  email: string,
  telefono: string,
  especializacion: string,
  estado: 'activo' | 'inactivo',
  fecha_contratacion: Date,
  fecha_actualizacion: Date
}
```

#### **Factura**
```javascript
{
  id: number,
  empresa_id: number,
  numero: string,
  fecha_emision: Date,
  fecha_vencimiento: Date,
  fecha_pago: Date | null,
  monto: number,
  concepto: string,
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada',
  fecha_creacion: Date,
  fecha_actualizacion: Date
}
```

#### **Acción**
```javascript
{
  id: number,
  empresa_id: number,
  consultor_id: number,
  tipo: 'email' | 'llamada' | 'visita' | 'reunion' | 'seguimiento' | 'otro',
  fecha_accion: Date,
  fecha_seguimiento: Date | null,
  notas: string,
  resultado: 'exitoso' | 'pendiente' | 'reprogramado' | 'cancelado',
  prioridad: 'alta' | 'media' | 'baja',
  fecha_creacion: Date,
  fecha_actualizacion: Date
}
```

### 🔐 **Autenticación y Autorización**

#### **JWT Token**
```javascript
// Header de autorización
Authorization: Bearer <jwt_token>

// Estructura del token
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 123,
    "email": "usuario@atisa.com",
    "role": "consultor",
    "permissions": ["read:empresas", "write:acciones"],
    "exp": 1640995200,
    "iat": 1640908800
  }
}
```

#### **Roles y Permisos**
```javascript
// Roles disponibles
const ROLES = {
  ADMIN: 'admin',
  CONSULTOR: 'consultor',
  SUPERVISOR: 'supervisor',
  VIEWER: 'viewer'
}

// Permisos por rol
const PERMISSIONS = {
  admin: ['*'], // Todos los permisos
  supervisor: ['read:*', 'write:acciones', 'write:facturas'],
  consultor: ['read:empresas', 'read:facturas', 'write:acciones'],
  viewer: ['read:*'] // Solo lectura
}
```

## 🧪 Testing y Calidad

### 🧪 **Estrategia de Testing**

#### **Tipos de Tests**
- **Unit Tests**: Componentes individuales y funciones
- **Integration Tests**: Interacción entre componentes
- **E2E Tests**: Flujos completos de usuario
- **Visual Regression Tests**: Comparación de UI

#### **Herramientas de Testing**
```javascript
// Jest + React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Test de componente
test('renders empresa card with correct data', () => {
  const empresa = {
    nombre: 'Empresa Test',
    cif: 'B12345678',
    facturas_pendientes: 5,
    monto_total: 15000
  }
  
  render(<EmpresaCard empresa={empresa} />)
  
  expect(screen.getByText('Empresa Test')).toBeInTheDocument()
  expect(screen.getByText('B12345678')).toBeInTheDocument()
  expect(screen.getByText('5 facturas pendientes')).toBeInTheDocument()
})
```

#### **Cobertura de Tests**
```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Generar reporte HTML
npm run test:coverage:html

# Umbral mínimo de cobertura
# statements: 80%
# branches: 70%
# functions: 80%
# lines: 80%
```

### 🔍 **Calidad de Código**

#### **ESLint Configuration**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    'react/prop-types': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error'
  }
}
```

#### **Prettier Configuration**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### **Husky Pre-commit Hooks**
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## 🤝 Contribución y Desarrollo

### 🌿 **Flujo de Trabajo Git**

#### **Branches**
```bash
# Rama principal
main                    # Código de producción
develop                 # Código de desarrollo

# Ramas de feature
feature/nombre-feature  # Nueva funcionalidad
bugfix/nombre-bug       # Corrección de errores
hotfix/nombre-hotfix    # Corrección urgente
```

#### **Commits**
```bash
# Convención de commits
feat: añadir filtro de empresas por consultor
fix: corregir error en cálculo de deuda total
docs: actualizar documentación de API
style: mejorar diseño del dashboard
refactor: reorganizar estructura de componentes
test: añadir tests para EmpresaCard
chore: actualizar dependencias
```

#### **Pull Requests**
1. **Crear Feature Branch**: `git checkout -b feature/nueva-funcionalidad`
2. **Desarrollar**: Implementar cambios con commits descriptivos
3. **Push**: `git push origin feature/nueva-funcionalidad`
4. **Crear PR**: En GitHub con descripción detallada
5. **Code Review**: Revisión por parte del equipo
6. **Merge**: Integración a develop/main

### 📋 **Checklist de Desarrollo**

#### **Antes de Crear PR**
- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan y cobertura es adecuada
- [ ] Documentación está actualizada
- [ ] No hay console.log o código de debug
- [ ] Responsive design funciona correctamente
- [ ] Accesibilidad cumple estándares WCAG

#### **Antes de Merge**
- [ ] Code review aprobado por al menos 2 personas
- [ ] Tests de integración pasan
- [ ] Build de producción es exitoso
- [ ] No hay conflictos de merge
- [ ] Documentación de cambios está completa

### 🚀 **Releases y Versionado**

#### **Semantic Versioning**
```bash
# Formato: MAJOR.MINOR.PATCH
1.0.0    # Primera versión estable
1.1.0    # Nueva funcionalidad (backward compatible)
1.1.1    # Corrección de bugs (backward compatible)
2.0.0    # Cambios breaking (no backward compatible)
```

#### **Changelog**
```markdown
# Changelog

## [1.1.0] - 2024-01-20
### Added
- Filtro de empresas por consultor
- Exportación de datos a Excel
- Notificaciones push en tiempo real

### Changed
- Mejorado rendimiento del dashboard
- Actualizada interfaz de usuario

### Fixed
- Error en cálculo de deuda total
- Problema de responsive en móviles
```

## 📄 Licencia

### 📜 **Información Legal**

Este proyecto es propiedad exclusiva de **ATISA** y está destinado para uso interno de la empresa. Todos los derechos están reservados.

#### **Términos de Uso**
- **Uso Interno**: Solo para empleados y colaboradores de ATISA
- **Confidencialidad**: La información contenida es confidencial
- **Propiedad Intelectual**: Código y diseño son propiedad de ATISA
- **Modificaciones**: Solo personal autorizado puede modificar el código

#### **Contacto Legal**
Para consultas sobre licencias, uso o distribución:
- **Empresa**: ATISA
- **Departamento**: Desarrollo de Software
- **Email**: desarrollo@atisa.com

---

## 🏢 **Sobre ATISA**

**ATISA** es una empresa líder en consultoría empresarial especializada en la gestión de facturación y cobros. Nuestro sistema de gestión de facturas frontend representa la vanguardia en tecnología web para la administración financiera empresarial.

### **Misión**
Proporcionar herramientas tecnológicas innovadoras que optimicen los procesos de gestión empresarial, mejorando la eficiencia operativa y la satisfacción del cliente.

### **Visión**
Ser referente en el desarrollo de soluciones tecnológicas para la gestión empresarial, contribuyendo al éxito de nuestros clientes a través de la innovación y la excelencia técnica.

---

**Desarrollado con ❤️ por el equipo de desarrollo de ATISA**

*Última actualización: Enero 2024*
*Versión del documento: 1.0.0*
## Cambios Recientes de UI

- Facturas (vista empresa):
  - Se muestra un chip de sociedad junto al título de cada factura con nombre y color según `CPY_0` (S005/S001/S010).
  - Botón “Historial” reubicado junto al chip (más compacto y visible); elimina versiones duplicadas laterales.
  - Nuevo selector de filtro por sociedad (Todas / S005 / S001 / S010) junto al buscador.
  - Corrección del selector de fecha de aviso: evita desfases de un día (usa formato local `YYYY-MM-DD`).
- Persistencia de acciones: al guardar acciones se registran vía `POST /api/facturas/acciones` y se recargan desde BD.
- Se eliminaron los botones “Marcar pagada” y “Aplazar” y su modal asociado.
- Se muestra el nombre de la factura (`nombre_factura`, desde `NUM_0`).
  - En la vista de facturas por empresa, aparece debajo de “Factura #tipo-asiento”.
- El historial de acciones lista ahora también el `nombre_factura` cuando está disponible.
- El botón “Añadir Acción” usa estilo azul y pasa a verde en hover.
 - Cada factura muestra ahora:
   - Importe (AMTCUR_0)
   - Pagado (PAYCUR_0)
   - Pendiente (AMTCUR_0 - PAYCUR_0)

### Notas de Integración
- El frontend espera que el backend incluya `sociedad_nombre` en la respuesta de facturas y soporta el filtro `?sociedad=`.
- Asegúrate de configurar `VITE_API_URL` o usar el proxy de Vite para que `/api/*` apunte al backend.
## Filtros y comportamiento de datos (UI)

Esta aplicación está alineada con la lógica del backend. Resumen de filtros y vistas:

- Empresas (Listado)
  - Muestra una tarjeta por empresa con deuda neta > 0.
  - Filtros de la vista:
    - Búsqueda por nombre o CIF (cliente).
    - Filtro por consultor asignado (incluye opción “Sin asignar”).
  - Sin datos mock: si la API falla, muestra un mensaje de error y lista vacía.

- Facturas de Empresa (Detalle)
  - Separa facturas y abonos en base a las banderas de la API.
  - Resumen visible: Pendiente facturas, Abonos y Total neto (filtrado por sociedad/búsqueda si usas esos controles en la página).

- Dashboard
  - Llama a `/api/estadisticas` y refleja exactamente los mismos filtros del backend (ver README del backend).
  - KPIs: Total empresas con deuda, Total facturas con saldo, Monto total neto adeudado.

## Indicador global de conexión

- En el header se muestra un badge:
  - Conectando: mientras haya peticiones en curso.
  - Sin conexion: si la última petición falló.
  - Conectado: estado normal.
- Este indicador reacciona a todas las llamadas (Dashboard, Empresas, detalle, etc.).

## Errores y sin mocks

- Cuando la API falla, no se cargan datos de ejemplo (para evitar confusiones):
  - Empresas: se muestra banner de error y la lista se queda vacía.
  - Dashboard: muestra error y botón de reintento.

## Rutas de la API usadas por el frontend

- `/api/clientes-con-resumen`: listado de empresas con deuda.
- `/api/facturas-cliente/{id}`: facturas de un cliente.
- `/api/estadisticas`: KPIs del dashboard.
- `/api/facturas/acciones` y `/api/facturas/cambios`: registro operativo asociado a facturas.
