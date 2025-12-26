
import React, { useRef, useState, useEffect } from 'react';
import { StrategyConfig, Avatar } from '../types';
import { MARKETS_DATA, LANGUAGES, VIDEO_STYLES, SCENE_CATEGORIES, DURATIONS, ASPECT_RATIOS, TRANSLATIONS } from '../constants';
import { Wand2, Upload, ArrowLeft, RotateCcw, Check, Home, Trees, Sparkles, Loader2, ArrowRight, X, ZoomIn, UserPlus, Image as ImageIcon, Send } from 'lucide-react';

interface Props {
  config: StrategyConfig;
  setConfig: React.Dispatch<React.SetStateAction<StrategyConfig>>;
  generatedTones: string[];
  onGenerate: () => void;
  isGenerating: boolean;
  onBack: () => void;
  onRestart: () => void;
  lang: 'en' | 'zh';
}

export const Step3Strategy: React.FC<Props> = ({ 
    config, setConfig, generatedTones, onGenerate, isGenerating, onBack, onRestart, lang
}) => {
  const t = TRANSLATIONS[lang];
  const sceneInputRef = useRef<HTMLInputElement>(null);
  const customAvatarFileRef = useRef<HTMLInputElement>(null);

  // Avatar State
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false); // Generating Metadata
  const [generatingImages, setGeneratingImages] = useState<string[]>([]); // IDs of images currently generating
  const [previewAvatar, setPreviewAvatar] = useState<Avatar | null>(null);
  
  // Custom Avatar State
  const [customInput, setCustomInput] = useState("");
  const [customFile, setCustomFile] = useState<string | null>(null);
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);

  // Scene Generation State
  const [scenePrompt, setScenePrompt] = useState("");
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);

  // Generate metadata on first load if empty (or manual trigger)
  useEffect(() => {
     // Optional: Could auto-trigger here, but button is safer for API quota
  }, []);

  const handleChange = (key: keyof StrategyConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleCountry = (country: string) => {
      setConfig(prev => {
          const exists = prev.countries.includes(country);
          const newCountries = exists ? prev.countries.filter(c => c !== country) : [...prev.countries, country];
          return { ...prev, countries: newCountries };
      });
  };

  const toggleScene = (sceneName: string) => {
      setConfig(prev => {
          const exists = prev.selectedScenes.includes(sceneName);
          return { ...prev, selectedScenes: exists ? prev.selectedScenes.filter(s => s !== sceneName) : [...prev.selectedScenes, sceneName] };
      });
  };

  const handleSceneUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const res = reader.result as string;
              setConfig(prev => ({ ...prev, uploadedScenes: [...prev.uploadedScenes, res], selectedScenes: [...prev.selectedScenes, "Custom Scene " + (prev.uploadedScenes.length + 1)] }));
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleGenerateScene = async () => {
      if (!scenePrompt) return;
      setIsGeneratingScene(true);
      try {
          const imgUrl = await generateSceneImage(scenePrompt);
          if (imgUrl) {
               setConfig(prev => ({ 
                   ...prev, 
                   uploadedScenes: [imgUrl, ...prev.uploadedScenes], 
                   selectedScenes: ["AI Generated Scene " + (prev.uploadedScenes.length + 1), ...prev.selectedScenes] 
               }));
               setScenePrompt("");
          }
      } catch (e) {
          console.error(e);
          alert("Failed to generate scene.");
      } finally {
          setIsGeneratingScene(false);
      }
  };

  const toggleAvatar = (id: string) => {
      setConfig(prev => {
          const exists = prev.selectedAvatars.includes(id);
          return { ...prev, selectedAvatars: exists ? prev.selectedAvatars.filter(a => a !== id) : [...prev.selectedAvatars, id] };
      });
  };

  // 1. Generate Metadata for 10 Avatars (Batch)
  const handleGenerateProfiles = async () => {
      setLoadingAvatars(true);
      try {
          const profiles = await generateAvatarProfiles(10);
          setAvatars(prev => [...profiles, ...prev]);
          // Auto-generate images for the first 5 to populate grid immediately
          const firstBatch = profiles.slice(0, 5);
          firstBatch.forEach(p => handleGenerateImage(p));
      } catch (e) {
          console.error(e);
          alert("Failed to generate avatar profiles.");
      } finally {
          setLoadingAvatars(false);
      }
  };

  // 2. Generate Image for a specific Avatar Card
  const handleGenerateImage = async (avatar: Avatar) => {
      if (avatar.img || generatingImages.includes(avatar.id)) return;
      
      setGeneratingImages(prev => [...prev, avatar.id]);
      try {
          const imgUrl = await generateAvatarImage(avatar.desc);
          if (imgUrl) {
              setAvatars(prev => prev.map(a => a.id === avatar.id ? { ...a, img: imgUrl } : a));
          }
      } catch (e) {
          console.error(e);
      } finally {
          setGeneratingImages(prev => prev.filter(id => id !== avatar.id));
      }
  };

  // 3. Custom Avatar Generation
  const handleCustomAvatarSubmit = async () => {
      if (!customInput && !customFile) return;
      setIsGeneratingCustom(true);
      try {
          const newAvatar = await analyzeContextForAvatar(customInput, customFile || undefined);
          setAvatars(prev => [newAvatar, ...prev]);
          setCustomInput("");
          setCustomFile(null);
          // Auto generate image for custom one
          handleGenerateImage(newAvatar);
          // Auto select it
          toggleAvatar(newAvatar.id);
      } catch (e) {
          console.error(e);
          alert("Failed to create custom avatar.");
      } finally {
          setIsGeneratingCustom(false);
      }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          const reader = new FileReader();
          reader.onloadend = () => setCustomFile(reader.result as string);
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  return (
    <div className="h-full overflow-y-auto pr-2 pb-20 relative">
        {/* Avatar Preview Modal */}
        {previewAvatar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8 backdrop-blur-sm" onClick={() => setPreviewAvatar(null)}>
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-lg w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button className="absolute top-4 right-4 text-white bg-slate-700/50 hover:bg-slate-600 rounded-full p-2 transition" onClick={() => setPreviewAvatar(null)}><X size={20}/></button>
                    
                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-6 bg-black flex items-center justify-center">
                        {previewAvatar.img ? (
                             <img src={previewAvatar.img} alt={previewAvatar.name} className="w-full h-full object-contain"/>
                        ) : (
                             <div className="text-slate-500 flex flex-col items-center">
                                 {generatingImages.includes(previewAvatar.id) ? <Loader2 className="animate-spin mb-2"/> : <Sparkles className="mb-2"/>}
                                 <span>{generatingImages.includes(previewAvatar.id) ? "Generating..." : "No Image Yet"}</span>
                             </div>
                        )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-1">{previewAvatar.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">{previewAvatar.traits.ethnicity}</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">{previewAvatar.traits.age}</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">{previewAvatar.traits.vibe}</span>
                    </div>
                    <p className="text-slate-400 mb-6 text-sm">{previewAvatar.desc}</p>
                    
                    <div className="flex gap-3">
                        {!previewAvatar.img && (
                             <button 
                                onClick={() => handleGenerateImage(previewAvatar)}
                                disabled={generatingImages.includes(previewAvatar.id)}
                                className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition"
                            >
                                {generatingImages.includes(previewAvatar.id) ? "Generating..." : "Generate Image"}
                            </button>
                        )}
                        <button 
                            onClick={() => { toggleAvatar(previewAvatar.id); setPreviewAvatar(null); }}
                            className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${config.selectedAvatars.includes(previewAvatar.id) ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                        >
                            {config.selectedAvatars.includes(previewAvatar.id) ? "Remove" : "Select"}
                        </button>
                    </div>
                </div>
            </div>
        )}

        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">{t.strategyMatrix}</h2>
                <p className="text-slate-400">Configure scenes, avatars, and format.</p>
            </div>
            <div className="flex gap-3">
                 <button onClick={onRestart} className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center gap-2 border border-slate-700">
                    <RotateCcw size={16} /> {t.restart}
                </button>
                <button onClick={onBack} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2">
                    <ArrowLeft size={16} /> {t.back}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                {/* Markets */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase">{t.targetMarket}</label>
                    <div className="space-y-4">
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {Object.keys(MARKETS_DATA).map(continent => (
                                <button key={continent} onClick={() => handleChange('continent', continent)} className={`flex-shrink-0 py-2 px-4 rounded-full text-xs transition-all ${config.continent === continent ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>{continent}</button>
                            ))}
                        </div>
                        {config.continent && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-900/50 rounded-lg max-h-40 overflow-y-auto custom-scrollbar">
                                {MARKETS_DATA[config.continent].map(country => (
                                    <button key={country} onClick={() => toggleCountry(country)} className={`flex items-center gap-2 text-left text-xs p-2 rounded transition-all ${config.countries.includes(country) ? 'bg-blue-900/40 text-blue-200 border border-blue-800' : 'text-slate-400 hover:bg-slate-800'}`}>
                                        <div className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 ${config.countries.includes(country) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'}`}>
                                            {config.countries.includes(country) && <Check size={8} className="text-white" />}
                                        </div>
                                        <span className="truncate">{country}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <select value={config.language} onChange={(e) => handleChange('language', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm">
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>

                {/* Scenes - Fixed Images + Generation */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase">{t.sceneContext}</label>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => handleChange('sceneCategory', 'Indoor')} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${config.sceneCategory === 'Indoor' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <Home size={16} /> {t.indoor}
                        </button>
                        <button onClick={() => handleChange('sceneCategory', 'Outdoor')} className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${config.sceneCategory === 'Outdoor' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                            <Trees size={16} /> {t.outdoor}
                        </button>
                    </div>

                    {/* AI Scene Generator */}
                    <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700 mb-4 flex gap-2">
                        <input 
                            type="text" 
                            value={scenePrompt}
                            onChange={(e) => setScenePrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateScene()}
                            placeholder="Generate AI Scene (e.g. 'Cyberpunk Coffee Shop')..."
                            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
                        />
                        <button 
                            onClick={handleGenerateScene}
                            disabled={isGeneratingScene || !scenePrompt}
                            className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded text-xs flex items-center gap-1"
                        >
                            {isGeneratingScene ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                         {SCENE_CATEGORIES[config.sceneCategory].map(scene => (
                             <div key={scene.id} onClick={() => toggleScene(scene.name)} className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 group transition-all ${config.selectedScenes.includes(scene.name) ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-700 hover:border-slate-500'}`}>
                                 <img src={scene.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={scene.name} onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                                     <span className="text-[10px] text-white font-medium block leading-tight">{scene.name}</span>
                                 </div>
                                 {config.selectedScenes.includes(scene.name) && <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5"><Check size={10} /></div>}
                             </div>
                         ))}
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pt-2 border-t border-slate-700">
                         <div onClick={() => sceneInputRef.current?.click()} className="w-16 h-16 flex-shrink-0 border-2 border-dashed border-slate-600 rounded flex items-center justify-center cursor-pointer hover:border-slate-400 text-slate-500 hover:text-white">
                            <Upload size={16} />
                            <input type="file" ref={sceneInputRef} className="hidden" accept="image/*" onChange={handleSceneUpload} />
                         </div>
                         {config.uploadedScenes.map((src, i) => (
                             <div key={i} className="w-16 h-16 flex-shrink-0 rounded border border-slate-600 overflow-hidden relative group">
                                 <img src={src} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white">Custom</div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                 <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <label className="block text-sm font-bold text-slate-400 mb-3 uppercase">{t.videoFormat}</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-slate-500 mb-1 block">Duration</span>
                            <select value={config.duration} onChange={(e) => handleChange('duration', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm">{DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}</select>
                        </div>
                        <div>
                             <span className="text-xs text-slate-500 mb-1 block">Aspect Ratio</span>
                            <select value={config.aspectRatio} onChange={(e) => handleChange('aspectRatio', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm">{ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-xs text-slate-500 mb-1 block">Style & Tone</span>
                         <select value={config.videoStyle} onChange={(e) => handleChange('videoStyle', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white text-sm mb-2">
                            {VIDEO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <div className="flex flex-wrap gap-2">{generatedTones.map(t => <button key={t} onClick={() => handleChange('tone', t)} className={`py-1 px-3 rounded-full text-[10px] border ${config.tone === t ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-600 text-slate-400'}`}>{t}</button>)}</div>
                    </div>
                </div>

                {/* Digital Humans Section - Full Grid Layout */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col h-[700px]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                             <label className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">{t.digitalHumans}</label>
                             <span className="text-[10px] text-slate-500 block">Nano Banana • {avatars.length} Profiles Generated</span>
                        </div>
                        <button 
                            onClick={handleGenerateProfiles}
                            disabled={loadingAvatars}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1 hover:from-pink-400 hover:to-rose-400 transition"
                        >
                            {loadingAvatars ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                            Generate 10 Profiles
                        </button>
                    </div>

                    {/* Custom Generator */}
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 mb-4">
                        <label className="text-[10px] uppercase font-bold text-blue-400 mb-2 flex items-center gap-1"><UserPlus size={10}/> Create Custom User Avatar</label>
                        <div className="flex gap-2 mb-2">
                             <input 
                                type="text" 
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder="Describe person (e.g. 'Asian female dentist, 30s')..." 
                                className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                             />
                             <div className="relative">
                                <button onClick={() => customAvatarFileRef.current?.click()} className={`p-1.5 rounded border border-slate-600 ${customFile ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                    <ImageIcon size={14}/>
                                </button>
                                <input type="file" ref={customAvatarFileRef} className="hidden" accept="image/*" onChange={handleCustomFileUpload} />
                             </div>
                        </div>
                        <button 
                            onClick={handleCustomAvatarSubmit}
                            disabled={isGeneratingCustom}
                            className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[10px] py-1 rounded border border-blue-600/50 transition flex items-center justify-center gap-1"
                        >
                            {isGeneratingCustom ? <Loader2 size={10} className="animate-spin"/> : <Send size={10}/>} Generate Custom Agent
                        </button>
                    </div>
                    
                    {/* Vertical Scroll Grid - Expanded Layout */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 overflow-y-auto custom-scrollbar p-2 flex-1 content-start bg-slate-900/30 rounded-lg border border-slate-800">
                        {avatars.length === 0 && (
                            <div className="col-span-full text-center text-slate-500 py-10 flex flex-col items-center justify-center h-full">
                                <Sparkles size={24} className="mb-2 text-slate-600"/>
                                <p className="text-xs">Click "Generate 10 Profiles" to start.</p>
                            </div>
                        )}
                        
                        {avatars.map((a, i) => (
                            <div 
                                key={a.id} 
                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all aspect-square relative group bg-slate-800 flex flex-col ${config.selectedAvatars.includes(a.id) ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-slate-700 hover:border-slate-500'}`}
                                onClick={() => toggleAvatar(a.id)}
                            >
                                {a.img ? (
                                    <img src={a.img} alt={a.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-slate-800" onClick={(e) => { e.stopPropagation(); handleGenerateImage(a); }}>
                                         {generatingImages.includes(a.id) ? (
                                             <Loader2 size={20} className="animate-spin text-blue-500"/>
                                         ) : (
                                             <>
                                                <div className="w-6 h-6 rounded-full bg-slate-700 mb-1 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                    {a.traits.ethnicity[0]}
                                                </div>
                                                <span className="text-[8px] text-slate-400 leading-tight line-clamp-2">{a.name}</span>
                                                <span className="text-[7px] text-blue-400 mt-1 bg-blue-900/30 px-1 rounded">Gen Image</span>
                                             </>
                                         )}
                                    </div>
                                )}
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pointer-events-none">
                                     <button onClick={(e) => { e.stopPropagation(); setPreviewAvatar(a); }} className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-1.5 hover:bg-black hover:scale-110 transition pointer-events-auto"><ZoomIn size={12}/></button>
                                     <span className="text-[8px] text-white font-bold truncate">{a.name}</span>
                                </div>

                                {config.selectedAvatars.includes(a.id) && (
                                    <div className="absolute top-0 left-0 bg-blue-600 text-white rounded-br-lg p-0.5">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-right text-[10px] text-slate-500 mt-2">
                        Selected: {config.selectedAvatars.length}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end pb-8">
             <button onClick={onGenerate} className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg`}>
                Next: Upload & Concepts <ArrowRight size={20} />
            </button>
        </div>
    </div>
  );
};
