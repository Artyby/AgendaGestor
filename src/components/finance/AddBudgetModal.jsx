import React, { useState } from "react";
import { X, PieChart, DollarSign, Calendar, AlertCircle } from "lucide-react";

const AddBudgetModal = ({ onSave, onClose, categories, budget }) => {
  const [formData, setFormData] = useState({
    name: budget?.name || "",
    category_id: budget?.category_id || "",
    amount: budget?.amount || "",
    period: budget?.period || "monthly",
    start_date: budget?.start_date || new Date().toISOString().split("T")[0],
    end_date: budget?.end_date || "",
    alert_threshold: budget?.alert_threshold || "80",
  });

  const periods = [
    { value: "weekly", label: "Semanal" },
    { value: "monthly", label: "Mensual" },
    { value: "quarterly", label: "Trimestral" },
    { value: "yearly", label: "Anual" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor ingresa un nombre para el presupuesto");
      return;
    }

    if (!formData.category_id) {
      alert("Por favor selecciona una categoría");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    if (
      parseFloat(formData.alert_threshold) < 0 ||
      parseFloat(formData.alert_threshold) > 100
    ) {
      alert("El umbral de alerta debe estar entre 0 y 100");
      return;
    }

    onSave({
      ...formData,
      amount: parseFloat(formData.amount),
      alert_threshold: parseFloat(formData.alert_threshold),
      end_date: formData.end_date || null,
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

  // Filtrar solo categorías de gastos
  const expenseCategories = categories.filter(
    (cat) => cat.type === "expense" || cat.type === "both"
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-400">
            {budget ? "Editar Presupuesto" : "Nuevo Presupuesto"}
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
              <PieChart className="inline mr-1" size={16} />
              Nombre del Presupuesto *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Presupuesto de Alimentación"
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoría *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Seleccionar categoría</option>
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Monto y Período */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <DollarSign className="inline mr-1" size={16} />
                Monto *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
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
                Período *
              </label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline mr-1" size={16} />
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha de Fin (opcional)
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={formData.start_date}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Umbral de alerta */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <AlertCircle className="inline mr-1" size={16} />
              Umbral de Alerta (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                name="alert_threshold"
                value={formData.alert_threshold}
                onChange={handleChange}
                min="0"
                max="100"
                step="5"
                className="flex-1"
              />
              <span className="text-white font-semibold w-16 text-right">
                {formData.alert_threshold}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recibirás una alerta cuando alcances este porcentaje del
              presupuesto
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-blue-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">💡 Consejo</p>
                <p>
                  Los presupuestos te ayudan a controlar tus gastos por
                  categoría. El sistema te alertará automáticamente cuando te
                  acerques al límite establecido.
                </p>
              </div>
            </div>
          </div>

          {/* Vista previa */}
          {formData.amount && parseFloat(formData.amount) > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-gray-400 mb-2">Vista Previa</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Presupuesto:</span>
                  <span className="text-white font-semibold">
                    $
                    {parseFloat(formData.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Alerta en:</span>
                  <span className="text-yellow-400 font-semibold">
                    $
                    {(
                      (parseFloat(formData.amount) *
                        parseFloat(formData.alert_threshold)) /
                      100
                    ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-slate-900 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-yellow-500 absolute left-0"
                    style={{ width: `${formData.alert_threshold}%` }}
                  />
                </div>
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
              {budget ? "Guardar Cambios" : "Crear Presupuesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
