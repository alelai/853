
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MilestonesProps {
  lang: Language;
}

const Milestones: React.FC<MilestonesProps> = ({ lang }) => {
  const { milestone } = TRANSLATIONS;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 uppercase tracking-wider">{milestone.title[lang]}</h2>
        <div className="w-20 h-1.5 bg-[#C1A376] mx-auto rounded-full"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {milestone.items.map((item, idx) => (
            <div key={idx} className="relative bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl transition-shadow group">
              <div className="absolute -top-6 -left-4 bg-[#C1A376] text-[#2A2016] font-black px-6 py-2 rounded-lg skew-x-[-10deg] shadow-lg group-hover:scale-105 transition-transform">
                {item.date[lang]}
              </div>
              <p className="mt-4 text-slate-700 leading-relaxed text-lg">
                {item.text[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Milestones;
