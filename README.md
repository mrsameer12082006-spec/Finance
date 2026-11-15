# 🌿 Nectar &bull; Smart Expense Tracker & Financial Insights Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-38bdf8.svg)](https://tailwindcss.com/)
[![shadcn/ui compatible](https://img.shields.io/badge/shadcn%2Fui-compatible-black.svg)](https://ui.shadcn.com/)

A modern, open-source personal finance tracking architecture that turns paycheck anxiety into automated financial clarity. Designed with serene aesthetic tokens, glassmorphism, fluid micro-interactions, and offline zero-telemetry client-side privacy.

---

## ✨ Highlights & Features

### 1. 🧭 Morphing Glassmorphic Navbar & Smooth Navigation
- **Scroll-Driven Retraction**: The navigation bar smoothly morphs between a full-width header at the top of the page into an edge-frosted, floating capsule pill as you scroll down.
- **Hardware-Accelerated Indicator Pill**: A GPU-composited sliding green indicator pill dynamically glides across navigation links with zero subpixel jitter.
- **ScrollSpy with Conflict Locking (`lockSpy`)**: Programmatic navigation clicks lock the active section tracker during travel, preventing intermediate sections from hijacking state.

### 2. 📊 Executive Financial Insights Dashboard
- **Daily Safe-to-Spend Velocity**: Automatically calculates your guilt-free daily allowance based on remaining discretionary budget and billing days left.
- **50/30/20 Financial Equilibrium**: Automatically splits monthly net income into Essential Needs ($50\%$), Lifestyle Wants ($30\%$), and Wealth/Savings Growth ($20\%$).
- **Visual Analytics (Recharts)**: Interactive hoverable Category Distribution Donut Chart and 30-Day Spending Trajectory Area Curve.
- **Natural Language Parsing**: Log expenses effortlessly by typing casually (e.g. *"₹450 dinner with team"* or *"Uber ₹280"*).
- **Automatic Expense Categorization**: Expense titles suggest a category and 50/30/20 group as you type; quick entry parses amounts and descriptions without guessing missing values.
- **Budget Threshold Alerts**: Dashboard and budget settings show dismissible alerts when monthly or category budgets reach 80% or are exceeded.
- **Recurring Payment Reminders**: Detects stable monthly expense patterns and lets you opt into in-app reminders; Nectar never creates transactions automatically.
- **Spending-Based Budget Suggestions**: Budget settings estimates category caps from up to three recorded months, projects the current month’s pace, and adds a reviewable buffer.

### 3. 🎨 High-End Animations & Micro-Interactions
- **Ambient Drifting Auras**: Multi-layered organic floating gradient blobs (`animate-ambient-drift-1` & `2`) that breathe depth into backgrounds.
- **Interactive Cursor-Following Glow**: Dynamic ambient radial green aura that fluidly follows your mouse across the authentication and landing pages.
- **Luxury Button Sheen (`.btn-shine`)**: $45^\circ$ specular light-sweep reflection gliding across primary CTA buttons on hover.
- **Apple-Style Spring Modals**: Modal drawers pop smoothly into view using physics-inspired cubic-bezier spring easing.
- **Interactive Stacked Ratio Bar**: Real-time visual 50/30/20 breakdown that updates live as you drag the income calculator slider.

### 4. 🔒 Zero-Telemetry Client-Side Privacy
- Your financial records never leave your browser.
- Full CRUD operations, budget ceilings, and CSV export operate completely client-side in browser `localStorage`.

### 5. 🧩 shadcn/ui & TypeScript Architecture
- Standardized `components/ui` directory for atomic reusable primitives.
- Path aliases configured (`@/*` mapping to `./src/*`) with `components.json` and `src/lib/utils.ts` (`cn` helper).
- Fully supports `.tsx` TypeScript components out-of-the-box.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite 6
- **State Management**: Redux Toolkit + React Redux
- **Routing**: React Router DOM (v6) with code-splitting (`React.lazy` / `Suspense`)
- **Styling**: Tailwind CSS (with custom Nectar palette & CSS variables)
- **Visualizations**: Recharts (PieChart, ResponsiveContainer, AreaChart)
- **Icons**: Lucide React
- **Utilities**: `clsx`, `tailwind-merge`

---

## 📁 Directory Structure

```
nectar/
├── components.json          # shadcn/ui configuration
├── tsconfig.json            # TypeScript path resolution (@/*)
├── tailwind.config.js       # Design tokens & semantic HSL variables
├── vite.config.js           # Vite config with path aliases
├── LICENSE                  # Open-source MIT License
├── README.md
└── src/
    ├── App.jsx              # App layout, lazy routes & theme wrapper
    ├── index.css            # Glassmorphism, keyframes & animations
    ├── main.jsx             # React DOM root & Redux Provider
    ├── components/
    │   ├── ui/              # Reusable shadcn/ui primitives (sign-in, etc.)
    │   ├── CategoryPieChart.jsx
    │   ├── DailyTrendChart.jsx
    │   ├── ExpenseModal.jsx
    │   ├── InsightCard.jsx
    │   ├── Navbar.jsx
    │   ├── Pagination.jsx
    │   └── Sidebar.jsx
    ├── hooks/
    │   ├── useDebounce.js
    │   ├── useFinancialInsights.js
    │   ├── useNavIndicator.js
    │   └── useScrollSpy.js
    ├── lib/
    │   └── utils.ts         # shadcn cn() class combiner
    ├── pages/
    │   ├── BudgetSettings.jsx
    │   ├── Dashboard.jsx
    │   ├── Expenses.jsx
    │   ├── Home.jsx         # Landing page with interactive engine
    │   ├── Login.jsx
    │   └── Signup.jsx       # Register with cursor-following aura
    ├── redux/
    │   ├── store.js
    │   └── slices/
    │       ├── authSlice.js
    │       ├── expenseSlice.js
    │       └── themeSlice.js
    ├── services/
    │   └── localStorageService.js
    └── utils/
        ├── csvExport.js
        ├── formatters.js
        └── smoothScroll.js
```

---

## 🛠️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/mrsameer12082006-spec/Nectar.git
cd Nectar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm start
```
This starts the development server on port `3000` and opens the browser automatically. `npm run dev` is also available.

### 4. Build for production
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### 5. Build and preview production
```bash
npm run start:prod
```
This builds the app and serves the production bundle on port `4173`, opening it in the browser. To preview an already-built bundle, use `npm run preview`.

### 6. Verify changes
```bash
npm run check
```
This runs the production build as a local verification check. GitHub Actions runs the same check for pushes and pull requests. Dependency update pull requests are scheduled weekly through Dependabot.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/your-username/nectar-smart-finance/issues) if you want to contribute.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

Copyright &copy; 2026 Nectar Contributors.
