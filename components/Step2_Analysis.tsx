
import React, { useState } from 'react';
import { ProductAnalysis, CompetitorData } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, AlertCircle, CheckCircle, Video, ArrowLeft, RotateCcw, ExternalLink, Plus, ShoppingBag, HelpCircle, ThumbsDown, MessageCircle } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  product: ProductAnalysis;
  competitors: CompetitorData[];
  onNext: (userHooks: string[]) => void;
  onBack: () => void;
  onRestart: () => void;
  lang: 'en' | 'zh';
}

export const Step2Analysis: React.FC<Props> = ({ product, competitors, onNext, onBack, onRestart, lang }) => {
  const t = TRANSLATIONS[lang];
  const [customHooks, setCustomHooks] = useState<string[]>([]);
  const [newHook, setNewHook] = useState('');

  const addHook = () => {
    if (newHook.trim()) {
      setCustomHooks([...customHooks, newHook.trim()]);
      setNewHook('');
    }
  };

  const handleNext = () => {
      const original = product.sellingPoints.map(sp => sp.point);
      const allHooks = [...original, ...customHooks];
      onNext(allHooks);
  };

  const openLink = (url: string) => {
      window.open(url, '_blank');
  };

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-6 pb-20 custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t.s2Title}</h2>
          <p className="text-slate-400">{t.s2Subtitle}</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={onRestart}
                className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-slate-700"
            >
                <RotateCcw size={16} /> {t.restart}
            </button>
            <button 
                onClick={onBack}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
                <ArrowLeft size={16} /> {t.back}
            </button>
            <button 
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
            {t.proceedStrategy}
            </button>
        </div>
      </div>

      {/* Product DNA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 col-span-2">
            <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <CheckCircle size={20} /> {t.prodDna}
            </h3>
            <div className="space-y-4">
                <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">{t.preciseCat}</span>
                    <div className="text-white text-lg font-mono bg-slate-900/50 p-2 rounded border border-slate-800">{product.category}</div>
                </div>
                <div>
                    <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">{t.detailedUsp}</span>
                    <div className="text-white bg-slate-700/30 p-3 rounded-lg border-l-4 border-blue-500 mt-1">
                        {product.usp}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">{t.painPoints}</span>
                        <ul className="list-disc list-inside text-slate-300 space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                            {product.painPoints.map((p, i) => <li key={i} className="text-sm">{p}</li>)}
                        </ul>
                    </div>
                    <div>
                         <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">{t.targetAudience}</span>
                         <p className="text-slate-300 text-sm whitespace-pre-line max-h-40 overflow-y-auto custom-scrollbar">{product.targetAudience}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Selling Points & Hooks - Enlarged */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col h-[500px]">
             <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> {t.topHooks}
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto mb-4 custom-scrollbar">
                {product.sellingPoints.map((sp, i) => (
                    <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        <div className="font-medium text-white text-sm">{sp.point}</div>
                        <div className="text-xs text-slate-400 italic mt-1">"{sp.hook}"</div>
                    </div>
                ))}
                {customHooks.map((hook, i) => (
                     <div key={`c-${i}`} className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/50">
                        <div className="font-medium text-white text-sm">{hook}</div>
                        <div className="text-xs text-blue-400 italic mt-1">(Custom)</div>
                    </div>
                ))}
            </div>
            
            <div className="mt-auto">
                <label className="text-xs text-slate-500 mb-1 block">{t.addHookLabel}</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newHook}
                        onChange={(e) => setNewHook(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        placeholder={t.addHookPlaceholder}
                        onKeyDown={(e) => e.key === 'Enter' && addHook()}
                    />
                    <button 
                        onClick={addHook}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded p-2"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Market Pulse & Sentiment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* AnswerThePublic Data (Top 50) */}
         <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 h-[500px] flex flex-col">
            <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <HelpCircle size={20} /> {t.publicRadar} (Top 50)
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar p-1">
                {product.marketQuestions && product.marketQuestions.length > 0 ? (
                    product.marketQuestions.map((q, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-xs w-6">{i + 1}.</span>
                            <span className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-1 rounded uppercase min-w-[40px] text-center">{q.type}</span>
                            <span className="text-slate-200 text-sm flex-1">{q.question}</span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <TrendingUp size={10} /> {q.volume}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-500 text-sm italic">{t.analyzingTrends}</div>
                )}
            </div>
         </div>

         {/* Trustpilot/Amazon Negative Data (Top 50) */}
         <div className="bg-slate-800/50 border border-red-900/30 rounded-xl p-6 h-[500px] flex flex-col">
             <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
                <ThumbsDown size={20} /> {t.compWeakness} (Top 50)
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar p-1">
                <p className="text-xs text-slate-500 mb-2">{t.compWeaknessSub}</p>
                {product.negativeReviews && product.negativeReviews.length > 0 ? (
                    product.negativeReviews.map((rev, i) => (
                        <div key={i} className="bg-red-950/20 p-3 rounded-lg border border-red-900/20">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-slate-500 text-[10px] mr-1">#{i + 1}</span>
                                <span className="text-[10px] bg-red-900/50 text-red-200 px-1.5 rounded">{rev.source}</span>
                            </div>
                            <p className="text-red-100/90 text-sm">"{rev.complaint}"</p>
                        </div>
                    ))
                ) : (
                     <div className="text-slate-500 text-sm italic">{t.scanning}</div>
                )}
            </div>
         </div>
      </div>

      {/* Competitor Spy Section */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-violet-400 mb-6 flex items-center gap-2">
            <Users size={20} /> {t.compIntel}
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 border-b border-slate-700 text-sm">
                                <th className="py-3 px-2">{t.tableComp}</th>
                                <th className="py-3 px-2">{t.tablePlatform}</th>
                                <th className="py-3 px-2">{t.tableConv}</th>
                                <th className="py-3 px-2">{t.tableStrat}</th>
                                <th className="py-3 px-2">{t.tableAssets}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {competitors.map((comp) => (
                                <tr key={comp.id} className="border-b border-slate-800 hover:bg-slate-700/20 transition">
                                    <td className="py-3 px-2 font-medium text-white">{comp.name}</td>
                                    <td className="py-3 px-2 text-slate-400">{comp.platform}</td>
                                    <td className="py-3 px-2 text-green-400 font-bold">{comp.conversionRate}%</td>
                                    <td className="py-3 px-2 text-slate-300 truncate max-w-[150px]">{comp.strategy}</td>
                                    <td className="py-3 px-2 flex gap-2">
                                        <button 
                                            onClick={() => openLink(comp.topVideoUrl)}
                                            className="text-violet-400 hover:text-violet-300 flex items-center gap-1 text-xs px-2 py-1 bg-violet-900/30 rounded border border-violet-800 hover:bg-violet-900/50 transition"
                                            title="View Viral Video Search"
                                        >
                                            <Video size={14} /> {t.viewVideo}
                                        </button>
                                        <button 
                                            onClick={() => openLink(comp.productUrl)}
                                            className="text-orange-400 hover:text-orange-300 flex items-center gap-1 text-xs px-2 py-1 bg-orange-900/30 rounded border border-orange-800 hover:bg-orange-900/50 transition"
                                            title="View Product Page Search"
                                        >
                                            <ShoppingBag size={14} /> {t.viewShop}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Chart */}
            <div className="h-64 bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-xs uppercase text-slate-500 font-bold mb-4">{t.convBench}</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitors}>
                        <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} interval={0} />
                        <YAxis tick={{fill: '#94a3b8', fontSize: 10}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}}
                            itemStyle={{color: '#fff'}}
                        />
                        <Bar dataKey="conversionRate" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                            {competitors.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};
