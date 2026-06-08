# ChatApp Demo

A fully client-side, static-frontend chat application that simulates real-time messaging entirely within the browser. No backend, no database, no external services — just **localStorage** for persistence and the **BroadcastChannel API** for cross-tab communication.

Open two browser tabs, log in as different demo users, and chat in real time.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | [Vite](https://vitejs.dev/) 6 |
| UI Library | [React](https://react.dev/) 19 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| Routing | [React Router](https://reactrouter.com/) v7 |
| Icons | [Lucide React](https://lucide.dev/) |
| Real-Time Simulation | BroadcastChannel API |
| Persistence | localStorage (in-memory repository synced on write) |

---

## Setup

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## Demo Usage

1. Open `http://localhost:5173` in **two separate browser tabs** (same browser).
2. In the first tab, log in as **Alice Demo** (or any pre-seeded demo user).
3. In the second tab, log in as **Bob Test**.
4. Start a conversation — messages, typing indicators, and read receipts propagate between tabs in real time via BroadcastChannel.

Pre-seeded demo accounts:

| Username | Display Name |
|---|---|
| `alice` | Alice Demo |
| `bob` | Bob Test |
| `charlie` | Charlie Mock |
| `diana` | Diana Fake |
| `eve` | Eve Example |

---

## Build

```bash
npm run build
```

Static assets are output to the `dist/` directory, ready for deployment to any static host (Vercel, Netlify, etc.).

---

## License

Private — all rights reserved.