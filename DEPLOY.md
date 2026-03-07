# Deploy Wedding RSVP lên Render.com

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
| **Build Command** | `npm install && npm run build` |
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

## Dùng Blueprint (render.yaml)

Nếu trong repo đã có file **`render.yaml`** ở root (cùng cấp với thư mục `frontend`):

1. Trên Render: **New** → **Blueprint**.
2. Chọn repo chứa `render.yaml`.
3. Render sẽ tạo sẵn Web Service theo file đó. Chỉ cần thêm biến **NEXT_PUBLIC_API_URL** (nếu có backend) trong tab **Environment** của service vừa tạo, rồi Deploy.

---

## Lưu ý

- **Free tier:** Service có thể “ngủ” sau ~15 phút không truy cập, lần mở đầu có thể chậm vài chục giây.
- **Ảnh địa chỉ nhà hàng:** File `public/dia-chi-nha-hang.png` nằm trong repo sẽ được deploy theo; đảm bảo đã add và commit file này.
- **Backend:** Form gửi RSVP, Export CSV và Generate QR phụ thuộc API. Cần deploy backend và cấu **NEXT_PUBLIC_API_URL** đúng thì mới dùng đầy đủ được.

---

## Tóm tắt nhanh

1. Push code (có `frontend/` + `render.yaml`) lên GitHub/GitLab.  
2. Render → New → Web Service (hoặc Blueprint) → chọn repo.  
3. Root Directory: `frontend`.  
4. Build: `npm install && npm run build`, Start: `npm start`.  
5. Thêm env `NEXT_PUBLIC_API_URL` = URL backend (nếu có).  
6. Deploy và dùng link Render cấp.
