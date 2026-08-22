# Dhaaga & Dagger backend

Node.js API for the storefront and admin workspace. It provides Firebase-verified customer authentication, email-code admin authentication, MongoDB-backed catalog/customer/cart/wishlist/orders/notifications, managed product uploads, health endpoints, and Socket.IO updates.

## Local setup

1. Install and start MongoDB locally on `mongodb://127.0.0.1:27017`.
2. Copy `.env.example` to `.env` and adjust values if required.
3. Run `npm install`.
4. Run `npm run dev`.
5. Run `npm run seed` once to insert the missing default Jeans and Henley catalog products. The seed is idempotent and does not overwrite admin edits.

The API starts at `http://localhost:5000`. The frontend defaults to this address.

## Endpoints

- `GET /api/v1/health` — process and database status.
- `GET /api/v1/health/ready` — readiness check; returns 503 until MongoDB connects.
- `GET /api/v1/auth/customer/session` — verify a Firebase customer ID token and sync the user.
- `POST /api/v1/auth/admin/request-code` — send a code to the configured admin email.
- `POST /api/v1/auth/admin/verify-code` — exchange a valid code for an admin JWT.
- `GET /api/v1/auth/admin/session` — validate an admin JWT.
- `GET /api/v1/products` — active customer catalog; supports `category`, `fit`, and `search` query filters.
- `GET|POST /api/v1/admin/products` and `PUT|DELETE /api/v1/admin/products/:id` — admin catalog management.
- `GET /api/v1/customers/me` — synchronized customer profile, cart, wishlist and purchases.
- `PUT /api/v1/customers/me/cart|wishlist|checkout` and `PATCH /api/v1/customers/me/profile` — customer state mutations.
- `GET /api/v1/orders` — recent orders; admin token required.
- `GET /api/v1/orders/mine` — current customer's orders.
- `POST /api/v1/orders` — validate price/stock on the server, reserve inventory, persist and broadcast an order.
- `PATCH /api/v1/orders/:id/status` — sequential admin fulfilment update.
- `POST /api/v1/uploads/product-image` — admin image upload (local in development, Cloudinary in production).
- `GET /api/v1/notifications` — latest admin notifications.
- `POST /api/v1/notifications` — create and broadcast a notification.
- `PATCH /api/v1/notifications/:id/read` — mark one notification read.
- `PATCH /api/v1/notifications/read-all` — mark all notifications read.

Catalog records include a top-level `category` (`Jeans` or `Henley`) and a validated category-specific `subtype`. The API rejects mismatched combinations, while the admin product editor switches both subtype options and size systems when the category changes.

## Realtime events

- `notification:new`
- `order:created`
- `order:updated`
- `catalog:updated`
- `realtime:ready`

Socket.IO runs with the normal Node server. Vercel serverless functions can host the HTTP API, but they do not provide a durable WebSocket process. For exact live multi-system updates, deploy this backend to a persistent Node host such as Railway, Render, Fly.io, or a VM. The frontend also polls periodically, so notifications still refresh on a serverless HTTP deployment.

## Deployment environment

Set these variables on the backend host:

- `MONGODB_URI` — use MongoDB Atlas or another network-accessible MongoDB URI in production.
- `CLIENT_ORIGINS` — comma-separated frontend origins.
- `NODE_ENV=production`
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — Firebase service-account credentials used only by the backend.
- `ADMIN_EMAIL` — the only email permitted to request admin access.
- `ADMIN_OTP_SECRET` and `ADMIN_JWT_SECRET` — separate long random secrets.
- `MAIL_MODE=smtp`, plus `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`.
- `UPLOAD_PROVIDER=cloudinary`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
- `PUBLIC_API_URL` — public backend origin used only for local-upload URLs.

For Gmail SMTP, use an app password rather than the Google account password. In local development, `MAIL_MODE=console` returns and logs a development code; this behavior is disabled when `NODE_ENV=production`.

For real admin OTP delivery, set `ADMIN_EMAIL` to the only authorized inbox, set `SMTP_USER` to the sending mailbox, add its `SMTP_PASS`, and switch `MAIL_MODE=smtp`. Production refuses to start an admin OTP request when SMTP or strong OTP/JWT secrets are missing; a code is deleted if delivery fails, so an unsent code can never be verified.

For exact Socket.IO updates across multiple admin systems, deploy with the root `render.yaml`, included Dockerfile, or another persistent Node host. Vercel can serve the HTTP API, but its serverless runtime is not a durable Socket.IO host. Do not use localhost MongoDB or local image storage in production.

## Firebase setup

Create a Firebase project, enable Google in Authentication → Sign-in method, and add the local and deployed frontend domains to Authorized domains. Put the Firebase web configuration in `frontend/.env` and a Firebase service account in `backend/.env`. Never place the service-account private key in the frontend.
