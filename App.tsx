
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Facilities from './components/Facilities';
import Products from './components/Products';
import Hengqin from './components/Hengqin';
import News from './components/News';
import Footer from './components/Footer';
import { Language } from './types';

type Page = 'home' | 'news';

const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('zh_tw');
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Handle back-to-top when changing pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    // Close mobile menu or other stateful UI if needed
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar 
        currentLang={currentLang} 
        onLangChange={handleLangChange} 
        onNavigate={navigateTo}
        currentPage={currentPage}
      />
      
      {currentPage === 'home' ? (
        <>
          <Hero lang={currentLang} />
          <About lang={currentLang} />
          <Facilities lang={currentLang} />
          <Hengqin lang={currentLang} />
          <Products lang={currentLang} />
        </>
      ) : (
        <News lang={currentLang} />
      )}
      
      <Footer lang={currentLang} />
    </div>
  );
};

export default App;
