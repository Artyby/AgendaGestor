import React from "react";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";

const AccountsList = ({ accounts, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = React.useState(null);

  const getAccountIcon = (type) => {
    switch (type) {
      case "checking":
        return <Wallet className="text-emerald-400" size={24} />;
      case "savings":
        return <PiggyBank className="text-blue-400" size={24} />;
      case "credit":
        return <CreditCard className="text-red-400" size={24} />;
      case "investment":
        return <TrendingUp className="text-purple-400" size={24} />;
      case "cash":
        return <DollarSign className="text-yellow-400" size={24} />;
      default:
        return <Wallet className="text-gray-400" size={24} />;
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

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
      <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
        <Wallet size={24} />
        Mis Cuentas
      </h3>

      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Wallet size={48} className="mx-auto mb-3 opacity-50" />
            <p>No tienes cuentas registradas</p>
            <p className="text-sm mt-1">Crea tu primera cuenta para empezar</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors border border-slate-700/50"
              style={{ borderLeftColor: account.color, borderLeftWidth: "4px" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    {getAccountIcon(account.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{account.name}</h4>
                    <p className="text-sm text-gray-400">
                      {getAccountTypeLabel(account.type)}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-xl font-bold text-emerald-400">
                      $
                      {parseFloat(account.balance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-400">{account.currency}</p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuOpen(menuOpen === account.id ? null : account.id)
                      }
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} className="text-gray-400" />
                    </button>

                    {menuOpen === account.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-10">
                        <button
                          onClick={() => {
                            onEdit(account);
                            setMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 flex items-center gap-2 rounded-t-lg"
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Estás seguro de eliminar la cuenta "${account.name}"?`
                              )
                            ) {
                              onDelete(account.id);
                            }
                            setMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 flex items-center gap-2 rounded-b-lg"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {account.description && (
                <p className="text-sm text-gray-400 mt-2 pl-14">
                  {account.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountsList;
