import React, { useState } from "react";
import { X, Wallet, DollarSign, Palette } from "lucide-react";

const AddAccountModal = ({ onSave, onClose, account }) => {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    type: account?.type || "checking",
    balance: account?.balance || "0.00",
    currency: account?.currency || "USD",
    color: account?.color || "#10b981",
    description: account?.description || "",
  });

  const accountTypes = [
    { value: "checking", label: "Cuenta Corriente" },
    { value: "savings", label: "Ahorros" },
    { value: "cash", label: "Efectivo" },
    { value: "credit", label: "Tarjeta de Crédito" },
    { value: "investment", label: "Inversión" },
    { value: "other", label: "Otra" },
  ];

  const colors = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Por favor ingresa un nombre para la cuenta");
      return;
    }

    if (parseFloat(formData.balance) < 0) {
      alert("El balance no puede ser negativo");
      return;
    }

    onSave({
      ...formData,
      balance: parseFloat(formData.balance),
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
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-lg w-full border border-emerald-500/30">
        {/* Header */}
        <div className="border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-400">
            {account ? "Editar Cuenta" : "Nueva Cuenta"}
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
              <Wallet className="inline mr-1" size={16} />
              Nombre de la Cuenta *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ej: Banco Personal"
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Tipo de cuenta */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Cuenta *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Balance inicial */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign className="inline mr-1" size={16} />
              Balance Inicial *
            </label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Moneda */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Moneda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="DOP">DOP - Peso Dominicano</option>
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="ARS">ARS - Peso Argentino</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Palette className="inline mr-1" size={16} />
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Información adicional sobre esta cuenta..."
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none resize-none"
            />
          </div>

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
              {account ? "Guardar Cambios" : "Crear Cuenta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
