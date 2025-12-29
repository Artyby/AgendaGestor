# TODO: Integración del Modo Finanzas

## Resumen del Proyecto

**AgendaGestor** es una aplicación web de gestión personal desarrollada en React que permite a los usuarios organizar su tiempo y finanzas de manera integrada. Actualmente cuenta con un sistema completo de agenda con calendario, tareas, metas e ideas, y está en proceso de expansión para incluir funcionalidades financieras.

### Características Actuales (Modo Agenda):

- **Calendario Interactivo**: Vista mensual con tareas y metas por fecha
- **Gestión de Tareas**: Crear, editar, completar y eliminar tareas con soporte para tareas recurrentes
- **Sistema de Metas**: Establecer y rastrear objetivos personales con fechas límite
- **Banco de Ideas**: Almacenar y categorizar ideas creativas
- **Gráficos de Progreso**: Visualización semanal del cumplimiento de tareas
- **Autenticación**: Sistema de login/registro con Supabase
- **Interfaz Responsiva**: Diseño adaptativo para móvil y desktop
- **Tema Personalizable**: Modo claro con colores púrpura/rosa

### Tecnologías Utilizadas:

- **Frontend**: React 18, Tailwind CSS, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Build Tool**: Vite
- **Lenguaje**: JavaScript (ES6+)

### Arquitectura:

- Componentes modulares organizados por funcionalidad
- Estado centralizado en App.jsx
- Servicios separados para operaciones de base de datos
- Tema dinámico basado en modo seleccionado

### Próximas Funcionalidades (Modo Finanzas):

- Dashboard financiero con balance total
- Gestión de ingresos y gastos
- Sistema de presupuestos por categoría
- Gráficos y reportes financieros
- Exportación de datos

## Análisis del Código Actual

- El modo "finanzas" ya existe en `App.jsx` con un tema oscuro (slate/emerald)
- Actualmente muestra un placeholder con "Modo Finanzas próximamente"
- Tiene placeholders para Balance Total y Transacciones
- El toggle entre "agenda" y "finanzas" ya está implementado

## Archivos a Crear/Modificar

### 1. Base de Datos (Supabase)

- [ ] Crear tabla `transactions`:

  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - type (text: 'income' | 'expense')
  - amount (decimal)
  - description (text)
  - category (text)
  - date (date)
  - created_at (timestamp)

- [ ] Crear tabla `budgets`:

  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - category (text)
  - amount (decimal)
  - period (text: 'monthly' | 'weekly' | 'yearly')
  - created_at (timestamp)

- [ ] Crear tabla `accounts` (opcional):
  - id (uuid, primary key)
  - user_id (uuid, foreign key)
  - name (text)
  - type (text: 'checking' | 'savings' | 'credit')
  - balance (decimal)

### 2. Componentes Nuevos

- [ ] `src/components/finance/FinanceView.jsx` - Vista principal de finanzas
- [ ] `src/components/finance/TransactionList.jsx` - Lista de transacciones
- [ ] `src/components/finance/BudgetChart.jsx` - Gráfico de presupuestos
- [ ] `src/components/finance/AddTransactionModal.jsx` - Modal para agregar transacción
- [ ] `src/components/finance/AddBudgetModal.jsx` - Modal para agregar presupuesto
- [ ] `src/components/finance/FinanceSummary.jsx` - Resumen financiero

### 3. Servicios

- [ ] Actualizar `src/services/supabase.js` con funciones para finanzas:
  - loadTransactions(userId)
  - addTransaction(data)
  - updateTransaction(id, data)
  - deleteTransaction(id)
  - loadBudgets(userId)
  - addBudget(data)
  - updateBudget(id, data)
  - deleteBudget(id)

### 4. Estado en App.jsx

- [ ] Agregar estados para datos financieros:

  - transactions: []
  - budgets: []
  - accounts: []
  - showTransactionModal: false
  - showBudgetModal: false

- [ ] Agregar funciones CRUD para transacciones y presupuestos
- [ ] Actualizar `loadAllData` para incluir datos financieros
- [ ] Reemplazar `renderFinanzasContent` con contenido real

### 5. Funcionalidades a Implementar

- [ ] Dashboard financiero con balance total
- [ ] Lista de transacciones con filtros (ingresos/gastos, categorías, fechas)
- [ ] Gráficos de gastos por categoría
- [ ] Sistema de presupuestos
- [ ] Metas de ahorro
- [ ] Exportar reportes (PDF/Excel)

### 6. UI/UX

- [ ] Tema consistente con el modo finanzas (slate/emerald)
- [ ] Iconos apropiados (DollarSign, TrendingUp, etc.)
- [ ] Responsive design
- [ ] Animaciones y transiciones

## Pasos de Implementación

1. Crear esquema de base de datos en Supabase
2. Implementar servicios de datos
3. Crear componentes básicos
4. Integrar en App.jsx
5. Agregar funcionalidades avanzadas
6. Testing y refinamiento

## Dependencias Adicionales

- [ ] Instalar librerías para gráficos (recharts o chart.js)
- [ ] Librerías para exportar datos (xlsx, jspdf)
- [ ] Librerías para manejo de fechas (date-fns)
