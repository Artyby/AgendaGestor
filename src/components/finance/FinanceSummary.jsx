import React from "react";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

const FinanceSummary = ({ accounts, transactions, goals, budgets }) => {
  // Calcular totales
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  );

  const monthlyIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === new Date().getMonth()
    )
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthlyNet = monthlyIncome - monthlyExpenses;

  const activeGoals = goals.filter((g) => !g.is_achieved).length;
  const achievedGoals = goals.filter((g) => g.is_achieved).length;

  const savingsRate =
    monthlyIncome > 0 ? ((monthlyNet / monthlyIncome) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Balance Total */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-emerald-100 text-sm font-medium">
            Balance Total
          </span>
          <DollarSign size={24} className="text-emerald-100" />
        </div>
        <p className="text-3xl font-bold">
          ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-emerald-100 text-xs mt-2">
          En {accounts.length} cuenta{accounts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Ingresos del Mes */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-100 text-sm font-medium">
            Ingresos del Mes
          </span>
          <TrendingUp size={24} className="text-blue-100" />
        </div>
        <p className="text-3xl font-bold">
          ${monthlyIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-blue-100 text-xs mt-2">
          Tasa de ahorro: {savingsRate}%
        </p>
      </div>

      {/* Gastos del Mes */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-red-100 text-sm font-medium">
            Gastos del Mes
          </span>
          <TrendingDown size={24} className="text-red-100" />
        </div>
        <p className="text-3xl font-bold">
          $
          {monthlyExpenses.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-red-100 text-xs mt-2">
          Balance: $
          {Math.abs(monthlyNet).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
      </div>

      {/* Metas */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-purple-100 text-sm font-medium">
            Metas Activas
          </span>
          <Target size={24} className="text-purple-100" />
        </div>
        <p className="text-3xl font-bold">{activeGoals}</p>
        <p className="text-purple-100 text-xs mt-2">
          {achievedGoals} completada{achievedGoals !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default FinanceSummary;
