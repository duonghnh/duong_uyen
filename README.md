# Wedding RSVP Website

Website xác nhận tham dự đám cưới với QR code, form đăng ký và admin dashboard.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: SQLite
- **QR Code**: qrcode library

## Cài đặt và chạy

### Backend

```bash
cd backend
npm install
npm run dev
```

Server chạy tại: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Website chạy tại: http://localhost:3000

## Tính năng

- ✅ Form xác nhận tham dự với validation
- ✅ Lựa chọn phương tiện di chuyển
- ✅ Animation mượt mà với Framer Motion
- ✅ QR Code generator
- ✅ Admin dashboard với filter và export CSV
- ✅ Responsive mobile-first
- ✅ Romantic pastel theme

## API Endpoints

- `POST /api/rsvp` - Submit RSVP
- `GET /api/rsvp` - Lấy danh sách RSVP
- `GET /api/generate-qr` - Generate QR code

## Deploy

### Backend
- Deploy lên Railway, Render hoặc VPS
- Set environment variables từ `.env.example`

### Frontend
- Deploy lên Vercel
- Update `NEXT_PUBLIC_API_URL` trong `.env.local`
