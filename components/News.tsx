
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NewsProps {
  lang: Language;
}

const News: React.FC<NewsProps> = ({ lang }) => {
  const { news } = TRANSLATIONS;
  const article = news.featured;

  // Function to split long text by newlines and render as paragraphs
  const renderContent = (text: string) => {
    return text.split('\n').map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return <div key={index} className="h-1" />; // Extremely tight gap for empty lines
      return (
        <p key={index} className="mb-2.5 leading-relaxed text-slate-300 font-light text-sm md:text-base text-justify">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <section id="news" className="py-20 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-extrabold text-[#2A2016] mb-3 uppercase tracking-tight">{news.title[lang]}</h2>
          <div className="w-16 h-1 bg-[#C1A376] rounded-full mx-auto md:mx-0"></div>
        </div>

        <div className="bg-[#2A2016] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="flex flex-col">
            {/* News Images Hero Area - Compact height */}
            <div className="relative bg-slate-100 h-[250px] md:h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="relative overflow-hidden group border-r border-white/5">
                  <img 
                    src="https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/853-signing-2.jpg" 
                    alt="Strategic Signing Ceremony" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/signing1/1200/800"; }}
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="hidden md:block relative overflow-hidden group">
                  <img 
                    src="https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/853-signing-1.jpg" 
                    alt="Strategic Dialogue" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/signing2/1200/800"; }}
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              </div>
              
              <div className="absolute top-5 left-5 bg-[#C1A376] text-[#2A2016] px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg z-10">
                Strategic Event
              </div>
            </div>

            {/* Comprehensive Article Body */}
            <div className="p-8 md:p-12 lg:p-16 text-white max-w-4xl mx-auto">
              <div className="text-[#C1A376] font-bold mb-4 flex items-center gap-3 text-xs uppercase tracking-widest">
                <i className="fa-regular fa-calendar"></i>
                <span>{article.date}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black mb-6 leading-tight text-white border-l-4 border-[#C1A376] pl-6">
                {article.headline[lang]}
              </h3>
              
              <div className="text-base md:text-lg text-slate-400 font-medium mb-8 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/10 italic">
                {article.subheadline[lang]}
              </div>
              
              <div className="article-content">
                {renderContent(article.content[lang])}
              </div>

              {/* Partner Profiles Grid - Compact version */}
              <div className="mt-12 pt-10 border-t border-white/10">
                <h4 className="text-[#C1A376] font-black text-[9px] uppercase tracking-[0.3em] mb-8 text-center">Stakeholder Matrix</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {article.partners.map((partner, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-[#C1A376]/20 transition-all">
                      <div className="text-[#C1A376] font-black text-sm uppercase tracking-tight mb-1">{partner.name[lang]}</div>
                      <div className="text-white text-[8px] font-bold opacity-50 mb-3 uppercase tracking-wider">{partner.role[lang]}</div>
                      <div className="text-slate-500 text-[10px] leading-tight">{partner.desc[lang]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Vision Quote - Tightened */}
        <div className="mt-12 text-center max-w-3xl mx-auto px-6">
          <blockquote className="text-lg md:text-xl font-light text-slate-600 italic leading-relaxed">
            {lang === 'en' 
              ? '"澳門的平台優勢、台灣的技術實力，加上853的生產能力，三方將共同構建新型產業模式。"' 
              : '「澳門的平台優勢、台灣的技術實力，加上853的生產能力，三方將共同構建『台灣研發+澳門品牌+本地生產』的新型產業模式，為大灣區生物科技產業升級提供樣板。」'}
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-slate-200"></div>
            <div className="font-bold text-[#C1A376] uppercase tracking-[0.2em] text-[9px]">853 Industrial Vision</div>
            <div className="w-6 h-px bg-slate-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
