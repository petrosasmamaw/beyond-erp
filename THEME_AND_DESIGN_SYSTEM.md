# Beyond ERP — Theme & Design System Specification

## 1. Design Philosophy

Beyond ERP adheres to a **mobile-first, high-density enterprise aesthetic**. Designed to run smoothly on smartphones used on shop floors, farmlands, delivery trucks, and hospital wards across Africa and North America, the UI balances touch usability (44px+ tap targets) with crisp data presentation.

### Core Principles
- **Clarity & Contrast**: High-contrast typography and clear visual hierarchy so screens remain readable in bright outdoor conditions.
- **Color-Coded Sector Identity**: 12 economic sectors are instantly recognizable via distinct primary and tint color codes.
- **Tactile Micro-Interactions**: Subtle active scale transitions (`transform: scale(0.98)`), smooth slide-up modals, and spring bar animations.
- **Bilingual & Multi-Script Typography**: Seamless typographic rendering across Latin and Ge'ez (Ethiopic) scripts.

---

## 2. Color System & Design Tokens

### 2.1. Global Semantic Tokens (CSS Variables)

Defined in `src/app/globals.css`:

```css
:root {
  /* Brand Core */
  --primary: #2563eb;          /* Royal Blue */
  --primary-dark: #1e40af;     /* Deep Navy */
  --primary-light: #60a5fa;    /* Sky Blue */
  --accent: #3b82f6;           /* Vivid Accent */

  /* Semantic Feedback */
  --gold: #f59e0b;             /* Warning / Pending / Attention */
  --red: #da020e;              /* Danger / Critical / Expense */
  --teal: #0f766e;             /* Success / Balanced / Healthy */
  --purple: #7c3aed;           /* Secondary Accent */
  
  /* Neutral & Surfaces (Light Mode) */
  --ink: #0f172a;              /* High-contrast foreground text */
  --muted: #64748b;            /* Secondary / placeholder text */
  --line: #e2e8f0;             /* Subtle borders & dividers */
  --soft: #f1f5f9;             /* Background secondary wash */
  --surface: #ffffff;          /* Card & container background */
  --shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}
```

### 2.2. The 12 Sector Color Palettes

Every sector configured in `src/features/erp/config.tsx` possesses a unique color identity for badges, cards, and icons:

| Sector | Primary Hex | Light Tint Hex | Associated Icon | Description |
|---|---|---|---|---|
| **Retail & Trading** | `#f59e0b` | `#fffbeb` | `fa-solid fa-store` | Warm Amber |
| **Manufacturing** | `#8b5cf6` | `#f5f3ff` | `fa-solid fa-industry` | Industrial Purple |
| **Agriculture** | `#10b981` | `#ecfdf5` | `fa-solid fa-wheat-awn` | Harvest Emerald |
| **Construction** | `#ea580c` | `#fff7ed` | `fa-solid fa-helmet-safety` | High-vis Orange |
| **Healthcare** | `#ef4444` | `#fff1f2` | `fa-solid fa-heart-pulse` | Clinical Crimson |
| **Education** | `#2563eb` | `#eff6ff` | `fa-solid fa-graduation-cap` | Academic Blue |
| **Hospitality** | `#ec4899` | `#fdf2f8` | `fa-solid fa-hotel` | Vibrant Rose |
| **Transport & Logistics** | `#06b6d4` | `#ecfeff` | `fa-solid fa-truck` | Maritime Cyan |
| **Finance & Banking** | `#0f766e` | `#f0fdfa` | `fa-solid fa-landmark` | Secure Teal |
| **Real Estate** | `#6366f1` | `#eef2ff` | `fa-solid fa-building` | Architectural Indigo |
| **NGO & Development** | `#84cc16` | `#f7fee7` | `fa-solid fa-hand-holding-heart` | Sustainable Lime |
| **Custom Sector** | `#64748b` | `#f8fafc` | `fa-solid fa-cubes` | Slate Neutral |

---

## 3. Dark & Light Mode Architecture

### 3.1. Context Provider (`ThemeContext.tsx`)
Theme toggling is managed centrally in `src/contexts/ThemeContext.tsx`:
- **State Storage**: Reads and writes to `localStorage` under key `beyond_theme`.
- **System Preference Detection**: Automatically checks `window.matchMedia("(prefers-color-scheme: dark)")` when no stored preference exists.
- **DOM Attribute Injection**: Applies `document.documentElement.setAttribute("data-theme", "light" | "dark")`.

### 3.2. Dark Mode Color Mapping
When `[data-theme="dark"]` is active:
- Surface backgrounds transition from pure white (`#ffffff`) to deep slate surfaces (`#1e293b` and `#0f172a`).
- Text ink switches from `#0f172a` to `#f8fafc`.
- Borders transition from `#e2e8f0` to dark dividers `#334155`.
- Subtle glassmorphic backdrops maintain contrast using alpha layers (`rgba(255, 255, 255, 0.08)`).

### 3.3. Toggle Component (`ThemeToggle.tsx`)
- Provides a quick 1-click toggle with smooth icon cross-fade between `Sun` and `Moon` (Lucide icons).
- Integrated directly into both the desktop header top bar and the mobile settings drawer.

---

## 4. Typography System

### 4.1. Font Stacks
Beyond ERP specifies a font stack optimized for both standard Latin text and the Ethiopian Ge'ez syllabary:

```css
font-family: var(--font-sans), "Noto Sans Ethiopic", ui-sans-serif, system-ui, -apple-system, sans-serif;
```

1. **`var(--font-sans)`**: Clean Latin sans-serif for numbers, English, and French.
2. **`Noto Sans Ethiopic`**: Google Font providing correct kerning and glyph rendering for:
   - Amharic (አማርኛ)
   - Tigrinya (ትግርኛ)
3. **`ui-sans-serif` & system fallbacks**: Native OS font rendering for high framerates and fast paint times on low-powered mobile devices.

### 4.2. Typographic Scale
- **Display / Hero Titles**: 28px – 34px, 800 weight (Bold, -1px tracking)
- **Section Headers (`h2`)**: 20px – 24px, 800 weight
- **Card Titles (`h3`)**: 14px – 16px, 700 weight
- **Body Text**: 14px, 400/500 weight, 1.4 – 1.5 line height
- **Eyebrow / Badges**: 10px – 11px, 900 weight, uppercase with letter-spacing
- **Numeric Stat Cards**: `clamp(16px, 4vw, 20px)`, tabular figures for aligned currencies

---

## 5. Component Library & Patterns

### 5.1. Layout Shells
- **Phone Frame Mode (`.phone-frame`, `.app-shell`)**:
  - Centers content in a phone-sized column (max 448px) on desktop monitors to simulate mobile operational usage.
  - Expands to 100% full-bleed on actual smartphone screens.
- **Top Bar (`.app-topbar`)**:
  - Sticky header featuring current user badge, language picker, network connection status badge, and theme toggle.
- **Ethiopian Calendar Strip (`.calendar-strip`)**:
  - Displays the active Ethiopian date (e.g. *Tikimt 17, 2019 E.C.*) and active holiday badges.
- **Bottom Navigation Bar (`BottomNav.tsx`)**:
  - Fixed mobile bottom navigation with 5 key touch targets: Home, Sectors, Money/Transactions, Team, and More/CRM.

### 5.2. Modals & Drawers
- **Mobile Bottom-Sheet (`.modal-box`)**:
  - Slides up from the screen bottom (`slideUp` 0.3s cubic bezier).
  - Rounded top corners (`24px 24px 0 0`) with maximum 92vh height and touch dismissal.
- **Centered Dialogs (`.center-modal`)**:
  - Center-aligned for confirmation dialogues and complex multi-step forms on desktop.

### 5.3. Status Pills & Badges
- **Online / Offline Pill**:
  - `.connection-badge.online`: Light blue with navy text.
  - `.connection-badge.offline`: Soft red with dark red text, alerting the operator that the offline sync queue is active.
- **Payment Pills**:
  - Visual pills for Telebirr, CBE Birr, Cash, Bank Transfer, and Credit Card with matching icons.

### 5.4. Micro-Visualizations
- **CSS Bar Charts (`.bar-chart`, `.bar-wrap`)**:
  - Lightweight pure-CSS vertical bar charts with gradients (`linear-gradient(180deg, #1d4ed8, #60a5fa)`).
  - Renders monthly revenue trends without external heavy chart libraries.

---

## 6. Standalone Prototype Styling (`beyond-erp.html`)

For zero-build browser demos, the root includes `beyond-erp.html`:
- Utilizes the **Tailwind CSS CDN** with custom palette extensions.
- Includes **FontAwesome 6.5.0** icon sets.
- Features embedded vanilla CSS variables matching the main Next.js production theme.
- Demonstrates instant tab switching, simulated offline mode, and interactive modal triggers.
