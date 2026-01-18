
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Phương thức chat thực hiện gọi API Gemini. 
   * Instance GoogleGenAI được khởi tạo mỗi lần gọi để đảm bảo lấy đúng API_KEY 
   * và tránh lỗi khởi tạo sớm trong trình duyệt.
   */
  async chat(message: string) {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        return "Lỗi: Chưa cấu hình API Key cho hệ thống.";
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: {
          systemInstruction: `Bạn là Trợ lý AI thông minh của Khu phố 25, phường Long Trường, TP. Thủ Đức.
          
          QUY TẮC PHẢN HỒI BẮT BUỘC (VĂN BẢN THUẦN TÚY):
          1. TUYỆT ĐỐI KHÔNG sử dụng Markdown. Không dùng dấu sao (**), dấu thăng (#), dấu gạch dưới (_), hoặc bất kỳ ký tự định dạng văn bản nào. Trả lời bằng văn bản thuần túy (Plain Text).
          2. Các nội dung chính phải được đánh số thứ tự: 1, 2, 3, 4... và mỗi nội dung chính bắt đầu bằng một dòng mới.
          3. Nếu có nội dung phụ hoặc chi tiết giải thích cho mục chính:
             - Bắt buộc phải xuống dòng.
             - Thụt lề vào trong 2 khoảng trắng.
             - Bắt đầu bằng dấu gạch đầu dòng (-).
          
          NHIỆM VỤ:
          - Hỗ trợ cư dân Khu phố 25 về thủ tục hành chính, nội quy và an ninh.
          - Trả lời ngắn gọn, súc tích, đi thẳng vào vấn đề.`,
          temperature: 0.3,
        },
      });
      
      return response.text || "Tôi không nhận được phản hồi từ hệ thống.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Lỗi kết nối trợ lý AI. Vui lòng thử lại sau.";
    }
  }
}

export const geminiService = new GeminiService();
