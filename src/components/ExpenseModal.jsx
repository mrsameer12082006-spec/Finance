import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X, Check } from 'lucide-react';
import { addExpense, updateExpense } from '../redux/slices/expenseSlice';

const CATEGORIES = [
  { id: 'Dining', label: 'Dining & Drinks', icon: '☕', defaultType: 'wants' },
  { id: 'Groceries', label: 'Groceries', icon: '🛒', defaultType: 'needs' },
  { id: 'Housing', label: 'Housing & Rent', icon: '🏠', defaultType: 'needs' },
  { id: 'Transport', label: 'Transit & Rides', icon: '🚇', defaultType: 'needs' },
  { id: 'Subscriptions', label: 'Subscriptions', icon: '📱', defaultType: 'wants' },
  { id: 'Utilities', label: 'Utilities & Bills', icon: '💡', defaultType: 'needs' },
  { id: 'Shopping', label: 'Shopping', icon: '🛍️', defaultType: 'wants' },
  { id: 'Wellness', label: 'Health & Wellness', icon: '🌿', defaultType: 'wants' },
  { id: 'Savings', label: 'Savings & Growth', icon: '🌱', defaultType: 'savings' },
];

export default function ExpenseModal({ isOpen, onClose, expenseToEdit }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Dining');
  const [type, setType] = useState('wants');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title || '');
      setAmount(expenseToEdit.amount ? String(expenseToEdit.amount) : '');
      setCategory(expenseToEdit.category || 'Dining');
      setType(expenseToEdit.type || 'wants');
      setPaymentMethod(expenseToEdit.paymentMethod || 'Credit Card');
      setDate(expenseToEdit.date || new Date().toISOString().split('T')[0]);
      setNotes(expenseToEdit.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Dining');
      setType('wants');
      setPaymentMethod('Credit Card');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError('');
  }, [expenseToEdit, isOpen]);

  const handleCategorySelect = (catId) => {
    setCategory(catId);
    const found = CATEGORIES.find(c => c.id === catId);
    if (found) {
      setType(found.defaultType);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an expense title.');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    const payload = {
      id: expenseToEdit ? expenseToEdit.id : `tx-${Date.now()}`,
      title: title.trim(),
      amount: numAmount,
      category,
      type,
      paymentMethod,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes.trim()
    };

    if (expenseToEdit) {
      dispatch(updateExpense(payload));
    } else {
      dispatch(addExpense(payload));
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-fruitful-darkCard rounded-3xl border border-fruitful-forest/15 dark:border-fruitful-darkBorder shadow-fruitful-float p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-fruitful-darkBorder mb-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-fruitful-forest dark:text-fruitful-mint">
              {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Categorize and track where your money goes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-fruitful-darkBg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Title / Vendor
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trader Joe's, Uber, Rent"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fruitful-emerald"
              required
            />
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-sm font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-fruitful-emerald"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fruitful-emerald"
                required
              />
            </div>
          </div>

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`
                    px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all
                    ${category === cat.id 
                      ? 'bg-fruitful-wasabi border-fruitful-forest text-fruitful-forest dark:bg-fruitful-forest/30 dark:border-fruitful-mint dark:text-fruitful-mint font-bold shadow-sm'
                      : 'border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-gray-600 dark:text-gray-400 hover:bg-gray-100'}
                  `}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                50/30/20 Group
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fruitful-emerald"
              >
                <option value="needs">Needs (50%)</option>
                <option value="wants">Wants (30%)</option>
                <option value="savings">Savings (20%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fruitful-emerald"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Monthly recurring bill, split with roommate"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-fruitful-darkBorder bg-gray-50 dark:bg-fruitful-darkBg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fruitful-emerald"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-fruitful-darkBg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-fruitful btn-fruitful-primary"
            >
              <Check className="w-4 h-4" />
              <span>{expenseToEdit ? 'Save Changes' : 'Create Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
