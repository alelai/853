
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface DosageFormsProps {
  lang: Language;
}

const DosageForms: React.FC<DosageFormsProps> = ({ lang }) => {
  const { dosageForms } = TRANSLATIONS;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#2A2016] mb-4 uppercase tracking-tight">{dosageForms.title[lang]}</h2>
          <div className="w-20 h-1.5 bg-[#C1A376] mx-auto rounded-full mb-6"></div>
          <p className="text-slate-500 max-w-2xl mx-auto">{dosageForms.subtitle[lang]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dosageForms.items.map((form) => (
            <div key={form.id} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-2">
              <div className="w-16 h-16 bg-[#F9F6F1] rounded-2xl flex items-center justify-center mb-8 text-[#C1A376] group-hover:bg-[#2A2016] group-hover:text-[#C1A376] transition-colors">
                {form.id === 'capsule' && <i className="fa-solid fa-pills text-3xl"></i>}
                {form.id === 'tablet' && <i className="fa-solid fa-circle-dot text-3xl"></i>}
                {form.id === 'plaster' && <i className="fa-solid fa-bandage text-3xl"></i>}
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-4">{form.name[lang]}</h4>
              <p className="text-slate-600 mb-8 leading-relaxed">{form.desc[lang]}</p>
              <div className="flex flex-wrap gap-2">
                {form.specs.map((spec, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider group-hover:bg-[#C1A376]/10 group-hover:text-[#C1A376] transition-colors">
                    {spec[lang]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DosageForms;
