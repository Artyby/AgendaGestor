# AgendaGestor

Una aplicación web completa para la gestión de agenda personal y finanzas, construida con React y Supabase. Ofrece una interfaz intuitiva para organizar tareas, ideas y metas, además de un completo sistema de gestión financiera con cuentas, transacciones, presupuestos y objetivos financieros.

## ✨ Características

### 📅 Módulo de Agenda

- **Calendario Interactivo**: Vista mensual con navegación fácil
- **Gestión de Tareas**: Crear, editar, completar y eliminar tareas
- **Sistema de Ideas**: Organizar ideas por categorías
- **Metas y Objetivos**: Establecer y rastrear metas con fechas límite
- **Estadísticas Semanales**: Gráficos de progreso de tareas completadas
- **Tareas Recurrentes**: Soporte para tareas que se repiten semanalmente

### 💰 Módulo de Finanzas

- **Gestión de Cuentas**: Múltiples cuentas bancarias y subcuentas
- **Transacciones Complejas**: Ingresos, gastos y transferencias entre cuentas
- **Categorización**: Sistema de categorías y etiquetas para organizar transacciones
- **Presupuestos**: Establecer y monitorear límites de gasto por categoría
- **Metas Financieras**: Definir objetivos de ahorro a largo plazo
- **Gráficos y Estadísticas**: Visualización de ingresos vs gastos, progreso de presupuestos
- **Balance en Tiempo Real**: Actualización automática de saldos

### 🔐 Autenticación y Seguridad

- Autenticación segura con email y contraseña
- Datos personales protegidos por usuario
- Sincronización en tiempo real con Supabase

### 🎨 Interfaz de Usuario

- Diseño moderno y responsivo
- Modo oscuro para el módulo de finanzas
- Tema púrpura para agenda, tema oscuro para finanzas
- Navegación intuitiva con menú hamburguesa
- Soporte completo para dispositivos móviles

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 19.2.0** - Framework principal
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Biblioteca de iconos
- **Recharts** - Gráficos y visualizaciones

### Backend & Base de Datos

- **Supabase** - Backend-as-a-Service (Autenticación, Base de datos PostgreSQL, API en tiempo real)

### Desarrollo

- **ESLint** - Linting y calidad de código
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- Una cuenta en [Supabase](https://supabase.com)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd agendagestor
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > API y copia tu URL del proyecto y anon key
3. Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 4. Configurar la Base de Datos

Ejecuta los siguientes scripts SQL en el SQL Editor de Supabase para crear las tablas necesarias:

```sql
-- Tabla de tareas
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  recurrent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ideas
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de metas
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cuentas
CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'investment')),
  balance DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de subcuentas
CREATE TABLE subaccounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  balance DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Tabla de transacciones
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id),
  account_id UUID REFERENCES accounts(id),
  to_account_id UUID REFERENCES accounts(id),
  subaccount_id UUID REFERENCES subaccounts(id),
  to_subaccount_id UUID REFERENCES subaccounts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de etiquetas
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Tabla de relación transacción-etiqueta
CREATE TABLE transaction_tags (
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (transaction_id, tag_id)
);

-- Tabla de presupuestos
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de metas financieras
CREATE TABLE financial_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subaccounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

-- Políticas para tasks
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Políticas para ideas
CREATE POLICY "Users can view own ideas" ON ideas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON ideas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON ideas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON ideas FOR DELETE USING (auth.uid() = user_id);

-- Políticas para goals
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Políticas para accounts
CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts" ON accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts" ON accounts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para subaccounts
CREATE POLICY "Users can view own subaccounts" ON subaccounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subaccounts" ON subaccounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subaccounts" ON subaccounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subaccounts" ON subaccounts FOR DELETE USING (auth.uid() = user_id);

-- Políticas para categories
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tags
CREATE POLICY "Users can view own tags" ON tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags" ON tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tags" ON tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags" ON tags FOR DELETE USING (auth.uid() = user_id);

-- Políticas para transaction_tags
CREATE POLICY "Users can view own transaction_tags" ON transaction_tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transaction_tags" ON transaction_tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transaction_tags" ON transaction_tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transaction_tags" ON transaction_tags FOR DELETE USING (auth.uid() = user_id);

-- Políticas para budgets
CREATE POLICY "Users can view own budgets" ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON budgets FOR DELETE USING (auth.uid() = user_id);

-- Políticas para financial_goals
CREATE POLICY "Users can view own financial_goals" ON financial_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own financial_goals" ON financial_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own financial_goals" ON financial_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own financial_goals" ON financial_goals FOR DELETE USING (auth.uid() = user_id);
```

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📖 Uso de la Aplicación

### Primeros Pasos

1. **Registro/Inicio de Sesión**: Crea una cuenta o inicia sesión con tu email
2. **Selección de Modo**: Usa el toggle para cambiar entre "Agenda" y "Finanzas"

### 📅 Módulo de Agenda

#### Vista de Resumen

- **Calendario**: Navega por meses, selecciona fechas para ver tareas
- **Gráfico de Progreso**: Visualiza el cumplimiento semanal de tareas
- **Ideas Recientes**: Lista de las últimas ideas guardadas

#### Vista por Pestañas

- **Calendario**: Gestión completa de tareas y metas
- **Progreso**: Estadísticas detalladas y gestión de metas
- **Ideas**: Organización completa de ideas por categorías

#### Funcionalidades

- **Crear Tarea**: Click en una fecha del calendario
- **Marcar Completada**: Click en el checkbox de la tarea
- **Agregar Idea**: Botón "Nueva Idea" en la vista de ideas
- **Establecer Meta**: Define objetivos con fecha límite opcional

### 💰 Módulo de Finanzas

#### Cuentas y Transacciones

- **Agregar Cuenta**: Define cuentas bancarias, ahorros, tarjetas de crédito
- **Crear Transacción**: Registra ingresos, gastos o transferencias
- **Categorizar**: Organiza transacciones por categorías predefinidas

#### Presupuestos y Metas

- **Establecer Presupuesto**: Define límites de gasto por categoría y período
- **Metas Financieras**: Establece objetivos de ahorro a largo plazo
- **Seguimiento**: Monitorea el progreso con gráficos visuales

#### Dashboard Financiero

- **Resumen General**: Balance total y resumen mensual
- **Gráficos**: Ingresos vs gastos, distribución por categorías
- **Progreso de Presupuestos**: Visualización del cumplimiento

## 📁 Estructura del Proyecto

```
agendagestor/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── agenda/
│   │   │   ├── CalendarView.jsx
│   │   │   ├── ChartView.jsx
│   │   │   ├── IdeasView.jsx
│   │   │   └── Modals.jsx
│   │   ├── finance/
│   │   │   ├── AccountsList.jsx
│   │   │   ├── AddAccountModal.jsx
│   │   │   ├── AddBudgetModal.jsx
│   │   │   ├── AddGoalModal.jsx
│   │   │   ├── AddTransactionModal.jsx
│   │   │   ├── BudgetProgress.jsx
│   │   │   ├── FinanceCharts.jsx
│   │   │   ├── FinanceSummary.jsx
│   │   │   ├── FinanceView.jsx
│   │   │   ├── GoalsList.jsx
│   │   │   └── TransactionList.jsx
│   │   ├── AuthScreen.jsx
│   │   └── ModeToggle.jsx
│   ├── services/
│   │   └── supabase.js
│   ├── styles/
│   │   └── ModeToggle.css
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.local
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── TODO.md
└── vite.config.js
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Vista previa de la build

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- La aplicación incluye limpieza automática de categorías duplicadas en cada carga
- Todas las operaciones de base de datos incluyen validación y manejo de errores
- La interfaz es completamente responsiva y optimizada para móviles
- Los datos se sincronizan en tiempo real con Supabase

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio o contacta al equipo de desarrollo.
