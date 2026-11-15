import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ExpenseModal from './components/ExpenseModal';

// Lazy-loaded routes for performance
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Expenses = lazy(() => import('./pages/Expenses'));
const BudgetSettings = lazy(() => import('./pages/BudgetSettings'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const SignInPageDemo = lazy(() => import('./components/ui/demo'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-nectar-canvas dark:bg-nectar-darkBg flex flex-col items-center justify-center gap-3">
      <div className="w-9 h-9 border-3 border-nectar-mint border-t-nectar-forest rounded-full animate-spin" />
      <span className="text-xs font-semibold text-gray-500">Loading Nectar Finance...</span>
    </div>
  );
}

// Protected App Layout Wrapper
function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-nectar-canvas dark:bg-nectar-darkBg transition-colors flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar 
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenAddModal={() => setAddModalOpen(true)}
        />

        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/budget" element={<BudgetSettings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {/* Global Add Expense Modal */}
      <ExpenseModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Landing Home Page */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes (always reachable, even if a login is saved in the browser) */}
        <Route 
          path="/login" 
          element={<Login />} 
        />
        <Route 
          path="/signup" 
          element={<Signup />} 
        />
        <Route 
          path="/signin-demo" 
          element={<SignInPageDemo />} 
        />

        {/* Protected Dashboard & App Routes */}
        <Route 
          path="/dashboard/*" 
          element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/expenses/*" 
          element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/budget/*" 
          element={isAuthenticated ? <ProtectedLayout /> : <Navigate to="/login" replace />} 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}