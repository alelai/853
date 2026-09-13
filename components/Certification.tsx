
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CertificationProps {
  lang: Language;
}

const Certification: React.FC<CertificationProps> = ({ lang }) => {
  const { certification } = TRANSLATIONS;

  return (
    <section id="certification" className="py-20 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-14 text-center">
          <div className="inline-block px-4 py-1 mb-5 rounded-full bg-[#C1A376]/10 border border-[#C1A376]/40 text-[#C1A376] text-[10px] font-black uppercase tracking-widest">
            {certification.badge[lang]}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#2A2016] mb-4 tracking-tight">{certification.title[lang]}</h2>
          <p className="text-lg md:text-xl text-[#C1A376] font-bold mb-4 leading-snug">{certification.subtitle[lang]}</p>
          <div className="w-16 h-1 bg-[#C1A376] mx-auto rounded-full mb-8"></div>
          <p className="text-base text-slate-600 leading-relaxed font-light text-justify md:text-center">{certification.paragraph[lang]}</p>
        </div>

        {/* Risk classification & pathway */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
            <h3 className="text-xl md:text-2xl font-black text-[#2A2016]">{certification.classificationTitle[lang]}</h3>
            <p className="text-xs text-slate-400 font-light">{certification.classificationNote[lang]}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {certification.classes.map((cls, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 text-center hover:shadow-md hover:bg-white transition-all">
                <div className="text-2xl font-black text-[#2A2016] mb-1">{cls.level[lang]}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-4">{cls.risk[lang]}</div>
                <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-black tracking-wide ${i < 2 ? 'bg-[#C1A376]/15 text-[#8A6D3B]' : 'bg-[#2A2016] text-[#C1A376]'}`}>
                  {cls.path[lang]}
                </span>
                <p className="text-xs text-slate-500 mt-4 leading-relaxed font-light">{cls.desc[lang]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform capabilities */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-[#2A2016] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <i className="fa-solid fa-shield-halved text-9xl"></i>
            </div>
            <div className="relative z-10">
              <h4 className="text-[#C1A376] font-black text-[10px] uppercase tracking-[0.3em] mb-4">AI + Compliance</h4>
              <h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight">{certification.platformTitle[lang]}</h3>
              <p className="text-sm md:text-base text-slate-300 font-light mb-10">{certification.platformSubtitle[lang]}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certification.features.map((feat, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all">
                    <div className="w-10 h-10 shrink-0 bg-[#C1A376]/15 rounded-xl flex items-center justify-center text-[#C1A376]">
                      <i className={feat.icon}></i>
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 font-medium leading-snug">{feat.label[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cooperation models */}
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <h3 className="text-xl md:text-2xl font-black text-[#2A2016] mb-6">{certification.modesTitle[lang]}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {certification.modes.map((mode, i) => (
              <span key={i} className="px-5 py-2 rounded-full bg-slate-50 border border-[#C1A376]/30 text-slate-700 text-xs md:text-sm font-bold hover:border-[#C1A376] hover:text-[#2A2016] transition-all">
                {mode.name[lang]}
              </span>
            ))}
          </div>
        </div>

        {/* Validation stats */}
        <div className="max-w-5xl mx-auto mb-10">
          <h3 className="text-center text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">{certification.statsTitle[lang]}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-b border-slate-100 py-10">
            {certification.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#2A2016] mb-2">{stat.value}</div>
                <div className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="max-w-4xl mx-auto text-center text-[11px] leading-relaxed text-slate-400 font-light">
          <i className="fa-solid fa-circle-info mr-1 text-[#C1A376]"></i>
          {certification.disclaimer[lang]}
        </p>
      </div>
    </section>
  );
};

export default Certification;
