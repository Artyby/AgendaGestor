import React from "react";
import { Target, Calendar, CheckCircle, AlertCircle, Plus } from "lucide-react";

const GoalsList = ({
  goals,
  onEdit,
  onDelete,
  onAddNew,

  detailed = false,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Sin fecha límite";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (percentage, daysRemaining) => {
    if (percentage >= 100) return "text-emerald-400";
    if (daysRemaining !== null && daysRemaining < 30 && percentage < 50)
      return "text-red-400";
    if (percentage >= 75) return "text-emerald-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-blue-400";
  };

  const getProgressBarColor = (percentage, daysRemaining) => {
    if (percentage >= 100) return "bg-emerald-500";
    if (daysRemaining !== null && daysRemaining < 30 && percentage < 50)
      return "bg-red-500";
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      savings: "Ahorros",
      investment: "Inversión",
      debt: "Deuda",
      purchase: "Compra",
      other: "Otro",
    };
    return labels[category] || category;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      critical: "Crítica",
    };
    return labels[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-500/20 text-gray-400",
      medium: "bg-blue-500/20 text-blue-400",
      high: "bg-yellow-500/20 text-yellow-400",
      critical: "bg-red-500/20 text-red-400",
    };
    return colors[priority] || colors.low;
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <Target size={24} />
          Metas Financieras
        </h3>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 text-sm transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva Meta</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Target size={48} className="mx-auto mb-3 opacity-50" />
            <p>No tienes metas financieras</p>
            <p className="text-sm mt-1">Establece tus objetivos de ahorro</p>
          </div>
        ) : (
          goals.map((goal) => {
            const currentAmount = parseFloat(goal.current_amount || 0);
            const targetAmount = parseFloat(goal.target_amount);
            const percentage = (currentAmount / targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isAchieved = goal.is_achieved || percentage >= 100;

            return (
              <div
                key={goal.id}
                className={`bg-slate-900/50 rounded-lg p-4 border ${
                  isAchieved ? "border-emerald-500/30" : "border-slate-700/50"
                } hover:border-slate-600/50 transition-colors`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white text-lg">
                        {goal.name}
                      </h4>
                      {isAchieved && (
                        <CheckCircle className="text-emerald-400" size={20} />
                      )}
                    </div>

                    {goal.description && (
                      <p className="text-sm text-gray-400 mb-2">
                        {goal.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {goal.category && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          {getCategoryLabel(goal.category)}
                        </span>
                      )}
                      {goal.priority && (
                        <span
                          className={`px-2 py-1 rounded ${getPriorityColor(
                            goal.priority
                          )}`}
                        >
                          {getPriorityLabel(goal.priority)}
                        </span>
                      )}
                      {goal.deadline && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar size={12} />
                          {formatDate(goal.deadline)}
                          {daysRemaining !== null && !isAchieved && (
                            <span
                              className={
                                daysRemaining < 30
                                  ? "text-red-400 font-semibold"
                                  : ""
                              }
                            >
                              ({daysRemaining} días)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {detailed && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => onEdit(goal)}
                        className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(`¿Eliminar meta "${goal.name}"?`)
                          ) {
                            onDelete(goal.id);
                          }
                        }}
                        className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>

                {/* Barra de progreso */}
                <div className="mb-2">
                  <div className="relative w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getProgressBarColor(
                        percentage,
                        daysRemaining
                      )} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Montos */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-400">Actual: </span>
                    <span
                      className={`font-semibold ${getProgressColor(
                        percentage,
                        daysRemaining
                      )}`}
                    >
                      $
                      {currentAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400">Meta: </span>
                    <span className="font-semibold text-white">
                      $
                      {targetAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400">Faltan: </span>
                    <span className="font-semibold text-blue-400">
                      $
                      {Math.max(0, targetAmount - currentAmount).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 }
                      )}
                    </span>
                  </div>
                </div>

                {/* Alertas */}
                {!isAchieved &&
                  daysRemaining !== null &&
                  daysRemaining < 30 &&
                  percentage < 50 && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded">
                      <AlertCircle size={16} />
                      <span>
                        ¡Atención! Esta meta está en riesgo de no cumplirse a
                        tiempo
                      </span>
                    </div>
                  )}

                {goal.account && (
                  <div className="mt-2 text-xs text-gray-400">
                    Cuenta vinculada:{" "}
                    <span className="text-emerald-400">
                      {goal.account.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resumen */}
      {detailed && goals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{goals.length}</p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {goals.filter((g) => g.is_achieved).length}
              </p>
              <p className="text-xs text-gray-400">Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {goals.filter((g) => !g.is_achieved).length}
              </p>
              <p className="text-xs text-gray-400">En progreso</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {
                  goals.filter(
                    (g) =>
                      !g.is_achieved &&
                      getDaysRemaining(g.deadline) !== null &&
                      getDaysRemaining(g.deadline) < 30
                  ).length
                }
              </p>
              <p className="text-xs text-gray-400">Urgentes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsList;
