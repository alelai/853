
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import Logo from './Logo';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLang, onLangChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = TRANSLATIONS.nav;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#2A2016] shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo and Brand Link */}
        <a href="#home" className="flex items-center space-x-3 group outline-none">
          <Logo className="w-12 h-12 transition-transform group-hover:scale-105" light={true} />
          <span className="font-bold text-lg hidden md:block text-white group-hover:text-[#C1A376] transition-colors">
            {currentLang === 'en' ? '853 Bio-Medical' : '853 國際生物醫藥'}
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-sm font-medium hover:text-[#C1A376] transition-colors text-white"
            >
              {item.label[currentLang]}
            </a>
          ))}
          
          <div className="flex items-center space-x-2 border-l pl-8 border-white/20">
            {(['en', 'zh_tw', 'zh_cn'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLangChange(lang)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  currentLang === lang 
                    ? 'bg-[#C1A376] text-[#2A2016] font-bold' 
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'zh_tw' ? '繁' : '簡'}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-2xl" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-white`}></i>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#2A2016] shadow-xl py-6 px-6 flex flex-col space-y-4 border-t border-white/10">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-white hover:text-[#C1A376]"
            >
              {item.label[currentLang]}
            </a>
          ))}
          <div className="flex space-x-4 pt-4 border-t border-white/10">
            {(['en', 'zh_tw', 'zh_cn'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onLangChange(lang);
                  setMobileMenuOpen(false);
                }}
                className={`text-sm font-bold uppercase ${currentLang === lang ? 'text-[#C1A376]' : 'text-slate-400'}`}
              >
                {lang === 'en' ? 'English' : lang === 'zh_tw' ? '繁體' : '简体'}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
