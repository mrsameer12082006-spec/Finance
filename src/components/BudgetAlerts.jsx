import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useFinancialInsights } from '../hooks/useFinancialInsights';

export default function BudgetAlerts() {
  const { budgetAlerts } = useFinancialInsights();
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  useEffect(() => {
    const activeIds = new Set(budgetAlerts.map((alert) => alert.id));
    setDismissedAlerts((previous) => {
      const next = previous.filter((id) => activeIds.has(id));
      return next.length === previous.length ? previous : next;
    });
  }, [budgetAlerts]);

  const visibleAlerts = budgetAlerts.filter((alert) => !dismissedAlerts.includes(alert.id));
  if (visibleAlerts.length === 0) return null;

  return (
    <section aria-label="Budget alerts" className="space-y-3">
      {visibleAlerts.map((alert) => {
        const isDanger = alert.severity === 'danger';
        return (
          <div
            key={alert.id}
            role="status"
            className={`flex items-start gap-3 rounded-2xl border p-4 ${
              isDanger
                ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200'
                : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
            }`}
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{alert.title}</p>
              <p className="mt-0.5 text-xs opacity-80">{alert.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissedAlerts((previous) => [...previous, alert.id])}
              className="rounded-full p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
              aria-label={`Dismiss ${alert.title}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </section>
  );
}
