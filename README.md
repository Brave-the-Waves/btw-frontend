# Brave the Waves — Frontend

The official web platform for **Brave the Waves**, a dragon boat fundraising event raising money for breast cancer awareness. This repo contains the React frontend, hosted on Firebase Hosting.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 7](https://vitejs.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Routing | [React Router v7](https://reactrouter.com/) |
| Animations | [Framer Motion](https://www.framer-motion.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Auth & Storage | [Firebase](https://firebase.google.com/) (Auth + Firestore Storage) |
| Payments | [Stripe](https://stripe.com/) (via backend checkout sessions) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| Signatures | [react-signature-canvas](https://www.npmjs.com/package/react-signature-canvas) |
| Email | [EmailJS](https://www.emailjs.com/) |
| Deployment | [Firebase Hosting](https://firebase.google.com/docs/hosting) |

The backend is a separate Node.js/Express service running on **Google Cloud Run**. This frontend communicates with it via `VITE_BACKEND_URL`.

---

## Project Structure

```
src/
├── assets/           # Static images and media
├── components/
│   ├── home/         # Landing page sections (Hero, About, Donate, EventInfo, etc.)
│   ├── teams/        # Team creation, joining, member display
│   ├── users/        # Profile cards, donation buttons, waiver overlay
│   └── ui/           # Base UI primitives (Button, Input, Card…)
├── contexts/
│   └── AuthContext.jsx  # Global auth state (Firebase + backend sync)
├── pages/            # Route-level page components
├── config.js         # API_BASE_URL (switches local ↔ production)
├── firebase.js       # Firebase app initialisation
└── main.jsx          # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Firebase project (Auth + Storage enabled)
- The [btw-backend](https://github.com/your-org/btw-backend) service running locally or pointed to production

### 1. Clone & install

```bash
git clone https://github.com/your-org/btw-frontend.git
cd btw-frontend
npm install
```

### 2. Configure environment

Create a `.env` file at the project root:

```env
VITE_USE_LOCAL_BACKEND=false
VITE_BACKEND_URL=https://your-cloud-run-url.run.app

# Firebase config
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Set `VITE_USE_LOCAL_BACKEND=true` and `VITE_LOCAL_PORT=http://localhost:8080` to point at a local backend instance instead.

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Test Stripe webhooks locally (optional)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward events to the local backend:

```bash
stripe listen --forward-to localhost:8080/api/stripe-webhook
```

---

## Building & Deploying

### Build for production

```bash
npm run build
```

This runs Vite's production build with automatic image optimisation (via `sharp`). Output goes to `dist/`.

### Deploy to Firebase Hosting

```bash
npx firebase deploy --only hosting
```

> **Important:** Always run `npm run build` before deploying. Vite bakes environment variables at build time — stale builds will use whatever `VITE_BACKEND_URL` was set when they were last compiled.

Cache headers (configured in `firebase.json`):
- `index.html` — `no-cache, no-store, must-revalidate` (ensures users always get the latest build)
- `/assets/**` — `public, max-age=31536000, immutable` (hashed filenames, safe to cache forever)

---

## Key Concepts

### Authentication flow

1. User signs in via Firebase Auth (email/password or Google)
2. `AuthContext` immediately sets basic user state from the Firebase token
3. A backend sync call (`POST /api/users/sync`) upserts the user in MongoDB
4. `fetchBackendUser` fetches the full user profile, registration status, and waiver status, merging them into React context

### Environment switching

`src/config.js` exports `API_BASE_URL`:
```js
USE_LOCAL_BACKEND ? `http://localhost:${LOCAL_PORT}` : VITE_BACKEND_URL
```
All API calls in the app go through this variable — never hardcode backend URLs.

### Waiver reminder

Registered users who haven't signed their waiver see a dismissible pink banner at the top of every page (`WaiverReminderBanner`). Dismissing resets on each new page load.
