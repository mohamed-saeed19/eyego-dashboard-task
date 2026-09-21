# Eyego Dashboard Task

An enterprise orders management and operations analytics dashboard built with Next.js (App Router), Redux Toolkit, TanStack Table, Recharts, and Tailwind CSS.

## Features

- **Authentication & Route Protection**: Mock login flow with cookie + localStorage synchronization, secured routes via Next.js middleware.
- **State Management**: Redux Toolkit for auth and table state (sorting, global search, multi-field filters, pagination).
- **Interactive Data Table**: Powered by `@tanstack/react-table` headless logic with shadcn UI styling, sortable columns, and responsive stacked cards on mobile.
- **Real-Time Visualizations**: Recharts bar chart dynamically reacting to active table filters.
- **Client-Side Export**: Export currently filtered datasets directly to Excel (`.xlsx`) or PDF (`.pdf`) via dynamic imports.
- **Production & Docker Ready**: Next.js standalone output with a multi-stage Dockerfile and Docker Compose setup.

---

## Demo Credentials

- **Email**: `test@example.com`
- **Password**: `123456`

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose (optional, for containerized deployment)

### Local Development

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd eyego-dashboard-task
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Running via Docker Compose

Run the production build in a containerized environment:

```bash
docker compose up --build
```

Access the application at [http://localhost:3000](http://localhost:3000).

To stop the container:

```bash
docker compose down
```

---

## Technical Decisions & Write-Up

### Why Mocked Authentication
The authentication service is mocked via a Next.js route handler (`/api/login`) with simulated network latency (800ms) to mirror realistic network behavior without requiring external database dependencies. Tokens are synchronized to both `localStorage` and `document.cookie`, allowing client-side Redux checks and server-side middleware route guards to stay in sync.

### Why Redux Toolkit for Table State
Managing sorting, filters, search queries, and pagination in a centralized Redux slice (`tableSlice`) ensures:
- Shared state between the table and chart without prop drilling.
- Easy state persistence and testing.
- Single source of truth for dynamic exports (Excel and PDF).

### Why Recharts
Recharts provides a composable, SVG-based declarative API designed for React with seamless support for responsive containers, customizable tooltips, and SVG gradient styling.

### Folder Structure Overview

```
src/
├── app/
│   ├── api/login/route.ts        # Mock login route handler
│   ├── dashboard/page.tsx        # Dashboard metrics & layout
│   ├── login/page.tsx            # Login UI form
│   ├── globals.css               # Global tokens and styles
│   ├── layout.tsx                # Root layout with Redux provider
│   └── page.tsx                  # Root redirect handler
├── components/
│   ├── dashboard/
│   │   ├── AnalyticsCharts.tsx   # Recharts visualization
│   │   ├── OrderMobileCard.tsx   # Mobile card layout
│   │   ├── OrdersTable.tsx       # Data table container & filters
│   │   └── OrdersTableColumns.tsx# Headless column definitions
│   └── ui/                       # Base UI primitives
├── lib/
│   ├── data/mockOrders.ts        # Order records mock dataset
│   ├── features/
│   │   ├── authSlice.ts          # Auth slice & login thunk
│   │   └── tableSlice.ts         # Table state & filter reducers
│   ├── exportUtils.ts            # Dynamic Excel & PDF exporters
│   ├── hooks.ts                  # Typed Redux hooks
│   ├── store.ts                  # Store configuration
│   └── utils.ts                  # Formatting & filtering helpers
├── middleware.ts                 # Server-side route protection
└── types/
    └── index.ts                  # Centralized TypeScript models
```
