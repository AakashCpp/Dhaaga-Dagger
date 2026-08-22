# Dhaaga & Dagger

The repository is split into two independently deployable applications:

- `frontend/` — React, Vite and Tailwind storefront plus admin workspace.
- `backend/` — Node.js, Express, MongoDB and Socket.IO API.

## Local development

Start MongoDB, then run the backend and frontend in separate terminals:

```text
cd backend
npm install
npm run dev
```

Seed the default Jeans and Henley catalog once:

```text
npm run seed
```

```text
cd frontend
npm install
npm run dev
```

The frontend uses `http://localhost:5000` by default. Copy `frontend/.env.example` and `backend/.env.example` to their local `.env` files when overriding configuration.

Customer checkout uses Firebase Google authentication. Admin access uses the single `ADMIN_EMAIL` allowlist value from the backend environment and a six-digit email code. There is no admin password stored in the frontend.

The shared catalog model supports `category` plus category-specific `subtype` values. Jeans use Slim, Regular, Skinny, or Relaxed with waist sizing; Henleys use Classic Slub, Waffle Knit, Heavyweight Rib, or Short Sleeve with XS–XXL sizing. The default catalog contains eight Jeans and six Henleys. Catalog changes made in the admin workspace are persisted by MongoDB and broadcast to connected storefront/admin sessions.

## Deployment

Deploy `frontend/` and `backend/` as separate projects and set each project root directory accordingly. Configure the frontend API URLs with the deployed backend origin. See `backend/README.md` for realtime hosting and production MongoDB requirements.

The root `render.yaml` deploys the backend on a persistent Node service (recommended for Socket.IO), and `frontend/vercel.json` configures the Vite SPA on Vercel. GitHub Actions builds the frontend and runs backend checks/tests on every push and pull request.

Frontend deployment variables:

- `VITE_API_URL=https://your-backend.example.com/api/v1`
- `VITE_SOCKET_URL=https://your-backend.example.com`
