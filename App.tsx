import React, { useState } from 'react';
import { STEPS, TRANSLATIONS } from './constants';
import { AppStep, ProductAnalysis, CompetitorData, StrategyConfig, MarketingScript, Language } from './types';
import { Step1Input } from './components/Step1_Input';
import { Step2Analysis } from './components/Step2_Analysis';
import { Step3Strategy } from './components/Step3_Strategy';
import { Step4Generation } from './components/Step4_Generation';
import { Step5Preview } from './components/Step5_Preview';
import { ChevronRight, Globe2, Languages } from 'lucide-react';

/**
 * Connector: Accesses the Gemini AI via Netlify Functions
 * This bridges the frontend to the secure backend environment variable
 */
const callGeminiBridge = async (prompt: string) => {
  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `AI Brain connection failed (${response.status})`);
    }

    const data = await response.json();
    
    // Compatibility check for various AI response formats
    const aiText = data.text || data.content || data.message || (typeof data === 'string' ? data : null);
    
    if (!aiText) {
      throw new Error('AI returned an empty response');
    }
    
    return aiText;
  } catch (error: any) {
    console.error("Bridge Error:", error);
    throw error;
  }
};

const App = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data States Management
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
    selectedScenes: [],
    duration: '15s',
    aspectRatio: '9:16',
    selectedAvatars: [],
    customAvatars: [],
    uploadedScenes: []
  });

  const [scripts, setScripts] = useState<MarketingScript[]>([]);
  const [selectedScripts, setSelectedScripts] = useState<MarketingScript[]>([]);
  const [uploadedFootage, setUploadedFootage] = useState<File[]>([]);

  const t = TRANSLATIONS[language];

  /**
   * Main logic for Step 1: Triggering AI Analysis
   */
  const handleProductAnalyze = async (input: string, image?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Prepare instructions for Gemini
      const aiPrompt = `Analyze this product: ${input}. 
      Return the output in ${language === 'zh' ? 'Chinese' : 'English'}. 
      Focus on: Product Name, Category, Key Selling Points, and Target Audience. 
      Format: Professional and concise summary.`;
      
      const aiResponseText = await callGeminiBridge(aiPrompt);
      
      // 2. Map AI result to application state to prevent Step 2 from crashing
      setProductData({
        name: input.substring(0, 25) + (input.length > 25 ? '...' : ''),
        category: "E-commerce Product",
        sellingPoints: [aiResponseText],
        targetAudience: "Global Consumers",
        painPoints: ["Analyzing consumer needs..."]
      } as any);
      
      // 3. Fill default values to enable UI flow
      setCompetitors([]); 
      setGeneratedTones(["Professional", "Viral", "Humorous", "Luxury", "Storytelling"]);
      
      // 4. Navigate to Step 2
      setCurrentStep(AppStep.ANALYSIS);
    } catch (e: any) {
      console.error("Analysis Error:", e);
      setError(e.message || "Cloud Function Error: Check API Key in Netlify.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisNext = (hooks: string[]) => {
      setUserHooks(hooks);
      setCurrentStep(AppStep.STRATEGY);
  };

  const handleStrategyNext = () => {
      setCurrentStep(AppStep.GENERATION);
  };

  const handleRestart = () => {
      if (window.confirm("Restart? All unsaved data will be lost.")) {
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
      {/* Sidebar - Navigation */}
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
         {/* Top Bar - Breadcrumbs and Language */}
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

         {/* Content Area - Core Logic Rendering */}
         <div className="flex-1 p-8 z-10 overflow-hidden">
            {error && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg z-50 shadow-2xl flex items-center gap-4">
                <span>{error}</span>
                <button onClick={() => setError(null)} className="font-bold hover:scale-110">✕</button>
              </div>
            )}
            
            {currentStep === AppStep.INPUT && <Step1Input onAnalyze={handleProductAnalyze} isLoading={isLoading} lang={language} />}
            {currentStep === AppStep.ANALYSIS && productData && <Step2Analysis product={productData} competitors={competitors} onNext={handleAnalysisNext} onBack={() => setCurrentStep(AppStep.INPUT)} onRestart={handleRestart} lang={language} />}
            {currentStep === AppStep.STRATEGY && <Step3Strategy config={strategyConfig} setConfig={setStrategyConfig} generatedTones={generatedTones} onGenerate={handleStrategyNext} isGenerating={false} onBack={() => setCurrentStep(AppStep.ANALYSIS)} onRestart={handleRestart} lang={language} />}
            {currentStep === AppStep.GENERATION && productData && <Step4Generation 
                scripts={scripts} 
                setScripts={setScripts}
                uploadedFootage={uploadedFootage} 
                setUploadedFootage={setUploadedFootage} 
                onProceed={handleProceedToStudio} 
                onBack={() => setCurrentStep(AppStep.STRATEGY)} 
                onRestart={handleRestart} 
                lang={language}
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
