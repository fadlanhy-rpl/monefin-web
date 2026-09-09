/**
 * Gamification Localization Dictionary (Achievements & Quests)
 * Maps seeded Indonesian titles/descriptions to English when language is 'en'.
 */

export const ACHIEVEMENT_TRANSLATIONS = {
  first_tx: {
    titleEn: "First Steps",
    descEn: "Record your first transaction in MoneFin.",
  },
  tx_10: {
    titleEn: "Active Tracker",
    descEn: "Record at least 10 income or expense transactions.",
  },
  tx_50: {
    titleEn: "Cash Flow Expert",
    descEn: "Record at least 50 transactions in the app.",
  },
  tx_100: {
    titleEn: "Financial Legend",
    descEn: "Record at least 100 transactions consistently.",
  },
  streak_3: {
    titleEn: "Spark of Discipline",
    descEn: "Maintain a 3-day transaction recording streak.",
  },
  streak_7: {
    titleEn: "Weekly Warrior",
    descEn: "Maintain a 7-day transaction recording streak.",
  },
  streak_30: {
    titleEn: "Monthly Consistency",
    descEn: "Maintain a 30-day uninterrupted recording streak.",
  },
  streak_100: {
    titleEn: "Habit Grandmaster",
    descEn: "Achieve a legendary 100-day recording streak.",
  },
  first_goal: {
    titleEn: "Dream Architect",
    descEn: "Create your first savings goal.",
  },
  first_deposit: {
    titleEn: "First Savings Deposit",
    descEn: "Make your first deposit to a savings goal.",
  },
  goal_completed_1: {
    titleEn: "Goal Achiever",
    descEn: "Reach 100% on any of your savings goals.",
  },
  goal_completed_3: {
    titleEn: "Master Achiever",
    descEn: "Successfully complete 3 dream savings goals.",
  },
  security_2fa: {
    titleEn: "Security Fortress",
    descEn: "Enable Two-Factor Authentication (2FA) to protect your account.",
  },
  budget_created: {
    titleEn: "Budget Controller",
    descEn: "Create at least 3 category budget limits.",
  },
  recurring_setup: {
    titleEn: "Automation Master",
    descEn: "Create at least 1 recurring transaction schedule.",
  },
  tx_250: {
    titleEn: "Bookkeeping Sultan",
    descEn: "Record at least 250 financial transactions in MoneFin.",
  },
  streak_14: {
    titleEn: "Two Weeks Champion",
    descEn: "Maintain a 14-day transaction recording streak.",
  },
  streak_60: {
    titleEn: "Two Months on Fire",
    descEn: "Maintain an uninterrupted 60-day recording streak.",
  },
  first_split_bill: {
    titleEn: "Split Bill Hero",
    descEn: "Create your very first Split Bill.",
  },
  split_bill_5: {
    titleEn: "Hangout Master",
    descEn: "Create at least 5 split bills with friends or colleagues.",
  },
  budget_all_rounder: {
    titleEn: "Holistic Budget Architect",
    descEn: "Create at least 5 category budgets for full financial control.",
  },
  savings_depositor_5: {
    titleEn: "Regular Saver",
    descEn: "Make at least 5 deposits into your savings goals.",
  },
  savings_depositor_10: {
    titleEn: "Gold Savings Collector",
    descEn: "Make at least 10 deposits into your savings goals.",
  },
  goal_completed_5: {
    titleEn: "Legendary Dream Achiever",
    descEn: "Successfully complete 5 dream savings goals to 100%.",
  },
  multi_account: {
    titleEn: "Financial Diversification",
    descEn: "Hold at least 3 active financial accounts (Bank, E-Wallet, Cash).",
  },
};

export const TITLE_FALLBACK_MAP = {
  "Pencatat Pemula": { title: "First Steps", desc: "Record your first transaction in MoneFin." },
  "Pencatat Aktif": { title: "Active Tracker", desc: "Record at least 10 income or expense transactions." },
  "Pakar Arus Kas": { title: "Cash Flow Expert", desc: "Record at least 50 transactions in the app." },
  "Legenda Finansial": { title: "Financial Legend", desc: "Record at least 100 transactions consistently." },
  "Sultan Pembukuan": { title: "Bookkeeping Sultan", desc: "Record at least 250 financial transactions in MoneFin." },
  "Percikan Disiplin": { title: "Spark of Discipline", desc: "Maintain a 3-day transaction recording streak." },
  "Pejuang Mingguan": { title: "Weekly Warrior", desc: "Maintain a 7-day transaction recording streak." },
  "Dua Pekan Juara": { title: "Two Weeks Champion", desc: "Maintain a 14-day transaction recording streak." },
  "Konsistensi Bulanan": { title: "Monthly Consistency", desc: "Maintain a 30-day uninterrupted recording streak." },
  "Dua Bulan Membara": { title: "Two Months on Fire", desc: "Maintain an uninterrupted 60-day recording streak." },
  "Grandmaster Habit": { title: "Habit Grandmaster", desc: "Achieve a legendary 100-day recording streak." },
  "Perancang Impian": { title: "Dream Architect", desc: "Create your first savings goal." },
  "Langkah Awal Menabung": { title: "First Savings Deposit", desc: "Make your first deposit to a savings goal." },
  "Penakluk Target": { title: "Goal Achiever", desc: "Reach 100% on any of your savings goals." },
  "Wirausahawan Impian": { title: "Master Achiever", desc: "Successfully complete 3 dream savings goals." },
  "Legenda Penakluk Impian": { title: "Legendary Dream Achiever", desc: "Successfully complete 5 dream savings goals to 100%." },
  "Benteng Keamanan": { title: "Security Fortress", desc: "Enable Two-Factor Authentication (2FA) to protect your account." },
  "Pengendali Anggaran": { title: "Budget Controller", desc: "Create at least 3 category budget limits." },
  "Arsitek Anggaran Holistik": { title: "Holistic Budget Architect", desc: "Create at least 5 category budgets for full financial control." },
  "Master Otomatisasi": { title: "Automation Master", desc: "Create at least 1 recurring transaction schedule." },
  "Pahlawan Patungan": { title: "Split Bill Hero", desc: "Create your very first Split Bill." },
  "Master Hangout": { title: "Hangout Master", desc: "Create at least 5 split bills with friends or colleagues." },
  "Penabung Rutin": { title: "Regular Saver", desc: "Make at least 5 deposits into your savings goals." },
  "Kolektor Tabungan Emas": { title: "Gold Savings Collector", desc: "Make at least 10 deposits into your savings goals." },
  "Diversifikasi Finansial": { title: "Financial Diversification", desc: "Hold at least 3 active financial accounts (Bank, E-Wallet, Cash)." },
};

export const QUEST_TRANSLATIONS = {
  // ─── DAILY QUESTS ──────────────────────────────────────────────────────────
  record_daily_tx: {
    titleEn: "Record Today's Transaction",
    descEn: "Record at least 1 income or expense transaction today.",
  },
  daily_income_track: {
    titleEn: "Record Cash Inflow",
    descEn: "Record at least 1 income transaction today.",
  },
  daily_expense_track: {
    titleEn: "Daily Expense Control",
    descEn: "Record at least 1 expense transaction to track your daily spending.",
  },
  daily_smart_review: {
    titleEn: "Check Financial Analytics",
    descEn: "Open Financial Reports or Summary to monitor your financial health.",
  },

  // ─── WEEKLY QUESTS ─────────────────────────────────────────────────────────
  weekly_tracking_3: {
    titleEn: "Consistent Tracker",
    descEn: "Record at least 3 transactions this week.",
  },
  weekly_tracking_7: {
    titleEn: "Super Disciplined Tracker",
    descEn: "Record a total of 7 transactions this week to maintain accurate bookkeeping.",
  },
  weekly_saver: {
    titleEn: "Weekly Savings Challenge",
    descEn: "Make at least 1 deposit into your Savings Goal this week.",
  },
  weekly_saver_double: {
    titleEn: "Savings Acceleration",
    descEn: "Deposit to your savings goals twice in a single week.",
  },
  weekly_budget_guardian: {
    titleEn: "Budget Guardian",
    descEn: "Create or adjust a category budget limit this week.",
  },
  weekly_split_bill: {
    titleEn: "Smart Split Bill",
    descEn: "Create 1 bill split with friends or family.",
  },
  weekly_goal_planner: {
    titleEn: "New Goal Planner",
    descEn: "Create a new target in the Savings Goals menu.",
  },
  weekly_budget_check: {
    titleEn: "Weekly Financial Review",
    descEn: "Visit Financial Reports to review your cash flow performance.",
  },

  // ─── TITLE FALLBACKS (ID -> EN) ───────────────────────────────────────────
  "Catat Transaksi Hari Ini": {
    titleEn: "Record Today's Transaction",
    descEn: "Record at least 1 income or expense transaction today.",
  },
  "Catat Arus Kas Masuk": {
    titleEn: "Record Cash Inflow",
    descEn: "Record at least 1 income transaction today.",
  },
  "Kontrol Belanja Harian": {
    titleEn: "Daily Expense Control",
    descEn: "Record at least 1 expense transaction to track your daily spending.",
  },
  "Cek Analisis Finansial": {
    titleEn: "Check Financial Analytics",
    descEn: "Open Financial Reports or Summary to monitor your financial health.",
  },
  "Pencatat Konsisten": {
    titleEn: "Consistent Tracker",
    descEn: "Record at least 3 transactions this week.",
  },
  "Pencatat Super Disiplin": {
    titleEn: "Super Disciplined Tracker",
    descEn: "Record a total of 7 transactions this week to maintain accurate bookkeeping.",
  },
  "Tantangan Menabung Mingguan": {
    titleEn: "Weekly Savings Challenge",
    descEn: "Make at least 1 deposit into your Savings Goal this week.",
  },
  "Akselerasi Tabungan": {
    titleEn: "Savings Acceleration",
    descEn: "Deposit to your savings goals twice in a single week.",
  },
  "Penjaga Batas Anggaran": {
    titleEn: "Budget Guardian",
    descEn: "Create or adjust a category budget limit this week.",
  },
  "Patungan Cerdas (Split Bill)": {
    titleEn: "Smart Split Bill",
    descEn: "Create 1 bill split with friends or family.",
  },
  "Perencana Impian Baru": {
    titleEn: "New Goal Planner",
    descEn: "Create a new target in the Savings Goals menu.",
  },
  "Evaluasi Finansial Mingguan": {
    titleEn: "Weekly Financial Review",
    descEn: "Visit Financial Reports to review your cash flow performance.",
  },
  "Catat 3 Transaksi Pekan Ini": {
    titleEn: "Record 3 Transactions This Week",
    descEn: "Record at least 3 new transactions this week.",
  },
  "Buat Anggaran Bulanan": {
    titleEn: "Set Monthly Budget",
    descEn: "Create at least 1 category budget for this month.",
  },
  "Buat Target Tabungan": {
    titleEn: "Create a Savings Goal",
    descEn: "Create at least 1 new savings goal.",
  },
  "Review Pengeluaran": {
    titleEn: "Review Expenses",
    descEn: "Review and evaluate your weekly financial report.",
  },
};

export function getLocalizedAchievement(badge, language) {
  if (!badge) return { title: "", description: "" };
  if (language !== "en") {
    return {
      title: badge.title || "",
      description: badge.description || "",
    };
  }

  // Check by slug
  if (badge.slug && ACHIEVEMENT_TRANSLATIONS[badge.slug]) {
    return {
      title: ACHIEVEMENT_TRANSLATIONS[badge.slug].titleEn,
      description: ACHIEVEMENT_TRANSLATIONS[badge.slug].descEn,
    };
  }

  // Check by Indonesian title
  if (badge.title && TITLE_FALLBACK_MAP[badge.title]) {
    return {
      title: TITLE_FALLBACK_MAP[badge.title].title,
      description: TITLE_FALLBACK_MAP[badge.title].desc,
    };
  }

  return {
    title: badge.title || "",
    description: badge.description || "",
  };
}

export function getLocalizedQuest(quest, language) {
  if (!quest) return { title: "", description: "" };
  if (language !== "en") {
    return {
      title: quest.title || "",
      description: quest.description || "",
    };
  }

  if (quest.slug && QUEST_TRANSLATIONS[quest.slug]) {
    return {
      title: QUEST_TRANSLATIONS[quest.slug].titleEn,
      description: QUEST_TRANSLATIONS[quest.slug].descEn,
    };
  }

  if (quest.title && QUEST_TRANSLATIONS[quest.title]) {
    return {
      title: QUEST_TRANSLATIONS[quest.title].titleEn,
      description: QUEST_TRANSLATIONS[quest.title].descEn,
    };
  }

  return {
    title: quest.title || "",
    description: quest.description || "",
  };
}
