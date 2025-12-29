import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// SERVICIOS DE CUENTAS (ACCOUNTS)
// ============================================

export const accountServices = {
  // Obtener todas las cuentas del usuario
  async getAll(userId) {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Crear nueva cuenta
  async create(userId, accountData) {
    const { data, error } = await supabase
      .from("accounts")
      .insert([{ ...accountData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar cuenta
  async update(accountId, updates) {
    const { data, error } = await supabase
      .from("accounts")
      .update(updates)
      .eq("id", accountId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar cuenta (soft delete)
  async delete(accountId) {
    const { error } = await supabase
      .from("accounts")
      .update({ is_active: false })
      .eq("id", accountId);

    if (error) throw error;
  },

  // Obtener balance total
  async getTotalBalance(userId) {
    const { data, error } = await supabase
      .from("accounts")
      .select("balance")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) throw error;
    return data.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  },
};

// ============================================
// SERVICIOS DE TRANSACCIONES (TRANSACTIONS)
// ============================================

export const transactionServices = {
  // Obtener todas las transacciones
  async getAll(userId, filters = {}) {
    let query = supabase
      .from("transactions")
      .select(
        `
        *,
        account:accounts!transactions_account_id_fkey(name, type, color),
        to_account:accounts!transactions_to_account_id_fkey(name, type, color),
        category:categories(name, color, icon),
        tags:transaction_tags(tag:tags(id, name, color))
      `
      )
      .eq("user_id", userId)
      .order("date", { ascending: false });

    // Aplicar filtros
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.accountId) query = query.eq("account_id", filters.accountId);
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
    if (filters.startDate) query = query.gte("date", filters.startDate);
    if (filters.endDate) query = query.lte("date", filters.endDate);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Crear transacción de ingreso
  async createIncome(userId, transactionData) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          ...transactionData,
          user_id: userId,
          type: "income",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Crear transacción de gasto
  async createExpense(userId, transactionData) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          ...transactionData,
          user_id: userId,
          type: "expense",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Crear transferencia entre cuentas
  async createTransfer(userId, transferData) {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          ...transferData,
          user_id: userId,
          type: "transfer",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar transacción
  async update(transactionId, updates) {
    // First check if transaction exists
    const { data: existingTransaction, error: checkError } = await supabase
      .from("transactions")
      .select("id")
      .eq("id", transactionId)
      .single();

    if (checkError || !existingTransaction) {
      throw new Error("Transaction not found");
    }

    // Proceed with update
    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", transactionId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error("No changes made to transaction");
    }
    return data[0];
  },

  // Eliminar transacción
  async delete(transactionId) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);

    if (error) throw error;
  },

  // Obtener resumen de transacciones
  async getSummary(userId, startDate, endDate) {
    const { data, error } = await supabase
      .from("transactions")
      .select("type, amount")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    const summary = {
      income: 0,
      expenses: 0,
      transfers: 0,
      net: 0,
    };

    data.forEach((t) => {
      const amount = parseFloat(t.amount);
      if (t.type === "income") summary.income += amount;
      else if (t.type === "expense") summary.expenses += amount;
      else if (t.type === "transfer") summary.transfers += amount;
    });

    summary.net = summary.income - summary.expenses;
    return summary;
  },

  // Agregar etiquetas a transacción
  async addTags(transactionId, tagIds) {
    const records = tagIds.map((tagId) => ({
      transaction_id: transactionId,
      tag_id: tagId,
    }));

    const { error } = await supabase.from("transaction_tags").insert(records);

    if (error) throw error;
  },

  // Remover etiqueta de transacción
  async removeTag(transactionId, tagId) {
    const { error } = await supabase
      .from("transaction_tags")
      .delete()
      .eq("transaction_id", transactionId)
      .eq("tag_id", tagId);

    if (error) throw error;
  },
};

// ============================================
// SERVICIOS DE CATEGORÍAS (CATEGORIES)
// ============================================

export const categoryServices = {
  // Obtener todas las categorías
  async getAll(userId) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Crear categoría
  async create(userId, categoryData) {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ ...categoryData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar categoría
  async update(categoryId, updates) {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", categoryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar categoría
  async delete(categoryId) {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) throw error;
  },

  // Inicializar categorías por defecto para nuevo usuario
  async initializeDefaults(userId) {
    const defaultCategories = [
      // Ingresos
      { name: "Salario", type: "income", color: "#10b981", icon: "briefcase" },
      { name: "Freelance", type: "income", color: "#3b82f6", icon: "code" },
      {
        name: "Inversiones",
        type: "income",
        color: "#8b5cf6",
        icon: "trending-up",
      },
      {
        name: "Otros Ingresos",
        type: "income",
        color: "#6366f1",
        icon: "plus-circle",
      },

      // Gastos
      {
        name: "Alimentación",
        type: "expense",
        color: "#ef4444",
        icon: "utensils",
      },
      { name: "Transporte", type: "expense", color: "#f59e0b", icon: "car" },
      { name: "Vivienda", type: "expense", color: "#84cc16", icon: "home" },
      { name: "Servicios", type: "expense", color: "#06b6d4", icon: "zap" },
      {
        name: "Entretenimiento",
        type: "expense",
        color: "#ec4899",
        icon: "film",
      },
      { name: "Salud", type: "expense", color: "#14b8a6", icon: "heart" },
      { name: "Educación", type: "expense", color: "#8b5cf6", icon: "book" },
      { name: "Ropa", type: "expense", color: "#f43f5e", icon: "shopping-bag" },
      {
        name: "Otros Gastos",
        type: "expense",
        color: "#64748b",
        icon: "more-horizontal",
      },
    ];

    const records = defaultCategories.map((cat) => ({
      ...cat,
      user_id: userId,
      is_system: true,
    }));

    const { error } = await supabase.from("categories").insert(records);
    if (error) throw error;
  },
};

// ============================================
// SERVICIOS DE ETIQUETAS (TAGS)
// ============================================

export const tagServices = {
  // Obtener todas las etiquetas
  async getAll(userId) {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Crear etiqueta
  async create(userId, tagData) {
    const { data, error } = await supabase
      .from("tags")
      .insert([{ ...tagData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar etiqueta
  async update(tagId, updates) {
    const { data, error } = await supabase
      .from("tags")
      .update(updates)
      .eq("id", tagId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar etiqueta
  async delete(tagId) {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);

    if (error) throw error;
  },
};

// ============================================
// SERVICIOS DE METAS (FINANCIAL GOALS)
// ============================================

export const goalServices = {
  // Obtener todas las metas
  async getAll(userId) {
    const { data, error } = await supabase
      .from("financial_goals")
      .select("*, account:accounts(name, color)")
      .eq("user_id", userId)
      .order("deadline", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Crear meta
  async create(userId, goalData) {
    const { data, error } = await supabase
      .from("financial_goals")
      .insert([{ ...goalData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar meta
  async update(goalId, updates) {
    const { data, error } = await supabase
      .from("financial_goals")
      .update(updates)
      .eq("id", goalId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar progreso de meta
  async updateProgress(goalId, amount) {
    const { data: goal } = await supabase
      .from("financial_goals")
      .select("current_amount, target_amount")
      .eq("id", goalId)
      .single();

    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
    const isAchieved = newAmount >= parseFloat(goal.target_amount);

    const updates = {
      current_amount: newAmount,
      is_achieved: isAchieved,
    };

    if (isAchieved && !goal.is_achieved) {
      updates.achieved_at = new Date().toISOString();
    }

    return await this.update(goalId, updates);
  },

  // Eliminar meta
  async delete(goalId) {
    const { error } = await supabase
      .from("financial_goals")
      .delete()
      .eq("id", goalId);

    if (error) throw error;
  },

  // Obtener metas en riesgo (menos del 50% completado y menos de 30 días para deadline)
  async getAtRisk(userId) {
    const { data, error } = await supabase
      .from("financial_goals")
      .select("*")
      .eq("user_id", userId)
      .eq("is_achieved", false)
      .not("deadline", "is", null);

    if (error) throw error;

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return data.filter((goal) => {
      const deadline = new Date(goal.deadline);
      const progress =
        (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) *
        100;
      return deadline <= thirtyDaysFromNow && progress < 50;
    });
  },
};

// ============================================
// SERVICIOS DE PRESUPUESTOS (BUDGETS)
// ============================================

export const budgetServices = {
  // Obtener todos los presupuestos
  async getAll(userId) {
    const { data, error } = await supabase
      .from("budgets")
      .select("*, category:categories(name, color, icon)")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Crear presupuesto
  async create(userId, budgetData) {
    const { data, error } = await supabase
      .from("budgets")
      .insert([{ ...budgetData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar presupuesto
  async update(budgetId, updates) {
    const { data, error } = await supabase
      .from("budgets")
      .update(updates)
      .eq("id", budgetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar presupuesto
  async delete(budgetId) {
    const { error } = await supabase
      .from("budgets")
      .update({ is_active: false })
      .eq("id", budgetId);

    if (error) throw error;
  },

  // Obtener progreso de presupuesto
  async getProgress(budgetId, userId) {
    const { data: budget } = await supabase
      .from("budgets")
      .select("*, category:categories(id)")
      .eq("id", budgetId)
      .single();

    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("category_id", budget.category.id)
      .eq("type", "expense")
      .gte("date", budget.start_date)
      .lte("date", budget.end_date || new Date().toISOString());

    const spent = transactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0
    );
    const remaining = parseFloat(budget.amount) - spent;
    const percentage = (spent / parseFloat(budget.amount)) * 100;

    return {
      budget: parseFloat(budget.amount),
      spent,
      remaining,
      percentage,
      isOverBudget: spent > parseFloat(budget.amount),
      isNearLimit: percentage >= parseFloat(budget.alert_threshold),
    };
  },
};

// ============================================
// SERVICIOS DE RECORDATORIOS (REMINDERS)
// ============================================

export const reminderServices = {
  // Obtener recordatorios activos
  async getActive(userId) {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", userId)
      .eq("is_completed", false)
      .order("due_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Crear recordatorio
  async create(userId, reminderData) {
    const { data, error } = await supabase
      .from("reminders")
      .insert([{ ...reminderData, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Marcar como completado
  async complete(reminderId) {
    const { data, error } = await supabase
      .from("reminders")
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq("id", reminderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar recordatorio
  async delete(reminderId) {
    const { error } = await supabase
      .from("reminders")
      .delete()
      .eq("id", reminderId);

    if (error) throw error;
  },
};

// ============================================
// SERVICIOS DE REPORTES Y ANÁLISIS
// ============================================

export const analyticsServices = {
  // Obtener gastos por categoría
  async getExpensesByCategory(userId, startDate, endDate) {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, category:categories(id, name, color)")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    const byCategory = {};
    data.forEach((t) => {
      if (t.category) {
        const catId = t.category.id;
        if (!byCategory[catId]) {
          byCategory[catId] = {
            category: t.category.name,
            color: t.category.color,
            total: 0,
          };
        }
        byCategory[catId].total += parseFloat(t.amount);
      }
    });

    return Object.values(byCategory);
  },

  // Obtener tendencia mensual
  async getMonthlyTrend(userId, months = 6) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const { data, error } = await supabase
      .from("transactions")
      .select("type, amount, date")
      .eq("user_id", userId)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0]);

    if (error) throw error;

    const byMonth = {};
    data.forEach((t) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!byMonth[month]) {
        byMonth[month] = { income: 0, expenses: 0 };
      }
      if (t.type === "income") byMonth[month].income += parseFloat(t.amount);
      else if (t.type === "expense")
        byMonth[month].expenses += parseFloat(t.amount);
    });

    return Object.entries(byMonth).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }));
  },

  // Calcular KPIs
  async getKPIs(userId, startDate, endDate) {
    const summary = await transactionServices.getSummary(
      userId,
      startDate,
      endDate
    );
    const goals = await goalServices.getAll(userId);

    const totalGoals = goals.length;
    const achievedGoals = goals.filter((g) => g.is_achieved).length;
    const savingsRate =
      summary.income > 0
        ? ((summary.income - summary.expenses) / summary.income) * 100
        : 0;

    return {
      savingsRate: savingsRate.toFixed(2),
      totalIncome: summary.income,
      totalExpenses: summary.expenses,
      netIncome: summary.net,
      goalsAchievedRate:
        totalGoals > 0 ? ((achievedGoals / totalGoals) * 100).toFixed(2) : 0,
    };
  },
};

// ============================================
// SERVICIOS DE EXPORTACIÓN
// ============================================

export const exportServices = {
  // Exportar transacciones a CSV
  async exportTransactionsCSV(userId, startDate, endDate) {
    const transactions = await transactionServices.getAll(userId, {
      startDate,
      endDate,
    });

    const headers = [
      "Fecha",
      "Tipo",
      "Monto",
      "Descripción",
      "Cuenta",
      "Categoría",
    ];
    const rows = transactions.map((t) => [
      t.date,
      t.type,
      t.amount,
      t.description || "",
      t.account?.name || "",
      t.category?.name || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csv;
  },

  // Exportar todas las cuentas
  async exportAccountsJSON(userId) {
    const accounts = await accountServices.getAll(userId);
    return JSON.stringify(accounts, null, 2);
  },

  // Exportar configuración completa
  async exportFullConfig(userId) {
    const [accounts, categories, tags, budgets, goals] = await Promise.all([
      accountServices.getAll(userId),
      categoryServices.getAll(userId),
      tagServices.getAll(userId),
      budgetServices.getAll(userId),
      goalServices.getAll(userId),
    ]);

    return JSON.stringify(
      {
        accounts,
        categories,
        tags,
        budgets,
        goals,
        exportDate: new Date().toISOString(),
      },
      null,
      2
    );
  },
};
