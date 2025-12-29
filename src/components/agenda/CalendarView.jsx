import React from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarView = ({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  tasks,
  getTasksForDate,
  toggleTaskComplete,
  deleteTask,
  setShowTaskModal,
  goals,
  getGoalsForDate,
}) => {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("es", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg sm:text-2xl font-bold capitalize truncate px-2">
          {monthName}
        </h2>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-xs sm:text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid del calendario */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Espacios vacíos al inicio */}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const dayTasks = getTasksForDate(date);
          const dayGoals = getGoalsForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`aspect-square p-1 sm:p-2 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all hover:shadow-md ${
                isSelected
                  ? "border-purple-500 bg-purple-100"
                  : isToday
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              } ${
                dayTasks.length > 0 || dayGoals.length > 0
                  ? "bg-purple-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-semibold">{day}</div>

              {/* Indicadores de tareas y metas */}
              <div className="flex flex-col items-center justify-center mt-0.5 sm:mt-1 gap-0.5">
                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] sm:text-xs">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full" />
                    <span className="hidden sm:inline">{dayTasks.length}</span>
                  </div>
                )}
                {dayGoals.length > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] sm:text-xs">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full" />
                    <span className="hidden sm:inline">{dayGoals.length}M</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalles del día seleccionado */}
      {selectedDate && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <h3 className="font-bold text-base sm:text-lg">
              {selectedDate.toLocaleDateString("es", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <button
              onClick={() => setShowTaskModal(true)}
              className="w-full sm:w-auto px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm flex items-center justify-center gap-1 transition-colors"
            >
              <Plus size={16} /> Agregar Tarea
            </button>
          </div>

          <div className="space-y-2">
            {/* Tareas del día */}
            {getTasksForDate(selectedDate).map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-2 sm:gap-3 hover:shadow-md transition-shadow"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                  className="mt-1 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-sm sm:text-base ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.time && (
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      ⏰ {task.time}
                    </div>
                  )}
                  {task.description && (
                    <div className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                      {task.description}
                    </div>
                  )}
                  {task.recurrent && (
                    <span className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-1">
                      Recurrente
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                  aria-label="Eliminar tarea"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Metas del día */}
            {getGoalsForDate(selectedDate).map((goal) => (
              <div
                key={goal.id}
                className="bg-green-50 p-3 rounded-lg border-2 border-green-300 flex items-start gap-2 sm:gap-3"
              >
                <div className="mt-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-xs">🎯</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base text-green-800">
                    {goal.title}
                  </div>
                  {goal.description && (
                    <div className="text-xs sm:text-sm text-green-700 mt-1 break-words">
                      {goal.description}
                    </div>
                  )}
                  <span className="inline-block text-xs bg-green-200 text-green-800 px-2 py-1 rounded mt-1">
                    Meta - Fecha límite
                  </span>
                </div>
              </div>
            ))}

            {getTasksForDate(selectedDate).length === 0 &&
              getGoalsForDate(selectedDate).length === 0 && (
                <p className="text-gray-400 text-center py-6 text-sm sm:text-base">
                  No hay tareas ni metas para este día
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
