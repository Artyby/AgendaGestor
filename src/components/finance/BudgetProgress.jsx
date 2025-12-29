import React, { useMemo } from "react";
import { PieChart, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const BudgetProgress = ({
  budgets,
  transactions,
  onEdit,
  onDelete,
  detailed = false,
}) => {
  const budgetsWithProgress = useMemo(() => {
    return budgets.map((budget) => {
      // Filtrar transacciones por categoría del presupuesto
      const categoryTransactions = transactions.filter(
        (t) => t.type === "expense" && t.category_id === budget.category_id
      );

      // Calcular total gastado
      const spent = categoryTransactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      );

      const budgetAmount = parseFloat(budget.amount);
      const percentage = (spent / budgetAmount) * 100;
      const remaining = budgetAmount - spent;
      const isOverBudget = spent > budgetAmount;
      const isNearLimit =
        percentage >= parseFloat(budget.alert_threshold || 80);

      return {
        ...budget,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        isOverBudget,
        isNearLimit,
      };
    });
  }, [budgets, transactions]);

  const getStatusColor = (budget) => {
    if (budget.isOverBudget) return "bg-red-500";
    if (budget.isNearLimit) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getStatusTextColor = (budget) => {
    if (budget.isOverBudget) return "text-red-400";
    if (budget.isNearLimit) return "text-yellow-400";
    return "text-emerald-400";
  };

  const getStatusIcon = (budget) => {
    if (budget.isOverBudget)
      return <AlertTriangle className="text-red-400" size={20} />;
    if (budget.isNearLimit)
      return <AlertTriangle className="text-yellow-400" size={20} />;
    return <CheckCircle className="text-emerald-400" size={20} />;
  };

  const getPeriodLabel = (period) => {
    const labels = {
      weekly: "Semanal",
      monthly: "Mensual",
      quarterly: "Trimestral",
      yearly: "Anual",
    };
    return labels[period] || period;
  };

  if (budgets.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <PieChart size={24} />
          Presupuestos
        </h3>
        <div className="text-center py-8 text-gray-400">
          <PieChart size={48} className="mx-auto mb-3 opacity-50" />
          <p>No tienes presupuestos configurados</p>
          <p className="text-sm mt-1">
            Crea presupuestos para controlar tus gastos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
        <PieChart size={24} />
        Presupuestos
      </h3>

      <div className="space-y-4">
        {budgetsWithProgress.map((budget) => (
          <div
            key={budget.id}
            className={`bg-slate-900/50 rounded-lg p-4 border ${
              budget.isOverBudget
                ? "border-red-500/30"
                : budget.isNearLimit
                ? "border-yellow-500/30"
                : "border-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {budget.category && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: budget.category.color }}
                  />
                )}
                <div>
                  <h4 className="font-semibold text-white">
                    {budget.name || budget.category?.name || "Sin categoría"}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {getPeriodLabel(budget.period)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(budget)}
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${getStatusColor(
                  budget
                )} transition-all duration-300 rounded-full`}
                style={{ width: `${budget.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-gray-400">Gastado: </span>
                  <span
                    className={`font-semibold ${getStatusTextColor(budget)}`}
                  >
                    $
                    {budget.spent.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">de </span>
                  <span className="font-semibold text-white">
                    $
                    {parseFloat(budget.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className={`font-semibold ${getStatusTextColor(budget)}`}>
                {budget.isOverBudget ? (
                  <span>
                    +$
                    {Math.abs(budget.remaining).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    excedido
                  </span>
                ) : (
                  <span>
                    $
                    {budget.remaining.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    restante
                  </span>
                )}
              </div>
            </div>

            {detailed && (
              <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <span>Progreso: </span>
                  <span className={getStatusTextColor(budget)}>
                    {budget.percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit && onEdit(budget)}
                    className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `¿Eliminar presupuesto "${
                            budget.name || budget.category?.name
                          }"?`
                        )
                      ) {
                        onDelete && onDelete(budget.id);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen general */}
      {detailed && budgetsWithProgress.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {budgetsWithProgress.filter((b) => !b.isOverBudget).length}
              </p>
              <p className="text-xs text-gray-400">En control</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {
                  budgetsWithProgress.filter(
                    (b) => b.isNearLimit && !b.isOverBudget
                  ).length
                }
              </p>
              <p className="text-xs text-gray-400">Cerca del límite</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">
                {budgetsWithProgress.filter((b) => b.isOverBudget).length}
              </p>
              <p className="text-xs text-gray-400">Excedidos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetProgress;
