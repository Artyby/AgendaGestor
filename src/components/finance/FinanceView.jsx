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
  Calendar,
  Bell,
  Download,
  Settings,
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
  onExportData, // eslint-disable-line no-unused-vars
  userId, // eslint-disable-line no-unused-vars
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
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lunes
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

  const weekTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= startOfWeek && tDate <= endOfWeek;
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

  return (
    <div className="space-y-6">
      {/* Header con balance y acciones rápidas */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-2xl p-6 border border-emerald-500/30">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-2">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </h2>
            <p className="text-gray-400">Balance Total</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleAddTransaction("income")}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2 transition-colors"
            >
              <TrendingUp size={18} />
              <span>Ingreso</span>
            </button>
            <button
              onClick={() => handleAddTransaction("expense")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
            >
              <TrendingDown size={18} />
              <span>Gasto</span>
            </button>
            <button
              onClick={() => handleAddTransaction("transfer")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
            >
              <ArrowRightLeft size={18} />
              <span>Transferir</span>
            </button>
            <button
              onClick={() => setShowAccountModal(true)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2 transition-colors"
            >
              <Wallet size={18} />
              <span>Nueva Cuenta</span>
            </button>
          </div>
        </div>

        {/* Resumen del mes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ingresos del mes</p>
                <p className="text-2xl font-bold text-emerald-400">
                  $
                  {monthIncome.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingUp className="text-emerald-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Gastos del mes</p>
                <p className="text-2xl font-bold text-red-400">
                  $
                  {monthExpenses.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingDown className="text-red-400" size={32} />
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Gastos de la semana</p>
                <p className="text-2xl font-bold text-red-400">
                  $
                  {weekExpenses.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <TrendingDown className="text-red-400" size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="bg-slate-900 rounded-lg shadow-xl border border-emerald-500/30 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-slate-800/50"
              }`}
            >
              <tab.icon size={20} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de cada tab */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <AccountsList
                  accounts={accounts}
                  onEdit={onUpdateAccount}
                  onDelete={onDeleteAccount}
                />
                <GoalsList
                  goals={activeGoals.slice(0, 3)}
                  onEdit={onUpdateGoal}
                  onDelete={onDeleteGoal}
                  onSave={onAddGoal}
                  onAddNew={() => setShowGoalModal(true)}
                />
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-400">
                  Presupuestos Activos
                </h3>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-emerald-400">
                  Metas Financieras
                </h3>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center gap-2"
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
              // For editing: extract id and pass as separate parameters
              const { id, ...updates } = transactionData;
              onUpdateTransaction(id, updates);
            } else {
              // For adding: pass data and tags directly
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
