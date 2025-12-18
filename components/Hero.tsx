
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const { hero } = TRANSLATIONS;

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#2A2016]/95 to-[#4E3B29]/70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-white">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[#C1A376]/20 border border-[#C1A376]/40 backdrop-blur-md text-[#C1A376] text-sm font-semibold tracking-wider">
            {lang === 'en' ? 'OFFICIAL 853 MEDICAL BRAND' : '853 醫療官方品牌'}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            {hero.title[lang]}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed font-light">
            {hero.subtitle[lang]}
          </p>
        </div>
      </div>

      {/* Stats Indicator */}
      <div className="absolute bottom-10 right-10 hidden xl:flex flex-col space-y-6">
        <div className="text-right border-r-4 border-[#C1A376] pr-6 py-1">
            <div className="text-3xl font-black text-white">MOP 3M+</div>
            <div className="text-[#C1A376] text-xs uppercase tracking-widest">{lang === 'en' ? 'Investment' : '項目投入'}</div>
        </div>
        <div className="text-right border-r-4 border-[#4E3B29] pr-6 py-1">
            <div className="text-3xl font-black text-white">367</div>
            <div className="text-slate-400 text-xs uppercase tracking-widest">{lang === 'en' ? 'Local Partners' : '合作藥房'}</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i className="fa-solid fa-chevron-down text-[#C1A376]/70 text-xl"></i>
      </div>
    </section>
  );
};

export default Hero;
