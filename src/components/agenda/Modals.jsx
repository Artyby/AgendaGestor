import React, { useState } from "react";
import { X } from "lucide-react";

export const TaskModal = ({ selectedDate, addTask, onClose }) => {
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    date: selectedDate
      ? formatLocalDate(selectedDate)
      : formatLocalDate(new Date()),
    recurrent: false,
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.date) return;
    addTask(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Nueva Tarea</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded h-24"
          />

          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.recurrent}
              onChange={(e) =>
                setFormData({ ...formData, recurrent: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span>Tarea recurrente (mismo día cada semana)</span>
          </label>

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Crear Tarea
          </button>
        </div>
      </div>
    </div>
  );
};

export const IdeaModal = ({ addIdea, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "General",
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.description) return;
    addIdea(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Nueva Idea</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <textarea
            placeholder="Descripción *"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded h-32"
          />

          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="Software">Software</option>
            <option value="Contenido">Contenido</option>
            <option value="General">General</option>
          </select>

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Guardar Idea
          </button>
        </div>
      </div>
    </div>
  );
};

export const GoalModal = ({ addGoal, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addGoal(formData);
      setFormData({ title: "", description: "", deadline: "" });
      onClose();
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Error al crear meta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Nueva Meta</h3>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Meta *"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <textarea
            placeholder="Descripción"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded h-24"
          />

          <input
            type="date"
            placeholder="Fecha límite"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Crear Meta
          </button>
        </div>
      </div>
    </div>
  );
};
