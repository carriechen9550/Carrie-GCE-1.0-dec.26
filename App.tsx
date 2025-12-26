
import React, { useState } from 'react';
import { STEPS, TRANSLATIONS } from './constants';
import { AppStep, ProductAnalysis, CompetitorData, StrategyConfig, MarketingScript, Language } from './types';
import { Step1Input } from './components/Step1_Input';
import { Step2Analysis } from './components/Step2_Analysis';
import { Step3Strategy } from './components/Step3_Strategy';
import { Step4Generation } from './components/Step4_Generation';
import { Step5Preview } from './components/Step5_Preview';
import { ChevronRight, Globe2, Languages } from 'lucide-react';

// 新的连接器：通过 Netlify Function 访问 Gemini
const callGeminiBridge = async (prompt: string) => {
  const response = await fetch('/.netlify/functions/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error('AI 大脑连接失败');
  const data = await response.json();
  return data.text;
};
const App = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data States
  const [productData, setProductData] = useState<ProductAnalysis | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [generatedTones, setGeneratedTones] = useState<string[]>([]);
  const [userHooks, setUserHooks] = useState<string[]>([]);
  
  const [strategyConfig, setStrategyConfig] = useState<StrategyConfig>({
    continent: 'North America',
    countries: ['United States'],
    language: 'English (US)',
    tone: 'Professional',
    videoStyle: 'TikTok UGC Style (Viral)',
    sceneCategory: 'Indoor',
    selectedScenes: [], // Multi-select
    duration: '15s',
    aspectRatio: '9:16',
    selectedAvatars: [], // Multi-select
    customAvatars: [],
    uploadedScenes: []
  });

  const [scripts, setScripts] = useState<MarketingScript[]>([]);
  const [selectedScripts, setSelectedScripts] = useState<MarketingScript[]>([]);
  
  // Lifted Footage State to share between Generation(4) and Studio(5)
  const [uploadedFootage, setUploadedFootage] = useState<File[]>([]);

  const t = TRANSLATIONS[language];

const handleProductAnalyze = async (input: string, image?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Send the input to your Netlify Cloud "Brain"
      const aiPrompt = `Analyze this product: ${input}. 
      Return the output in ${language === 'zh' ? 'Chinese' : 'English'}. 
      Focus on: Product Name, Category, Key Selling Points, and Target Audience.`;
      
      const aiResponseText = await callGeminiBridge(aiPrompt);
      
      // 2. Format the AI response into your application's data structure
      // We use a safe mock here so your UI (Step 2) doesn't crash
      setProductData({
        name: "AI Analyzed Product",
        category: "E-commerce Item",
        sellingPoints: [aiResponseText.substring(0, 200) + "..."],
        targetAudience: "General Global Audience",
        painPoints: ["General pain points solved by this product"]
      } as any);
      
      // 3. Set placeholder data for competitors and tones to enable the "Next" button
      setCompetitors([]); 
      setGeneratedTones(["Professional", "Viral", "Humorous", "Luxury", "Storytelling"]);
      
      // 4. Move to Step 2: Analysis
      setCurrentStep(AppStep.ANALYSIS);
    } catch (e: any) {
      console.error("Analysis Error:", e);
      setError(e.message || "Failed to analyze product via Cloud Function");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisNext = (hooks: string[]) => {
      setUserHooks(hooks);
      setCurrentStep(AppStep.STRATEGY);
  };

  // Step 3 now just moves to Step 4 without generating yet
  const handleStrategyNext = () => {
      setCurrentStep(AppStep.GENERATION);
  };

  const handleRestart = () => {
      if (window.confirm("Restart? All data will be lost.")) {
          setProductData(null);
          setCompetitors([]);
          setScripts([]);
          setSelectedScripts([]);
          setUploadedFootage([]);
          setStrategyConfig(prev => ({...prev, customAvatars: [], uploadedScenes: [], selectedScenes: [], selectedAvatars: []}));
          setCurrentStep(AppStep.INPUT);
      }
  };

  const handleProceedToStudio = (selection: MarketingScript[]) => {
      setSelectedScripts(selection);
      setCurrentStep(AppStep.EDITOR);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <div className="w-20 lg:w-64 border-r border-slate-800 flex flex-col bg-[#0b1120]">
        <div className="p-6 flex items-center gap-3 text-blue-500 font-bold text-xl tracking-tighter cursor-pointer" onClick={handleRestart}>
          <Globe2 size={28} />
          <span className="hidden lg:block">GCE</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {STEPS.map((step) => {
             const isActive = currentStep === step.id;
             const isCompleted = currentStep > step.id;
             return (
              <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg' : isCompleted ? 'text-slate-400 bg-slate-800/50' : 'text-slate-600'}`}>
                <div className={`${isActive ? 'text-white' : ''}`}>{step.icon}</div>
                <span className="hidden lg:block font-medium text-sm">{(t as any)[`step${step.id}`]}</span>
                {isCompleted && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 hidden lg:block"></div>}
              </div>
             );
          })}
        </nav>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative">
         {/* Top Bar */}
         <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 z-10 bg-[#0f172a]/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Application</span>
                <ChevronRight size={14} />
                <span className="text-white font-medium">{(t as any)[`step${currentStep}`]}</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')} className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs transition-colors">
                    <Languages size={14} /> {language === 'en' ? 'English' : '中文'}
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500"></div>
            </div>
         </header>

         {/* Content */}
         <div className="flex-1 p-8 z-10 overflow-hidden">
            {error && <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg z-50">{error} <button onClick={() => setError(null)} className="ml-2 underline">×</button></div>}
            
            {currentStep === AppStep.INPUT && <Step1Input onAnalyze={handleProductAnalyze} isLoading={isLoading} lang={language} />}
            {currentStep === AppStep.ANALYSIS && productData && <Step2Analysis product={productData} competitors={competitors} onNext={handleAnalysisNext} onBack={() => setCurrentStep(AppStep.INPUT)} onRestart={handleRestart} lang={language} />}
            {currentStep === AppStep.STRATEGY && <Step3Strategy config={strategyConfig} setConfig={setStrategyConfig} generatedTones={generatedTones} onGenerate={handleStrategyNext} isGenerating={false} onBack={() => setCurrentStep(AppStep.ANALYSIS)} onRestart={handleRestart} lang={language} />}
            {/* Step 4 now receives data to perform generation internally */}
            {currentStep === AppStep.GENERATION && productData && <Step4Generation 
                scripts={scripts} 
                setScripts={setScripts}
                uploadedFootage={uploadedFootage} 
                setUploadedFootage={setUploadedFootage} 
                onProceed={handleProceedToStudio} 
                onBack={() => setCurrentStep(AppStep.STRATEGY)} 
                onRestart={handleRestart} 
                lang={language}
                // Props for generation
                productData={productData}
                competitors={competitors}
                strategyConfig={strategyConfig}
                userHooks={userHooks}
            />}
            {currentStep === AppStep.EDITOR && <Step5Preview selectedScripts={selectedScripts} config={strategyConfig} uploadedFootage={uploadedFootage} onBack={() => setCurrentStep(AppStep.GENERATION)} onRestart={handleRestart} lang={language} />}
         </div>
      </main>
    </div>
  );
};

export default App;
