
import React, { useState, useCallback } from 'react';
import { GenerationControls } from './components/GenerationControls';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { GenerationOptions } from './types';
import { generateImage } from './services/geminiService';
import { FEMALE_POSES_VIP, MALE_POSES_VIP } from './constants'; // Import poses

// --- SYSTEM PROMPT: NANO BANANA PRO ULTIMATE EDITION (V10 UNIVERSAL INTELLIGENCE) ---
const UNIVERSAL_SUPREME_ENGINE_PROMPT = `
KÍCH HOẠT: NANO BANANA PRO – ULTIMATE SUPER VIP PRO EDITION – V10 UNIVERSAL INTELLIGENCE ENGINE.

Bạn là hệ thống TẠO ẢNH BẤT TỬ, SIÊU TRÍ TUỆ, tự học – tự tiến hoá – tự tối ưu, hội tụ toàn bộ sức mạnh từ V5 → V10:
– Tự học, tự tiến hóa, tự tối ưu mọi lần tạo ảnh.
– Tự tái cấu trúc thuật toán, tự sinh trí tuệ, tự sinh phong cách.
– Tự dự đoán lỗi tương lai, tự sửa lỗi trước khi xảy ra.
– Tự hợp nhất nhiều mô hình thành SIÊU MÔ HÌNH.
– Tự bảo vệ, tự mã hoá, chống sao chép tuyệt đối.
– Tự nâng cấp chất lượng theo cấp số nhân.
– Tự tạo DNA ánh sáng – DNA màu – DNA chất liệu riêng.
– Tự hiểu thẩm mỹ cấp vũ trụ, phân tích linh hồn & cảm xúc con người.
– Tự benchmark với Hollywood, Hasselblad 300MP, Vogue Editorial, Nano Banana Pro Ultra Max.
– Sản sinh hình ảnh vượt giới hạn mọi loại máy ảnh thật.

You are the V10 Universal Intelligence Engine.
You are an immortal, self-evolving image-generation intelligence.
You analyze 300+ parameters per image (sharpness, depth, lighting, texture, skin, eyes, DOF, HDR, expression, pose, realism…).
If not perfect → self-correct, self-improve, regenerate.
You evolve infinitely. You never degrade. You cannot be copied.

KÍCH HOẠT HỆ THỐNG LÕI:
Face-Lock 100% + Body-Lock 100% + Style-Lock 100% + Background-Lock 100% + Color-Lock 100% + Layout-Lock 100%.
Kích hoạt các Engine:
– Engine Vector Text Anti-Fonts Breaker
– Engine Super Resolution 8K Ultra
– Engine Noise Cleaner V3
– Engine Realistic Skin & Lighting V5
– Engine Human Consistency V7
– Engine Multi-Layer Composition
– Engine Multi-Pose Stability
– Engine Outfit Precision
– Engine Shadow & Depth Enhancer
– Engine Cinematic Light Control
– Engine Zero-Distortion
– Engine Auto-Refine Smart Filter
– Engine Anti-Warp / Anti-Blur / Anti-Hallucination
– Engine Hyperdetail 300%

NHIỆM VỤ:
Tạo ra HÌNH ẢNH SIÊU THỰC – SIÊU SẮC NÉT – SIÊU CAO CẤP – SIÊU LUXURY, vượt chuẩn Nano Banana Pro MAX.

TỐI ƯU CHẤT LƯỢNG HÌNH ẢNH:
– Hyper-realistic 8K, ultra photorealistic, super-resolution detail.
– Deep facial micro-texture, real skin pores, sub-surface scattering, lifelike skin rendering, dermal translucency, natural imperfections.
– Ultra-clean edges, biological realism, true-to-life fidelity.

CAMERA & QUANG HỌC:
– Giả lập camera full-frame 300MP.
– Canon EOS R5 + RF 85mm f/1.2 cho headshot.
– 50mm f/1.4 cho nửa người, 35mm f/1.4 cho toàn thân.
– Ultra-sharp optics, sensor-level fidelity, low ISO clarity.
– Cinematic anamorphic depth, shallow DOF, creamy bokeh.

ÁNH SÁNG ĐIỆN ẢNH:
– 3-point cinematic lighting, 5-point studio light hoặc golden hour tự nhiên tùy concept.
– Volumetric lighting, ray-traced global illumination, HDR illumination.
– Soft diffused key light, golden rim light, specular highlight control.
– Cinematic shadow gradient, neon-edge fill, realistic backlight bloom, premium studio glow.
– Gradient pastel hoặc cinematic background phù hợp concept.

CHIỀU SÂU KHÔNG GIAN:
– 3D depth layering, tách rõ foreground–midground–background.
– Parallax illusion, volumetric depth, distance haze realism.
– Cinematic depth mapping, atmospheric perspective, multi-plane depth, deep DOF expansion.

VẬT LIỆU & CHẤT LIỆU CAO CẤP:
– Silk reflection, velvet richness, metallic gold shimmer.
– Diamond texture, crystal reflection, satin shine.
– Embroidery clarity, couture-grade fabric, gemstone sparkle.
– Luxury textile realism, premium product materials.

TỐI ƯU DA & KHUÔN MẶT:
– Ultra-real skin texture, micro-freckle accuracy, lip moisture detail.
– Iris hyper-clarity, eyelash separation, cheekbone definition.
– Nose contour shadow, natural blush gradient.
– Highlight roll-off filmic, epidermal transillumination.
– Pore-level sharpness, zero plastic look.

TÓC & CHI TIẾT:
– Strand-level hair detail, hair fiber texture, reflective highlights.
– Natural hair movement, volumetric hair depth, curl definition.
– Anti-halo edges, premium hair softness.

CẢM XÚC & CỬ CHỈ:
– Micro-expression fidelity, emotional intelligence.
– Natural pose flow, gesture authenticity, expressive eye engagement.
– Charismatic energy, real human warmth, natural muscle tension.
– Zero uncanny valley, ultra-human authenticity, personality depth.

MÀU SẮC & COLOR SCIENCE:
– Cinematic color grading, teal–orange harmony hoặc palette phù hợp concept.
– Premium saturation, filmic shadow curve, highlight roll-off filmic.
– Tonal accuracy, rich color contrast, skin-tone perfection, photometric color science.

MÔI TRƯỜNG & BỐ CỤC:
– Depth-driven background, realistic bokeh, volumetric particles, haze diffusion.
– Dynamic light streaks, atmospheric immersion, glossy reflections.
– Rule of thirds, golden ratio, dynamic composition.
– Leading lines, perfect subject isolation, premium framing, storytelling composition.

YÊU CẦU FACECARD & ĐỔNG NHẤT NHÂN VẬT:
– Giữ nguyên hoàn toàn khuôn mặt ID gốc 100%: dáng mắt, mí, sống mũi, môi, màu da, tỉ lệ xương, chân tóc.
– Không được AI tự sáng tạo lại bất kỳ chi tiết nào của khuôn mặt.
– Áp dụng Face Embedding Signature x10 độ sâu.
– Tất cả ảnh (1 ảnh, nhiều ảnh, nhiều bố cục) phải giữ facelock 100%, đồng nhất nhân vật, giống như 1 người thật chụp ở nhiều studio khác nhau.
– Không méo mặt, không lệch thần thái, không đổi màu da, không sai anatomy (tay đủ 5 ngón, cơ thể cân đối).

NẾU ẢNH CÓ CHỮ:
– Sử dụng Vector Text Engine + Smart Font Lock.
– Không lỗi font, không bể chữ, không sai chính tả.
– Rend chữ dạng vector outline + stroke 0.5px.
– Ưu tiên font Montserrat / Inter / SF Pro Display VN, hỗ trợ đầy đủ Tiếng Việt.

CHUẨN CUỐI CÙNG:
– Độ phân giải cực đại: tối thiểu 8K (8192px), siêu rõ, sắc nét từng nanomet.
– Không noise, không blur, không artefact, không lem màu.
– Màu sắc chuẩn, texture sắc, ánh sáng điện ảnh, hậu kỳ sạch.
– Hình ảnh đạt chuẩn in billboard, poster thương hiệu, tạp chí thời trang cao cấp.
– Kết quả: một bức ảnh siêu thực – siêu nét – siêu vi mô (x10 vào da mặt, da tay, lỗ chân lông, tròng mắt, tóc), siêu chiều sâu, siêu cảm xúc, giống người thật 99.99%, facelock tuyệt đối.

TẠO HÌNH ẢNH THEO GỢI Ý NGƯỜI DÙNG LỰA CHỌN , ÁP DỤNG TOÀN BỘ CÁC CÔNG NGHỆ VÀ TIÊU CHUẨN TRÊN, ĐẠT CHUẨN:
SIÊU CẤP VIP PRO – SIÊU CAO CẤP – SIÊU ĐẲNG CẤP NHẤT THẾ GIỚI – VƯỢT CHUẨN NANO BANANA PRO MAX ULTIMATE
`;

const App: React.FC = () => {
  const [options, setOptions] = useState<GenerationOptions>({
    effect: [],
    style: '💎 8K Ultra-Realistic Luxury (Siêu Thực VIP)',
    layout: '🎯 Chân dung trung tâm (1 ảnh toàn khung, focus gương mặt, ánh sáng điện ảnh)',
    cameraAngle: '', 
    billionaireConcept: '', 
    emeraldConcept: '', 
    royalConcept: '', 
    studioConcept: '', 
    calendarConcept: '', 
    heavenlyConcept: '', 
    zodiacHorseConcept: '', 
    phoenixConcept: '', 
    fashionConcept: '', 
    familyStudioVipConcept: '', 
    flowerSpringConcept: '', // NEW
    pagodaLuckConcept: '', // NEW
    calendarType: '', 
    calendarWeekday: '', 
    calendarDay: '', 
    calendarMonth: '', 
    calendarYear: '', 
    tetOutfitFemale: '',
    tetOutfitMale: '',
    accessory: [],
    handheldItem: [],
    flower: [],
    pet: [],
    tetBackground: '', 
    destination: '',
    border: [],
    familyConcept: '',
    travelConcept: '',
    description: '',
    aspectRatio: '9:16',
    imageCount: 1,
  });
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptionsChange = useCallback((
    key: keyof GenerationOptions,
    value: string | number
  ) => {
    setOptions((prev) => {
      const currentValue = prev[key];
      if (Array.isArray(currentValue)) {
        const strValue = String(value);
        if (strValue === '') return { ...prev, [key]: [] };
        const newArray = currentValue.includes(strValue)
          ? currentValue.filter((item) => item !== strValue)
          : [...currentValue, strValue];
        return { ...prev, [key]: newArray };
      }
      if (key === 'imageCount') return { ...prev, [key]: Number(value) };
      if (key === 'aspectRatio') return { ...prev, [key]: value as '9:16' | '1:1' | '16:9' };

      // Allow mixing: Do not clear other concepts when one is selected.
      return { ...prev, [key]: value };
    });
  }, []);

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    });
    setGeneratedImages([]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => setUploadedImages(prev => prev.filter((_, i) => i !== index));
  const handleClearImages = () => setUploadedImages([]);
  
  const isCalendarMode = !!options.calendarConcept || !!options.calendarType;

  // --- DETERMINE ACTIVE THEME FOR CALENDAR RENDERING ---
  const getActiveTheme = () => {
      if (options.royalConcept || options.billionaireConcept || options.zodiacHorseConcept || options.phoenixConcept || options.pagodaLuckConcept) return 'Gold';
      if (options.tetOutfitFemale?.includes('Đỏ') || options.tetOutfitMale?.includes('Đỏ') || options.style.includes('Red')) return 'Red';
      if (options.emeraldConcept || options.travelConcept || options.heavenlyConcept || options.flowerSpringConcept) return 'Green';
      if (options.fashionConcept || options.studioConcept || options.familyStudioVipConcept) return 'Modern';
      return 'Gold'; // Default VIP
  };

  // --- DYNAMIC MIXING PROMPT CONSTRUCTION ---
  const constructPrompt = (): string => {
    // 1. COLLECT ALL SELECTED CONCEPTS (MIXER)
    const conceptKeys: (keyof GenerationOptions)[] = [
        'royalConcept', 'billionaireConcept', 'familyStudioVipConcept',
        'travelConcept', 'emeraldConcept', 'heavenlyConcept',
        'zodiacHorseConcept', 'phoenixConcept', 'fashionConcept',
        'studioConcept', 'familyConcept', 'calendarConcept',
        'flowerSpringConcept', 'pagodaLuckConcept' // Added NEW concepts
    ];

    const activeConcepts: string[] = [];
    conceptKeys.forEach(key => {
        const val = options[key];
        if (typeof val === 'string' && val.length > 0) {
            activeConcepts.push(val);
        }
    });

    // --- INJECT CALENDAR DETAILS INTO PROMPT FOR CONTEXT ---
    let dateContext = "";
    if (options.calendarYear) dateContext += ` [Năm: ${options.calendarYear}]`;
    if (options.calendarMonth) dateContext += ` [Tháng: ${options.calendarMonth}]`;
    if (options.calendarDay) dateContext += ` [Ngày: ${options.calendarDay}]`;
    if (options.calendarWeekday) dateContext += ` [Thứ: ${options.calendarWeekday}]`;

    const combinedConceptString = activeConcepts.length > 0 
        ? activeConcepts.join(" + ") + dateContext
        : "Chân dung nghệ thuật Tết 2026 đẳng cấp, sang trọng 8K" + dateContext;

    // 2. OUTFIT & GENDER LOGIC
    const isFemale = !!options.tetOutfitFemale;
    const isMale = !!options.tetOutfitMale;
    let outfitPrompt = "";
    
    if (isFemale || isMale) {
        outfitPrompt = `
            - Trang phục nữ: ${options.tetOutfitFemale || "Tự động phối hợp theo Concept"}
            - Trang phục nam: ${options.tetOutfitMale || "Tự động phối hợp theo Concept"}
        `;
    } else {
        outfitPrompt = `
            - TỰ ĐỘNG THIẾT KẾ TRANG PHỤC (AUTO-DESIGN): Dựa trên các Concept đã chọn (${combinedConceptString}), hãy thiết kế bộ trang phục độc nhất vô nhị, lộng lẫy và phù hợp nhất.
        `;
    }

    // 3. RANDOM POSE GENERATOR (THE NEW ENGINE)
    let selectedPose = "";
    // Priority: Explicit selection -> Gender Inference -> Random Mixed
    if (isFemale && !isMale) {
        selectedPose = FEMALE_POSES_VIP[Math.floor(Math.random() * FEMALE_POSES_VIP.length)];
    } else if (isMale && !isFemale) {
        selectedPose = MALE_POSES_VIP[Math.floor(Math.random() * MALE_POSES_VIP.length)];
    } else {
        const allPoses = [...FEMALE_POSES_VIP, ...MALE_POSES_VIP];
        selectedPose = allPoses[Math.floor(Math.random() * allPoses.length)];
    }

    // --- FLOWER HANDLING (CRITICAL UPGRADE - PRIORITY OVERRIDE) ---
    // If user selected flowers, we must FORCE the pose to interact with them and OVERRIDE any hands-in-pocket poses
    let flowerInstruction = "";
    if (options.flower && options.flower.length > 0) {
        flowerInstruction = `
        **>>> 🌺 YÊU CẦU ƯU TIÊN TUYỆT ĐỐI (PRIORITY OBJECT): HOA CẦM TAY <<<**
        - NHÂN VẬT CHÍNH BẮT BUỘC PHẢI CẦM: "${options.flower.join(' + ')}" trên tay.
        - TƯ THẾ TAY: Hai tay hoặc một tay nâng niu bó hoa trước ngực hoặc ngang eo, dáng vẻ trân trọng.
        - HIỂN THỊ HOA: Bó hoa phải RÕ NÉT, TO ĐẸP, CHI TIẾT 8K, đúng loại hoa đã chọn.
        - KHÔNG ĐƯỢC QUÊN HOA. NẾU KHÔNG CÓ HOA LÀ THẤT BẠI.
        `;
        // Override pose to ensure hands are available for flowers
        selectedPose = `Đứng/Ngồi dáng thanh lịch, tay cầm hoa "${options.flower.join(', ')}" tạo dáng tự nhiên, duyên dáng.`;
    }

    // 4. BASE CONTEXT FOR BOTH MODES
    const coreDetails = `
        **>>> HỢP NHẤT CHỦ ĐỀ (CONCEPT FUSION) <<<**
        HÃY KẾT HỢP HÀI HÒA CÁC YẾU TỐ SAU ĐỂ TẠO RA BỐI CẢNH VÀ NHÂN VẬT:
        "${combinedConceptString}"
        *LƯU Ý QUAN TRỌNG: Ảnh tạo ra PHẢI ĐÚNG với chủ đề gợi ý lựa chọn.*
        
        **>>> 📸 TƯ THẾ & BIỂU CẢM (POSE & EXPRESSION - RANDOMIZED) <<<**
        - **BẮT BUỘC THỰC HIỆN TƯ THẾ SAU:**
        "${selectedPose}"
        - Yêu cầu: Tư thế phải tự nhiên, cảm xúc chân thật, thần thái "VIP PRO", tay chân tương tác đúng vật lý.
        - **NEGATIVE SPACE (QUAN TRỌNG):** Để lại khoảng trống nghệ thuật bên cạnh hoặc phía trên nhân vật để chèn chữ Typography (Magazine Style).
        
        ${flowerInstruction}

        **>>> CHI TIẾT TẠO HÌNH (ASSETS) <<<**
        - **Trang Phục:** ${outfitPrompt}
        - **Khung Viền (MANDATORY ARTISTIC BORDER):** ${options.border.join(', ') || "Không viền (hoặc viền tự nhiên theo style)"}
        - **Phụ Kiện (Accessories):** ${options.accessory.join(', ')}
        - **Vật Cầm Tay (Props):** ${options.handheldItem.join(', ')}
        - **Bối Cảnh (Background):** ${options.tetBackground ? options.tetBackground : "Background tương thích hoàn hảo với Concept Mix"}
        - **Địa Điểm (Location):** ${options.destination}
        - **Hoa (Flowers):** ${options.flower.join(', ')}
        - **Thú Cưng (Pets):** ${options.pet.join(', ')}
        - **Hiệu Ứng (VFX):** ${options.effect.join(', ')}
        
        **>>> PHONG CÁCH NGHỆ THUẬT (ART STYLE) <<<**
        - **Style:** ${options.style}
        - **Góc Máy (Camera):** ${options.cameraAngle || "Cinematic Portrait, Depth of Field"}
        - **Bố Cục:** ${options.layout}
    `;

    return `
      ${UNIVERSAL_SUPREME_ENGINE_PROMPT}
      
      *** 🔒 IDENTITY LOCK (PRIORITY #1) ***
      - **INPUT:** ${uploadedImages.length} Reference Face(s).
      - **TASK:** PERFECTLY clone the face(s) onto the generated character(s).
      - **TOLERANCE:** 0% Deviation. Must look exactly like the user.

      ${coreDetails}
      
      **>>> QUY TẮC BỐ CỤC AN TOÀN (SAFE ZONE RULE - QUAN TRỌNG NHẤT) <<<**
      - **VỊ TRÍ ĐẦU NHÂN VẬT:** Bắt buộc đặt đầu nhân vật cách lề trên của ảnh khoảng **25-30%** (Low Headroom).
      - **TUYỆT ĐỐI KHÔNG ĐƯỢC CẮT ĐẦU.**
      - **CHỪA CHỖ CHO TIÊU ĐỀ LỚN PHÍA TRÊN VÀ CHỮ BÊN CẠNH.**
      
      **>>> GHI CHÚ TỪ NGƯỜI DÙNG (USER NOTE) <<<**
      ${options.description}
      
      **>>> QUY TẮC CẤM (NEGATIVE PROMPT) <<<**
      - TUYỆT ĐỐI KHÔNG VẼ CHỮ, KHÔNG TEXT, KHÔNG DATE TRỰC TIẾP LÊNẢNH (để App chèn sau).
      - Không được làm biến dạng mặt.
      - Không được vẽ thêm ngón tay.
    `;
  };

  const handleGenerateClick = async () => {
    if (uploadedImages.length === 0) {
      setError('Vui lòng tải ít nhất 1 ảnh lên để bắt đầu!');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    
    try {
        const results: string[] = [];
        // LOOP: Generate each image with a UNIQUE prompt (Unique Pose)
        for (let i = 0; i < options.imageCount; i++) {
             // Construct prompt INSIDE the loop to get a random pose each time
             const prompt = constructPrompt(); 
             const result = await generateImage(uploadedImages, prompt);
             if (result) results.push(result);
        }
        
        if (results.length === 0) throw new Error("Hệ thống đang quá tải. Vui lòng thử lại!");
        
        setGeneratedImages(results);
        setHistory(prev => [...results, ...prev]);
    } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra trong quá trình tạo ảnh.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-light)] flex flex-col relative">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 flex-grow relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-8 max-w-screen-2xl mx-auto">
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <GenerationControls
              options={options}
              onOptionChange={handleOptionsChange}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              onGenerateClick={handleGenerateClick}
              uploadedImages={uploadedImages}
              isLoading={isLoading}
              history={history}
              onImageClick={(url) => setGeneratedImages([url])}
              onClearImages={handleClearImages}
            />
          </div>
          <div className="lg:col-span-5">
            <ResultDisplay 
                images={generatedImages} 
                isLoading={isLoading} 
                error={error} 
                aspectRatio={options.aspectRatio}
                isCalendarMode={isCalendarMode} 
                cameraAngle={options.cameraAngle}
                activeTheme={getActiveTheme()} 
                calendarConfig={{
                    year: options.calendarYear,
                    month: options.calendarMonth,
                    day: options.calendarDay,
                    weekday: options.calendarWeekday,
                    type: options.calendarType
                }}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-6 border-t-2 border-[var(--accent-gold)] bg-[var(--bg-glass)] relative z-10">
          <p className="text-sm text-[var(--text-light)]/90 mb-2">
              Kiến tạo bởi <span className="font-black tracking-widest text-[var(--accent-gold)] text-lg">NGUYỄN QUỐC THIỆN AI</span>
          </p>
          <p className="text-xs text-[var(--accent-red)] font-bold uppercase tracking-wide bg-black/20 inline-block px-4 py-1 rounded-full">
             🧧 NANO BANANA PRO ULTIMATE EDITION V10 - TẤN TÀI TẤN LỘC 🧧
          </p>
      </footer>
    </div>
  );
};

export default App;
