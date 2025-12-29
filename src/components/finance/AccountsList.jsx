import React, { useState } from "react";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  DollarSign,
  MoreVertical,
  Edit2,
  Trash2,
  Briefcase,
} from "lucide-react";

const AccountsList = ({ accounts, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(null);

  const getAccountIcon = (type) => {
    const iconProps = { size: 20 };
    switch (type) {
      case "checking":
        return <Wallet {...iconProps} className="text-emerald-400" />;
      case "savings":
        return <PiggyBank {...iconProps} className="text-emerald-400" />;
      case "credit":
        return <CreditCard {...iconProps} className="text-blue-400" />;
      case "investment":
        return <TrendingUp {...iconProps} className="text-purple-400" />;
      case "cash":
        return <DollarSign {...iconProps} className="text-yellow-400" />;
      default:
        return <Wallet {...iconProps} className="text-emerald-400" />;
    }
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      checking: "Cuenta Corriente",
      savings: "Ahorros",
      credit: "Tarjeta de Crédito",
      investment: "Inversión",
      cash: "Efectivo",
      other: "Otra",
    };
    return labels[type] || type;
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
          <Wallet size={20} />
          Mis Cuentas
        </h3>
        <div className="text-center py-8 text-gray-400">
          <Wallet size={48} className="mx-auto mb-3 opacity-50" />
          <p>No tienes cuentas registradas</p>
          <p className="text-sm mt-1">Crea tu primera cuenta para empezar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-emerald-500/20 overflow-hidden">
      <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
        <Wallet size={20} />
        Mis Cuentas
      </h3>

      <div className="space-y-3 overflow-hidden">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-slate-900/70 rounded-lg p-3 sm:p-4 border-l-4 hover:bg-slate-900/90 transition-all duration-200 group relative overflow-hidden"
            style={{ borderLeftColor: account.color }}
          >
            <div className="flex items-start justify-between gap-2">
              {/* Icono y detalles */}
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <div
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${account.color}20` }}
                >
                  {getAccountIcon(account.type)}
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                  <h4 className="font-semibold text-gray-200 text-sm sm:text-base truncate">
                    {account.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {getAccountTypeLabel(account.type)}
                  </p>
                  {account.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 sm:line-clamp-2 break-words">
                      {account.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Balance y menú */}
              <div className="flex items-start gap-1 sm:gap-2 flex-shrink-0">
                <div className="text-right min-w-0">
                  <p className="text-base sm:text-lg font-bold text-emerald-400 truncate">
                    $
                    {parseFloat(account.balance || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {account.currency || "DOP"}
                  </p>
                </div>

                {/* Menú de opciones */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === account.id ? null : account.id)
                    }
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>

                  {menuOpen === account.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setMenuOpen(null)}
                      />
                      <div className="absolute right-0 mt-1 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1 z-20 min-w-[140px]">
                        <button
                          onClick={() => {
                            onEdit(account);
                            setMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Edit2 size={14} />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Eliminar la cuenta "${account.name}"?`
                              )
                            ) {
                              onDelete(account.id);
                            }
                            setMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Balance Total</span>
          <span className="text-xl font-bold text-emerald-400">
            $
            {accounts
              .reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
              .toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountsList;
