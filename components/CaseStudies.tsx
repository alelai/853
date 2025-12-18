
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CaseStudiesProps {
  lang: Language;
}

const CaseStudies: React.FC<CaseStudiesProps> = ({ lang }) => {
  const { caseStudies } = TRANSLATIONS;

  return (
    <section id="products" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-4xl font-extrabold text-[#2A2016] mb-4">{caseStudies.title[lang]}</h2>
          <div className="w-20 h-1.5 bg-[#C1A376] rounded-full"></div>
        </div>

        <div className="space-y-32">
          {caseStudies.items.map((item, idx) => (
            <div key={idx} className={`flex flex-col lg:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2 space-y-8">
                <div className="inline-block px-4 py-1 bg-[#F9F6F1] text-[#C1A376] rounded-lg font-black text-xs uppercase tracking-[0.2em] border border-[#C1A376]/20">
                  {item.type[lang]}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                  {item.title[lang]}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {item.desc[lang]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <i className="fa-solid fa-check-double text-[#C1A376]"></i>
                      <span className="font-bold text-slate-700 text-sm">{pt[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 group">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl transform transition-transform group-hover:scale-[1.02]">
                  <img src={item.image} alt={item.title[lang]} className="w-full h-[450px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A2016]/60 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
