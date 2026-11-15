import React, { useMemo, useState } from 'react';
import { Bell, BellOff, CalendarClock, Sparkles } from 'lucide-react';
import { localStorageService } from '../services/localStorageService';
import { findRecurringExpenses } from '../utils/expenseAutomation';
import { formatCurrency } from '../utils/formatters';

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nextMonthlyDate(dayOfMonth, today = new Date()) {
  const day = Number(dayOfMonth) || 1;
  const currentMonthDue = new Date(today.getFullYear(), today.getMonth(), Math.min(day, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()));
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (currentMonthDue >= todayStart) return toLocalDateString(currentMonthDue);

  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const due = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(day, new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate()));
  return toLocalDateString(due);
}

function daysUntil(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((due - todayStart) / 86400000);
}

function readableDueDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RecurringExpenses({ expenses }) {
  const [reminders, setReminders] = useState(() => localStorageService.getRecurringReminders());
  const recurringExpenses = useMemo(() => findRecurringExpenses(expenses), [expenses]);
  const remindersByKey = new Map(reminders.map((reminder) => [reminder.key, reminder]));

  const reminderRows = reminders.map((reminder) => {
    const candidate = recurringExpenses.find((expense) => expense.key === reminder.key);
    const dayOfMonth = candidate?.dayOfMonth || reminder.dayOfMonth;
    return {
      ...reminder,
      ...candidate,
      dayOfMonth,
      nextDue: nextMonthlyDate(dayOfMonth),
    };
  });
  const upcomingReminders = reminderRows.filter((reminder) => daysUntil(reminder.nextDue) <= 3);

  const saveReminders = (nextReminders) => {
    localStorageService.saveRecurringReminders(nextReminders);
    setReminders(nextReminders);
  };

  const addReminder = (expense) => {
    if (remindersByKey.has(expense.key)) return;
    saveReminders([
      ...reminders,
      {
        key: expense.key,
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        dayOfMonth: expense.dayOfMonth,
      },
    ]);
  };

  const removeReminder = (key) => {
    saveReminders(reminders.filter((reminder) => reminder.key !== key));
  };

  return (
    <section className="space-y-4 rounded-3xl border border-nectar-forest/10 bg-white p-5 shadow-nectar dark:border-nectar-darkBorder dark:bg-nectar-darkCard sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-nectar-wasabi text-nectar-forest dark:bg-nectar-forest/30 dark:text-nectar-mint">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-nectar-forest dark:text-nectar-mint">Recurring expense reminders</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Nectar spots similar payments across months. Reminders are opt-in and never create transactions automatically.
          </p>
        </div>
      </div>

      {upcomingReminders.length > 0 && (
        <div role="status" className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
          {upcomingReminders.map((reminder) => {
            const days = daysUntil(reminder.nextDue);
            return (
              <p key={reminder.key} className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-200">
                <Bell className="h-3.5 w-3.5 shrink-0" />
                {reminder.title} · {formatCurrency(reminder.amount)} · {days === 0 ? 'due today' : `due in ${days} day${days === 1 ? '' : 's'}`}
              </p>
            );
          })}
        </div>
      )}

      {reminderRows.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Your reminders</p>
          {reminderRows.map((reminder) => (
            <div key={reminder.key} className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3.5 py-3 dark:bg-nectar-darkBg">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">{reminder.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {reminder.category} · {formatCurrency(reminder.amount)} · next {readableDueDate(reminder.nextDue)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeReminder(reminder.key)}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 transition hover:bg-white hover:text-red-600 dark:hover:bg-nectar-darkCard"
                aria-label={`Remove reminder for ${reminder.title}`}
              >
                <BellOff className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {recurringExpenses.length > 0 ? (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3.5 w-3.5 text-nectar-emerald" />
            Detected from your history
          </p>
          {recurringExpenses.map((expense) => (
            <div key={expense.key} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 px-3.5 py-3 dark:border-nectar-darkBorder">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">{expense.title}</p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {expense.category} · average {formatCurrency(expense.amount)} · {expense.occurrences} matching months
                </p>
              </div>
              {remindersByKey.has(expense.key) ? (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <Bell className="h-3.5 w-3.5" />
                  Reminded
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => addReminder(expense)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-nectar-forest px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-nectar-emerald dark:bg-nectar-mint dark:text-nectar-forest"
                >
                  <Bell className="h-3.5 w-3.5" />
                  Remind me
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-gray-50 p-3 text-xs text-gray-500 dark:bg-nectar-darkBg dark:text-gray-400">
          Add similar expenses in at least two different months to see recurring payment suggestions here.
        </p>
      )}
    </section>
  );
}
