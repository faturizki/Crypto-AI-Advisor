# Crypto AI Advisor Dashboard

Modern Next.js frontend for cryptocurrency token analysis and AI scoring.

## Features

- Real-time token data from Supabase
- Advanced filtering by score, volume, and chain
- Full-text search across token names and chains
- Responsive table design optimized for desktop and mobile
- Live data updates via Supabase real-time subscriptions
- High-potential token highlighting
- Professional dark theme with Tailwind CSS

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with header/footer
│   ├── page.tsx        # Main dashboard page
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Statistics and title
│   ├── FilterBar.tsx   # Filter controls
│   └── TokenTable.tsx  # Token display table
├── hooks/
│   └── useTokens.ts    # Data fetching hook
└── types.ts            # TypeScript definitions
```

## Key Components

### TokenTable

Displays tokens in a sortable, filterable table

### FilterBar

Provides controls for score threshold, volume, chains, and search

### Header

Shows dashboard statistics and last update time

## Real-time Updates

The dashboard automatically refreshes data:

- Every 5 minutes via polling
- Instantly when database changes via Supabase subscriptions
- On-demand using the refresh button
