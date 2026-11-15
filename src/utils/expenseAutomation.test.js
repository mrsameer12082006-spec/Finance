import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  findRecurringExpenses,
  getCategoryBudgetRecommendations,
  parseQuickExpense,
  suggestExpenseCategory,
} from './expenseAutomation.js';

describe('expense automations', () => {
  it('suggests a category and 50/30/20 group from an expense description', () => {
    assert.deepEqual(suggestExpenseCategory('Uber ride'), { category: 'Transport', type: 'needs' });
    assert.deepEqual(suggestExpenseCategory('Monthly Spotify'), { category: 'Subscriptions', type: 'wants' });
    assert.equal(suggestExpenseCategory('unexpected expense'), null);
  });

  it('parses quick expenses without inventing a missing amount or description', () => {
    assert.deepEqual(parseQuickExpense('₹1,250 dinner at Social'), {
      title: 'Dinner at Social',
      amount: 1250,
      category: 'Dining',
      type: 'wants',
    });
    assert.equal(parseQuickExpense('rent'), null);
    assert.equal(parseQuickExpense('₹500'), null);
  });

  it('detects stable monthly expenses but ignores single-month and variable entries', () => {
    const expenses = [
      { title: 'Apartment Monthly Rent', category: 'Housing', amount: 28000, date: '2026-10-01' },
      { title: 'Apartment Rent November', category: 'Housing', amount: 28200, date: '2026-11-01' },
      { title: 'Coffee', category: 'Dining', amount: 250, date: '2026-10-12' },
      { title: 'Coffee', category: 'Dining', amount: 900, date: '2026-11-12' },
    ];

    const recurring = findRecurringExpenses(expenses);
    assert.equal(recurring.length, 1);
    assert.equal(recurring[0].category, 'Housing');
    assert.equal(recurring[0].nextDue, '2026-12-01');
  });

  it('recommends a buffered category cap from past spending', () => {
    const recommendations = getCategoryBudgetRecommendations([
      { category: 'Dining', amount: 10000, date: '2026-10-04' },
      { category: 'Dining', amount: 4000, date: '2026-11-04' },
    ], { Dining: 8000 }, new Date(2026, 10, 15));

    assert.equal(recommendations[0].averageMonthlySpend, 9000);
    assert.equal(recommendations[0].recommendedLimit, 9900);
  });
});
