import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Leaf, 
  ArrowRight, 
  Check, 
  Sparkles, 
  TrendingUp, 
  PieChart, 
  Zap, 
  Lock, 
  Sun, 
  Moon,
  LayoutDashboard
} from 'lucide-react';
import { toggleTheme } from '../redux/slices/themeSlice';
import { formatCurrency } from '../utils/formatters';
import { smoothScrollTo } from '../utils/smoothScroll';
import { useNavIndicator } from '../hooks/useNavIndicator';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useScrollReveal } from '../hooks/useScrollReveal';

const NAV_ITEMS = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'flow', label: 'Money Flow', href: '#flow' },
  { id: 'simulator', label: 'Simulator', href: '#simulator' },
  { id: 'integrity', label: 'Privacy', href: '#integrity' },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Simulator State in Hero/Landing
  const [income, setIncome] = useState(80000);
  const [activeTab, setActiveTab] = useState(0);

  const needs = income * 0.50;
  const wants = income * 0.30;
  const savings = income * 0.20;

  // Active section tracking for zaro.ai style scroll-spy
  const sectionIds = ['features', 'flow', 'simulator', 'integrity'];
  const activeSection = useScrollSpy(sectionIds, 'features');
  const [hoveredSection, setHoveredSection] = useState(null);
  const { containerRef, itemRefs, indicator, mounted, moveTo, hide } = useNavIndicator();

  // Scroll state for retracting navigation bar
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger smooth reveal on scroll (inspired by zaro.ai render-on-scroll)
  useScrollReveal();

  // Synchronize sliding nav indicator with active or hovered section
  useEffect(() => {
    const target = hoveredSection || activeSection;
    if (target) {
      moveTo(target);
    }
  }, [activeSection, hoveredSection, moveTo, isScrolled]);

  // Handle initial page load with URL hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.slice(1);
      if (sectionIds.includes(hashId)) {
        const timer = setTimeout(() => {
          smoothScrollTo(hashId, { behavior: 'smooth' });
          moveTo(hashId);
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [moveTo]);

  // Handle smooth scroll when clicking navigation link
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setHoveredSection(null);
    moveTo(targetId);
    smoothScrollTo(targetId, { behavior: 'smooth' });
  };

  const flowTabs = [
    {
      id: 'balance',
      title: 'Automated 50/30/20 Balance',
      desc: 'Automatically allocate every rupee to Needs, Wants, and Wealth reserves.',
      accent: {
        bg: 'from-emerald-500/15 via-teal-500/10 to-transparent',
        border: 'border-emerald-500/40 dark:border-emerald-500/30',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
        badgeDot: 'bg-emerald-500',
        bar: 'from-emerald-500 via-teal-500 to-cyan-500',
        activeBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-600/30',
        highlightText: 'text-emerald-700 dark:text-emerald-300',
      },
      preview: {
        tag: 'Balanced Pace',
        amount: formatCurrency(income * 0.68).split('.')[0],
        sub: `Spent so far out of ${formatCurrency(income).split('.')[0]} income`,
        barPct: 68,
        details: [
          { label: 'Essential Needs (50%)', val: formatCurrency(needs).split('.')[0] },
          { label: 'Lifestyle Wants (30%)', val: formatCurrency(wants).split('.')[0] },
          { label: 'High-Yield Growth (20%)', val: `+${formatCurrency(savings).split('.')[0]}`, highlight: true }
        ]
      }
    },
    {
      id: 'velocity',
      title: 'Daily Safe-to-Spend Velocity',
      desc: 'Never wonder if you can afford dinner tonight. Real-time daily safe limits.',
      accent: {
        bg: 'from-sky-500/15 via-blue-500/10 to-transparent',
        border: 'border-sky-500/40 dark:border-sky-500/30',
        badge: 'bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60',
        badgeDot: 'bg-sky-500',
        bar: 'from-sky-500 via-blue-500 to-indigo-500',
        activeBtn: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm shadow-sky-600/30',
        highlightText: 'text-sky-700 dark:text-sky-300',
      },
      preview: {
        tag: 'Dynamic Allowance',
        amount: `₹${(wants / 30).toFixed(0)}/day`,
        sub: 'Guilt-free daily allowance for discretionary living',
        barPct: 45,
        details: [
          { label: 'Days Remaining in Cycle', val: '18 Days' },
          { label: 'Discretionary Remaining', val: formatCurrency(wants * 0.6).split('.')[0] },
          { label: 'Month-End Projected Surplus', val: `+${formatCurrency(savings * 1.1).split('.')[0]}`, highlight: true }
        ]
      }
    },
    {
      id: 'subscriptions',
      title: 'Recurring Subscriptions Audit',
      desc: 'Spot creep in subscriptions and reclaim up to ₹4,500/month automatically.',
      accent: {
        bg: 'from-amber-500/15 via-rose-500/10 to-transparent',
        border: 'border-amber-500/40 dark:border-amber-500/30',
        badge: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
        badgeDot: 'bg-amber-500',
        bar: 'from-amber-500 via-orange-500 to-rose-500',
        activeBtn: 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-sm shadow-amber-600/30',
        highlightText: 'text-amber-700 dark:text-amber-300',
      },
      preview: {
        tag: '3 Active Subscriptions',
        amount: '₹4,500/mo',
        sub: 'Identified recurring streaming and gym charges',
        barPct: 82,
        details: [
          { label: 'Cult.fit & Wellness', val: '₹2,500.00' },
          { label: 'Netflix & Spotify', val: '₹649.00' },
          { label: 'Annual Reclaim Potential', val: '+₹45,000/yr', highlight: true }
        ]
      }
    },
    {
      id: 'accelerator',
      title: 'High-Yield Wealth Accelerator',
      desc: 'Channel leftover budget margins into automated 7.10% compound wealth reserves.',
      accent: {
        bg: 'from-indigo-500/15 via-purple-500/10 to-transparent',
        border: 'border-indigo-500/40 dark:border-indigo-500/30',
        badge: 'bg-indigo-50 text-indigo-800 border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
        badgeDot: 'bg-indigo-500',
        bar: 'from-indigo-500 via-purple-500 to-pink-500',
        activeBtn: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-600/30',
        highlightText: 'text-indigo-700 dark:text-indigo-300',
      },
      preview: {
        tag: '7.10% Wealth Growth',
        amount: `+${formatCurrency(savings).split('.')[0]}/mo`,
        sub: 'Compounding cash reserve goal for 2026',
        barPct: 76,
        details: [
          { label: 'Emergency Fund Goal', val: '₹5,00,000' },
          { label: 'Accrued to Date', val: '₹3,80,000' },
          { label: 'Time to Target', val: '2.5 Months', highlight: true }
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 transition-colors relative">
      
      {/* ==========================================================================
           RETRACTING NAVBAR (Full-width at top -> Morphs into Floating Pill on scroll)
           ========================================================================== */}
      <div 
        className={`fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out ${
          isScrolled 
            ? 'top-3 sm:top-4 px-4' 
            : 'top-0 px-0'
        }`}
      >
        <header 
          className={`pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between ${
            isScrolled
              ? 'w-full max-w-5xl glass-nectar-pill rounded-full px-5 py-2.5 shadow-nectar-float'
              : 'w-full max-w-full glass-nectar-full rounded-none px-6 lg:px-12 py-3.5'
          }`}
        >
          
          {/* Brand with vibrant calming gradient */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25 transition-transform duration-300 group-hover:scale-105">
              <Leaf className="w-4 h-4 text-emerald-100" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base">
              Nectar
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-teal-50 to-sky-50 text-teal-800 dark:from-teal-950/60 dark:to-sky-950/60 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
              Smart Finance
            </span>
          </Link>

          {/* Nav Links with soothing sea-glass sliding indicator */}
          <nav
            onMouseLeave={() => {
              setHoveredSection(null);
              if (activeSection) {
                moveTo(activeSection);
              }
            }}
            className="hidden md:flex items-center"
            aria-label="Main Navigation"
          >
            <div
              ref={containerRef}
              className="relative flex items-center rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 backdrop-blur-md overflow-hidden shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)]"
            >
              {/* Hardware-accelerated sliding indicator pill with soothing gradient tint */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 -z-0 rounded-full bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-emerald-500/15 dark:from-teal-400/25 dark:via-sky-400/25 dark:to-emerald-400/20 shadow-xs border border-teal-500/30 dark:border-teal-400/35 ${
                  mounted ? 'nav-indicator-glide' : 'transition-opacity duration-200'
                }`}
                style={{
                  transform: `translate3d(${indicator.left}px, 0, 0)`,
                  width: `${indicator.width}px`,
                  opacity: indicator.visible ? 1 : 0,
                }}
              />

              {NAV_ITEMS.map((item) => {
                const isCurrent = (hoveredSection || activeSection) === item.id;
                return (
                  <a
                    key={item.id}
                    ref={(el) => itemRefs.current.set(item.id, el)}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    onMouseEnter={() => setHoveredSection(item.id)}
                    onFocus={() => setHoveredSection(item.id)}
                    onBlur={() => setHoveredSection(null)}
                    className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 select-none ${
                      isCurrent
                        ? 'text-teal-950 dark:text-teal-200 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-teal-900 dark:hover:text-teal-200'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-nectar btn-nectar-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn-nectar btn-shine text-xs py-2 px-4 shadow-sm bg-gradient-to-r from-teal-800 via-slate-900 to-teal-900 text-white hover:opacity-95"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>
        </header>
      </div>

      {/* ==========================================================================
           HERO SECTION (Rich Atmospheric Soothing Auras + Gradient Typography)
           ========================================================================== */}
      <section className="pt-36 pb-20 px-6 sm:px-10 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Multi-tone luminous atmospheric auras (Cyan, Emerald, Periwinkle & Sunlight) */}
        <div className="absolute top-1/4 left-1/3 w-[650px] h-[360px] bg-gradient-to-tr from-teal-300/35 via-emerald-200/30 to-sky-200/25 rounded-full blur-3xl pointer-events-none animate-ambient-drift-1" />
        <div className="absolute top-1/3 right-1/4 w-[560px] h-[320px] bg-gradient-to-bl from-indigo-200/30 via-sky-200/35 to-teal-100/25 rounded-full blur-3xl pointer-events-none animate-ambient-drift-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[240px] bg-gradient-to-r from-amber-200/20 via-rose-100/15 to-sky-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-50/90 via-sky-50/90 to-emerald-50/90 dark:from-slate-900/90 dark:to-teal-950/60 backdrop-blur-md border border-teal-200/70 dark:border-teal-800/50 text-teal-900 dark:text-teal-200 text-xs font-semibold hero-fade-in shadow-xs transition-transform duration-300 hover:scale-[1.02]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
            <span>Smart Personal Finance Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium text-slate-900 dark:text-slate-100 tracking-tight leading-[1.08] hero-fade-in hero-fade-in--headline">
            Turn every dollar into <br />
            <span className="italic font-normal bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 bg-clip-text text-transparent">
              peace of mind.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed hero-fade-in hero-fade-in--subhead">
            A modern financial insights system that automatically organizes every paycheck into a balanced 50/30/20 money flow. Know exactly what to spend, save, and grow without the stress.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade-in hero-fade-in--cta">
            <Link
              to="/signup"
              className="btn-nectar btn-shine text-base py-3.5 px-8 shadow-nectar hover:shadow-nectar-float w-full sm:w-auto bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 hover:from-teal-800 hover:to-emerald-800 text-white font-semibold"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="btn-nectar btn-nectar-secondary text-base py-3.5 px-8 w-full sm:w-auto hover:border-teal-300 dark:hover:border-teal-700"
            >
              <span>Explore Demo Dashboard</span>
            </Link>
          </div>
        </div>

      </section>

      {/* ==========================================================================
           BENTO FEATURES GRID (Colorful & Soothing Card Personalities)
           ========================================================================== */}
      <section id="features" className="scroll-mt-24 py-20 px-6 sm:px-10 max-w-6xl mx-auto reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
            Designed for Serenity
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-2 mb-3">
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Azure Sky */}
          <div className="card-interactive group bg-gradient-to-br from-white via-white to-sky-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950/30 p-8 rounded-3xl border border-sky-100 dark:border-sky-900/40 shadow-nectar space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md shadow-sky-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 transition-colors group-hover:text-sky-700 dark:group-hover:text-sky-300">Natural Language Parsing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Log expenses by typing casually like "₹450 dinner with team". Our parser extracts amount, category, and date automatically.
            </p>
          </div>

          {/* Card 2: Emerald Teal */}
          <div className="card-interactive group bg-gradient-to-br from-white via-white to-teal-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/30 p-8 rounded-3xl border border-teal-100 dark:border-teal-900/40 shadow-nectar space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md shadow-teal-500/25">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-300">Daily Safe-to-Spend Limit</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Dynamic calculations that divide remaining discretionary allowance by the days remaining in your monthly billing cycle.
            </p>
          </div>

          {/* Card 3: Indigo Lavender */}
          <div className="card-interactive group bg-gradient-to-br from-white via-white to-indigo-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/40 shadow-nectar space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md shadow-indigo-500/25">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 transition-colors group-hover:text-indigo-700 dark:group-hover:text-indigo-300">Zero Telemetry & Offline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your financial records never leave your browser. Full CRUD and export capabilities operate completely client-side in localStorage.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           MONEYFLOW INTERACTIVE SHOWCASE (Rich Themed Tab Switching)
           ========================================================================== */}
      <section id="flow" className="scroll-mt-24 py-20 px-6 sm:px-10 max-w-6xl mx-auto reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
            The MoneyFlow Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-2 mb-3">
            We don't just log spending.<br />We make progress stick.
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Click through our automated systems below to see real-time financial equilibrium.
          </p>
        </div>

        <div className="bg-white dark:bg-nectar-darkCard rounded-3xl p-6 sm:p-12 border border-slate-200/80 dark:border-nectar-darkBorder shadow-nectar grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Tabs with personalized soothing colors */}
          <div className="lg:col-span-6 space-y-3">
            {flowTabs.map((tab, idx) => {
              const isSelected = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`
                    w-full text-left p-5 rounded-2xl border transition-all duration-300 ease-out flex items-start justify-between gap-4 relative overflow-hidden group
                    ${isSelected
                      ? `bg-gradient-to-r ${tab.accent.bg} ${tab.accent.border} shadow-sm translate-x-1`
                      : 'bg-white/60 dark:bg-nectar-darkBg/60 border-slate-200/60 dark:border-nectar-darkBorder hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}
                  `}
                >
                  <div className="relative z-10">
                    <h3 className={`text-base font-bold mb-1 transition-colors duration-200 ${isSelected ? 'text-slate-950 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {tab.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tab.desc}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isSelected
                      ? `${tab.accent.activeBtn} scale-100 rotate-0 shadow-sm`
                      : 'opacity-0 scale-50 -rotate-45'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Live Device Simulator with dynamic theme morphing */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-gradient-to-b from-slate-50 to-white dark:from-slate-950/80 dark:to-slate-900/80 rounded-3xl p-6 border border-slate-200/80 dark:border-nectar-darkBorder shadow-nectar-float space-y-5">
              <div className="w-20 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto" />

              <div
                key={activeTab}
                className="space-y-4 animate-fade-in-up"
              >
                <div className="bg-white dark:bg-nectar-darkCard rounded-2xl p-5 border border-slate-200/80 dark:border-nectar-darkBorder shadow-sm space-y-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${flowTabs[activeTab].accent.badgeDot}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${flowTabs[activeTab].accent.badgeDot}`} />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Active Engine
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs transition-transform duration-300 ${flowTabs[activeTab].accent.badge}`}>
                      {flowTabs[activeTab].preview.tag}
                    </span>
                  </div>

                  <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-all duration-300">
                    {flowTabs[activeTab].preview.amount}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {flowTabs[activeTab].preview.sub}
                  </p>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-nectar-darkBg rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full bg-gradient-to-r ${flowTabs[activeTab].accent.bar} rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] animate-shimmer shadow-xs`}
                      style={{ width: `${flowTabs[activeTab].preview.barPct}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-nectar-darkCard rounded-2xl p-4 border border-slate-200/80 dark:border-nectar-darkBorder space-y-2.5 transition-colors">
                  {flowTabs[activeTab].preview.details.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs py-0.5 border-b border-slate-100 dark:border-nectar-darkBorder/40 last:border-none"
                    >
                      <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                      <span className={`font-bold transition-colors ${item.highlight ? `${flowTabs[activeTab].accent.highlightText} font-mono` : 'text-slate-800 dark:text-slate-200'}`}>
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           50/30/20 INTERACTIVE INCOME SIMULATOR (Rich Soothing Color Distribution)
           ========================================================================== */}
      <section id="simulator" className="scroll-mt-24 py-20 px-6 sm:px-10 max-w-5xl mx-auto reveal-on-scroll">
        <div className="bg-white dark:bg-nectar-darkCard rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-nectar-darkBorder shadow-nectar space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 mb-2">
              Personalized Calculator
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-2 mb-2">
              50/30/20 Take-Home Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Slide your monthly net income to see how your money naturally balances.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border border-slate-200/80 dark:border-nectar-darkBorder space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly Net Income
              </span>
              <span className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(income).split('.')[0]}
              </span>
            </div>

            <input
              type="range"
              min="20000"
              max="300000"
              step="2000"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value))}
              className="w-full accent-teal-600 dark:accent-teal-400 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-400">
              <span>₹20,000 / mo</span>
              <span>₹1,50,000 / mo</span>
              <span>₹3,00,000+ / mo</span>
            </div>

            {/* Interactive Visual 50/30/20 Distribution Bar */}
            <div className="pt-2 border-t border-slate-200 dark:border-nectar-darkBorder space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>Balanced Allocation</span>
                <span className="font-mono text-teal-800 dark:text-teal-300">100% of Net Income</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-teal-800 to-teal-600 text-white transition-all duration-300 ease-out flex items-center justify-center text-[9px] font-bold tracking-wider shadow-xs"
                  style={{ width: '50%' }}
                  title="50% Needs"
                >
                  50%
                </div>
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 text-white transition-all duration-300 ease-out flex items-center justify-center text-[9px] font-bold tracking-wider shadow-xs"
                  style={{ width: '30%' }}
                  title="30% Wants"
                >
                  30%
                </div>
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white transition-all duration-300 ease-out flex items-center justify-center text-[9px] font-bold tracking-wider border-l border-white/20 shadow-xs"
                  style={{ width: '20%' }}
                  title="20% Growth"
                >
                  20%
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span>Needs (₹{(income * 0.50).toLocaleString('en-IN')})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Wants (₹{(income * 0.30).toLocaleString('en-IN')})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Growth (₹{(income * 0.20).toLocaleString('en-IN')})</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Needs Cap */}
            <div className="card-interactive p-5 rounded-2xl bg-gradient-to-br from-teal-50/70 to-white dark:from-slate-900 dark:to-teal-950/20 border border-teal-200/70 dark:border-teal-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                50% Needs Cap
              </span>
              <div className="text-2xl font-serif font-bold text-teal-900 dark:text-teal-100 my-1.5">
                {formatCurrency(needs).split('.')[0]}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Rent, groceries, utilities, basic transit, healthcare</p>
            </div>

            {/* Wants Cap */}
            <div className="card-interactive p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 to-white dark:from-slate-900 dark:to-amber-950/20 border border-amber-200/70 dark:border-amber-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                30% Wants Cap
              </span>
              <div className="text-2xl font-serif font-bold text-amber-800 dark:text-amber-300 my-1.5">
                {formatCurrency(wants).split('.')[0]}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Dining, weekend travel, hobbies, entertainment</p>
            </div>

            {/* Growth Goal */}
            <div className="card-interactive p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-sky-50/60 dark:from-emerald-950/30 dark:to-slate-900 border border-emerald-300/80 dark:border-emerald-800/60 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                20% Growth Goal
              </span>
              <div className="text-2xl font-serif font-bold text-emerald-900 dark:text-emerald-200 my-1.5">
                {formatCurrency(savings).split('.')[0]}
              </div>
              <p className="text-[11px] text-emerald-950 dark:text-emerald-300/90 font-medium">Automated emergency buffer and compound investments</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           CALL TO ACTION (Luminous Northern Lights Twilight Aurora Banner)
           ========================================================================== */}
      <section className="py-20 px-6 sm:px-10 max-w-5xl mx-auto text-center reveal-on-scroll">
        <div className="bg-gradient-to-br from-slate-950 via-[#0A2326] to-[#0D1E36] border border-teal-700/40 text-white rounded-3xl p-10 sm:p-16 shadow-nectar-float relative overflow-hidden space-y-6">
          {/* Luminous multi-color Northern Lights floating glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-400/25 rounded-full blur-3xl pointer-events-none animate-ambient-drift-1" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none animate-ambient-drift-2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-teal-300 border border-white/15 shadow-sm">
            <Leaf className="w-6 h-6" />
          </div>

          <h2 className="relative z-10 text-3xl sm:text-5xl font-serif font-medium tracking-tight text-white">
            Ready to feel great about your money?
          </h2>

          <p className="relative z-10 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join thousands who turned paycheck anxiety into automated financial clarity. Set up your personal money system in under 2 minutes.
          </p>

          <div className="relative z-10 pt-2">
            <Link
              to="/signup"
              className="btn-shine inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:from-emerald-300 hover:to-cyan-200 text-slate-950 font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-teal-500/25"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           FOOTER (Editorial Cool Slate Layout with Soothing Accents)
           ========================================================================== */}
      <footer id="integrity" className="scroll-mt-24 border-t border-slate-200/80 dark:border-nectar-darkBorder py-12 px-6 sm:px-10 max-w-6xl mx-auto text-xs text-slate-500 dark:text-slate-400 reveal-on-scroll">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span>Nectar Smart Finance</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Log in</Link>
            <Link to="/signup" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Sign up</Link>
            <Link to="/dashboard" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Dashboard</Link>
          </div>

          <p className="text-center sm:text-right">
            © 2026 Nectar Smart Finance. Mindful wealth & automated cashflow.
          </p>
        </div>
      </footer>

    </div>
  );
}
