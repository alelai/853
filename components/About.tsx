
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AboutProps {
  lang: Language;
}

const About: React.FC<AboutProps> = ({ lang }) => {
  const { intro, vision } = TRANSLATIONS;

  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#2A2016] mb-4 leading-tight tracking-tight">{intro.title[lang]}</h2>
            <div className="w-16 h-1 bg-[#C1A376] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-20">
            {/* Detailed Introduction */}
            <div className="flex flex-col lg:flex-row items-start gap-12">
                <div className="lg:w-3/5">
                    <div className="inline-block px-3 py-1 mb-4 bg-[#F9F6F1] text-[#C1A376] rounded text-[10px] font-black uppercase tracking-widest border border-[#C1A376]/20">
                        {intro.milestone.headline[lang]}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                        {lang === 'en' ? 'Redefining the Industrial Landscape of Macau' : '重塑澳門工業製造的技術版圖'}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed font-light mb-4">
                        {intro.milestone.paragraph[lang]}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed font-light border-l-2 border-[#C1A376] pl-4 bg-slate-50 py-3">
                        {lang === 'en' 
                          ? 'Our achievement in 2025 is not merely a bureaucratic victory; it is the manifestation of years of rigorous scientific inquiry and industrial design. By successfully operationalizing Macau\'s most advanced plaster production line, we have established a technical beachhead.' 
                          : '2025 年獲得的工業准照不僅是行政上的認可，更是多年嚴謹科研與工業設計的結晶。隨著澳門最先進自動化膏貼生產線的正式投產，我們已在功能性醫療護理領域建立了堅實的技術灘頭陣地。'}
                    </p>
                </div>
                <div className="lg:w-2/5">
                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg relative group max-w-sm mx-auto">
                        <img 
                            src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                            alt="Bio-Medical Facility"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2A2016]/40 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-white text-xl font-black mb-1 uppercase tracking-tighter">Certified 2025</div>
                            <div className="text-[#C1A376] font-bold text-[10px] tracking-widest uppercase">Industrial License No. 853-25</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategy Expansion */}
            <div className="flex flex-col lg:flex-row-reverse items-start gap-12">
                <div className="lg:w-3/5">
                    <div className="inline-block px-3 py-1 mb-4 bg-[#F9F6F1] text-[#C1A376] rounded text-[10px] font-black uppercase tracking-widest border border-[#C1A376]/20">
                        {intro.strategy.headline[lang]}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                        {lang === 'en' ? 'Accelerating Scientific Translation' : '加速科研成果向產業價值的轉化'}
                    </h3>
                    <p className="text-base text-slate-600 leading-relaxed font-light mb-6">
                        {intro.strategy.paragraph[lang]}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-[#2A2016] transition-colors">
                            <div className="text-2xl font-black text-[#C1A376]">MOP 3.5M</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/40">{lang === 'en' ? 'R&D Injection' : '首期研發投入'}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-[#2A2016] transition-colors">
                            <div className="text-2xl font-black text-[#C1A376]">CDMO 2.0</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-white/40">{lang === 'en' ? 'Service Tier' : '技術服務等級'}</div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-2/5">
                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg max-w-sm mx-auto">
                        <img 
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            alt="Engineering Excellence"
                        />
                    </div>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="pt-16 border-t border-slate-100">
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-black text-[#2A2016] uppercase tracking-tight mb-2">{vision.title[lang]}</h3>
                    <div className="w-12 h-1 bg-[#C1A376] mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {vision.items.map((item, i) => (
                        <div key={i} className="flex gap-6 group items-start">
                            <div className="text-3xl font-black text-[#C1A376]/20 transition-colors group-hover:text-[#C1A376] shrink-0">0{i+1}</div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title[lang]}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed font-light">
                                    {item.desc[lang]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
