import React from "react";
import { Plus, Trash2 } from "lucide-react";

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold capitalize">{monthName}</h2>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

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

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`aspect-square p-2 rounded border-2 text-sm font-medium transition-all ${
                isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"
              } ${
                dayTasks.length > 0 || dayGoals.length > 0
                  ? "bg-purple-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div>{day}</div>
              {dayTasks.length > 0 && (
                <div className="text-xs mt-1">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-1" />
                  {dayTasks.length}
                </div>
              )}
              {dayGoals.length > 0 && (
                <div className="text-xs mt-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
                  {dayGoals.length}M
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">
              {selectedDate.toLocaleDateString("es", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm flex items-center gap-1"
            >
              <Plus size={16} /> Agregar
            </button>
          </div>

          <div className="space-y-2">
            {getTasksForDate(selectedDate).map((task) => (
              <div
                key={task.id}
                className="bg-white p-3 rounded border flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskComplete(task.id)}
                  className="mt-1 w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                  {task.time && (
                    <div className="text-sm text-gray-600">⏰ {task.time}</div>
                  )}
                  {task.description && (
                    <div className="text-sm text-gray-500 mt-1">
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
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {getTasksForDate(selectedDate).length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No hay tareas para este día
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
