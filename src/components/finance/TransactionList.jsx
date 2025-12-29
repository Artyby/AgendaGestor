import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Calendar,
  Search,
  Filter,
  Edit,
  Trash2,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAccount, setFilterAccount] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        searchTerm === "" ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || t.type === filterType;
      const matchesCategory =
        filterCategory === "all" || t.category_id === filterCategory;
      const matchesAccount =
        filterAccount === "all" || t.account_id === filterAccount;

      return matchesSearch && matchesType && matchesCategory && matchesAccount;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterAccount]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case "income":
        return <TrendingUp className="text-emerald-400" size={20} />;
      case "expense":
        return <TrendingDown className="text-red-400" size={20} />;
      case "transfer":
        return <ArrowRightLeft className="text-blue-400" size={20} />;
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

  const getTypeLabel = (type) => {
    const labels = {
      income: "Ingreso",
      expense: "Gasto",
      transfer: "Transferencia",
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
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
        year: "numeric",
      });
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <ArrowRightLeft size={24} />
          {title}
        </h3>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-sm"
          >
            Ver todas
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 space-y-3">
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
              <option value="transfer">Transferencias</option>
            </select>

            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Todas las cuentas</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ArrowRightLeft size={48} className="mx-auto mb-3 opacity-50" />
            <p>No hay transacciones</p>
            <p className="text-sm mt-1">
              {searchTerm || filterType !== "all"
                ? "Intenta cambiar los filtros"
                : "Agrega tu primera transacción"}
            </p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors border border-slate-700/50 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">
                        {transaction.description || "Sin descripción"}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          transaction.type === "income"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : transaction.type === "expense"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {getTypeLabel(transaction.type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                      <Calendar size={14} />
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.account && (
                        <>
                          <span>•</span>
                          <span>{transaction.account.name}</span>
                        </>
                      )}
                      {transaction.type === "transfer" &&
                        transaction.to_account && (
                          <>
                            <ArrowRightLeft size={14} />
                            <span>{transaction.to_account.name}</span>
                          </>
                        )}
                      {transaction.category && (
                        <>
                          <span>•</span>
                          <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{
                              backgroundColor: `${transaction.category.color}20`,
                              color: transaction.category.color,
                            }}
                          >
                            {transaction.category.name}
                          </span>
                        </>
                      )}
                    </div>

                    {transaction.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {transaction.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${getTransactionColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}$
                      {parseFloat(transaction.amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} className="text-blue-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "¿Estás seguro de eliminar esta transacción?"
                          )
                        ) {
                          onDelete(transaction.id);
                        }
                      }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showFilters && filteredTransactions.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-400">
          Mostrando {filteredTransactions.length} de {transactions.length}{" "}
          transacciones
        </div>
      )}
    </div>
  );
};

export default TransactionList;
