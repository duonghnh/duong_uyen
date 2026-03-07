# Deploy Wedding RSVP lên Render.com

## Gộp Frontend + Backend thành một app

Dự án đã **gộp API vào Next.js**: backend chạy trong cùng app với frontend (API tại `/api/rsvp`, `/api/generate-qr`, `/api/export-csv`). Bạn **chỉ cần deploy 1 Web Service** (thư mục `frontend`).

| Service          | Vai trò              | Root Directory | URL ví dụ                        |
|------------------|----------------------|----------------|----------------------------------|
| **wedding-rsvp** | Frontend + API + DB  | `frontend`     | https://wedding-rsvp.onrender.com |

- **Không cần** deploy riêng backend; không cần cấu `NEXT_PUBLIC_API_URL`. Database: SQLite `wedding.db` trong `frontend` (có thể mất khi redeploy).
- Render **chạy cả hai cùng lúc** (khi deploy 2 service riêng): mỗi service là một container riêng, luôn bật (hoặc “ngủ” rồi thức khi có request trên free tier).
- Frontend gọi Backend qua URL: bạn cấu **NEXT_PUBLIC_API_URL** = URL của backend, và **FRONTEND_URL** = URL của frontend.
- Cách đơn giản nhất: dùng **Blueprint** (một lần tạo cả 2 service từ `render.yaml`), rồi thêm 2 biến môi trường trên.

---

## Chuẩn bị

1. **Đẩy code lên GitHub/GitLab**
   - Tạo repo (ví dụ: `wedding-rsvp`)
   - Đẩy toàn bộ thư mục dự án (có cả `frontend/` và `render.yaml` ở root)

2. **Backend API (nếu có)**
   - Ứng dụng gọi API qua biến `NEXT_PUBLIC_API_URL` (mặc định `http://localhost:5000`).
   - Nếu bạn có backend riêng (Express, Flask…), deploy backend trước, lấy URL (ví dụ `https://wedding-api.onrender.com`) để điền vào bước 5.

---

## Các bước deploy trên Render

### 1. Đăng nhập Render

- Vào [render.com](https://render.com) → đăng ký/đăng nhập (có thể dùng GitHub).

### 2. Tạo Web Service mới

- Dashboard → **New** → **Web Service**.
- Kết nối repository GitHub/GitLab của bạn và chọn repo **wedding-rsvp** (hoặc tên repo bạn tạo).

### 3. Cấu hình dịch vụ

Nếu repo có file **`render.yaml`** ở root, Render có thể tự điền sẵn. Nếu không, nhập tay:

| Mục | Giá trị |
|-----|--------|
| **Name** | `wedding-rsvp` (hoặc tên bạn thích) |
| **Region** | Singapore (gần VN) hoặc Oregon |
| **Root Directory** | `frontend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` (dùng **npm**, không gõ nhầm thành `buildyarn`) |
| **Start Command** | `npm start` |

### 4. Biến môi trường (Environment)

Trong **Environment** (Environment Variables):

- **Nếu đã có backend deploy trên Render (hoặc nơi khác):**
  - Key: `NEXT_PUBLIC_API_URL`  
  - Value: URL backend (ví dụ: `https://wedding-api.onrender.com`), **không** có dấu `/` ở cuối.

- **Nếu chưa có backend:**  
  Có thể để trống hoặc tạm thời không thêm. Form RSVP, Admin, QR sẽ báo lỗi khi gọi API cho đến khi bạn deploy backend và cập nhật `NEXT_PUBLIC_API_URL`.

### 5. Deploy

- Bấm **Create Web Service**.
- Render sẽ clone repo, chạy build trong thư mục `frontend`, rồi chạy `npm start`.
- Khi build xanh, bạn có link dạng: `https://wedding-rsvp.onrender.com`.

---

## Deploy chỉ Backend (từng bước)

Nếu bạn muốn tạo **riêng** một Web Service cho backend (không dùng Blueprint):

1. Vào [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**.
2. Kết nối repo GitHub (vd: `duonghnh/duong_uyen`) và chọn repo đó.
3. Điền cấu hình:
   - **Name:** `wedding-rsvp-api` (hoặc tên bạn thích).
   - **Region:** Singapore hoặc Oregon.
   - **Root Directory:** `backend` ← **bắt buộc** (để Render dùng code trong thư mục `backend`).
   - **Runtime:** Node.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment (tùy chọn):**
   - `FRONTEND_URL` = URL frontend (vd: `https://wedding-rsvp.onrender.com`) để API biết domain frontend (dùng cho QR, CORS).
5. Bấm **Create Web Service** → đợi deploy xong.
6. Copy **URL** của backend (vd: `https://wedding-rsvp-api.onrender.com`), dùng để cấu **NEXT_PUBLIC_API_URL** cho service frontend (xem mục Blueprint bên dưới).

---

## Dùng Blueprint (render.yaml) – Frontend + Backend cùng lúc

Repo có sẵn **2 service** trong `render.yaml`: **wedding-rsvp** (frontend) và **wedding-rsvp-api** (backend).

1. Trên Render: **New** → **Blueprint** → chọn repo.
2. Render tạo 2 Web Service. Đợi cả hai deploy xong.
3. **Quan trọng – tránh lỗi "Failed to fetch" khi Submit:**
   - Vào service **wedding-rsvp** (frontend) → **Environment** → thêm:
     - `NEXT_PUBLIC_API_URL` = **URL của backend** (ví dụ: `https://wedding-rsvp-api.onrender.com`, không có `/` ở cuối).
   - Vào service **wedding-rsvp-api** (backend) → **Environment** → thêm:
     - `FRONTEND_URL` = **URL của frontend** (ví dụ: `https://wedding-rsvp.onrender.com`).
4. **Redeploy** cả hai service sau khi thêm biến môi trường (để frontend build lại với `NEXT_PUBLIC_API_URL` mới).

---

## Lưu ý

- **Free tier:** Service có thể “ngủ” sau ~15 phút không truy cập, lần mở đầu có thể chậm vài chục giây.
- **Ảnh địa chỉ nhà hàng:** File `public/dia-chi-nha-hang.png` nằm trong repo sẽ được deploy theo; đảm bảo đã add và commit file này.
- **Backend:** Form gửi RSVP, Export CSV và Generate QR phụ thuộc API. Cần deploy backend và cấu **NEXT_PUBLIC_API_URL** đúng thì mới dùng đầy đủ được.
- **Lỗi "Failed to fetch" khi Submit:** Thường do frontend không gọi đúng backend. Kiểm tra service **wedding-rsvp** đã có biến `NEXT_PUBLIC_API_URL` = URL backend chưa, sau đó **Redeploy** frontend.

---

## Tóm tắt nhanh

1. Push code (có `frontend/` + `render.yaml`) lên GitHub/GitLab.  
2. Render → New → Web Service (hoặc Blueprint) → chọn repo.  
3. Root Directory: `frontend`.  
4. Build: `npm install && npm run build`, Start: `npm start`.  
5. Thêm env `NEXT_PUBLIC_API_URL` = URL backend (nếu có).  
6. Deploy và dùng link Render cấp.
