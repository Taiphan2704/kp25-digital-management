# 🏢 Hệ thống Quản lý Số Khu phố 25 - Long Trường

Ứng dụng quản lý dân cư, an ninh và hành chính thông minh, tích hợp trợ lý AI Gemini. Sẵn sàng triển khai thực tế cho các khu phố tại TP. Thủ Đức.

## 🚀 Quy trình triển khai (Chỉ mất 5 phút)

### Bước 1: Đưa mã nguồn lên GitHub
1. Tạo một Repository mới trên [GitHub](https://github.com) (VD: `kp25-digital-management`).
2. Mở Terminal tại thư mục dự án này và chạy:
   ```bash
   git init
   git add .
   git commit -m "Phát hành phiên bản triển khai thực tế"
   git branch -M main
   git remote add origin https://github.com/TEN_TAI_KHOAN_CUA_BAN/kp25-digital-management.git
   git push -u origin main
   ```

### Bước 2: Triển khai lên Render.com
1. Đăng nhập [Render](https://render.com) bằng tài khoản GitHub.
2. Chọn **New +** -> **Static Site**.
3. Kết nối với Repository vừa tạo.
4. Cấu hình cài đặt:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. **Quan trọng (Cấu hình AI riêng):** Nhấn **Advanced** -> **Add Environment Variable**:
   - **Key**: `API_KEY`
   - **Value**: (Dán Gemini API Key của khu phố đó vào đây - Lấy tại [AI Studio](https://aistudio.google.com/))
6. Nhấn **Create Static Site**.

### Bước 3: Cấu hình cho các khu phố khác
Để mỗi khu phố có một bản cài đặt riêng:
- Chỉ cần "Fork" repository này trên GitHub.
- Thực hiện lại **Bước 2** trên Render và nhập `API_KEY` riêng của khu phố đó.
- Hệ thống sẽ hoàn toàn tách biệt về dữ liệu (localStorage) và chi phí AI.

## 🛠 Công nghệ sử dụng
- **Frontend**: React 19, TypeScript, Tailwind CSS.
- **AI**: Google Gemini API (gemini-3-flash-preview).
- **Icons**: Lucide React.
- **Charts**: Recharts.

---
*Phát triển bởi Senior Full-stack Engineer & Smart City Architect.*
