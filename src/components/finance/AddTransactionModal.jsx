import React, { useState, useEffect } from "react";
import { X, DollarSign, Calendar, FileText, Tag } from "lucide-react";

const AddTransactionModal = ({
  type,
  transaction,
  accounts,
  categories,
  tags,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    account_id: "",
    to_account_id: "",
    category_id: "",
    notes: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        description: transaction.description || "",
        date: transaction.date,
        account_id: transaction.account_id || "",
        to_account_id: transaction.to_account_id || "",
        category_id: transaction.category_id || "",
        notes: transaction.notes || "",
      });
      // Cargar tags si hay
      if (transaction.tags) {
        setSelectedTags(transaction.tags.map((t) => t.tag.id));
      }
    }
  }, [transaction]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    if (!formData.account_id) {
      alert("Por favor selecciona una cuenta");
      return;
    }

    if (type === "transfer" && !formData.to_account_id) {
      alert("Por favor selecciona la cuenta destino");
      return;
    }

    if (type === "transfer" && formData.account_id === formData.to_account_id) {
      alert("No puedes transferir a la misma cuenta");
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      type,
    };

    // Include transaction ID when editing
    if (transaction) {
      transactionData.id = transaction.id;
    }

    onSave(transactionData, selectedTags);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getTitle = () => {
    if (transaction) return "Editar Transacción";
    switch (type) {
      case "income":
        return "Nuevo Ingreso";
      case "expense":
        return "Nuevo Gasto";
      case "transfer":
        return "Nueva Transferencia";
      default:
        return "Nueva Transacción";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "income":
        return "text-emerald-400";
      case "expense":
        return "text-red-400";
      case "transfer":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === type || cat.type === "both"
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/30">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${getTypeColor()}`}>
            {getTitle()}
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
          {/* Monto */}
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
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none text-xl font-semibold"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="inline mr-1" size={16} />
              Descripción
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ej: Compra en supermercado"
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline mr-1" size={16} />
              Fecha *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Cuenta origen */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {type === "transfer" ? "Cuenta Origen *" : "Cuenta *"}
            </label>
            <select
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Seleccionar cuenta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} - $
                  {parseFloat(acc.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Cuenta destino (solo para transferencias) */}
          {type === "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cuenta Destino *
              </label>
              <select
                name="to_account_id"
                value={formData.to_account_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Seleccionar cuenta</option>
                {accounts
                  .filter((acc) => acc.id !== formData.account_id)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} - $
                      {parseFloat(acc.balance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Categoría (no para transferencias) */}
          {type !== "transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Sin categoría</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Etiquetas */}
          {tags && tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Tag className="inline mr-1" size={16} />
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notas adicionales
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Información adicional..."
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
              {transaction ? "Guardar Cambios" : "Crear Transacción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
