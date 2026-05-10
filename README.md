# ✈️ Traveloop

> **A full-stack travel planning SaaS platform** — Build itineraries, track budgets, collaborate, and share your adventures with the world.

![Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🌟 Features

### 🔐 Authentication
- Full **Supabase Auth** integration (Email/Password Sign Up & Sign In)
- Global session management via **Zustand** (`useAuthStore`)
- Protected routes — unauthorized users are redirected to Login
- User profile updates (display name, language preference)

### 🗺️ Interactive Itinerary Builder
- Drag-and-drop stop reordering powered by **@hello-pangea/dnd**
- Live city search against the Supabase `cities` table
- Interactive map with **React Leaflet** — numbered pins drop automatically when you add a city
- Dashed **Polyline route** connects stops in order, updating live as you reorder
- Auto-pan & fly-to animation when a new stop is added

### 📋 Trip Management
- Create trips with title, description, dates, and cover image
- My Trips grid with cover photos, date ranges, and destination counts
- **View**, **Share**, and **Delete** actions on every trip card
- One-click public link copy for sharing

### 🗓️ Detailed Itinerary View
- Day-by-day vertical **timeline** pulling real data from `trip_stops` and `activities`
- Activity cards with images, duration, and ₹ cost
- Empty state with a direct CTA to the Itinerary Builder

### 💰 Budget & Expenses
- 4 summary stat cards: Total Budget, Daily Average, Largest Category, Status
- Interactive **Recharts Donut chart** for cost breakdown
- **Category progress bars** showing % of total per category
- Itemised expense list — add new expenses with category, description, and amount
- Hover-to-reveal delete on individual line items

### ✅ Packing Checklist
- Add custom items grouped by category (Documents, Electronics, Clothing, Misc)
- One-click check/uncheck with strikethrough effect
- **Live progress bar** showing % of items packed

### 📝 Trip Journal & Notes
- Rich text note editor with save functionality
- Notes grid with timestamp and hover-delete
- Persists in local component state (ready for DB integration)

### 🌐 Public / Shared Itinerary
- Publicly accessible `/shared/:tripId` route — no login required
- Full read-only hero, map, and timeline view
- **Social Share modal**: Copy Link, Post on Twitter, Share on Facebook
- **Copy Trip** button for logged-in visitors to duplicate the itinerary

### 👤 User Profile & Settings
- Avatar upload UI with hover effect
- Edit display name (synced to Supabase `user_metadata`)
- Language preference selector (English, Español, Français, Deutsch)
- Saved Destinations visual grid
- Danger Zone with **Delete Account** (with confirmation safeguard)
- Sign Out button

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + ShadCN UI components |
| **State Management** | Zustand (`useAuthStore`, `useTripStore`) |
| **Routing** | React Router DOM v7 |
| **Backend / Auth** | Supabase (PostgreSQL + RLS + Auth) |
| **Maps** | React Leaflet + Leaflet.js |
| **Drag & Drop** | @hello-pangea/dnd |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
src/
├── components/
│   └── ui/               # ShadCN UI components (Button, Card, Input, Textarea)
├── layouts/
│   ├── MainLayout.tsx    # App shell with sidebar + mobile nav
│   └── TripLayout.tsx    # Per-trip shell with hero + internal tab nav
├── pages/
│   ├── LandingPage.tsx          # Marketing homepage
│   ├── AuthPage.tsx             # Login / Sign Up
│   ├── DashboardPage.tsx        # Overview stats + upcoming trip widget
│   ├── CreateTripPage.tsx       # Step 1: Trip details form
│   ├── ItineraryBuilderPage.tsx # Step 2: Drag-drop stops + live map
│   ├── MyTripsPage.tsx          # Trip grid with share & delete
│   ├── ItineraryViewPage.tsx    # Day-by-day timeline (inside TripLayout)
│   ├── TripBudgetPage.tsx       # Budget tracker + charts
│   ├── ChecklistPage.tsx        # Packing checklist
│   ├── NotesPage.tsx            # Trip journal
│   ├── SharedTripPage.tsx       # Public read-only itinerary
│   ├── ProfilePage.tsx          # User settings
│   ├── CitySearchPage.tsx       # Explore destinations
│   └── ActivitySearchPage.tsx   # Browse activities
├── store/
│   ├── useAuthStore.ts   # Supabase session state
│   └── useTripStore.ts   # Trip builder client state
├── lib/
│   ├── supabase.ts       # Supabase client init
│   └── utils.ts          # Tailwind class merger (cn)
└── App.tsx               # Router + auth guard
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- Users (managed by Supabase Auth)

-- Trips
CREATE TABLE trips (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trip Stops
CREATE TABLE trip_stops (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     UUID REFERENCES trips(id) ON DELETE CASCADE,
  city_name   TEXT NOT NULL,
  lat         FLOAT,
  lng         FLOAT,
  stop_order  INT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Cities (destination catalog)
CREATE TABLE cities (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT NOT NULL,
  country TEXT,
  lat     FLOAT,
  lng     FLOAT,
  cost_level INT  -- 1 = budget, 2 = mid, 3 = luxury
);

-- Activities
CREATE TABLE activities (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id  UUID REFERENCES trip_stops(id) ON DELETE CASCADE,
  title    TEXT,
  duration TEXT,
  cost     NUMERIC,
  image_url TEXT
);
```

> Row Level Security (RLS) is enabled — users can only access their own trips.

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/Duraisingh-J/traveloop_hackathians.git
cd traveloop_hackathians
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Schema

Run the SQL from `prisma/schema.prisma` (or the Supabase SQL editor) to create all tables and enable RLS policies.

### 4. Start Development Server

```bash
npm run dev
```

App runs at **http://localhost:5173**

### 5. Build for Production

```bash
npm run build
```

---

## 🧭 Navigation

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing Page | No |
| `/login` | Auth (Sign In / Sign Up) | No |
| `/shared/:id` | Public Itinerary View | No |
| `/dashboard` | Dashboard | ✅ Yes |
| `/trips` | My Trips | ✅ Yes |
| `/trips/create` | Create Trip | ✅ Yes |
| `/trips/build` | Itinerary Builder | ✅ Yes |
| `/trips/:id` | Trip Itinerary View | ✅ Yes |
| `/trips/:id/budget` | Trip Budget | ✅ Yes |
| `/trips/:id/checklist` | Packing Checklist | ✅ Yes |
| `/trips/:id/notes` | Trip Notes | ✅ Yes |
| `/search` | Explore Cities | ✅ Yes |
| `/profile` | User Profile | ✅ Yes |

---

## 💡 Key Design Decisions

- **Currency**: All monetary values are displayed in **Indian Rupee (₹)** using the `en-IN` locale.
- **Map Icons**: Custom HTML `divIcon` pins are used instead of default Leaflet images to prevent Vite bundling issues.
- **Button `asChild`**: Implemented using `React.cloneElement` to correctly forward `inline-flex` layout classes to `<Link>` children.
- **Ghost / Outline Hover**: Uses `accent/10` background tint (not solid accent) to keep text readable on hover.

---


