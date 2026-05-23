# Abu Muhammad Azan — Backend & Admin Panel

## Setup Instructions

### 1. Install Node.js
Download from https://nodejs.org (v18 or higher)

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Create .env file
Copy `.env.example` to `.env` and fill in:

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | Free cluster at mongodb.com/atlas |
| `JWT_SECRET` | Any long random string |
| `ADMIN_PASSWORD` | Your chosen password |
| `CLOUDINARY_*` | Free account at cloudinary.com |

### 4. Run the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 5. Open Admin Panel
Visit: **http://localhost:5000/admin**

Default login:
- Username: `admin`
- Password: whatever you set in `.env` (default: `Admin@2024!`)

**⚠️ Change the password immediately after first login!**

---

## API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `GET  /api/auth/verify` — Verify token
- `POST /api/auth/change-password` — Change password

### Gallery
- `GET    /api/gallery` — Get all images (public)
- `POST   /api/gallery/upload` — Upload images (admin)
- `PUT    /api/gallery/:id` — Update caption/category (admin)
- `DELETE /api/gallery/:id` — Delete image (admin)
- `POST   /api/gallery/bulk/delete` — Delete multiple (admin)
- `PUT    /api/gallery/reorder/all` — Reorder (admin)

### Inquiries
- `POST /api/inquiries` — Submit inquiry (public)
- `GET  /api/inquiries` — Get all inquiries (admin)
- `GET  /api/inquiries/:id` — Get one inquiry (admin)
- `PUT  /api/inquiries/:id` — Update status/notes (admin)
- `DELETE /api/inquiries/:id` — Delete (admin)
- `GET  /api/inquiries/export/excel` — Export to Excel (admin)

### Content
- `GET /api/content` — Get content (public)
- `PUT /api/content` — Update content (admin)

---

## Deployment (Railway / Render)

1. Push to GitHub
2. Connect repo to Railway.app or Render.com
3. Set all `.env` variables in the dashboard
4. Deploy — your admin panel will be at `yourapp.railway.app/admin`
