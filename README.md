# 🏢 Hệ thống Quản lý Số Khu phố 25 - Long Trường

Ứng dụng quản lý dân cư, an ninh và hành chính thông minh, tích hợp trợ lý AI Gemini. Sẵn sàng triển khai thực tế cho các khu phố tại TP. Thủ Đức.

## 🚀 Quy trình triển khai (Chỉ mất 5 phút)

### Bước 1: Đưa mã nguồn lên GitHub
1. Tạo một Repository mới trên [GitHub](https://github.com).
2. Mở Terminal tại thư mục dự án này và chạy các lệnh sau:
   ```bash
   # 1. Khởi tạo Git
   git init

   # 2. Thêm tất cả file (Đảm bảo đã có file .gitignore chuẩn)
   git add .

   # 3. Lưu thay đổi (Bắt buộc phải có tin nhắn trong ngoặc kép)
   git commit -m "Phát hành phiên bản triển khai thực tế"

   # 4. Chuyển tên nhánh mặc định thành main
   git branch -M main

   # 5. Kết nối với GitHub (Thay link bằng link Repo của bạn)
   git remote add origin https://github.com/Taiphan2704/kp25-digital-management.git

   # 6. Đẩy mã nguồn lên
   git push -u origin main
   ```

### 💡 Khắc phục lỗi phổ biến
- **Lỗi "src refspec main does not match any":** Do bạn chưa chạy lệnh `git commit` trước khi push. Hãy chạy `git commit -m "nội dung"` rồi thử lại.
- **Lỗi "remote origin already exists":** Do bạn đã kết nối rồi. Hãy bỏ qua bước `git remote add` và chạy thẳng lệnh `git push`.

### Bước 2: Triển khai lên Render.com
1. Đăng nhập [Render](https://render.com) bằng tài khoản GitHub.
2. Chọn **New +** -> **Static Site**.
3. Kết nối với Repository vừa tạo.
4. Cấu hình cài đặt:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. **Quan trọng (Cấu hình AI):** Nhấn **Advanced** -> **Add Environment Variable**:
   - **Key**: `API_KEY`
   - **Value**: (Dán Gemini API Key lấy tại [AI Studio](https://aistudio.google.com/))
6. Nhấn **Create Static Site**.

## 🛠 Công nghệ sử dụng
- **Frontend**: React 19, TypeScript, Tailwind CSS.
- **AI**: Google Gemini API (gemini-3-flash-preview).
- **Icons**: Lucide React.
- **Charts**: Recharts.

---
*Phát triển bởi Senior Full-stack Engineer & Smart City Architect.*