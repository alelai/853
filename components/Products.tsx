
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ProductsProps {
  lang: Language;
}

const Products: React.FC<ProductsProps> = ({ lang }) => {
  const { innovation } = TRANSLATIONS;

  return (
    <section id="innovation" className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#2A2016] mb-4 uppercase tracking-tight">{innovation.title[lang]}</h2>
            <div className="w-16 h-1 bg-[#C1A376] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-20 max-w-4xl mx-auto">
            {/* Materials Technology - Text Focused */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h4 className="text-[#C1A376] font-black text-[10px] uppercase tracking-[0.3em] mb-4">Material Excellence</h4>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">{innovation.materials.headline[lang]}</h3>
                <p className="text-base text-slate-600 leading-relaxed font-light mb-8">
                    {innovation.materials.paragraph[lang]}
                </p>
                <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                    <div className="text-center">
                        <div className="text-2xl font-black text-[#2A2016]">PP+</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Polymer</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-[#2A2016]">TPU</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Medical</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-[#2A2016]">98%</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Compatibility</div>
                    </div>
                </div>
            </div>

            {/* Digital Health Section - Text Focused */}
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                <h4 className="text-[#C1A376] font-black text-[10px] uppercase tracking-[0.3em] mb-4">Digital Transformation</h4>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">{innovation.digital.headline[lang]}</h3>
                <p className="text-base text-slate-600 leading-relaxed font-light mb-8">
                    {innovation.digital.paragraph[lang]}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#C1A376] shadow-sm">
                            <i className="fa-solid fa-microchip"></i>
                        </div>
                        <div>
                            <h5 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Smart Systems' : '智慧健康系統'}</h5>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">AI-driven personalized care</p>
                        </div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#C1A376] shadow-sm">
                            <i className="fa-solid fa-database"></i>
                        </div>
                        <div>
                            <h5 className="font-bold text-slate-900 text-sm">{lang === 'en' ? 'Data Platform' : '大健康數據平台'}</h5>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Integrated R&D analytics</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mission & Diversification - Tightened gaps */}
            <div className="bg-[#2A2016] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden">
                <div className="max-w-3xl relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-[#C1A376] leading-tight">
                        {lang === 'en' ? 'Strategic Future' : '戰略未來：以科技引領健康生活'}
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                            {lang === 'en' 
                              ? '853 Bio-Medical is deeply committed to "Macau\'s Moderate Economic Diversification." By establishing high-end manufacturing infrastructures and fostering cross-border ecosystems, we create high-value industrial assets for the GBA.' 
                              : '澳門 853 國際生物醫藥深度契合「澳門經濟適度多元發展」的戰略藍圖。通過建立高端製造基礎設施，並構建「澳門研發+橫琴生產」的跨境聯動模式，我們正在打造具備高附加值的產業資產。'}
                        </p>
                        <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">
                            {lang === 'en'
                              ? 'We evolve from a supplier to a lifestyle advocate, ensuring that every resident in Macau and the Greater Bay Area can access precision healthcare that is both advanced and human-centric.'
                              : '我們正從單純的醫療產品供應商進階為健康生活的倡導者。我們的使命是將專業的醫藥知識與數字化個性方案深度融合，確保大灣區居民都能享受到前瞻性、人性關懷的精準醫療服務。'}
                        </p>
                    </div>
                </div>
                {/* Decorative element */}
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <i className="fa-solid fa-dna text-9xl"></i>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
