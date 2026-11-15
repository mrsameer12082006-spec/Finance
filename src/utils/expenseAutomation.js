const CATEGORY_RULES = [
  { category: 'Housing', type: 'needs', pattern: /\b(rent|housing|apartment|mortgage|landlord)\b/i },
  { category: 'Groceries', type: 'needs', pattern: /\b(grocer(?:y|ies)?|supermarket|produce|pantry|market)\b/i },
  { category: 'Transport', type: 'needs', pattern: /\b(uber|taxi|transit|metro|commute|bus|train|flight|petrol|fuel)\b/i },
  { category: 'Subscriptions', type: 'wants', pattern: /\b(netflix|spotify|subscription|membership|prime video|icloud)\b/i },
  { category: 'Utilities', type: 'needs', pattern: /\b(utility|utilities|electricity|electric|wifi|internet|water bill|phone bill)\b/i },
  { category: 'Wellness', type: 'wants', pattern: /\b(gym|wellness|doctor|medical|pharmacy|health)\b/i },
  { category: 'Savings', type: 'savings', pattern: /\b(save|saving|savings|invest|investment|stock|mutual fund|sip)\b/i },
  { category: 'Shopping', type: 'wants', pattern: /\b(shopping|clothing|apparel|zara|uniqlo|amazon)\b/i },
  { category: 'Dining', type: 'wants', pattern: /\b(dining|dinner|lunch|breakfast|coffee|cafe|restaurant|food)\b/i },
];

const MONTH_NAMES = /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/gi;

export function suggestExpenseCategory(text) {
  const rule = CATEGORY_RULES.find(({ pattern }) => pattern.test(text));
  return rule ? { category: rule.category, type: rule.type } : null;
}

export function getTodayLocalDate() {
  const now = new Date();
  return formatLocalDate(now);
}

export function parseQuickExpense(input) {
  const amountMatch = input.match(/(?:₹|rs\.?|\$|usd)?\s*(\d[\d,]*(?:\.\d{1,2})?)/i);
  if (!amountMatch) return null;

  const amount = Number.parseFloat(amountMatch[1].replaceAll(',', ''));
  const description = input.replace(amountMatch[0], '').replace(/^\s*(for|at|on)\s+/i, '').trim();
  if (!Number.isFinite(amount) || amount <= 0 || !description) return null;

  const suggestion = suggestExpenseCategory(description);
  const title = description.charAt(0).toUpperCase() + description.slice(1);
  return {
    title,
    amount,
    category: suggestion?.category || 'Dining',
    type: suggestion?.type || 'wants',
  };
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(MONTH_NAMES, ' ')
    .replace(/\b(monthly|payment|bill|invoice)\b/g, ' ')
    .replace(/\b20\d{2}\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function toLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addMonthClamped(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const firstOfNextMonth = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  firstOfNextMonth.setDate(Math.min(day, lastDay));
  return firstOfNextMonth;
}

export function findRecurringExpenses(expenses) {
  const groups = new Map();

  expenses.forEach((expense) => {
    const normalizedTitle = normalizeTitle(expense.title || '');
    const amount = Number(expense.amount);
    const date = toLocalDate(expense.date || '');
    if (!normalizedTitle || !date || !Number.isFinite(amount) || amount <= 0) return;

    const key = `${expense.category || 'Other'}:${normalizedTitle}`;
    const group = groups.get(key) || { key, title: expense.title, category: expense.category || 'Other', entries: [] };
    group.entries.push({ amount, date });
    groups.set(key, group);
  });

  return Array.from(groups.values()).flatMap((group) => {
    const entries = group.entries.sort((a, b) => a.date - b.date);
    const monthKeys = new Set(entries.map(({ date }) => `${date.getFullYear()}-${date.getMonth()}`));
    if (monthKeys.size < 2) return [];

    const amounts = entries.map(({ amount }) => amount);
    const averageAmount = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    if ((Math.max(...amounts) - Math.min(...amounts)) / averageAmount > 0.15) return [];

    const monthlyCadence = entries.slice(1).every((entry, index) => {
      const previous = entries[index].date;
      const dayGap = (entry.date - previous) / 86400000;
      const monthGap = (entry.date.getFullYear() - previous.getFullYear()) * 12 + entry.date.getMonth() - previous.getMonth();
      return monthGap >= 1 && monthGap <= 2 && dayGap >= 25 && dayGap <= 66;
    });
    if (!monthlyCadence) return [];

    const lastDate = entries[entries.length - 1].date;
    return [{
      key: group.key,
      title: group.title,
      category: group.category,
      amount: Math.round(averageAmount * 100) / 100,
      dayOfMonth: lastDate.getDate(),
      nextDue: formatLocalDate(addMonthClamped(lastDate)),
      occurrences: entries.length,
    }];
  });
}

export function getCategoryBudgetRecommendations(expenses, categoryLimits, now = new Date()) {
  const monthlyTotals = new Map();
  expenses.forEach((expense) => {
    const date = toLocalDate(expense.date || '');
    const amount = Number(expense.amount);
    if (!date || !Number.isFinite(amount) || amount <= 0 || !expense.category) return;

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const month = monthlyTotals.get(monthKey) || new Map();
    month.set(expense.category, (month.get(expense.category) || 0) + amount);
    monthlyTotals.set(monthKey, month);
  });

  const activeMonths = Array.from(monthlyTotals.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 3);

  return Object.keys(categoryLimits || {}).flatMap((category) => {
    const monthlySpending = activeMonths.map(([monthKey, totals]) => {
      const amount = totals.get(category) || 0;
      if (monthKey === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`) {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return amount * daysInMonth / Math.max(1, now.getDate());
      }
      return amount;
    });
    if (!monthlySpending.some((amount) => amount > 0)) return [];

    const averageMonthlySpend = monthlySpending.reduce((sum, amount) => sum + amount, 0) / monthlySpending.length;
    const recommendedLimit = Math.ceil((averageMonthlySpend * 1.1) / 100) * 100;
    return [{
      category,
      currentLimit: Number(categoryLimits[category]) || 0,
      recommendedLimit,
      averageMonthlySpend: Math.round(averageMonthlySpend * 100) / 100,
      monthsAnalyzed: monthlySpending.length,
    }];
  });
}
