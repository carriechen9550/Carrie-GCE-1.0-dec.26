
import React, { useState, useRef, useEffect } from 'react';
import { MarketingScript, StrategyConfig, ProductionSlot } from '../types';
import { TRANSLATIONS } from '../constants';
import { Download, ArrowLeft, RotateCcw, Loader2, PlayCircle, History, Check, Send, Upload, Key, Film } from 'lucide-react';

interface Props {
  selectedScripts: MarketingScript[];
  config: StrategyConfig;
  uploadedFootage: File[];
  onBack: () => void;
  onRestart: () => void;
  lang: 'en' | 'zh';
}

export const Step5Preview: React.FC<Props> = ({ selectedScripts, config, uploadedFootage, onBack, onRestart, lang }) => {
  const t = TRANSLATIONS[lang];
  const [referenceFrame, setReferenceFrame] = useState<string | null>(null);
  const [refinementImage, setRefinementImage] = useState<string | null>(null);
  const refinementFileRef = useRef<HTMLInputElement>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  const [slots, setSlots] = useState<ProductionSlot[]>(
      Array(5).fill(0).map((_, i) => ({
          id: i,
          scriptId: selectedScripts[i % selectedScripts.length]?.id || "",
          subtitleConfig: { style: "", font: "", fontSize: 0, color: "", isExplosive: false }, // Placeholder, unused in UI
          status: 'idle',
          currentUrl: null,
          history: [],
          promptHistory: []
      }))
  );

  const [activeSlotId, setActiveSlotId] = useState<number>(0);
  const [revisionInputs, setRevisionInputs] = useState<Record<number, string>>({});

  useEffect(() => {
      // Check for Veo Key on mount
      const checkKey = async () => {
          const has = await checkVeoKey();
          setHasApiKey(has);
      };
      checkKey();

      if (uploadedFootage.length > 0 && !referenceFrame) {
          const imgFile = uploadedFootage.find(f => f.type.startsWith('image/'));
          if (imgFile) {
              const reader = new FileReader();
              reader.onload = () => setReferenceFrame(reader.result as string);
              reader.readAsDataURL(imgFile);
          } else {
              const video = document.createElement('video');
              video.src = URL.createObjectURL(uploadedFootage[0]);
              video.onloadedmetadata = () => { video.currentTime = 1; };
              video.onseeked = () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = 1280; canvas.height = 720;
                  canvas.getContext('2d')?.drawImage(video, 0, 0, 1280, 720);
                  setReferenceFrame(canvas.toDataURL('image/jpeg'));
              };
          }
      }
  }, [uploadedFootage]);

  const handleRefineUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.files?.[0]) {
          const reader = new FileReader();
          reader.onload = () => setRefinementImage(reader.result as string);
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const generateSlot = async (slotId: number, instruction?: string) => {
      if (!hasApiKey) {
          await openVeoKeyDialog();
          const has = await checkVeoKey();
          setHasApiKey(has);
          if(!has) return;
      }

      const slot = slots.find(s => s.id === slotId);
      const script = selectedScripts.find(s => s.id === slot.scriptId);
      if (!slot || !script) return;

      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'generating' } : s));

      try {
          const activeReference = refinementImage || referenceFrame;
          
          let avatarDesc = "";
          if (config.selectedAvatars.length > 0) {
              avatarDesc = "Include a consistent digital human character presenter.";
          }

          const prompt = `${script.scenes.map(s => s.visual).join(' ')}. Style: ${script.style}.`;
          
          const url = await generateVeoVideo(
              prompt, 
              activeReference || undefined, 
              script.copy, 
              config.duration, 
              uploadedFootage.length, 
              "", // Clean video
              instruction,
              avatarDesc,
              config.language
          );
          
          setSlots(prev => prev.map(s => s.id === slotId ? { 
              ...s, 
              status: 'done', 
              currentUrl: url, 
              history: [url, ...s.history],
              promptHistory: [instruction || "Initial", ...s.promptHistory]
          } : s));
          setRevisionInputs(prev => ({...prev, [slotId]: ""}));
      } catch (e: any) {
          setSlots(prev => prev.map(s => s.id === slotId ? { ...s, status: 'error', error: e.message } : s));
      }
  };

  const handleRevisionSubmit = (slotId: number) => {
      const text = revisionInputs[slotId];
      if (text?.trim() || refinementImage) {
          generateSlot(slotId, text?.trim());
      }
  };

  const activeSlot = slots.find(s => s.id === activeSlotId);

  return (
    <div className="h-full flex flex-col pb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
            <h2 className="text-2xl font-bold text-white">{t.prodStudio}</h2>
            <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-800 mt-1">
                <Check size={12} /> {t.strictMode} & Clean Feed (No Subtitles)
            </div>
        </div>
        <div className="flex gap-3">
             <button onClick={onRestart} className="px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"><RotateCcw size={16} /></button>
             <button onClick={onBack} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-2"><ArrowLeft size={16} /> {t.back}</button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left Slots List */}
        <div className="col-span-3 bg-slate-800/30 border border-slate-700 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {slots.map((slot) => (
                <div key={slot.id} onClick={() => setActiveSlotId(slot.id)} className={`p-4 rounded-lg border transition-all cursor-pointer ${activeSlotId === slot.id ? 'bg-slate-800 border-blue-500 shadow-lg' : 'bg-slate-900/30 border-slate-700'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-white">{t.slot} {slot.id + 1}</span>
                        {slot.status === 'done' && <span className="text-green-400 text-xs">Ready (v{slot.history.length})</span>}
                        {slot.status === 'generating' && <Loader2 size={14} className="animate-spin text-blue-400"/>}
                        {slot.status === 'error' && <span className="text-red-400 text-xs">Error</span>}
                    </div>
                    {slot.status === 'idle' && (
                        <button onClick={(e) => { e.stopPropagation(); generateSlot(slot.id); }} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold">{t.render}</button>
                    )}
                    {slot.status === 'done' && (
                        <div className="text-xs text-slate-400">
                             Latest: {slot.promptHistory[0]?.slice(0, 20)}...
                        </div>
                    )}
                    {slot.status === 'error' && (
                        <div className="text-xs text-red-400">
                             {slot.error}
                             <button onClick={(e) => { e.stopPropagation(); generateSlot(slot.id); }} className="w-full mt-2 py-1 bg-red-900/50 text-red-200 rounded text-[10px]">Retry</button>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Right Active Preview */}
        <div className="col-span-9 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pr-2">
            {activeSlot ? (
                <>
                    {/* API Key Warning */}
                    {!hasApiKey && (
                        <div className="bg-orange-500/20 border border-orange-500/50 p-3 rounded-lg flex items-center justify-between mb-2">
                            <span className="text-orange-200 text-sm flex items-center gap-2"><Key size={16}/> Paid Veo Generation Requires User API Key Selection</span>
                            <button onClick={async () => { await openVeoKeyDialog(); setHasApiKey(await checkVeoKey()); }} className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1 rounded text-xs font-bold">Select Key</button>
                        </div>
                    )}

                    {/* Clean Video Player */}
                    <div className="w-full aspect-video bg-black rounded-xl border border-slate-700 relative flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xl">
                        {activeSlot.currentUrl ? (
                            <video src={activeSlot.currentUrl} controls className="h-full w-full object-contain" autoPlay loop />
                        ) : (
                            <div className="text-center opacity-40">
                                {activeSlot.status === 'generating' ? <Loader2 size={64} className="animate-spin text-blue-500 mx-auto"/> : <PlayCircle size={64} className="mx-auto"/>}
                                <p className="mt-4">{activeSlot.status === 'generating' ? 'Rendering High-Fidelity Asset with Veo 3.1...' : 'Select a Slot & Render'}</p>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] px-2 py-1 rounded border border-white/20 flex items-center gap-1">
                             <Film size={10}/> Clean Feed / Raw Footage
                        </div>
                    </div>

                    <div className="grid grid-cols-1">
                        {/* Refine / Modify */}
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Refine & Regenerate (Clean Feed)</label>
                            
                            <div className="flex flex-col gap-3">
                                <input 
                                    type="text" 
                                    value={revisionInputs[activeSlotId] || ''}
                                    onChange={(e) => setRevisionInputs({...revisionInputs, [activeSlotId]: e.target.value})}
                                    placeholder="e.g. 'Make camera move slower', 'Change background'..." 
                                    className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white w-full"
                                    onKeyDown={(e) => e.key === 'Enter' && handleRevisionSubmit(activeSlotId)}
                                />
                                
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                         <button onClick={() => refinementFileRef.current?.click()} className="px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-[10px] hover:text-white flex items-center gap-1 text-slate-400">
                                            <Upload size={12}/> {refinementImage ? "Change Asset" : "Upload Ref Asset"}
                                         </button>
                                         <input type="file" ref={refinementFileRef} className="hidden" accept="image/*" onChange={handleRefineUpload} />
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleRevisionSubmit(activeSlotId)}
                                        disabled={activeSlot.status === 'generating'} 
                                        className="bg-blue-600 px-4 py-1.5 rounded text-white font-bold text-xs flex items-center gap-2 hover:bg-blue-500 shadow-lg"
                                    >
                                        {activeSlot.status === 'generating' ? <Loader2 size={12} className="animate-spin"/> : <Send size={12}/>} 
                                        Gen V{activeSlot.history.length + 1}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {activeSlot.history.length > 0 && (
                        <div className="border-t border-slate-800 pt-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><History size={12}/> Version History</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {activeSlot.history.map((url, i) => (
                                    <div key={i} className={`flex justify-between items-center text-xs p-3 rounded mb-1 border ${activeSlot.currentUrl === url ? 'bg-blue-900/20 border-blue-800 text-blue-100' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>
                                        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setSlots(prev => prev.map(s => s.id === activeSlotId ? { ...s, currentUrl: url } : s))}>
                                            <span className="font-bold bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">V{activeSlot.history.length - i}</span>
                                            <span className="truncate">{activeSlot.promptHistory[i] || "Initial Version"}</span>
                                        </div>
                                        <button 
                                            onClick={() => { const a = document.createElement('a'); a.href = url; a.download = `Slot_${activeSlotId}_V${activeSlot.history.length - i}.mp4`; a.click(); }}
                                            className="text-slate-400 hover:text-white px-2 py-1 bg-slate-700 rounded flex items-center gap-1 ml-2"
                                        >
                                            <Download size={10}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">Select a slot to begin</div>
            )}
        </div>
      </div>
    </div>
  );
};
