
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AdvantagesProps {
  lang: Language;
}

const Advantages: React.FC<AdvantagesProps> = ({ lang }) => {
  const { advantages } = TRANSLATIONS;

  return (
    <section id="advantages" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-extrabold text-[#2A2016] mb-4">{advantages.title[lang]}</h2>
            <p className="text-2xl text-[#C1A376] font-medium mb-12 leading-tight">
              {advantages.subtitle[lang]}
            </p>
            <div className="space-y-8">
              {advantages.items.map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="w-16 h-16 shrink-0 bg-[#F9F6F1] rounded-2xl flex items-center justify-center text-[#C1A376] font-black text-xs border border-slate-100 group-hover:bg-[#C1A376] group-hover:text-white transition-all">
                    {item.highlight[lang]}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title[lang]}</h4>
                    <p className="text-slate-600 leading-relaxed">{item.desc[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="World Map Distribution" />
              <div className="absolute inset-0 bg-[#2A2016]/20"></div>
              {/* Pulsing indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-[#C1A376] rounded-full animate-ping"></div>
                <div className="w-4 h-4 bg-[#C1A376] rounded-full absolute top-0 left-0"></div>
              </div>
            </div>
            {/* Tag Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-[#2A2016] text-white p-8 rounded-3xl shadow-xl max-w-xs border border-white/10">
              <div className="text-3xl font-black text-[#C1A376] mb-1">GBA</div>
              <div className="text-sm font-medium opacity-80 uppercase tracking-widest">
                {lang === 'en' ? 'Core Hub Competitive Strength' : '大灣區獨具競爭力優勢'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
