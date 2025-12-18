
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface FacilitiesProps {
  lang: Language;
}

const Facilities: React.FC<FacilitiesProps> = ({ lang }) => {
  const { services } = TRANSLATIONS;

  const tags: Record<string, Record<Language, string>> = {
    essentialOils: {
      en: 'Essential Oils',
      zh_tw: '植物精油',
      zh_cn: '植物精油'
    },
    naturalScents: {
      en: 'Natural Scents',
      zh_tw: '天然香型',
      zh_cn: '天然香型'
    },
    skinAdhesion: {
      en: 'Skin Adhesion',
      zh_tw: '高貼合性',
      zh_cn: '高贴合性'
    },
    breathability: {
      en: 'Breathability',
      zh_tw: '極致透氣',
      zh_cn: '极致透气'
    }
  };

  const tagList = [tags.essentialOils, tags.naturalScents, tags.skinAdhesion, tags.breathability];

  return (
    <section id="services" className="py-24 bg-slate-50 text-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-[#2A2016] mb-6 tracking-tight uppercase">{services.title[lang]}</h2>
          <p className="text-xl text-[#C1A376] font-bold uppercase tracking-[0.2em]">{lang === 'en' ? 'Manufacturing & OEM Solutions' : '製造能力與代工解決方案'}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-20">
            {/* Manufacturing Deep Dive */}
            <div className="bg-white p-12 lg:p-16 rounded-[4rem] shadow-xl shadow-slate-200 border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/2 space-y-6">
                    <div className="w-16 h-1 bg-[#C1A376] rounded-full mb-4"></div>
                    <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                        {services.manufacturing.headline[lang]}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed font-light italic bg-slate-50 p-6 rounded-2xl border-l-4 border-[#C1A376]">
                        {services.manufacturing.paragraph[lang]}
                    </p>
                </div>
                <div className="lg:w-1/2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-[#2A2016] rounded-3xl p-8 flex flex-col justify-center text-center">
                            <div className="text-4xl font-black text-[#C1A376] mb-2">3</div>
                            <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{lang === 'en' ? 'Active Lines' : '自動化產線'}</div>
                        </div>
                        <div className="aspect-square bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-center text-center">
                            <div className="text-4xl font-black text-[#C1A376] mb-2">11U</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lang === 'en' ? 'Strategic Floor' : '核心廠址'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OEM/Market Deep Dive */}
            <div className="bg-[#2A2016] p-12 lg:p-16 rounded-[4rem] shadow-2xl text-white flex flex-col lg:flex-row-reverse gap-12 items-center">
                <div className="lg:w-1/2 space-y-6">
                    <div className="w-16 h-1 bg-[#C1A376] rounded-full mb-4"></div>
                    <h3 className="text-3xl font-extrabold text-white leading-tight">
                        {services.oem.headline[lang]}
                    </h3>
                    <p className="text-lg text-slate-300 leading-relaxed font-light">
                        {services.oem.paragraph[lang]}
                    </p>
                </div>
                <div className="lg:w-1/2">
                    <div className="p-8 border border-white/10 bg-white/5 rounded-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#C1A376] rounded-xl flex items-center justify-center text-[#2A2016]">
                                <i className="fa-solid fa-flask-vial text-2xl"></i>
                            </div>
                            <div className="text-xl font-bold text-[#C1A376]">{lang === 'en' ? 'Natural Innovations' : '天然技術創新'}</div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {tagList.map((tag, i) => (
                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#C1A376]">
                                    {tag[lang]}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
