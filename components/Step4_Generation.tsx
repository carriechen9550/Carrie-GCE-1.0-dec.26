
import React, { useState, useRef } from 'react';
import { MarketingScript, ProductAnalysis, CompetitorData, StrategyConfig } from '../types';
import { TRANSLATIONS, VOICE_OPTIONS, AUDIO_STYLES, PACING_OPTIONS } from '../constants';
import { Clock, ArrowRight, ArrowLeft, RotateCcw, CheckCircle, PlusCircle, Upload, Play, Download, Edit3, Save, Film, Mic, Pause, Sparkles, Wand2, Loader2, Type, Zap, Music } from 'lucide-react';

interface Props {
  scripts: MarketingScript[];
  setScripts: React.Dispatch<React.SetStateAction<MarketingScript[]>>;
  uploadedFootage: File[];
  setUploadedFootage: React.Dispatch<React.SetStateAction<File[]>>;
  onProceed: (selectedScripts: MarketingScript[]) => void;
  onBack: () => void;
  onRestart: () => void;
  lang: 'en' | 'zh';
  // Context for Generation
  productData: ProductAnalysis;
  competitors: CompetitorData[];
  strategyConfig: StrategyConfig;
  userHooks: string[];
}

export const Step4Generation: React.FC<Props> = ({ 
    scripts, setScripts, uploadedFootage, setUploadedFootage, onProceed, onBack, onRestart, lang,
    productData, competitors, strategyConfig, userHooks
}) => {
  const t = TRANSLATIONS[lang];
  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempDuration, setTempDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Audio State
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [generatingAudioId, setGeneratingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const footageRef = useRef<HTMLInputElement>(null);

  const toggleSelection = (id: string) => {
    if (selectedScripts.includes(id)) setSelectedScripts(prev => prev.filter(sId => sId !== id));
    else if (selectedScripts.length < 5) setSelectedScripts(prev => [...prev, id]);
  };

  const handleFootageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) setUploadedFootage(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
      const promises = files.map(file => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
      }));
      return Promise.all(promises);
  };

  const handleGenerateConcepts = async () => {
      setIsGenerating(true);
      try {
          const imageBase64s = await convertFilesToBase64(uploadedFootage.filter(f => f.type.startsWith('image/')));

          const generated = await generateMarketingScripts(
              productData,
              competitors,
              {
                  market: strategyConfig.countries.join(', '),
                  language: lang === 'zh' ? 'Chinese' : strategyConfig.language,
                  tone: strategyConfig.tone,
                  style: strategyConfig.videoStyle,
                  scene: strategyConfig.selectedScenes.join(', ') || strategyConfig.sceneCategory,
                  duration: strategyConfig.duration,
                  aspectRatio: strategyConfig.aspectRatio
              },
              userHooks,
              imageBase64s,
              customPrompt
          );
          setScripts(generated);
      } catch (e: any) {
          console.error(e);
          alert("Failed to generate concepts: " + e.message);
      } finally {
          setIsGenerating(false);
      }
  };

  const startEdit = (script: MarketingScript) => {
      setEditingId(script.id);
      setTempDuration(script.duration);
  };

  const saveEdit = (id: string) => {
      setScripts(prev => prev.map(s => s.id === id ? { ...s, duration: tempDuration, copy: s.copy + " (Adjusted for " + tempDuration + ")" } : s));
      setEditingId(null);
  };

  const updateAudioSetting = (scriptId: string, field: 'voiceId' | 'style' | 'speed', value: string) => {
      setScripts(prev => prev.map(s => s.id === scriptId ? {
          ...s,
          audioSettings: { ...s.audioSettings, [field]: value }
      } : s));
      // Reset generated audio if settings change
      if (audioUrls[scriptId]) {
          const newUrls = {...audioUrls};
          delete newUrls[scriptId];
          setAudioUrls(newUrls);
      }
  };

  const handleGenerateAudio = async (script: MarketingScript) => {
      setGeneratingAudioId(script.id);
      try {
          // Pass full audio settings including Style and Speed
          const url = await generateSpeech(
              script.copy, 
              script.audioSettings.voiceId,
              script.audioSettings.style,
              script.audioSettings.speed
          );
          setAudioUrls(prev => ({ ...prev, [script.id]: url }));
      } catch (e) {
          console.error(e);
          alert("Failed to generate audio. Please try again.");
      } finally {
          setGeneratingAudioId(null);
      }
  };

  const togglePlay = (id: string) => {
      if (playingAudio === id) {
          audioRef.current?.pause();
          setPlayingAudio(null);
      } else {
          if (audioRef.current) {
              audioRef.current.src = audioUrls[id];
              audioRef.current.play();
              setPlayingAudio(id);
              audioRef.current.onended = () => setPlayingAudio(null);
          } else {
             const audio = new Audio(audioUrls[id]);
             audioRef.current = audio;
             audio.play();
             setPlayingAudio(id);
             audio.onended = () => setPlayingAudio(null);
          }
      }
  };

  const downloadAudio = (script: MarketingScript) => {
      const url = audioUrls[script.id];
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${script.versionName}_${script.audioSettings.voiceId}.wav`;
      a.click();
  };

  const handleProceed = () => {
      onProceed(scripts.filter(s => selectedScripts.includes(s.id)));
  };

  return (
    <div className="h-full overflow-y-auto pr-2 pb-20">
      <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{t.genConcepts}</h2>
            <p className="text-slate-400">{scripts.length === 0 ? "Step 1: Upload Assets & Configure" : "Step 2: Select Concepts"}</p>
          </div>
          <div className="flex gap-3">
             <button onClick={onRestart} className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center gap-2 border border-slate-700"><RotateCcw size={16} /> {t.restart}</button>
             <button onClick={onBack} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> {t.back}</button>
        </div>
      </div>
      
      {/* Configuration & Upload Section */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-bold text-violet-400 uppercase mb-4 flex items-center gap-2"><Film size={18} /> {t.footageSource} <span className="text-xs text-slate-500 normal-case ml-2">(Primary Reference)</span></h3>
          <p className="text-xs text-slate-400 mb-4">{t.footageHint}</p>
          
          <div className="flex flex-col gap-6">
              <div className="flex gap-4 overflow-x-auto pb-2 min-h-[120px]">
                  <button onClick={() => footageRef.current?.click()} className="w-28 h-28 flex-shrink-0 border-2 border-dashed border-slate-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors">
                      <Upload size={24} />
                      <span className="text-[10px] mt-2 font-bold">UPLOAD</span>
                      <input type="file" multiple ref={footageRef} className="hidden" onChange={handleFootageUpload} />
                  </button>
                  {uploadedFootage.map((file, i) => (
                      <div key={i} className="w-28 h-28 flex-shrink-0 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center relative overflow-hidden group">
                          {file.type.startsWith('image') ? <img src={URL.createObjectURL(file)} className="w-full h-full object-cover"/> : <Film size={24} className="text-slate-500"/>}
                          <div className="absolute bottom-0 w-full bg-black/60 text-[8px] text-white text-center truncate px-1">{file.name}</div>
                          <button onClick={() => setUploadedFootage(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><RotateCcw size={8}/></button>
                      </div>
                  ))}
              </div>

              <div className="flex gap-4 items-start border-t border-slate-700 pt-6">
                  <div className="flex-1">
                      <label className="text-xs font-bold text-slate-400 mb-2 block">{t.customPrompt}</label>
                      <textarea 
                        value={customPrompt} 
                        onChange={(e) => setCustomPrompt(e.target.value)} 
                        placeholder={t.customPromptPlace} 
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none h-24 resize-none" 
                      />
                  </div>
                  <div className="flex flex-col gap-2 pt-6">
                      <button 
                        onClick={handleGenerateConcepts}
                        disabled={isGenerating}
                        className={`w-48 px-4 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 text-white shadow-lg'}`}
                      >
                         {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Wand2 size={18} />}
                         {scripts.length > 0 ? "Regenerate Concepts" : "Generate Concepts"}
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Generated Scripts List */}
      {scripts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 mb-8 animate-fade-in-up">
            {scripts.map((script, idx) => {
              const isSelected = selectedScripts.includes(script.id);
              const isEditing = editingId === script.id;
              const hasAudio = !!audioUrls[script.id];
              
              return (
                <div key={script.id} onClick={() => toggleSelection(script.id)} className={`border rounded-xl overflow-hidden cursor-pointer transition-all group relative ${isSelected ? 'bg-slate-800/80 border-green-500 ring-1 ring-green-500/50' : 'bg-slate-800 border-slate-700 hover:border-blue-500'}`}>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isSelected ? 'bg-green-600 text-white' : 'bg-blue-600/20 text-blue-400'}`}>V{idx + 1}</span>
                                    <h3 className="text-xl font-bold text-white">{script.versionName}</h3>
                                </div>
                                <div className="text-xs text-yellow-400 font-bold mt-1 mb-1">{script.title}</div>
                                <div className="text-[10px] text-slate-400 flex flex-wrap gap-1">{script.hashtags.map(h => <span key={h}>#{h}</span>)}</div>
                            </div>
                            <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded">
                                        <input type="text" value={tempDuration} onChange={(e) => setTempDuration(e.target.value)} className="w-12 bg-transparent text-white text-sm outline-none border-b border-blue-500"/>
                                        <button onClick={() => saveEdit(script.id)} className="text-green-400"><CheckCircle size={16}/></button>
                                    </div>
                                ) : (
                                    <button onClick={() => startEdit(script)} className="flex items-center gap-1 text-slate-400 text-sm bg-slate-900 px-3 py-1 rounded hover:text-white">
                                        <Clock size={16} /> {script.duration} <Edit3 size={12}/>
                                    </button>
                                )}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                    {isSelected ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
                                </div>
                            </div>
                        </div>

                        {/* Script & Audio Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="md:col-span-2 bg-slate-900/50 rounded-lg p-5 border border-slate-800">
                                <div className="flex flex-col gap-3 mb-3">
                                    <h4 className="text-xs uppercase text-slate-500 font-bold flex items-center gap-2"><Music size={12}/> AI Voiceover Studio</h4>
                                    
                                    <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/50 rounded border border-slate-800" onClick={(e) => e.stopPropagation()}>
                                        <div>
                                            <span className="text-[10px] text-slate-500 block mb-1">Voice Character</span>
                                            <select 
                                                value={script.audioSettings?.voiceId || 'Kore'} 
                                                onChange={(e) => updateAudioSetting(script.id, 'voiceId', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                            >
                                                {VOICE_OPTIONS.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-500 block mb-1">Tone Style</span>
                                            <select 
                                                value={script.audioSettings?.style || 'Professional'} 
                                                onChange={(e) => updateAudioSetting(script.id, 'style', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                            >
                                                {AUDIO_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-500 block mb-1">Pacing</span>
                                            <select 
                                                value={script.audioSettings?.speed || 'Normal'} 
                                                onChange={(e) => updateAudioSetting(script.id, 'speed', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                            >
                                                {PACING_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-2" onClick={(e) => e.stopPropagation()}>
                                        {!hasAudio ? (
                                            <button 
                                                onClick={() => handleGenerateAudio(script)} 
                                                disabled={generatingAudioId === script.id}
                                                className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded flex items-center justify-center gap-2 transition w-full md:w-auto"
                                            >
                                                {generatingAudioId === script.id ? <Loader2 size={14} className="animate-spin"/> : <Mic size={14}/>} Generate Audio
                                            </button>
                                        ) : (
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button onClick={() => togglePlay(script.id)} className="flex-1 px-4 text-xs bg-green-600 hover:bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2">
                                                    {playingAudio === script.id ? <Pause size={14}/> : <Play size={14}/>} {playingAudio === script.id ? "Playing..." : "Play"}
                                                </button>
                                                <button onClick={() => downloadAudio(script)} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 rounded flex items-center gap-1">
                                                    <Download size={14}/> WAV
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-slate-200 font-serif text-lg leading-relaxed whitespace-pre-line border-t border-slate-800 pt-3 mt-3">{script.copy}</p>
                            </div>
                            
                            {/* AI Suggested Subtitle Strategy */}
                            <div className="md:col-span-1 bg-slate-900/80 rounded-lg p-4 border border-violet-900/30">
                                <h4 className="text-xs uppercase text-violet-400 font-bold mb-3 flex items-center gap-2">
                                    <Type size={12}/> AI Subtitle Strategy
                                </h4>
                                {script.subtitleStrategy ? (
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Font</span>
                                            <span className="text-white">{script.subtitleStrategy.font}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Color</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: script.subtitleStrategy.color}}></div>
                                                <span className="text-white">{script.subtitleStrategy.color}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Size</span>
                                            <span className="text-white">{script.subtitleStrategy.size}</span>
                                        </div>
                                        <div className="mt-3">
                                            <span className="text-slate-500 block mb-1 flex items-center gap-1"><Zap size={10} className="text-yellow-400"/> Explosive Frames:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {(script.subtitleStrategy.explosiveMoments || []).slice(0,4).map((m, i) => (
                                                    <span key={i} className="bg-yellow-500/20 text-yellow-200 px-1.5 py-0.5 rounded text-[10px]">{m}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-slate-500 text-xs italic">Analysis required...</span>
                                )}
                            </div>
                        </div>

                        {/* Full Scene List Display */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                            {(script.scenes || []).map((scene, i) => (
                                <div key={i} className="bg-slate-900 p-2 rounded border border-slate-700 opacity-70">
                                    <div className="text-[10px] text-slate-500 mb-1">{scene.time}</div>
                                    <div className="text-xs text-slate-300 line-clamp-3">{scene.visual}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              )
            })}
          </div>
      )}

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-[#0f172a]/90 border-t border-slate-800 backdrop-blur-md flex justify-between items-center z-50">
          <div className="text-sm text-slate-400">Selected: <span className="text-white font-bold">{selectedScripts.length}</span></div>
          <button onClick={handleProceed} disabled={selectedScripts.length === 0} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${selectedScripts.length > 0 ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
            {t.proceedStudio} <ArrowRight size={18} />
          </button>
      </div>
    </div>
  );
};
