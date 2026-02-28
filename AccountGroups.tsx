@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: 'Inter', sans-serif;
  --font-display: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Premium Dark Blue Theme (default) */
  --background: 224 71% 4%;
  --foreground: 210 40% 98%;
  
  --primary: 217 91% 60%;
  --primary-foreground: 222 47% 11%;
  
  --secondary: 217 33% 17%;
  --secondary-foreground: 210 40% 98%;
  
  --muted: 217 33% 12%;
  --muted-foreground: 215 20% 65%;
  
  --accent: 250 80% 65%;
  --accent-foreground: 210 40% 98%;
  
  --destructive: 0 62% 30%;
  --destructive-foreground: 210 40% 98%;
  
  --border: 217 33% 15%;
  --input: 217 33% 15%;
  --ring: 217 91% 60%;
  
  --radius: 0.75rem;

  --card: 224 71% 4%;
  --card-foreground: 210 40% 98%;
  --popover: 224 71% 6%;
  --popover-foreground: 210 40% 98%;

  --sidebar-bg: 224 71% 4%;
  --sidebar-border: 0 0% 100% / 0.05;
  --surface: 222 47% 8%;
  --surface-hover: 222 47% 11%;
  --text-primary: 0 0% 100%;
  --text-secondary: 215 20% 65%;
  --text-tertiary: 215 20% 45%;
  --glass-bg: 0 0% 100% / 0.05;
  --glass-border: 0 0% 100% / 0.10;
  --glass-bg-hover: 0 0% 100% / 0.08;
}

[data-theme="light"] {
  --background: 210 40% 98%;
  --foreground: 222 47% 11%;
  
  --primary: 217 91% 50%;
  --primary-foreground: 0 0% 100%;
  
  --secondary: 214 32% 91%;
  --secondary-foreground: 222 47% 11%;
  
  --muted: 210 40% 94%;
  --muted-foreground: 215 16% 47%;
  
  --accent: 250 80% 60%;
  --accent-foreground: 0 0% 100%;
  
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  
  --border: 214 32% 85%;
  --input: 214 32% 85%;
  --ring: 217 91% 50%;

  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;

  --sidebar-bg: 0 0% 100%;
  --sidebar-border: 214 32% 85%;
  --surface: 210 40% 96%;
  --surface-hover: 210 40% 93%;
  --text-primary: 222 47% 11%;
  --text-secondary: 215 16% 47%;
  --text-tertiary: 215 16% 62%;
  --glass-bg: 222 47% 11% / 0.04;
  --glass-border: 222 47% 11% / 0.10;
  --glass-bg-hover: 222 47% 11% / 0.07;
}

@layer base {
  body {
    @apply bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary-foreground;
    font-family: var(--font-sans);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    @apply font-bold tracking-tight;
    color: hsl(var(--text-primary));
  }
}

@layer utilities {
  .glass {
    @apply backdrop-blur-md;
    background: hsl(var(--glass-bg));
    border: 1px solid hsl(var(--glass-border));
  }
  
  .glass-card {
    @apply backdrop-blur-xl shadow-xl;
    background: hsl(var(--glass-bg));
    border: 1px solid hsl(var(--glass-border));
  }

  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400;
  }

  .text-gradient-primary {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400;
  }
}

[data-theme="dark"] .text-gradient {
  background-image: linear-gradient(to right, white, #dbeafe, #bfdbfe);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Theme transition - scoped to major containers */
body,
aside,
main,
nav,
header,
.min-h-screen,
[class*="rounded-xl"],
[class*="border-"] {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Disable transitions on canvas/drag/animation elements */
canvas, svg path, svg line, svg circle,
[data-node-card], .dragging * {
  transition: none !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--background));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}

/* ===== LIGHT MODE OVERRIDES ===== */

/* Hardcoded dark backgrounds → light equivalents */
[data-theme="light"] .bg-\[\#020617\] { background-color: hsl(var(--background)) !important; }
[data-theme="light"] .bg-\[\#020617\]\/80 { background-color: hsl(var(--sidebar-bg) / 0.95) !important; }
[data-theme="light"] .bg-\[\#020617\]\/90 { background-color: hsl(var(--background) / 0.95) !important; }
[data-theme="light"] .bg-\[\#0a0f1e\] { background-color: hsl(var(--surface)) !important; }
[data-theme="light"] .bg-\[\#0a0f1e\]\/60 { background-color: hsl(var(--card) / 0.95) !important; }
[data-theme="light"] .bg-\[\#0a0f1e\]\/80 { background-color: hsl(var(--surface) / 0.95) !important; }
[data-theme="light"] .bg-\[\#0a0f1e\]\/90 { background-color: hsl(var(--card) / 0.97) !important; }
[data-theme="light"] .bg-\[\#0a0f1e\]\/92 { background-color: hsl(var(--card) / 0.97) !important; }
[data-theme="light"] .bg-\[\#0f172a\] { background-color: hsl(var(--card)) !important; }
[data-theme="light"] .bg-\[\#0f172a\]\/95 { background-color: hsl(var(--card) / 0.98) !important; }
[data-theme="light"] .bg-\[\#0b1121\] { background-color: hsl(var(--surface)) !important; }
[data-theme="light"] .bg-\[\#060b18\] { background-color: hsl(var(--background)) !important; }

/* Text colors */
[data-theme="light"] .text-white { color: hsl(var(--text-primary)) !important; }
[data-theme="light"] .text-white\/90 { color: hsl(var(--text-primary) / 0.9) !important; }
[data-theme="light"] .text-white\/80 { color: hsl(var(--text-primary) / 0.8) !important; }
[data-theme="light"] .text-white\/70 { color: hsl(var(--text-primary) / 0.7) !important; }
[data-theme="light"] .text-white\/60 { color: hsl(var(--text-primary) / 0.6) !important; }
[data-theme="light"] .text-white\/50 { color: hsl(var(--text-secondary)) !important; }
[data-theme="light"] .text-white\/40 { color: hsl(var(--text-tertiary)) !important; }
[data-theme="light"] .text-white\/30 { color: hsl(var(--text-tertiary)) !important; }

/* Glass/semi-transparent backgrounds */
[data-theme="light"] .bg-white\/5 { background-color: hsl(var(--glass-bg)) !important; }
[data-theme="light"] .bg-white\/\[0\.02\] { background-color: hsl(var(--glass-bg)) !important; }
[data-theme="light"] .bg-white\/\[0\.04\] { background-color: hsl(var(--glass-bg-hover)) !important; }
[data-theme="light"] .bg-white\/\[0\.01\] { background-color: hsl(222 47% 11% / 0.02) !important; }
[data-theme="light"] .bg-white\/10 { background-color: hsl(var(--glass-bg-hover)) !important; }

/* Borders */
[data-theme="light"] .border-white\/5 { border-color: hsl(var(--border)) !important; }
[data-theme="light"] .border-white\/10 { border-color: hsl(var(--border)) !important; }
[data-theme="light"] .border-white\/15 { border-color: hsl(var(--border)) !important; }
[data-theme="light"] .border-white\/20 { border-color: hsl(var(--border)) !important; }

/* Hover states */
[data-theme="light"] .hover\:bg-white\/5:hover { background-color: hsl(var(--glass-bg)) !important; }
[data-theme="light"] .hover\:bg-white\/\[0\.04\]:hover { background-color: hsl(var(--glass-bg-hover)) !important; }
[data-theme="light"] .hover\:text-white:hover { color: hsl(var(--text-primary)) !important; }
[data-theme="light"] .hover\:border-primary\/30:hover { border-color: hsl(var(--primary) / 0.3) !important; }

/* Dividers & separators */
[data-theme="light"] .divide-white\/5 > * + * { border-color: hsl(var(--border)) !important; }

/* Ring colors */
[data-theme="light"] .ring-white\/10 { --tw-ring-color: hsl(var(--border)) !important; }

/* Logo: black text in light mode */
[data-theme="light"] .invert.brightness-0 {
  filter: none !important;
}


/* Shadows for light mode cards */
[data-theme="light"] .shadow-xl { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important; }
[data-theme="light"] .shadow-2xl { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important; }

/* Backdrop blur on light */
[data-theme="light"] .backdrop-blur-md { backdrop-filter: blur(8px); }
[data-theme="light"] .backdrop-blur-xl { backdrop-filter: blur(16px); }

/* From/to gradient overrides */
[data-theme="light"] .from-white\/10 { --tw-gradient-from: hsl(var(--glass-bg)) !important; }
[data-theme="light"] .to-white\/5 { --tw-gradient-to: hsl(var(--glass-bg)) !important; }
[data-theme="light"] .from-\[\#020617\] { --tw-gradient-from: hsl(var(--background)) !important; }

/* Placeholder text */
[data-theme="light"] .placeholder-white\/30::placeholder { color: hsl(var(--text-tertiary)) !important; }
[data-theme="light"] .placeholder\:text-white\/30::placeholder { color: hsl(var(--text-tertiary)) !important; }

/* Black overlays (modals) */
[data-theme="light"] .bg-black\/60 { background-color: rgba(0, 0, 0, 0.4) !important; }
[data-theme="light"] .bg-black\/50 { background-color: rgba(0, 0, 0, 0.35) !important; }
