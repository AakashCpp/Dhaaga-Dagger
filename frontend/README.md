# DenimKart

Responsive React and Vite storefront with a component-based admin operations panel.

## Local development

From the repository root:

    cd frontend
    npm install
    npm run dev

Customer storefront: http://127.0.0.1:5173/

Customer authentication: http://127.0.0.1:5173/#auth

Admin entry: http://127.0.0.1:5173/#admin

## Application structure

- `src/App.tsx` only composes routes and page-level navigation.
- `src/app` owns route parsing and storefront controller orchestration.
- `src/storefront/pages` and `src/storefront/components` own customer UI.
- `src/auth/pages` owns authentication UI; `src/services/firebase/authRegistry.ts` accepts the production Firebase adapter.
- `src/admin/pages` and `src/admin/components` own operations UI.
- `src/store` owns Redux Toolkit state for catalog, cart, account, likes, and purchase history.

## Data architecture

- Redux Toolkit is the source of truth for catalog, cart, likes, customer profile, and purchase history.
- CatalogRepository isolates current catalog persistence from UI components; Redux keeps the admin and storefront synchronized.
- The current local adapters keep this frontend-only prototype functional and persist preview state in localStorage.
- Firebase contracts live in src/services/firebase. A future adapter can implement authentication, Firestore catalog/profile/order records, realtime subscriptions, and Storage uploads without rewriting the product editor, profile, or storefront.
- Uploaded images are optimized in the browser for the local prototype. A Firebase adapter should upload the original File, then store the returned Storage URL in the product gallery.
- Bundled photographic assets use compressed JPEG delivery variants to avoid blocking first interaction with multi-megabyte source PNG files.

## Firebase preparation

1. Copy .env.example to .env.local.
2. Add Firebase web app environment values.
3. Install the Firebase SDK when backend work starts.
4. Implement the interfaces in `src/services/firebase/contracts.ts`.
5. Register the Firebase auth implementation with `registerAuthGateway` during application bootstrap.
6. Subscribe to the remote gateways after authentication and dispatch `replaceCatalog` / `hydrateCustomer` into the Redux store.

Keep Firebase security rules authoritative. Admin authorization must be based on verified custom claims, not a client-side route check.

## Vercel

The frontend includes `vercel.json` with Vite build settings and SPA rewrites. Set the Vercel Root Directory to `frontend`.

    npm run build

Deploy the repository to Vercel and add the VITE_FIREBASE values in Project Settings when Firebase is connected.
