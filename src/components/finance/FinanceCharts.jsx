import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  DollarSign,
} from "lucide-react";

const FinanceCharts = ({ transactions, categories, budgets, goals }) => {
  // Calcular gastos por categoría
  const expensesByCategory = useMemo(() => {
    const byCategory = {};

    transactions
      .filter((t) => t.type === "expense" && t.category)
      .forEach((t) => {
        const catName = t.category.name;
        const catColor = t.category.color;
        if (!byCategory[catName]) {
          byCategory[catName] = { name: catName, value: 0, color: catColor };
        }
        byCategory[catName].value += parseFloat(t.amount);
      });

    return Object.values(byCategory).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Tendencia mensual últimos 6 meses
  const monthlyTrend = useMemo(() => {
    const months = {};
    const now = new Date();

    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const monthName = date.toLocaleDateString("es-ES", { month: "short" });
      months[key] = {
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        income: 0,
        expenses: 0,
        net: 0,
      };
    }

    // Agregar transacciones
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      if (months[key]) {
        const amount = parseFloat(t.amount);
        if (t.type === "income") {
          months[key].income += amount;
        } else if (t.type === "expense") {
          months[key].expenses += amount;
        }
      }
    });

    // Calcular neto
    Object.values(months).forEach((m) => {
      m.net = m.income - m.expenses;
    });

    return Object.values(months);
  }, [transactions]);

  // Comparación ingresos vs gastos
  const incomeVsExpenses = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return [
      { name: "Ingresos", value: income, color: "#10b981" },
      { name: "Gastos", value: expenses, color: "#ef4444" },
    ];
  }, [transactions]);

  // KPIs
  const kpis = useMemo(() => {
    const totalIncome = incomeVsExpenses[0].value;
    const totalExpenses = incomeVsExpenses[1].value;
    const net = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (net / totalIncome) * 100 : 0;

    const totalGoals = goals.length;
    const achievedGoals = goals.filter((g) => g.is_achieved).length;
    const goalsRate = totalGoals > 0 ? (achievedGoals / totalGoals) * 100 : 0;

    return {
      savingsRate: savingsRate.toFixed(1),
      net: net.toFixed(2),
      goalsRate: goalsRate.toFixed(1),
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
    };
  }, [incomeVsExpenses, goals]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: $
              {parseFloat(entry.value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Tasa de Ahorro</span>
            <TrendingUp className="text-emerald-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {kpis.savingsRate}%
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Balance Neto</span>
            <DollarSign className="text-blue-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-blue-400">
            $
            {parseFloat(kpis.net).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Metas Completadas</span>
            <Activity className="text-purple-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-purple-400">
            {kpis.goalsRate}%
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Transacciones</span>
            <PieIcon className="text-yellow-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-yellow-400">
            {transactions.length}
          </p>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tendencia mensual */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/20">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <Activity size={24} />
            Tendencia Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                name="Ingresos"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                name="Gastos"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Neto"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gastos por categoría - Pie */}
        <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/20">
          <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <PieIcon size={24} />
            Gastos por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ingresos vs Gastos - Bar chart */}
      <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <BarChart size={24} />
          Comparación Ingresos vs Gastos
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={incomeVsExpenses}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#10b981">
              {incomeVsExpenses.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 categorías de gastos */}
      <div className="bg-slate-900/50 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-xl font-bold text-emerald-400 mb-4">
          Top 5 Categorías de Gasto
        </h3>
        <div className="space-y-3">
          {expensesByCategory.slice(0, 5).map((cat, index) => {
            const total = expensesByCategory.reduce(
              (sum, c) => sum + c.value,
              0
            );
            const percentage = (cat.value / total) * 100;

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-white font-medium">{cat.name}</span>
                  </div>
                  <span className="text-gray-400">
                    $
                    {cat.value.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinanceCharts;
