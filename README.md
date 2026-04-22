# DRAPE — Luxury Fashion E-Commerce

Full-stack MERN application for a premium Tunisian fashion brand.

## Tech Stack
- **Backend**: Node.js + Express + MongoDB (Mongoose) + JWT Auth
- **Frontend**: React (Vite) + Tailwind CSS + React Router v6
- **Images**: Cloudinary
- **WhatsApp**: Whapi.Cloud (free sandbox)
- **Deploy**: Vercel (frontend) + Railway/Render (backend)

---

## Quick Start

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Configure Environment

**server/.env** (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_32chars
JWT_REFRESH_SECRET=your_refresh_secret_32chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
WHAPI_TOKEN=your_whapi_token
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**client/.env**:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- Admin: `admin@drape.tn` / `Admin123!`
- Client 1: `sarra@example.com` / `Client123!`
- Client 2: `youssef@example.com` / `Client123!`
- 12 products across all 4 categories
- 3 sample orders
- 5 sample notifications

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api

---

## 📱 WhatsApp Notifications Setup (Whapi.Cloud — Free)

Clients automatically receive WhatsApp messages when their order status changes. Zero setup needed on the client side.

### Admin Setup (one-time, 5 minutes):

1. Go to [https://app.whapi.cloud](https://app.whapi.cloud) → Create free account
2. Click **"New Channel"** → Scan QR code with your **WhatsApp Business app**  
   *(same way you link WhatsApp Web — scan once, stays linked)*
3. Copy the **API Token** from your channel dashboard
4. Paste it in `server/.env`:  
   ```
   WHAPI_TOKEN=your_token_here
   ```
5. Redeploy backend

**That's it!** Clients will now automatically receive WhatsApp messages in French when:
- ✅ Order confirmed
- 🚚 Order shipped  
- ✅ Order delivered
- ❌ Order cancelled

**Free plan**: 150 messages/day — sufficient for a growing store.  
Upgrade at [https://whapi.cloud/price](https://whapi.cloud/price) when needed.

---

## Deployment

### Frontend → Vercel

1. Push `client/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set `VITE_API_URL=https://your-backend.railway.app/api` in Vercel environment variables
4. The `vercel.json` file handles SPA routing automatically

### Backend → Railway or Render

1. Push `server/` to GitHub
2. Create new service on Railway/Render
3. Add all `.env` variables in the platform dashboard
4. Set start command: `node server.js`
5. Railway auto-detects `package.json` and runs `npm start`

### CORS Configuration

In `server/.env`, set:
```
CLIENT_URL=https://your-app.vercel.app
```

---

## Project Structure

```
/
├── client/                    # React Vite frontend
│   ├── src/
│   │   ├── components/        # Navbar, CartDrawer, ProductCard, etc.
│   │   ├── contexts/          # AuthContext, CartContext
│   │   ├── pages/             # Route-level components
│   │   │   └── admin/         # Admin panel pages
│   │   └── utils/
│   │       └── api.js         # Axios instance with auto token refresh
│   └── vercel.json
│
└── server/                    # Express API
    ├── config/                # DB + Cloudinary config
    ├── controllers/           # Route handlers
    ├── middleware/            # Auth, error handler, upload
    ├── models/                # Mongoose schemas
    ├── routes/                # Express routers
    ├── scripts/
    │   └── seed.js            # Database seeder
    └── services/
        └── whatsappService.js # Whapi.Cloud integration
```

---

## API Reference

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh-token` | Cookie |
| GET | `/api/products` | Public |
| POST | `/api/products` | Admin |
| POST | `/api/orders` | Client |
| PATCH | `/api/orders/:id/status` | Admin → triggers WhatsApp |
| GET | `/api/notifications/my` | Client |

---

## Design System

| Token | Value |
|-------|-------|
| `--cream` | `#FAF9F6` |
| `--charcoal` | `#1C1C1C` |
| `--gold` | `#C9A84C` |
| Font: headings | Playfair Display |
| Font: body | DM Sans |

---

Made with ♥ for DRAPE — Tunisian luxury fashion
