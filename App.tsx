
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Facilities from './components/Facilities';
import Products from './components/Products';
import Hengqin from './components/Hengqin';
import News from './components/News';
import Footer from './components/Footer';
import { Language } from './types';

const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>('zh_tw');

  const handleLangChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  return (
    <div className="min-h-screen">
      <Navbar currentLang={currentLang} onLangChange={handleLangChange} />
      <Hero lang={currentLang} />
      <About lang={currentLang} />
      <Facilities lang={currentLang} />
      <Hengqin lang={currentLang} />
      <Products lang={currentLang} />
      <News lang={currentLang} />
      <Footer lang={currentLang} />
    </div>
  );
};

export default App;
