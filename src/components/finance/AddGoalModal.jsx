import React, { useState } from "react";
import { X, Target, DollarSign, Calendar, FileText } from "lucide-react";

const AddGoalModal = ({ onSave, onClose, accounts, goal }) => {
  const [formData, setFormData] = useState({
    name: goal?.name || "",
    description: goal?.description || "",
    target_amount: goal?.target_amount || "",
    current_amount: goal?.current_amount || "0",
    deadline: goal?.deadline || "",
    category: goal?.category || "savings",
    priority: goal?.priority || "medium",
    account_id: goal?.account_id || "",
  });

  const categories = [
    { value: "savings", label: "Ahorros" },
    { value: "investment", label: "Inversión" },
    { value: "debt", label: "Pagar Deuda" },
    { value: "purchase", label: "Compra" },
    { value: "other", label: "Otro" },
  ];

  const priorities = [
    { value: "low", label: "Baja", color: "text-gray-400" },
    { value: "medium", label: "Media", color: "text-blue-400" },
    { value: "high", label: "Alta", color: "text-yellow-400" },
    { value: "critical", label: "Crítica", color: "text-red-400" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor ingresa un nombre para la meta");
      return;
    }

    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      alert("Por favor ingresa un monto objetivo válido");
      return;
    }

    if (
      parseFloat(formData.current_amount) < 0 ||
      parseFloat(formData.current_amount) > parseFloat(formData.target_amount)
    ) {
      alert("El monto actual debe estar entre 0 y el monto objetivo");
      return;
    }

    onSave({
      ...formData,
      target_amount: parseFloat(formData.target_amount),
      current_amount: parseFloat(formData.current_amount),
      account_id: formData.account_id || null,
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-400">
            {goal ? "Editar Meta" : "Nueva Meta Financiera"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="text-gray-400" size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Target className="inline mr-1" size={16} />
              Nombre de la Meta *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Vacaciones 2025"
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="inline mr-1" size={16} />
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción breve de tu meta..."
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

          {/* Montos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <DollarSign className="inline mr-1" size={16} />
                Monto Objetivo *
              </label>
              <input
                type="number"
                name="target_amount"
                value={formData.target_amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monto Actual
              </label>
              <input
                type="number"
                name="current_amount"
                value={formData.current_amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Fecha límite */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={16} />
              Fecha Límite
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Categoría y Prioridad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cuenta vinculada */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cuenta Vinculada (opcional)
            </label>
            <select
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Sin cuenta vinculada</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - $
                  {parseFloat(acc.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Puedes vincular una cuenta para rastrear automáticamente el
              progreso
            </p>
          </div>

          {/* Preview del progreso */}
          {formData.target_amount && parseFloat(formData.target_amount) > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-gray-400 mb-2">Vista Previa</p>
              <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(
                      (parseFloat(formData.current_amount || 0) /
                        parseFloat(formData.target_amount)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">
                  $
                  {parseFloat(formData.current_amount || 0).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  )}
                </span>
                <span className="text-gray-400">
                  {(
                    (parseFloat(formData.current_amount || 0) /
                      parseFloat(formData.target_amount)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
                <span className="text-white">
                  $
                  {parseFloat(formData.target_amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              {goal ? "Guardar Cambios" : "Crear Meta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
