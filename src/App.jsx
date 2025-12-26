import React, { useState, useEffect } from "react";
import {
  Calendar,
  BarChart3,
  Lightbulb,
  Layout,
  List,
  LogOut,
} from "lucide-react";
import { supabase } from "./services/supabase";
import AuthScreen from "./components/AuthScreen";
import CalendarView from "./components/CalendarView";
import ChartView from "./components/ChartView";
import IdeasView from "./components/IdeasView";
import { TaskModal, IdeaModal, GoalModal } from "./components/Modals";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("summary");
  const [activeTab, setActiveTab] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [goals, setGoals] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadAllData(session.user.id);
        } else {
          setTasks([]);
          setIdeas([]);
          setGoals([]);
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

  const loadAllData = async (userId) => {
    try {
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
    } catch (error) {
      console.error("Error loading data:", error);
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
      setTasks([]);
      setIdeas([]);
      setGoals([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      // Parse the task date as local date to avoid timezone shifts
      const taskDateStr = task.date; // Assuming format is YYYY-MM-DD
      const taskDate = new Date(taskDateStr + "T00:00:00"); // Force local timezone interpretation

      const matchesDate = taskDate.toDateString() === date.toDateString();
      const matchesRecurrent =
        task.recurrent && taskDate.getDay() === date.getDay();

      return matchesDate || matchesRecurrent;
    });
  };

  const getGoalsForDate = (date) => {
    return goals.filter((goal) => {
      if (!goal.deadline) return false;
      // Parse the goal deadline as local date to avoid timezone shifts
      const goalDateStr = goal.deadline; // Assuming format is YYYY-MM-DD
      const goalDate = new Date(goalDateStr + "T00:00:00"); // Force local timezone interpretation
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
      // Prepare data for insertion, handling empty deadline
      const insertData = {
        title: goalData.title,
        description: goalData.description,
        user_id: user.id,
        achieved: false,
      };

      // Only include deadline if it's not empty and column exists
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
      if (error.message.includes("deadline")) {
        alert(
          "La columna 'deadline' no existe en la base de datos. Por favor, agrega la columna 'deadline' de tipo DATE a la tabla 'goals' en Supabase."
        );
      } else {
        alert("Error al crear meta: " + error.message);
      }
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-700">Cargando...</div>
      </div>
    );
  }
  if (!user) {
    return <AuthScreen onSignIn={signInWithEmail} onSignUp={signUpWithEmail} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-xl lg:text-2xl font-bold text-purple-700">
              📅 Agenda Manager
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                )}
                <span className="text-sm font-medium truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setView("summary")}
                  className={`px-3 lg:px-4 py-2 rounded flex items-center gap-2 text-sm lg:text-base ${
                    view === "summary"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <Layout size={18} />
                  <span className="hidden sm:inline">Resumen</span>
                </button>
                <button
                  onClick={() => setView("tabs")}
                  className={`px-3 lg:px-4 py-2 rounded flex items-center gap-2 text-sm lg:text-base ${
                    view === "tabs" ? "bg-purple-500 text-white" : "bg-gray-200"
                  }`}
                >
                  <List size={18} />
                  <span className="hidden sm:inline">Tabs</span>
                </button>
              </div>

              <button
                onClick={signOut}
                className="px-3 lg:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2 text-sm lg:text-base whitespace-nowrap"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
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
                      <div className="text-sm text-gray-600">
                        {idea.category}
                      </div>
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
                  <span className="hidden xs:inline">Calendario</span>
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
                  <span className="hidden xs:inline">Progreso</span>
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
                  <span className="hidden xs:inline">Ideas</span>
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
      </div>

      {showTaskModal && (
        <TaskModal
          selectedDate={selectedDate}
          addTask={addTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}
      {showIdeaModal && (
        <IdeaModal addIdea={addIdea} onClose={() => setShowIdeaModal(false)} />
      )}
      {showGoalModal && (
        <GoalModal addGoal={addGoal} onClose={() => setShowGoalModal(false)} />
      )}
    </div>
  );
};
export default App;
