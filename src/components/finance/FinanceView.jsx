import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Target,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import FinanceSummary from "./FinanceSummary";
import AccountsList from "./AccountsList";
import TransactionList from "./TransactionList";
import BudgetProgress from "./BudgetProgress";
import GoalsList from "./GoalsList";
import FinanceCharts from "./FinanceCharts";
import AddTransactionModal from "./AddTransactionModal";
import AddAccountModal from "./AddAccountModal";
import AddGoalModal from "./AddGoalModal";
import AddBudgetModal from "./AddBudgetModal";

const FinanceView = ({
  accounts,
  transactions,
  budgets,
  goals,
  categories,
  tags,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onExportData,
  userId,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionType, setTransactionType] = useState("expense");

  // Calcular balance total
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || 0),
    0
  );

  // Calcular ingresos y gastos del mes actual
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= firstDayOfMonth && tDate <= lastDayOfMonth;
  });

  const monthIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const monthExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Calcular gastos de la semana actual
  const startOfWeek = new Date(now);
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(now.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weekTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    const normalizedTDate = new Date(
      tDate.getFullYear(),
      tDate.getMonth(),
      tDate.getDate()
    );
    return normalizedTDate >= startOfWeek && normalizedTDate <= endOfWeek;
  });

  const weekExpenses = weekTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Metas activas
  const activeGoals = goals.filter((g) => !g.is_achieved);

  const handleAddTransaction = (type) => {
    setTransactionType(type);
    setSelectedTransaction(null);
    setShowTransactionModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionType(transaction.type);
    setShowTransactionModal(true);
  };

  const tabs = [
    { id: "overview", label: "Resumen", icon: DollarSign },
    { id: "transactions", label: "Transacciones", icon: ArrowRightLeft },
    { id: "budgets", label: "Presupuestos", icon: PieChart },
    { id: "goals", label: "Metas", icon: Target },
    { id: "analytics", label: "Análisis", icon: TrendingUp },
  ];

  // Componente simplificado de metas para el overview
  const GoalsPreview = () => {
    const displayGoals = activeGoals.slice(0, 3);

    if (displayGoals.length === 0) {
      return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
              <Target size={20} />
              Metas Activas
            </h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
            >
              <Plus size={16} />
              Nueva
            </button>
          </div>
          <p className="text-gray-400 text-center py-8">
            No tienes metas activas. ¡Crea una para comenzar!
          </p>
        </div>
      );
    }

    return (
      <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-emerald-500/20 overflow-hidden">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 truncate">
            <Target size={20} className="flex-shrink-0" />
            <span className="truncate">Metas Activas</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGoalModal(true)}
              className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nueva</span>
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className="text-gray-400 hover:text-gray-300 text-sm"
            >
              Ver todas ({activeGoals.length})
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {displayGoals.map((goal) => {
            const progress = Math.min(
              (parseFloat(goal.current_amount) /
                parseFloat(goal.target_amount)) *
                100,
              100
            );

            return (
              <div key={goal.id} className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-200 truncate">
                      {goal.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      $
                      {parseFloat(goal.current_amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      de $
                      {parseFloat(goal.target_amount).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400 ml-2">
                    {progress.toFixed(0)}%
                  </span>
                </div>

                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con balance y acciones rápidas */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-2xl p-4 sm:p-6 border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-2">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Balance Total</p>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
              onClick={() => handleAddTransaction("income")}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Ingreso</span>
            </button>
            <button
              onClick={() => handleAddTransaction("expense")}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <TrendingDown size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span>Gasto</span>
            </button>
            <button
              onClick={() => handleAddTransaction("transfer")}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <ArrowRightLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Transferir</span>
              <span className="sm:hidden">Transfer</span>
            </button>
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <Wallet size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Nueva Cuenta</span>
              <span className="sm:hidden">Cuenta</span>
            </button>
          </div>
        </div>

        {/* Resumen del mes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Ingresos del mes
                </p>
                <p className="text-lg sm:text-2xl font-bold text-emerald-400 truncate">
                  $
                  {monthIncome.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingUp
                className="text-emerald-400 flex-shrink-0 ml-2"
                size={24}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Gastos del mes
                </p>
                <p className="text-lg sm:text-2xl font-bold text-red-400 truncate">
                  $
                  {monthExpenses.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingDown
                className="text-red-400 flex-shrink-0 ml-2"
                size={24}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Gastos de la semana
                </p>
                <p className="text-lg sm:text-2xl font-bold text-red-400 truncate">
                  $
                  {weekExpenses.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingDown
                className="text-red-400 flex-shrink-0 ml-2"
                size={24}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-slate-900 rounded-lg shadow-xl border border-emerald-500/30 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] sm:min-w-[120px] py-3 sm:py-4 px-3 sm:px-6 flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-800/50"
              }`}
            >
              <tab.icon size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm md:text-base">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Contenido de cada tab */}
        <div className="p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
                <AccountsList
                  accounts={accounts}
                  onEdit={onUpdateAccount}
                  onDelete={onDeleteAccount}
                />
                <GoalsPreview />
              </div>
              <BudgetProgress
                budgets={budgets.slice(0, 4)}
                transactions={monthTransactions}
              />
              <TransactionList
                transactions={transactions.slice(0, 10)}
                accounts={accounts}
                categories={categories}
                onEdit={handleEditTransaction}
                onDelete={onDeleteTransaction}
                title="Transacciones Recientes"
                showViewAll={true}
                onViewAll={() => setActiveTab("transactions")}
              />
            </div>
          )}

          {activeTab === "transactions" && (
            <TransactionList
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              onEdit={handleEditTransaction}
              onDelete={onDeleteTransaction}
              showFilters={true}
            />
          )}

          {activeTab === "budgets" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-emerald-400">
                  Presupuestos Activos
                </h3>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus size={18} />
                  <span>Nuevo Presupuesto</span>
                </button>
              </div>
              <BudgetProgress
                budgets={budgets}
                transactions={monthTransactions}
                onEdit={onUpdateBudget}
                onDelete={onDeleteBudget}
                detailed={true}
              />
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-emerald-400">
                  Metas Financieras
                </h3>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus size={18} />
                  <span>Nueva Meta</span>
                </button>
              </div>
              <GoalsList
                goals={goals}
                onEdit={onUpdateGoal}
                onDelete={onDeleteGoal}
                onSave={onAddGoal}
                detailed={true}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <FinanceCharts
              transactions={transactions}
              accounts={accounts}
              categories={categories}
              budgets={budgets}
              goals={goals}
            />
          )}
        </div>
      </div>

      {/* Modales */}
      {showTransactionModal && (
        <AddTransactionModal
          type={transactionType}
          transaction={selectedTransaction}
          accounts={accounts}
          categories={categories}
          tags={tags}
          onSave={(transactionData, selectedTags) => {
            if (selectedTransaction) {
              const { id, ...updates } = transactionData;
              const cleanedUpdates = {
                ...updates,
                category_id: updates.category_id || null,
                to_account_id: updates.to_account_id || null,
                subaccount_id: updates.subaccount_id || null,
                to_subaccount_id: updates.to_subaccount_id || null,
              };
              onUpdateTransaction(id, cleanedUpdates);
            } else {
              onAddTransaction(transactionData, selectedTags);
            }
          }}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {showAccountModal && (
        <AddAccountModal
          onSave={onAddAccount}
          onClose={() => setShowAccountModal(false)}
        />
      )}

      {showGoalModal && (
        <AddGoalModal
          accounts={accounts}
          onSave={onAddGoal}
          onClose={() => setShowGoalModal(false)}
        />
      )}

      {showBudgetModal && (
        <AddBudgetModal
          categories={categories}
          onSave={onAddBudget}
          onClose={() => setShowBudgetModal(false)}
        />
      )}
    </div>
  );
};

export default FinanceView;
