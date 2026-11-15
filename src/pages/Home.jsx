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
  const [isFlowPaused, setIsFlowPaused] = useState(false);

  const needs = income * 0.50;
  const wants = income * 0.30;
  const savings = income * 0.20;

  // Active section tracking with lockable smooth scroll-spy
  const sectionIds = ['features', 'flow', 'simulator', 'integrity'];
  const { activeSection, setActiveSection, lockSpy } = useScrollSpy(sectionIds, 'features');
  const { containerRef, itemRefs, indicator, mounted, moveTo, hide } = useNavIndicator();
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to retract navbar into floating pill on scroll (SevaSetu style)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger smooth reveal on scroll (inspired by zaro.ai render-on-scroll)
  useScrollReveal();

  // Re-measure indicator position when navbar width morphs between full-width & pill
  useEffect(() => {
    const t1 = setTimeout(() => {
      if (activeSection) moveTo(activeSection);
    }, 150);
    const t2 = setTimeout(() => {
      if (activeSection) moveTo(activeSection);
    }, 320);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isScrolled, activeSection, moveTo]);

  // Synchronize sliding nav indicator with active or hovered section
  useEffect(() => {
    const target = hoveredSection || activeSection;
    if (target) {
      moveTo(target);
    }
  }, [activeSection, hoveredSection, moveTo]);

  // Handle initial page load with URL hash
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.slice(1);
      if (sectionIds.includes(hashId)) {
        lockSpy(hashId, 900);
        const timer = setTimeout(() => {
          smoothScrollTo(hashId);
          moveTo(hashId);
        }, 120);
        return () => clearTimeout(timer);
      }
    }
  }, [lockSpy, moveTo]);

  // Handle smooth scroll when clicking navigation link
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setHoveredSection(null);
    lockSpy(targetId, 850);
    moveTo(targetId);
    smoothScrollTo(targetId);
  };

  const flowTabs = [
    {
      title: 'Automated 50/30/20 Balance',
      desc: 'Automatically allocate every rupee to Needs, Wants, and Wealth reserves.',
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
      title: 'Daily Safe-to-Spend Velocity',
      desc: 'Never wonder if you can afford dinner tonight. Real-time daily safe limits.',
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
      title: 'Recurring Subscriptions Audit',
      desc: 'Spot creep in subscriptions and reclaim up to ₹4,500/month automatically.',
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
      title: 'High-Yield Wealth Accelerator',
      desc: 'Channel leftover budget margins into automated 7.10% compound wealth reserves.',
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

  // Auto-advance the MoneyFlow feature tabs every 3s, looping top -> bottom -> top.
  // Pauses while the user hovers the section, and restarts the timer after a manual click.
  useEffect(() => {
    if (isFlowPaused) return;
    const timer = setTimeout(() => {
      setActiveTab((prev) => (prev + 1) % flowTabs.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeTab, isFlowPaused, flowTabs.length]);

  return (
    <div className="min-h-screen bg-nectar-canvas dark:bg-nectar-darkBg text-gray-900 dark:text-gray-100 transition-colors">
      
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
              ? 'w-full max-w-5xl glass-nectar-pill rounded-full px-5 py-2.5'
              : 'w-full max-w-full glass-nectar-full rounded-none px-6 lg:px-12 py-3.5'
          }`}
        >
          
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nectar-emerald to-nectar-forest flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Leaf className="w-4 h-4 text-nectar-mint" />
            </div>
            <span className="font-bold text-nectar-forest dark:text-nectar-mint tracking-tight text-base">
              Nectar
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-nectar-mint/80 text-nectar-forest dark:bg-nectar-emerald/20 dark:text-nectar-mint border border-nectar-forest/10 dark:border-nectar-mint/20">
              Smart Finance
            </span>
          </Link>

          {/* Nav Links with sliding indicator pill */}
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
              className="relative flex items-center rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] backdrop-blur-md overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
            >
              {/* Hardware-accelerated sliding indicator pill */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 -z-0 rounded-full bg-nectar-mint/90 dark:bg-nectar-emerald/35 shadow-xs ${
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
                        ? 'text-nectar-forest dark:text-nectar-mint font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:text-nectar-forest dark:hover:text-nectar-mint'
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
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-nectar-darkBg transition-colors"
              title="Toggle theme"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-nectar-forest" />}
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
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-nectar-forest dark:hover:text-nectar-mint transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn-nectar btn-nectar-primary btn-shine text-xs py-2 px-4 shadow-sm"
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
           HERO SECTION (zaro.ai blur & slide entrance animation + organic floating aura)
           ========================================================================== */}
      <section className="pt-36 pb-20 px-6 sm:px-10 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Multi-layered organic drifting aura backdrops */}
        <div className="absolute top-1/3 left-1/2 w-[650px] h-[340px] bg-gradient-to-tr from-nectar-mint/45 via-emerald-100/35 to-nectar-peach/25 rounded-full blur-3xl pointer-events-none animate-ambient-drift-1" />
        <div className="absolute top-1/4 left-1/2 w-[520px] h-[290px] bg-gradient-to-br from-nectar-leaf/20 via-nectar-wasabi/40 to-nectar-peachLight/30 rounded-full blur-3xl pointer-events-none animate-ambient-drift-2" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nectar-peach dark:bg-nectar-darkCard border border-nectar-peachDeep/10 dark:border-nectar-darkBorder text-nectar-peachDeep dark:text-nectar-mint text-xs font-semibold hero-fade-in shadow-xs transition-transform duration-300 hover:scale-[1.02]">
            <span className="w-2 h-2 rounded-full bg-nectar-forest dark:bg-nectar-mint animate-pulse" />
            <span>Smart Personal Finance Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium text-nectar-forest dark:text-nectar-mint tracking-tight leading-[1.08] hero-fade-in hero-fade-in--headline">
            Turn every dollar into <br />
            <span className="italic font-normal text-nectar-emerald dark:text-emerald-400">peace of mind.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed hero-fade-in hero-fade-in--subhead">
            A modern financial insights system that automatically organizes every paycheck into a balanced 50/30/20 money flow. Know exactly what to spend, save, and grow without the stress.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade-in hero-fade-in--cta">
            <Link
              to="/signup"
              className="btn-nectar btn-nectar-primary btn-shine text-base py-3.5 px-8 shadow-nectar hover:shadow-nectar-float w-full sm:w-auto"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="btn-nectar btn-nectar-secondary text-base py-3.5 px-8 w-full sm:w-auto hover:border-nectar-emerald/30"
            >
              <span>Explore Demo Dashboard</span>
            </Link>
          </div>
        </div>

      </section>

      {/* ==========================================================================
           BENTO FEATURES GRID (with Staggered Scroll Reveal)
           ========================================================================== */}
      <section id="features" className="scroll-mt-24 py-20 px-6 sm:px-10 max-w-6xl mx-auto reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-nectar-forest dark:text-nectar-mint">
            Designed for Serenity
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-nectar-forest dark:text-nectar-mint mt-2 mb-3">
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-interactive group bg-white dark:bg-nectar-darkCard p-8 rounded-3xl border border-nectar-forest/10 dark:border-nectar-darkBorder shadow-nectar space-y-3">
            <div className="w-10 h-10 rounded-xl bg-nectar-wasabi dark:bg-nectar-forest/20 flex items-center justify-center text-nectar-forest dark:text-nectar-mint transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-nectar-forest dark:text-nectar-mint transition-colors">Natural Language Parsing</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Log expenses by typing casually like "₹450 dinner with team". Our parser extracts amount, category, and date automatically.
            </p>
          </div>

          <div className="card-interactive group bg-white dark:bg-nectar-darkCard p-8 rounded-3xl border border-nectar-forest/10 dark:border-nectar-darkBorder shadow-nectar space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-nectar-forest dark:text-nectar-mint transition-colors">Daily Safe-to-Spend Limit</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Dynamic calculations that divide remaining discretionary allowance by the days remaining in your monthly billing cycle.
            </p>
          </div>

          <div className="card-interactive group bg-white dark:bg-nectar-darkCard p-8 rounded-3xl border border-nectar-forest/10 dark:border-nectar-darkBorder shadow-nectar space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-nectar-forest dark:text-nectar-mint transition-colors">Zero Telemetry & Offline</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Your financial records never leave your browser. Full CRUD and export capabilities operate completely client-side in localStorage.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           MONEYFLOW INTERACTIVE SHOWCASE (Smooth Tab Switching Animation)
           ========================================================================== */}
      <section id="flow" className="scroll-mt-24 py-20 px-6 sm:px-10 max-w-6xl mx-auto reveal-on-scroll">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-nectar-forest dark:text-nectar-mint">
            The MoneyFlow Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-nectar-forest dark:text-nectar-mint mt-2 mb-3">
            We don't just log spending.<br />We make progress stick.
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Click through our automated systems below to see real-time financial equilibrium.
          </p>
        </div>

        <div className="bg-white dark:bg-nectar-darkCard rounded-3xl p-6 sm:p-12 border border-nectar-forest/10 dark:border-nectar-darkBorder shadow-nectar grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          onMouseEnter={() => setIsFlowPaused(true)}
          onMouseLeave={() => setIsFlowPaused(false)}
        >
          {/* Left Tabs with smooth active indicators */}
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
                      ? 'bg-nectar-wasabi dark:bg-nectar-forest/30 border-nectar-forest dark:border-nectar-mint shadow-sm translate-x-1'
                      : 'bg-gray-50/80 dark:bg-nectar-darkBg/60 border-transparent hover:border-gray-200 dark:hover:border-nectar-darkBorder hover:bg-white dark:hover:bg-nectar-darkBg'}
                  `}
                >
                  <div className="relative z-10">
                    <h3 className={`text-base font-bold mb-1 transition-colors duration-200 ${isSelected ? 'text-nectar-forest dark:text-nectar-mint' : 'text-gray-800 dark:text-gray-200'}`}>
                      {tab.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {tab.desc}
                    </p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isSelected
                      ? 'bg-nectar-forest text-white scale-100 rotate-0 shadow-sm'
                      : 'opacity-0 scale-50 -rotate-45'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Live Device Simulator with smooth keyframe morphing & radar status */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-nectar-canvas dark:bg-nectar-darkBg rounded-3xl p-6 border border-nectar-forest/15 dark:border-nectar-darkBorder shadow-nectar-float space-y-5">
              <div className="w-20 h-3.5 rounded-full bg-gray-200 dark:bg-nectar-darkCard mx-auto" />

              <div
                key={activeTab}
                className="space-y-4 animate-fade-in-up"
              >
                <div className="bg-white dark:bg-nectar-darkCard rounded-2xl p-5 border border-nectar-forest/10 dark:border-nectar-darkBorder shadow-sm space-y-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nectar-emerald opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-nectar-emerald" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Active Engine
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-nectar-mint text-nectar-forest shadow-xs transition-transform duration-300">
                      {flowTabs[activeTab].preview.tag}
                    </span>
                  </div>

                  <div className="text-3xl font-serif font-bold text-nectar-forest dark:text-nectar-mint tracking-tight transition-all duration-300">
                    {flowTabs[activeTab].preview.amount}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {flowTabs[activeTab].preview.sub}
                  </p>

                  <div className="w-full h-2.5 bg-gray-100 dark:bg-nectar-darkBg rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-nectar-emerald to-nectar-leaf rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] animate-shimmer"
                      style={{ width: `${flowTabs[activeTab].preview.barPct}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-nectar-darkCard rounded-2xl p-4 border border-nectar-forest/10 dark:border-nectar-darkBorder space-y-2.5 transition-colors">
                  {flowTabs[activeTab].preview.details.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs py-0.5 border-b border-gray-50 dark:border-nectar-darkBorder/40 last:border-none"
                    >
                      <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                      <span className={`font-bold transition-colors ${item.highlight ? 'text-nectar-emerald dark:text-nectar-mint font-mono' : 'text-gray-800 dark:text-gray-200'}`}>
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
           50/30/20 INTERACTIVE INCOME SIMULATOR
           ========================================================================== */}
      <section id="simulator" className="scroll-mt-24 py-20 px-6 sm:px-10 max-w-5xl mx-auto reveal-on-scroll">
        <div className="bg-white dark:bg-nectar-darkCard rounded-3xl p-8 sm:p-12 border border-nectar-forest/10 dark:border-nectar-darkBorder shadow-nectar space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-nectar-forest dark:text-nectar-mint">
              Personalized Calculator
            </span>
            <h2 className="text-3xl font-serif font-bold text-nectar-forest dark:text-nectar-mint mt-2 mb-2">
              50/30/20 Take-Home Simulator
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Slide your monthly net income to see how your money naturally balances.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-nectar-canvas dark:bg-nectar-darkBg border border-nectar-forest/10 dark:border-nectar-darkBorder space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Monthly Net Income
              </span>
              <span className="text-3xl font-serif font-bold text-nectar-forest dark:text-nectar-mint">
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
              className="w-full accent-nectar-forest cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-gray-400">
              <span>₹20,000 / mo</span>
              <span>₹1,50,000 / mo</span>
              <span>₹3,00,000+ / mo</span>
            </div>

            {/* Interactive Visual 50/30/20 Distribution Bar */}
            <div className="pt-2 border-t border-nectar-forest/10 dark:border-nectar-darkBorder space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-500 dark:text-gray-400">
                <span>Balanced Allocation</span>
                <span className="font-mono text-nectar-forest dark:text-nectar-mint">100% of Net Income</span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-gray-100 dark:bg-nectar-darkCard overflow-hidden flex shadow-inner">
                <div 
                  className="h-full bg-nectar-forest dark:bg-nectar-emerald transition-all duration-300 ease-out flex items-center justify-center text-[9px] font-bold text-white tracking-wider"
                  style={{ width: '50%' }}
                  title="50% Needs"
                >
                  50%
                </div>
                <div 
                  className="h-full bg-amber-500 transition-all duration-300 ease-out flex items-center justify-center text-[9px] font-bold text-white tracking-wider"
                  style={{ width: '30%' }}
                  title="30% Wants"
                >
                  30%
                </div>
                <div 
                  className="h-full bg-nectar-leaf dark:bg-nectar-mint text-nectar-forest transition-all duration-300 ease-out flex items-center justify-center text-[9px] font-bold tracking-wider"
                  style={{ width: '20%' }}
                  title="20% Growth"
                >
                  20%
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600 dark:text-gray-400 pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-nectar-forest dark:bg-nectar-emerald" />
                  <span>Needs (₹{(income * 0.50).toLocaleString('en-IN')})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Wants (₹{(income * 0.30).toLocaleString('en-IN')})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-nectar-leaf dark:bg-nectar-mint" />
                  <span>Growth (₹{(income * 0.20).toLocaleString('en-IN')})</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-interactive p-5 rounded-2xl bg-gray-50 dark:bg-nectar-darkBg border border-gray-100 dark:border-nectar-darkBorder">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                50% Needs Cap
              </span>
              <div className="text-2xl font-serif font-bold text-nectar-forest dark:text-nectar-mint my-1.5">
                {formatCurrency(needs).split('.')[0]}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Rent, groceries, utilities, basic transit, healthcare</p>
            </div>

            <div className="card-interactive p-5 rounded-2xl bg-gray-50 dark:bg-nectar-darkBg border border-gray-100 dark:border-nectar-darkBorder">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                30% Wants Cap
              </span>
              <div className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400 my-1.5">
                {formatCurrency(wants).split('.')[0]}
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Dining, weekend travel, hobbies, entertainment</p>
            </div>

            <div className="card-interactive p-5 rounded-2xl bg-nectar-wasabi dark:bg-nectar-forest/30 border border-nectar-mint dark:border-nectar-darkBorder">
              <span className="text-xs font-bold uppercase tracking-wider text-nectar-forest dark:text-nectar-mint">
                20% Growth Goal
              </span>
              <div className="text-2xl font-serif font-bold text-nectar-emerald dark:text-nectar-mint my-1.5">
                {formatCurrency(savings).split('.')[0]}
              </div>
              <p className="text-[11px] text-nectar-forest dark:text-nectar-mint">Automated emergency buffer and compound investments</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           CALL TO ACTION (Nectar Luxury Banner)
           ========================================================================== */}
      <section className="py-20 px-6 sm:px-10 max-w-5xl mx-auto text-center reveal-on-scroll">
        <div className="bg-gradient-to-br from-nectar-forest to-emerald-950 text-white rounded-3xl p-10 sm:p-16 shadow-nectar-float relative overflow-hidden space-y-6">
          {/* Subtle ambient rotating glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-nectar-mint/20 rounded-full blur-3xl pointer-events-none animate-ambient-drift-1" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-ambient-drift-2" />

          <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto text-nectar-mint">
            <Leaf className="w-6 h-6" />
          </div>

          <h2 className="relative z-10 text-3xl sm:text-5xl font-serif font-medium tracking-tight">
            Ready to feel great about your money?
          </h2>

          <p className="relative z-10 text-sm sm:text-base text-gray-200 max-w-xl mx-auto">
            Join thousands who turned paycheck anxiety into automated financial clarity. Set up your personal money system in under 2 minutes.
          </p>

          <div className="relative z-10 pt-2">
            <Link
              to="/signup"
              className="btn-shine inline-flex items-center gap-2 px-8 py-4 rounded-full bg-nectar-mint text-nectar-forest font-bold text-sm hover:bg-emerald-200 transition-transform active:scale-95 shadow-lg"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================================
           FOOTER (Nectar Editorial Layout)
           ========================================================================== */}
      <footer id="integrity" className="scroll-mt-24 border-t border-nectar-forest/10 dark:border-nectar-darkBorder py-12 px-6 sm:px-10 max-w-6xl mx-auto text-xs text-gray-500 dark:text-gray-400 reveal-on-scroll">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-nectar-forest dark:text-nectar-mint font-bold">
            <Leaf className="w-4 h-4" />
            <span>Nectar Smart Finance</span>
          </div>

          <p className="text-center sm:text-right">
            © 2026 Nectar Smart Finance. Mindful wealth & automated cashflow.
          </p>
        </div>
      </footer>

    </div>
  );
}