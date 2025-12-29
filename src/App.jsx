import React, { useState, useEffect } from "react";
import {
  Calendar,
  BarChart3,
  Lightbulb,
  Layout,
  List,
  LogOut,
  DollarSign,
} from "lucide-react";
import {
  supabase,
  accountServices,
  transactionServices,
  categoryServices,
  goalServices,
  budgetServices,
} from "./services/supabase";
import AuthScreen from "./components/AuthScreen";
import ModeToggle from "./components/ModeToggle";
import CalendarView from "./components/agenda/CalendarView";
import ChartView from "./components/agenda/ChartView";
import IdeasView from "./components/agenda/IdeasView";
import { TaskModal, IdeaModal, GoalModal } from "./components/agenda/Modals";
import FinanceView from "./components/finance/FinanceView";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("agenda");
  const [view, setView] = useState("summary");
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Estados de Agenda
  const [tasks, setTasks] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Estados de Finanzas
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [financialGoals, setFinancialGoals] = useState([]);

  // Colores según el modo
  const themeColors = {
    agenda: {
      bg: "from-purple-100 via-pink-100 to-blue-100",
      primary: "bg-purple-500",
      primaryHover: "hover:bg-purple-600",
      text: "text-purple-700",
      border: "border-purple-600",
      accent: "bg-purple-50",
    },
    finanzas: {
      bg: "from-gray-900 via-slate-800 to-gray-900",
      primary: "bg-emerald-500",
      primaryHover: "hover:bg-emerald-600",
      text: "text-emerald-400",
      border: "border-emerald-500",
      accent: "bg-slate-800",
    },
  };

  const theme = themeColors[mode];

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadAllData(session.user.id);
        } else {
          resetAllData();
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadAllData(session.user.id);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetAllData = () => {
    setTasks([]);
    setIdeas([]);
    setGoals([]);
    setAccounts([]);
    setTransactions([]);
    setCategories([]);
    setTags([]);
    setBudgets([]);
    setFinancialGoals([]);
  };

  const loadAllData = async (userId) => {
    try {
      // Cargar datos de agenda
      const [tasksData, ideasData, goalsData] = await Promise.all([
        supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: true }),
        supabase
          .from("ideas")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("goals")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false }),
      ]);

      if (tasksData.data) setTasks(tasksData.data);
      if (ideasData.data) setIdeas(ideasData.data);
      if (goalsData.data) setGoals(goalsData.data);

      // Cargar datos financieros
      await loadFinancialData(userId);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const loadFinancialData = async (userId) => {
    try {
      const [
        accountsData,
        transactionsData,
        categoriesData,
        budgetsData,
        goalsData,
      ] = await Promise.all([
        accountServices.getAll(userId),
        transactionServices.getAll(userId),
        categoryServices.getAll(userId),
        budgetServices.getAll(userId),
        goalServices.getAll(userId),
      ]);

      setAccounts(accountsData || []);
      setTransactions(transactionsData || []);
      setCategories(categoriesData || []);
      setBudgets(budgetsData || []);
      setFinancialGoals(goalsData || []);

      // Si no hay categorías, inicializar las por defecto
      if (!categoriesData || categoriesData.length === 0) {
        await categoryServices.initializeDefaults(userId);
        const newCategories = await categoryServices.getAll(userId);
        setCategories(newCategories || []);
      }
    } catch (error) {
      console.error(
        "Error loading financial data:",
        error.message || JSON.stringify(error)
      );
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const signUpWithEmail = async (email, password) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Cuenta creada exitosamente. Revisa tu email para confirmar.");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error al crear cuenta: " + error.message);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      resetAllData();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // ============================================
  // FUNCIONES DE AGENDA
  // ============================================

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      const taskDateStr = task.date;
      const taskDate = new Date(taskDateStr + "T00:00:00");
      const matchesDate = taskDate.toDateString() === date.toDateString();
      const matchesRecurrent =
        task.recurrent && taskDate.getDay() === date.getDay();
      return matchesDate || matchesRecurrent;
    });
  };

  const getGoalsForDate = (date) => {
    return goals.filter((goal) => {
      if (!goal.deadline) return false;
      const goalDateStr = goal.deadline;
      const goalDate = new Date(goalDateStr + "T00:00:00");
      return goalDate.toDateString() === date.toDateString();
    });
  };

  const addTask = async (taskData) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...taskData, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data) setTasks([...tasks, data[0]]);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error al crear tarea");
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId);

      if (error) throw error;
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);
      if (error) throw error;
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleTaskComplete = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    updateTask(taskId, { completed: !task.completed });
  };

  const addIdea = async (ideaData) => {
    try {
      const { data, error } = await supabase
        .from("ideas")
        .insert([{ ...ideaData, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data) setIdeas([data[0], ...ideas]);
    } catch (error) {
      console.error("Error adding idea:", error);
      alert("Error al crear idea");
    }
  };

  const deleteIdea = async (ideaId) => {
    try {
      const { error } = await supabase.from("ideas").delete().eq("id", ideaId);
      if (error) throw error;
      setIdeas(ideas.filter((idea) => idea.id !== ideaId));
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  const addGoal = async (goalData) => {
    try {
      const insertData = {
        title: goalData.title,
        description: goalData.description,
        user_id: user.id,
        achieved: false,
      };

      if (goalData.deadline && goalData.deadline.trim() !== "") {
        insertData.deadline = goalData.deadline;
      }

      const { data, error } = await supabase
        .from("goals")
        .insert([insertData])
        .select();

      if (error) throw error;
      if (data) setGoals([data[0], ...goals]);
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Error al crear meta: " + error.message);
    }
  };

  const toggleGoalAchieved = async (goalId) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      const { error } = await supabase
        .from("goals")
        .update({ achieved: !goal.achieved })
        .eq("id", goalId);
      if (error) throw error;
      setGoals(
        goals.map((g) =>
          g.id === goalId ? { ...g, achieved: !g.achieved } : g
        )
      );
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", goalId);
      if (error) throw error;
      setGoals(goals.filter((goal) => goal.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayTasks = getTasksForDate(date);
      const completed = dayTasks.filter((t) => t.completed).length;
      const total = dayTasks.length;

      stats.push({
        day: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][date.getDay()],
        completed,
        pending: total - completed,
        total,
      });
    }
    return stats;
  };

  // ============================================
  // FUNCIONES DE FINANZAS
  // ============================================

  const handleAddAccount = async (accountData) => {
    try {
      const newAccount = await accountServices.create(user.id, accountData);
      setAccounts([...accounts, newAccount]);
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Error al crear cuenta");
    }
  };

  const handleUpdateAccount = async (accountId, updates) => {
    try {
      const updatedAccount = await accountServices.update(accountId, updates);
      setAccounts(
        accounts.map((acc) => (acc.id === accountId ? updatedAccount : acc))
      );
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error al actualizar cuenta");
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await accountServices.delete(accountId);
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error al eliminar cuenta");
    }
  };

  const handleAddTransaction = async (transactionData, tagIds) => {
    try {
      // Limpiar campos UUID vacíos
      const cleanedData = {
        ...transactionData,
        category_id: transactionData.category_id || null,
        to_account_id: transactionData.to_account_id || null,
        subaccount_id: transactionData.subaccount_id || null,
        to_subaccount_id: transactionData.to_subaccount_id || null,
      };

      let newTransaction;

      if (cleanedData.type === "income") {
        newTransaction = await transactionServices.createIncome(
          user.id,
          cleanedData
        );
      } else if (cleanedData.type === "expense") {
        newTransaction = await transactionServices.createExpense(
          user.id,
          cleanedData
        );
      } else if (cleanedData.type === "transfer") {
        newTransaction = await transactionServices.createTransfer(
          user.id,
          cleanedData
        );
      }

      if (tagIds && tagIds.length > 0) {
        await transactionServices.addTags(newTransaction.id, tagIds);
      }

      // Recargar transacciones para obtener datos completos
      const updatedTransactions = await transactionServices.getAll(user.id);
      setTransactions(updatedTransactions);

      // Recargar cuentas para actualizar balances
      const updatedAccounts = await accountServices.getAll(user.id);
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(
        "Error al crear transacción: " + (error.message || "Error desconocido")
      );
    }
  };

  const handleUpdateTransaction = async (transactionId, updates) => {
    try {
      await transactionServices.update(transactionId, updates);
      const updatedTransactions = await transactionServices.getAll(user.id);
      setTransactions(updatedTransactions);
      const updatedAccounts = await accountServices.getAll(user.id);
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Error al actualizar transacción");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await transactionServices.delete(transactionId);
      setTransactions(transactions.filter((t) => t.id !== transactionId));
      const updatedAccounts = await accountServices.getAll(user.id);
      setAccounts(updatedAccounts);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Error al eliminar transacción");
    }
  };

  const handleAddBudget = async (budgetData) => {
    try {
      const newBudget = await budgetServices.create(user.id, budgetData);
      setBudgets([...budgets, newBudget]);
    } catch (error) {
      console.error("Error adding budget:", error);
      alert("Error al crear presupuesto");
    }
  };

  const handleUpdateBudget = async (budgetId, updates) => {
    try {
      await budgetServices.update(budgetId, updates);
      const updatedBudgets = await budgetServices.getAll(user.id);
      setBudgets(updatedBudgets);
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Error al actualizar presupuesto");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await budgetServices.delete(budgetId);
      setBudgets(budgets.filter((b) => b.id !== budgetId));
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Error al eliminar presupuesto");
    }
  };

  const handleAddFinancialGoal = async (goalData) => {
    try {
      const newGoal = await goalServices.create(user.id, goalData);
      setFinancialGoals([...financialGoals, newGoal]);
    } catch (error) {
      console.error("Error adding goal:", error);
      alert("Error al crear meta");
    }
  };

  const handleUpdateFinancialGoal = async (goalId, updates) => {
    try {
      await goalServices.update(goalId, updates);
      const updatedGoals = await goalServices.getAll(user.id);
      setFinancialGoals(updatedGoals);
    } catch (error) {
      console.error("Error updating goal:", error);
      alert("Error al actualizar meta");
    }
  };

  const handleDeleteFinancialGoal = async (goalId) => {
    try {
      await goalServices.delete(goalId);
      setFinancialGoals(financialGoals.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Error al eliminar meta");
    }
  };

  // ============================================
  // RENDERIZADO DE CONTENIDO
  // ============================================

  const renderAgendaContent = () => (
    <>
      {view === "summary" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CalendarView
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              tasks={tasks}
              getTasksForDate={getTasksForDate}
              toggleTaskComplete={toggleTaskComplete}
              deleteTask={deleteTask}
              setShowTaskModal={setShowTaskModal}
              goals={goals}
              getGoalsForDate={getGoalsForDate}
            />
          </div>
          <div className="space-y-6">
            <ChartView
              getWeeklyStats={getWeeklyStats}
              goals={goals}
              toggleGoalAchieved={toggleGoalAchieved}
              deleteGoal={deleteGoal}
              setShowGoalModal={setShowGoalModal}
            />
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" /> Ideas Recientes
              </h3>
              <div className="space-y-2">
                {ideas.slice(0, 3).map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3 bg-purple-50 rounded border-l-4 border-purple-500"
                  >
                    <div className="font-medium">{idea.title}</div>
                    <div className="text-sm text-gray-600">{idea.category}</div>
                  </div>
                ))}
                {ideas.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    No hay ideas guardadas
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-t-lg shadow-lg">
            <div className="flex flex-col sm:flex-row border-b">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2 font-medium text-sm sm:text-base ${
                  activeTab === "calendar"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
              >
                <Calendar size={20} />
                <span>Calendario</span>
              </button>
              <button
                onClick={() => setActiveTab("chart")}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2 font-medium text-sm sm:text-base ${
                  activeTab === "chart"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
              >
                <BarChart3 size={20} />
                <span>Progreso</span>
              </button>
              <button
                onClick={() => setActiveTab("ideas")}
                className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2 font-medium text-sm sm:text-base ${
                  activeTab === "ideas"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
              >
                <Lightbulb size={20} />
                <span>Ideas</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-b-lg shadow-lg p-6">
            {activeTab === "calendar" && (
              <CalendarView
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                tasks={tasks}
                getTasksForDate={getTasksForDate}
                toggleTaskComplete={toggleTaskComplete}
                deleteTask={deleteTask}
                setShowTaskModal={setShowTaskModal}
                goals={goals}
                getGoalsForDate={getGoalsForDate}
              />
            )}
            {activeTab === "chart" && (
              <ChartView
                getWeeklyStats={getWeeklyStats}
                goals={goals}
                toggleGoalAchieved={toggleGoalAchieved}
                deleteGoal={deleteGoal}
                setShowGoalModal={setShowGoalModal}
              />
            )}
            {activeTab === "ideas" && (
              <IdeasView
                ideas={ideas}
                deleteIdea={deleteIdea}
                setShowIdeaModal={setShowIdeaModal}
              />
            )}
          </div>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center`}
      >
        <div className={`text-2xl font-bold ${theme.text}`}>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSignIn={signInWithEmail} onSignUp={signUpWithEmail} />;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.bg} p-4 transition-all duration-500`}
    >
      <header className="max-w-7xl mx-auto mb-6">
        <div
          className={`${
            mode === "finanzas"
              ? "bg-slate-900 border border-emerald-500/30"
              : "bg-white"
          } rounded-lg shadow-lg p-4 transition-all duration-500`}
        >
          {/* MOBILE: Stack vertical */}
          <div className="flex flex-col gap-4 lg:hidden">
            <div className="flex items-center justify-center">
              <h1
                className={`text-xl font-bold ${
                  mode === "finanzas" ? "text-emerald-400" : "text-purple-700"
                }`}
              >
                {mode === "agenda" ? "📅 Agenda" : "💰 Finanzas"}
              </h1>
            </div>

            <div className="flex justify-center">
              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            <div className="flex items-center justify-center gap-2">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span
                className={`text-sm font-medium ${
                  mode === "finanzas" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>

            {mode === "agenda" && (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setView("summary")}
                  className={`px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    view === "summary"
                      ? `${theme.primary} text-white`
                      : "bg-gray-200"
                  }`}
                >
                  <Layout size={16} />
                  <span>Resumen</span>
                </button>
                <button
                  onClick={() => setView("tabs")}
                  className={`px-4 py-2 rounded flex items-center gap-2 text-sm ${
                    view === "tabs"
                      ? `${theme.primary} text-white`
                      : "bg-gray-200"
                  }`}
                >
                  <List size={16} />
                  <span>Tabs</span>
                </button>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 text-sm"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          </div>

          {/* DESKTOP: Layout horizontal */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            <h1
              className={`text-2xl font-bold whitespace-nowrap ${
                mode === "finanzas" ? "text-emerald-400" : "text-purple-700"
              }`}
            >
              {mode === "agenda" ? "📅 Agenda Manager" : "💰 Finance Manager"}
            </h1>

            <div className="flex-1 flex justify-center">
              <ModeToggle mode={mode} onModeChange={setMode} />
            </div>

            <div className="flex items-center gap-4">
              {mode === "agenda" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setView("summary")}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      view === "summary"
                        ? `${theme.primary} text-white`
                        : "bg-gray-200"
                    }`}
                  >
                    <Layout size={18} />
                    <span>Resumen</span>
                  </button>
                  <button
                    onClick={() => setView("tabs")}
                    className={`px-4 py-2 rounded flex items-center gap-2 ${
                      view === "tabs"
                        ? `${theme.primary} text-white`
                        : "bg-gray-200"
                    }`}
                  >
                    <List size={18} />
                    <span>Tabs</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span
                  className={`text-sm font-medium ${
                    mode === "finanzas" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>

              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {mode === "agenda" ? (
          renderAgendaContent()
        ) : (
          <FinanceView
            accounts={accounts}
            transactions={transactions}
            budgets={budgets}
            goals={financialGoals}
            categories={categories}
            tags={tags}
            onAddAccount={handleAddAccount}
            onUpdateAccount={handleUpdateAccount}
            onDeleteAccount={handleDeleteAccount}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddBudget={handleAddBudget}
            onUpdateBudget={handleUpdateBudget}
            onDeleteBudget={handleDeleteBudget}
            onAddGoal={handleAddFinancialGoal}
            onUpdateGoal={handleUpdateFinancialGoal}
            onDeleteGoal={handleDeleteFinancialGoal}
            userId={user.id}
          />
        )}
      </div>

      {mode === "agenda" && (
        <>
          {showTaskModal && (
            <TaskModal
              selectedDate={selectedDate}
              addTask={addTask}
              onClose={() => setShowTaskModal(false)}
            />
          )}
          {showIdeaModal && (
            <IdeaModal
              addIdea={addIdea}
              onClose={() => setShowIdeaModal(false)}
            />
          )}
          {showGoalModal && (
            <GoalModal
              addGoal={addGoal}
              onClose={() => setShowGoalModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
