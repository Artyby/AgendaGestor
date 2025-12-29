import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Calendar,
  Filter,
  ChevronRight,
} from "lucide-react";

const TransactionList = ({
  transactions,
  accounts,
  categories,
  onEdit,
  onDelete,
  title = "Transacciones",
  showFilters = false,
  showViewAll = false,
  onViewAll,
}) => {
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getTransactionIcon = (type) => {
    switch (type) {
      case "income":
        return (
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-400" />
          </div>
        );
      case "expense":
        return (
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <TrendingDown size={20} className="text-red-400" />
          </div>
        );
      case "transfer":
        return (
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <ArrowRightLeft size={20} className="text-blue-400" />
          </div>
        );
      default:
        return null;
    }
  };

  const getTransactionColor = (type) => {
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

  const getTransactionSign = (type) => {
    return type === "income" ? "+" : type === "expense" ? "-" : "";
  };

  const getAccountName = (accountId) => {
    const account = accounts.find((a) => a.id === accountId);
    return account?.name || "Cuenta";
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "";
  };

  const getCategoryBadgeColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return "bg-gray-500/20 text-gray-400";

    const colors = {
      food: "bg-orange-500/20 text-orange-400",
      transport: "bg-blue-500/20 text-blue-400",
      entertainment: "bg-purple-500/20 text-purple-400",
      health: "bg-red-500/20 text-red-400",
      education: "bg-yellow-500/20 text-yellow-400",
      services: "bg-cyan-500/20 text-cyan-400",
    };

    return colors[category.type] || "bg-gray-500/20 text-gray-400";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // Filtrar transacciones
  const filteredTransactions = transactions
    .filter((t) => {
      if (filterType !== "all" && t.type !== filterType) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          t.description?.toLowerCase().includes(searchLower) ||
          getAccountName(t.account_id).toLowerCase().includes(searchLower) ||
          getCategoryName(t.category_id).toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (transactions.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <ArrowRightLeft size={20} />
          {title}
        </h3>
        <p className="text-gray-400 text-center py-8">
          No hay transacciones registradas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-emerald-500/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
          <ArrowRightLeft size={20} />
          {title}
        </h3>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-gray-400 hover:text-emerald-400 flex items-center gap-1"
          >
            Ver todas
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar transacciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-900/50 text-gray-200 px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-900/50 text-gray-400 hover:text-gray-300"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "income"
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-900/50 text-gray-400 hover:text-gray-300"
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterType === "expense"
                  ? "bg-red-500 text-white"
                  : "bg-slate-900/50 text-gray-400 hover:text-gray-300"
              }`}
            >
              Gastos
            </button>
          </div>
        </div>
      )}

      {/* Lista de transacciones */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No se encontraron transacciones
          </p>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => onEdit(transaction)}
              className="bg-slate-900/70 rounded-lg p-4 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Icono y detalles */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getTransactionIcon(transaction.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-200 text-sm truncate">
                        {transaction.description || "Sin descripción"}
                      </h4>
                      {transaction.type === "expense" &&
                        transaction.category_id && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadgeColor(
                              transaction.category_id
                            )}`}
                          >
                            {getCategoryName(transaction.category_id)}
                          </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={12} />
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>{getAccountName(transaction.account_id)}</span>
                    </div>

                    {transaction.notes && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {transaction.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Monto */}
                <div className="text-right flex-shrink-0">
                  <p
                    className={`text-lg font-bold ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {getTransactionSign(transaction.type)}$
                    {parseFloat(transaction.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
