
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface NewsProps {
  lang: Language;
}

const News: React.FC<NewsProps> = ({ lang }) => {
  const { news } = TRANSLATIONS;
  const article = news.featured;

  // Render text blocks as paragraphs
  const renderContent = (text: string) => {
    return text.split('\n').map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return <div key={index} className="h-4" />;
      return (
        <p key={index} className="mb-6 leading-relaxed text-slate-700 text-lg text-justify font-light">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Blog Header / Hero */}
      <header className="bg-[#2A2016] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
            <i className="fa-solid fa-newspaper text-[20rem] -translate-y-1/4 translate-x-1/4"></i>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-[#C1A376] font-black text-xs uppercase tracking-[0.3em] mb-4">
              <i className="fa-solid fa-calendar-days"></i>
              <span>{article.date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
              {article.headline[lang]}
            </h1>
            <div className="text-xl md:text-2xl text-[#C1A376] font-bold border-l-4 border-[#C1A376] pl-6 leading-relaxed">
              {article.subheadline[lang]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Blog Body */}
      <main className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* Main Content Card */}
          <article className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100">
            
            {/* Primary Event Photo: Signing Ceremony */}
            <div className="mb-12">
              <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                <img 
                  src="Image_20251218155359_80_22.png" 
                  alt="澳台雙域企業深度共融戰略聯結備忘協議簽署儀式" 
                  className="w-full h-auto object-cover"
                  onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/signing/1200/800"; }}
                />
              </div>
              <div className="p-4 bg-slate-50 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold mt-2">
                {lang === 'en' ? 'Protocol Signing Ceremony: Macau & Taiwan Bio-tech Strategic Partnership' : '澳台雙域企業深度共融戰略聯結備忘協議簽署儀式現場'}
              </div>
            </div>

            {/* Verbatim Content Part 1 */}
            <div className="prose prose-lg max-w-none text-slate-800">
              {renderContent(article.content[lang])}
            </div>

            {/* Secondary Event Photo: Product Presentation */}
            <div className="my-12">
              <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                <img 
                  src="Image_20251218155312_78_22.png" 
                  alt="New Product Presentation" 
                  className="w-full h-auto object-cover"
                  onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/presentation/1200/800"; }}
                />
              </div>
              <div className="p-4 bg-slate-50 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold mt-2">
                {lang === 'en' ? 'Bowtee Bouwutsou Capsules: Asia Product Premiere Ceremony' : '寶活素產品發布儀式：澳台企業家共同見證大健康創新成果'}
              </div>
            </div>

            {/* Stakeholder Profiles */}
            <div className="mt-16 pt-16 border-t border-slate-100">
              <h3 className="text-2xl font-black text-[#2A2016] mb-10 text-center uppercase tracking-tight">
                {lang === 'en' ? 'Strategic Partnership Matrix' : '戰略合作體系：核心成員'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {article.partners.map((partner, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-[#2A2016] transition-all">
                    <div className="text-[#C1A376] font-black text-sm mb-2 uppercase tracking-tight group-hover:text-[#C1A376]">
                        {partner.name[lang]}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 group-hover:text-white/40">
                        {partner.role[lang]}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-300">
                        {partner.desc[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Vision Footer */}
          <div className="mt-20 text-center px-6">
            <h4 className="text-[#C1A376] font-black text-[10px] uppercase tracking-[0.5em] mb-6">Future Outlook</h4>
            <blockquote className="text-xl md:text-2xl font-light italic text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {lang === 'en' 
                ? '"By establishing a closed-loop ecosystem of Brand-Raw Material-Production, we aim to eliminate historical bottlenecks in regional industrial growth."' 
                : '「澳門的平台優勢、台灣的技術實力，加上853的生產能力，三方將共同構建『台灣研發+澳門品牌+本地生產』的新型產業模式。」'}
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-4">
                <div className="w-12 h-px bg-slate-200"></div>
                <div className="font-bold text-[#2A2016] text-xs uppercase tracking-widest">853 Industrial Vision 2025</div>
                <div className="w-12 h-px bg-slate-200"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default News;
