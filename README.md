# Wedding RSVP Website

Website xác nhận tham dự đám cưới với QR code, form đăng ký và admin dashboard.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TailwindCSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: SQLite
- **QR Code**: qrcode library

## Chạy local (development)

**Cần chạy cả Backend và Frontend** thì form RSVP mới gửi được. Nếu chỉ chạy frontend sẽ báo lỗi "Không thể kết nối máy chủ".

### Bước 1 – Chạy Backend (terminal 1)

```bash
cd backend
npm install
npm run dev
```

Kiểm tra: mở http://localhost:5000 — không báo lỗi là được. Server API chạy tại đây.

### Bước 2 – Chạy Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:3000 và thử gửi form.

### Nếu vẫn lỗi "Không thể kết nối máy chủ"

1. **Backend có đang chạy không?**  
   - Mở http://localhost:5000 trên trình duyệt. Nếu không mở được hoặc lỗi → chạy backend (terminal 1: `cd backend && npm run dev`).  
   - Nếu khi chạy backend báo **EADDRINUSE: port 5000** → đã có tiến trình dùng port 5000 (tắt app đó hoặc đổi port backend trong `backend/.env`: `PORT=5001`), rồi trong `frontend/.env.local` đặt `NEXT_PUBLIC_API_URL=http://localhost:5001`.

2. **Frontend có trỏ đúng API không?**  
   Trong `frontend/` tạo hoặc sửa file `.env.local` (chỉ 1 dòng):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
   Nếu backend chạy port khác (vd: 5001) thì dùng `http://localhost:5001`.  
   Sau đó **restart** frontend (Ctrl+C rồi chạy lại `npm run dev`).

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
