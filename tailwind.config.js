/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        nectar: {
          // Architectural Cool White Surfaces
          canvas: '#F8FAFC',        // Slate-50 crisp cool white
          canvasSubtle: '#F1F5F9',  // Slate-100 soft fog
          surface: '#FFFFFF',       // Pure elevated card white
          
          // Deep Obsidian Slate Typography & Core Branding (Decent & High-End)
          forest: '#0F172A',        // Slate-900 obsidian
          emerald: '#164E63',       // Glacial Spruce / Deep Cyan-Slate
          accent: '#0E7490',        // Calm Glacial Teal
          mineral: '#1E3A34',       // Deep Pine
          
          // Soothing Ice & Mist Highlights (No AI-slop neons)
          mint: '#E0F2FE',          // Frosted Glacial Sky (soothing active pill)
          mintLight: '#F0F9FF',     // Whisper-light frost
          leaf: '#38BDF8',          // Clean ice-water accent
          wasabi: '#F1F5F9',        // Replaces muddy green with refined cool fog
          
          // Refined Slate & Fog replacements for peach
          peach: '#F8FAFC',         // Subtle badge slate
          peachLight: '#F1F5F9',
          peachDeep: '#334155',     // Slate-700
          
          droplet: '#F0F9FF',
          
          // Dark Mode (Midnight Celestial Ink)
          darkBg: '#0B0F17',        // Deep celestial slate-ink
          darkCard: '#111827',      // Elevated dark surface (Slate-900)
          darkBorder: '#1E293B',    // Hairline dark border (Slate-800)
          darkMuted: '#94A3B8',     // Muted text (Slate-400)
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        geist: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
        'card': '1.5rem',
        '2card': '2rem'
      },
      boxShadow: {
        'nectar': '0 16px 32px -8px rgba(15, 23, 42, 0.05), 0 4px 8px -2px rgba(15, 23, 42, 0.02)',
        'nectar-float': '0 20px 40px -12px rgba(15, 23, 42, 0.08), 0 8px 16px -4px rgba(15, 23, 42, 0.04)',
        'nectar-glow': '0 0 35px rgba(56, 189, 248, 0.12)',
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
};
