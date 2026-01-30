


import { GoogleGenAI, Modality } from "@google/genai";

// Helper to safely get API Key
const getApiKey = () => {
    try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            return process.env.API_KEY;
        }
    } catch (e) {
        console.warn("Failed to read process.env");
    }
    return ''; 
};

// HYPER SPEED OPTIMIZATION: Reduce wait times
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// CHANGED: Accept string[] instead of single string
export const generateImage = async (base64ImagesData: string[], prompt: string): Promise<string | null> => {
  const apiKey = getApiKey();

  // --- STRICT CHECK: NGĂN CHẶN TẠO ẢNH NẾU KHÔNG CÓ API KEY ---
  if (!apiKey || apiKey.trim() === '') {
      throw new Error("⚠️ Hệ thống chưa được kích hoạt. Vui lòng kiểm tra cấu hình API Key!");
  }

  // Khởi tạo client trực tiếp với key đã kiểm tra
  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Priority List: 
  // 1. gemini-2.5-flash-image: FLASH SPEED (Primary Choice)
  // 2. gemini-3-pro-image-preview: HIGH QUALITY BACKUP
  const models = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];
  
  const MAX_RETRIES = 2; // Reduced retries for speed
  let lastError: any = null;

  for (const model of models) {
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
        try {
          // console.log(`Attempting to generate image with model: ${model}, attempt ${attempt + 1}`);
          
          // CONSTRUCT MULTI-PART CONTENT FOR ALL UPLOADED IMAGES
          const imageParts = base64ImagesData.map(img => {
               // Extract clean base64 string and mimeType
               const mimeType = img.split(';')[0].split(':')[1];
               const base64Data = img.split(',')[1];
               
               return {
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                  },
               };
          });

          const response = await ai.models.generateContent({
            model: model,
            contents: {
              parts: [
                ...imageParts, // SPREAD ALL IMAGE PARTS
                {
                  text: prompt,
                },
              ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
          });

          const part = response.candidates?.[0]?.content?.parts?.[0];
          if (part && part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            return imageUrl;
          }
          
          throw new Error("API không trả về dữ liệu ảnh (No image data).");

        } catch (error: any) {
          const errorMessage = error.message || '';
          
          // 1. BẮT LỖI PERMISSION DENIED / INVALID KEY NGAY LẬP TỨC
          if (errorMessage.includes('permission denied') || errorMessage.includes('API key not valid') || errorMessage.includes('403')) {
               console.warn(`Model ${model} Permission Error (Skipping): ${errorMessage}`);
               lastError = error; 
               break; // Thoát vòng lặp retry của model hiện tại để thử model tiếp theo
          }

          // 2. Xử lý lỗi quá tải (Overloaded / 503 / 429)
          const isOverloaded = errorMessage.includes('503') || errorMessage.includes('429') || errorMessage.includes('Overloaded');
          
          if (isOverloaded) {
              // SPEED UP: Retry faster (500ms + random) instead of waiting seconds
              const delay = 500 + Math.random() * 500; 
              console.warn(`Model ${model} overloaded. Quick Retry in ${Math.round(delay)}ms...`);
              await wait(delay);
              attempt++;
              continue; // Retry
          } 
          
          // Các lỗi khác
          console.warn(`Failed to generate image with model ${model}:`, errorMessage);
          lastError = error;
          break; // Chuyển sang model tiếp theo
        }
    }
  }

  // console.error("All models failed to generate image.");
  
  // XỬ LÝ THÔNG BÁO LỖI CUỐI CÙNG CHO NGƯỜI DÙNG
  if (lastError) {
      const msg = lastError.message || '';
      
      // Lỗi Quyền Truy Cập (403) - Đây là lỗi bạn đang gặp phải
      if (msg.includes('permission denied') || msg.includes('403') || msg.includes('API key not valid')) {
          throw new Error("⛔ LỖI QUYỀN TRUY CẬP (403): API Key không hợp lệ, chưa bật Billing, hoặc bị giới hạn vùng. Vui lòng kiểm tra tài khoản Google AI Studio.");
      }
      
      // Lỗi Quá Tải
      if (msg.includes('503') || msg.includes('Overloaded')) {
          throw new Error("🐢 Server Google đang quá tải (503). Vui lòng đợi 1 phút rồi thử lại.");
      }
      
      // Lỗi Model không tồn tại hoặc sai tên
      if (msg.includes('not found') || msg.includes('404')) {
           throw new Error("⚠️ Model AI không phản hồi (404). Vui lòng thử lại.");
      }
  }

  // Lỗi mặc định
  throw new Error("Máy chủ AI đang bận hoặc gặp sự cố. Vui lòng thử lại sau giây lát!");
};