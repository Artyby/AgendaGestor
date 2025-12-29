import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ChartView = ({
  getWeeklyStats,
  goals,
  toggleGoalAchieved,
  deleteGoal,
  setShowGoalModal,
}) => {
  const stats = getWeeklyStats();
  const maxValue = Math.max(...stats.map((s) => s.total), 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Progreso Semanal</h2>
        <button
          onClick={() => setShowGoalModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
        >
          <Plus size={18} /> Meta
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-sm font-medium mb-2">{stat.day}</div>
            <div className="relative h-40 bg-gray-100 rounded">
              {stat.total > 0 && (
                <>
                  <div
                    className="absolute bottom-0 w-full bg-green-400 rounded-b transition-all"
                    style={{ height: `${(stat.completed / maxValue) * 100}%` }}
                  />
                  <div
                    className="absolute w-full bg-orange-300 rounded-t transition-all"
                    style={{
                      height: `${(stat.pending / maxValue) * 100}%`,
                      bottom: `${(stat.completed / maxValue) * 100}%`,
                    }}
                  />
                </>
              )}
            </div>
            <div className="text-xs mt-2 text-gray-600">
              {stat.completed}/{stat.total}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded" />
          <span className="text-sm">Completadas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-300 rounded" />
          <span className="text-sm">Pendientes</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg">Metas</h3>
        {goals.map((goal) => {
          const isOverdue =
            goal.deadline &&
            new Date(goal.deadline + "T00:00:00") < new Date() &&
            !goal.achieved;
          return (
            <div
              key={goal.id}
              className={`p-4 rounded border-2 flex items-center gap-3 ${
                goal.achieved
                  ? "bg-green-50 border-green-300"
                  : isOverdue
                  ? "bg-red-50 border-red-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={goal.achieved}
                onChange={() => toggleGoalAchieved(goal.id)}
                className="w-5 h-5 cursor-pointer"
              />
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    goal.achieved
                      ? "line-through text-gray-400"
                      : isOverdue
                      ? "text-red-600"
                      : ""
                  }`}
                >
                  {goal.title}
                </div>
                <div className="text-sm text-gray-600">{goal.description}</div>
                {goal.deadline && (
                  <div
                    className={`text-xs mt-1 ${
                      isOverdue ? "text-red-500 font-medium" : "text-gray-500"
                    }`}
                  >
                    {isOverdue ? "¡Vencida!" : "Límite:"}{" "}
                    {new Date(goal.deadline).toLocaleDateString("es-ES")}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteGoal(goal.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        {goals.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            No hay metas definidas
          </p>
        )}
      </div>
    </div>
  );
};

export default ChartView;
