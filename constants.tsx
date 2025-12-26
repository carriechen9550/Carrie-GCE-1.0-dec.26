
import React from 'react';
import { LayoutDashboard, Target, Wand2, PlaySquare, Settings } from 'lucide-react';

export const STEPS = [
  { id: 0, title: 'Product Scan', icon: <LayoutDashboard size={20} /> },
  { id: 1, title: 'Analysis & Spy', icon: <Target size={20} /> },
  { id: 2, title: 'Strategy', icon: <Settings size={20} /> },
  { id: 3, title: 'Generation', icon: <Wand2 size={20} /> },
  { id: 4, title: 'GCE Studio', icon: <PlaySquare size={20} /> },
];

export const TRANSLATIONS = {
    en: {
        appTitle: "Global Conversion Engine",
        step0: "Product Scan",
        step1: "Analysis",
        step2: "Strategy",
        step3: "Generation",
        step4: "Studio",
        back: "Back",
        restart: "Restart",
        next: "Next",
        // Step 1
        s1Title: "Global Conversion Engine",
        s1Subtitle: "Upload product data. AI analyzes Tier 3 categories, detailed USPs, and market gaps.",
        prodUrl: "Product URL / Text",
        uploadImg: "Upload Product Image",
        imgUploaded: "Image Uploaded",
        pastePlaceholder: "Paste your product URL (Amazon, Shopify, TikTok) or describe your product features here...",
        analyzeBtn: "Start Deep Analysis",
        analyzing: "Analyzing Market Data...",
        footerPower: "Powered by Gemini 2.5",
        footerSpy: "Real-time Competitor Spy",
        footerReverse: "Viral Reverse Engineering",
        // Step 2
        s2Title: "Analysis Report",
        s2Subtitle: "Deep dive into market landscape.",
        proceedStrategy: "Proceed to Strategy",
        prodDna: "Product DNA",
        preciseCat: "Precise Category (Tier 3)",
        detailedUsp: "Detailed USP",
        painPoints: "Pain Points Solved (Min 5)",
        targetAudience: "Target Audience",
        topHooks: "Top Selling Hooks",
        addHookLabel: "Add Missing Marketing Point",
        addHookPlaceholder: "e.g. Waterproof up to 10m...",
        publicRadar: "Public Inquiry Radar (AnswerThePublic)",
        compWeakness: "Competitor Weaknesses (Simulated Reviews)",
        compWeaknessSub: "Aggregated from 50+ recent negative reviews (1-2 stars).",
        compIntel: "Competitor Intelligence (Top 10 Simulated)",
        tableComp: "Competitor",
        tablePlatform: "Platform",
        tableConv: "Conv. Rate",
        tableStrat: "Strategy",
        tableAssets: "Top Assets",
        convBench: "Conversion Benchmark",
        scanning: "Scanning...",
        analyzingTrends: "Analyzing search trends...",
        viewVideo: "Video",
        viewShop: "Shop",
        // Step 3 & 4 & 5
        uploadVid: "Upload Video",
        analyze: "Analyze",
        strategyMatrix: "Strategy Matrix",
        targetMarket: "Target Markets",
        sceneContext: "Scene Context",
        indoor: "Indoor",
        outdoor: "Outdoor",
        digitalHumans: "Digital Humans",
        videoFormat: "Video Format",
        genAssets: "Generate Assets",
        genConcepts: "Generated Concepts",
        footageSource: "Footage Source",
        footageHint: "Upload product angles/videos. AI will strictly maintain product fidelity.",
        customPrompt: "Custom Director Prompt",
        customPromptPlace: "Describe specific shots or a custom video idea...",
        editDuration: "Edit Duration",
        downloadAudio: "Download Audio",
        proceedStudio: "Proceed to Studio",
        prodStudio: "Production Studio",
        slot: "Slot",
        render: "Render",
        refine: "Refine / Modify",
        history: "History",
        download: "Download",
        strictMode: "Strict Fidelity Mode Active"
    },
    zh: {
        appTitle: "全球转化引擎 (GCE)",
        step0: "产品扫描",
        step1: "分析与情报",
        step2: "策略布局",
        step3: "内容生成",
        step4: "制片工坊",
        back: "返回",
        restart: "重新开始",
        next: "下一步",
        // Step 1
        s1Title: "全球转化引擎 (GCE)",
        s1Subtitle: "上传产品数据。AI分析三级类目、详细USP和市场空白。",
        prodUrl: "产品链接 / 文本",
        uploadImg: "上传产品图片",
        imgUploaded: "图片已上传",
        pastePlaceholder: "在此粘贴您的产品链接（Amazon, Shopify, TikTok）或描述产品功能...",
        analyzeBtn: "开始深度分析",
        analyzing: "正在分析市场数据...",
        footerPower: "由 Gemini 2.5 驱动",
        footerSpy: "实时竞对侦察",
        footerReverse: "爆款反向工程",
        // Step 2
        s2Title: "分析报告",
        s2Subtitle: "深入剖析市场格局。",
        proceedStrategy: "进入策略布局",
        prodDna: "产品 DNA",
        preciseCat: "精准类目 (Tier 3)",
        detailedUsp: "详细 USP",
        painPoints: "解决的痛点 (至少5个)",
        targetAudience: "目标受众",
        topHooks: "核心卖点钩子",
        addHookLabel: "补充营销卖点",
        addHookPlaceholder: "例如：10米防水...",
        publicRadar: "公众咨询雷达 (AnswerThePublic)",
        compWeakness: "竞对弱点 (模拟评论)",
        compWeaknessSub: "聚合了50+条近期差评 (1-2星)。",
        compIntel: "竞对情报 (模拟Top 10)",
        tableComp: "竞争对手",
        tablePlatform: "平台",
        tableConv: "转化率",
        tableStrat: "策略",
        tableAssets: "核心素材",
        convBench: "转化率基准",
        scanning: "扫描中...",
        analyzingTrends: "正在分析搜索趋势...",
        viewVideo: "视频",
        viewShop: "店铺",
        // Step 3 & 4 & 5
        uploadVid: "上传视频",
        analyze: "开始分析",
        strategyMatrix: "策略矩阵",
        targetMarket: "目标市场",
        sceneContext: "场景语境",
        indoor: "室内场景",
        outdoor: "户外场景",
        digitalHumans: "数字人 (AI Avatars)",
        videoFormat: "视频格式",
        genAssets: "生成素材",
        genConcepts: "生成脚本方案",
        footageSource: "原始素材源",
        footageHint: "上传不同角度的产品图或视频。AI将严格保持产品外观一致性，绝不形变。",
        customPrompt: "自定义导演指令",
        customPromptPlace: "描述特定的分镜或自定义视频创意...",
        editDuration: "修改时长",
        downloadAudio: "导出音频",
        proceedStudio: "进入制片工坊",
        prodStudio: "制片工坊",
        slot: "通道",
        render: "开始渲染",
        refine: "修改 / 重绘",
        history: "历史版本",
        download: "下载",
        strictMode: "严格保真模式已激活"
    }
};

export const MARKETS_DATA: Record<string, string[]> = {
    "North America": ["United States", "Canada", "Mexico"],
    "Europe": ["United Kingdom", "Germany", "France", "Spain", "Italy", "Netherlands", "Sweden", "Poland", "Switzerland"],
    "Asia Pacific": ["Japan", "South Korea", "Australia", "Singapore", "India", "Thailand", "Vietnam", "Indonesia", "Malaysia"],
    "Middle East & Africa": ["UAE", "Saudi Arabia", "Turkey", "Israel", "Egypt", "South Africa"],
    "Latin America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru"]
};

export const LANGUAGES = [
    "English (US)", "English (UK)", "Spanish (Spain)", "Spanish (LatAm)", "French", "German", 
    "Japanese", "Chinese (Mandarin)", "Arabic", "Portuguese (Brazil)", "Italian", "Korean", 
    "Dutch", "Turkish", "Hindi", "Russian", "Thai", "Vietnamese", "Indonesian", "Polish"
];

export const VIDEO_STYLES = [
    "TikTok UGC Style (Viral)",
    "High-End Brand Commercial",
    "Problem/Solution Split Screen",
    "ASMR Unboxing",
    "Founder Story",
    "3D Product Showcase",
    "Fast-Paced Street Interview",
    "Lifestyle Vlog Aesthetic",
    "Cinematic Macro Shots",
    "Testimonial Montage"
];

export const SCENE_CATEGORIES = {
    Indoor: [
        { id: 'k1', name: "Modern White Kitchen", img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80" },
        { id: 'k2', name: "Rustic Farmhouse Kitchen", img: "https://images.unsplash.com/photo-1556909212-d5b604d4390c?w=400&q=80" },
        { id: 'k3', name: "Industrial Loft Kitchen", img: "https://images.unsplash.com/photo-1542013936693-884638332954?w=400&q=80" },
        { id: 'k4', name: "Minimalist Japandi Kitchen", img: "https://images.unsplash.com/photo-1593696140826-c58b5418a800?w=400&q=80" },
        { id: 'k5', name: "Luxury Marble Kitchen", img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80" },
        { id: 'k6', name: "Cozy Tiny Home Kitchen", img: "https://images.unsplash.com/photo-1588854337440-27a3c3104f4a?w=400&q=80" },
        { id: 'lr1', name: "Sunny Living Room", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
        { id: 'gym1', name: "Home Gym", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80" },
    ],
    Outdoor: [
        { id: 'c1', name: "Forest Campsite", img: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&q=80" },
        { id: 'c2', name: "Lakeside Glamping", img: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&q=80" },
        { id: 'c3', name: "Mountain Peak Tent", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
        { id: 'c4', name: "Desert Bonfire", img: "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=400&q=80" },
        { id: 'c5', name: "RV Park Sunset", img: "https://images.unsplash.com/photo-1526491109672-747406520280?w=400&q=80" },
        { id: 'c7', name: "Beach Picnic", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
        { id: 'c10', name: "National Park Vista", img: "https://images.unsplash.com/photo-1496070242169-953f95071977?w=400&q=80" },
        { id: 'st1', name: "Urban Street", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },
    ]
};

export const DURATIONS = ["10s", "15s", "20s", "30s", "60s"];
export const ASPECT_RATIOS = ["9:16", "16:9", "3:4", "4:3", "1:1"];

// Extended High-Conversion Voice Options (Mapped to Base Voices with Style Hints)
export const VOICE_OPTIONS = [
    { id: 'Puck', name: 'Puck', label: 'Male - Gen Z/Hype (TikTok Native)' },
    { id: 'Charon', name: 'Charon', label: 'Male - Deep Narrative (Movie Trailer)' },
    { id: 'Kore', name: 'Kore', label: 'Female - Soothing (Wellness/Beauty)' },
    { id: 'Fenrir', name: 'Fenrir', label: 'Male - Authoritative (Tech Review)' },
    { id: 'Zephyr', name: 'Zephyr', label: 'Female - Clear/News (Educational)' },
    // New High Conversion Options (Mapped internally to base voices but implied different use)
    { id: 'Puck-HighEnergy', name: 'Puck', label: 'Male - High Energy Sales' },
    { id: 'Kore-ASMR', name: 'Kore', label: 'Female - Soft ASMR' },
    { id: 'Zephyr-Fast', name: 'Zephyr', label: 'Female - Fast Explainer' },
    { id: 'Charon-Gravel', name: 'Charon', label: 'Male - Gritty Storyteller' },
    { id: 'Fenrir-Coach', name: 'Fenrir', label: 'Male - Motivational Coach' },
    { id: 'Kore-Sales', name: 'Kore', label: 'Female - Enthusiastic Sales' },
    { id: 'Puck-Urgent', name: 'Puck', label: 'Male - Urgent Deal Alert' },
    { id: 'Zephyr-Professional', name: 'Zephyr', label: 'Female - Corporate Professional' },
    { id: 'Charon-Dramatic', name: 'Charon', label: 'Male - Dramatic Intro' },
    { id: 'Fenrir-Bold', name: 'Fenrir', label: 'Male - Bold Statement' }
];

// Extended Tone Styles
export const AUDIO_STYLES = [
    "Excited (Viral)",
    "Professional (Trust)",
    "Storytelling (Emotional)",
    "ASMR (Whisper)",
    "News Anchor (Fact-based)",
    "Sarcastic (Humorous)",
    "Urgent (Limited Time)",
    "Casual (Bestie/Vlog)",
    "Luxurious (Elegant)",
    "Motivational (Inspiring)",
    "Suspenseful (Mystery)",
    "Empathetic (Problem Solving)",
    "Controversial (Opinion)",
    "Educational (How-to)",
    "Minimalist (Luxury)",
    "Hype (High Energy)",
    "Chill (Relaxed)",
    "Dramatic (Movie Trailer)",
    "Serious (Warning)",
    "Friendly (Customer Support)"
];

// New Pacing Options
export const PACING_OPTIONS = [
    "Normal",
    "Fast (Urgent)",
    "Slow (Dramatic)",
    "Ultra Fast (Disclaimers/Gen Z)",
    "Variable (Natural Pause)",
    "Slow Build (Crescendo)",
    "Staccato (Punchy)",
    "Flowing (Meditative)",
    "Rapid Fire (TikTok Trend)",
    "Deliberate (Educational)"
];
