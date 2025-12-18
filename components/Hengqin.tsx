
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HengqinProps {
  lang: Language;
}

const Hengqin: React.FC<HengqinProps> = ({ lang }) => {
  const { hengqin } = TRANSLATIONS;

  return (
    <section id="hengqin" className="py-24 bg-[#2A2016] relative overflow-hidden text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C1A376]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
            <div className="inline-block px-3 py-1 bg-[#C1A376] text-[#2A2016] text-[10px] font-black uppercase mb-4 tracking-widest rounded-full">
                {lang === 'en' ? 'GBA Strategic Base' : '粵港澳大灣區核心產業基地'}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tighter">
                {hengqin.title[lang]}
            </h2>
            <p className="text-xl text-[#C1A376] font-bold mb-6 uppercase tracking-wide border-l-2 border-[#C1A376] pl-6">
                {hengqin.subtitle[lang]}
            </p>
            <div className="text-lg text-slate-300 leading-relaxed font-light">
                {hengqin.paragraph[lang]}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
                {hengqin.sections.map((sec, i) => (
                    <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-[#C1A376] flex items-center justify-center text-[#2A2016] text-lg font-black shadow-lg">
                                {i + 1}
                            </div>
                            <h4 className="text-xl font-bold group-hover:text-[#C1A376] transition-colors">{sec.title[lang]}</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            {sec.desc[lang]}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {sec.list.map((item, idx) => (
                                <li key={idx} className="flex items-center text-slate-200 text-xs">
                                    <i className="fa-solid fa-square-check text-[#C1A376] mr-3"></i>
                                    <span className="font-medium">{item[lang]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="lg:sticky lg:top-24 space-y-8">
                {/* Cross Border Logic Visualization - Made Smaller */}
                <div className="p-8 bg-[#C1A376] rounded-[2rem] text-[#2A2016] shadow-xl relative overflow-hidden">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b border-[#2A2016]/10 pb-3">Operational Architecture</h5>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full border border-[#2A2016] flex items-center justify-center font-black text-xs">1</div>
                            <div>
                                <div className="font-black text-sm">{lang === 'en' ? 'Macau R&D' : '澳門研發核心'}</div>
                                <div className="text-[10px] opacity-80">{lang === 'en' ? 'Academic synergy' : '學術協同研發'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full border border-[#2A2016] flex items-center justify-center font-black text-xs">2</div>
                            <div>
                                <div className="font-black text-sm">{lang === 'en' ? 'Hengqin Base' : '橫琴規模化生產'}</div>
                                <div className="text-[10px] opacity-80">{lang === 'en' ? 'Industrial scalability' : '量產與國際標準'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full border border-[#2A2016] flex items-center justify-center font-black text-xs">3</div>
                            <div>
                                <div className="font-black text-sm">{lang === 'en' ? 'Global Markets' : '全球市場佈局'}</div>
                                <div className="text-[10px] opacity-80">{lang === 'en' ? 'Logistics & export' : '全球智慧物流'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Quote */}
                <div className="p-8 border border-white/10 rounded-[2rem] bg-white/5">
                    <p className="text-base font-light italic text-slate-400 mb-4">
                        {lang === 'en' 
                          ? '"Hengqin represents the industrial physicalization of our innovations, scaling TCM modernization projects to the global network."' 
                          : '「橫琴基地是我們澳門研發成果的產業化落地。它提供了無縫對接的物流環境，使我們的中醫藥現代化項目能高效輻射至全球市場。」'}
                    </p>
                    <div className="font-black text-[#C1A376] uppercase tracking-widest text-[9px]">853 Industrial Board</div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hengqin;
