
import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Search, FileText } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface Props {
  onAnalyze: (input: string, image?: string) => void;
  isLoading: boolean;
  lang: 'en' | 'zh';
}

export const Step1Input: React.FC<Props> = ({ onAnalyze, isLoading, lang }) => {
  const t = TRANSLATIONS[lang];
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 mb-4">
          {t.s1Title}
        </h1>
        <p className="text-slate-400 text-lg">
          {t.s1Subtitle}
        </p>
      </div>

      <div className="w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-3 bg-slate-700 rounded-lg text-white font-medium hover:bg-slate-600 transition flex items-center justify-center gap-2">
            <LinkIcon size={18} /> {t.prodUrl}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 py-3 border rounded-lg font-medium transition flex items-center justify-center gap-2 ${selectedImage ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50'}`}
          >
             <Upload size={18} /> {selectedImage ? t.imgUploaded : t.uploadImg}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {selectedImage && (
            <div className="mb-4 relative w-24 h-24">
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-lg border border-slate-600" />
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                >
                    ×
                </button>
            </div>
        )}

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.pastePlaceholder}
          className="w-full h-40 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
        />

        <button
          onClick={() => onAnalyze(input, selectedImage || undefined)}
          disabled={(!input && !selectedImage) || isLoading}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            isLoading 
              ? 'bg-slate-700 cursor-not-allowed text-slate-400'
              : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {t.analyzing}
            </>
          ) : (
            <>
              <Search size={20} /> {t.analyzeBtn}
            </>
          )}
        </button>
      </div>
      
      <div className="mt-8 flex gap-6 text-slate-500 text-sm">
        <span>{t.footerPower}</span>
        <span>•</span>
        <span>{t.footerSpy}</span>
        <span>•</span>
        <span>{t.footerReverse}</span>
      </div>
    </div>
  );
};
