# Brave the Waves — Frontend

This adds a Vite + React scaffold and copies the existing components into `src/` so you can build and deploy the site.

Quick start

1. Install dependencies:

```powershell
cd c:/Users/antho/Downloads/btw-frontend
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Build for production:

```powershell
npm run build
```

Deploy

- For Vercel: create a new Vercel project pointing to this repo — Vercel will run `npm run build` and deploy the `dist` output.
- For Netlify: set build command to `npm run build` and publish directory to `dist`.

Notes

- This scaffold includes Tailwind CSS (basic setup) so the existing utility classes will work.
- I created minimal `ui` wrappers (Button, Input, Textarea, Card, Label) to satisfy imports; you can replace them with your design system later.
