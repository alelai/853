
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import Logo from './Logo';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const { footer } = TRANSLATIONS;

  // Group contacts based on the list provided by user
  const groupedContacts = [
    {
      title: lang === 'en' ? 'Main Entities' : '主體單位',
      contacts: footer.contactList.slice(0, 5) // Mask, Sales Email, Pharmacy, Bio-Medical, Enquiry Email
    },
    {
      title: lang === 'en' ? 'Direct Contact' : '業務諮詢',
      contacts: footer.contactList.slice(5) // Ms Chen, Ms Huang, Fax
    }
  ];

  return (
    <footer id="contact" className="bg-[#2A2016] text-white pt-16 pb-10 overflow-hidden relative border-t border-white/5">
      {/* Decorative BG element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C1A376]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Mission Column */}
          <div className="col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <Logo className="w-10 h-10" light={true} />
              <div>
                <h3 className="text-lg font-black tracking-tight text-white uppercase leading-none">853 Bio-Medical</h3>
                <p className="text-[#C1A376] text-[8px] tracking-[0.2em] font-bold uppercase mt-1">{lang === 'en' ? 'International Technology' : '國際生物醫藥'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
                <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs">
                    {lang === 'en' 
                        ? 'Macau Bio-tech: New Engine for Healthcare. Strategic partner for entering the Macau health market with zero-tariff advantages.' 
                        : '濠概與 853：澳門大健康製造新引擎。進軍澳門大健康市場的戰略夥伴，提供研發、生產及一站式落地解決方案。'}
                </p>
                <div className="flex space-x-2.5 pt-2">
                    <a href="#" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C1A376] hover:text-[#2A2016] transition-colors border border-white/10 text-[10px]"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C1A376] hover:text-[#2A2016] transition-colors border border-white/10 text-[10px]"><i className="fa-brands fa-weixin"></i></a>
                    <a href="#" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C1A376] hover:text-[#2A2016] transition-colors border border-white/10 text-[10px]"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
            </div>
          </div>

          {/* Grouped Contacts Columns */}
          {groupedContacts.map((group, gIdx) => (
            <div key={gIdx} className="col-span-1">
              <h5 className="text-[10px] font-black mb-6 text-white border-b border-[#C1A376]/30 pb-2 inline-block uppercase tracking-widest">{group.title}</h5>
              <div className="space-y-4">
                  {group.contacts.map((c, i) => (
                      <div key={i} className="flex flex-col space-y-0.5 group">
                          <span className="text-[#C1A376] font-bold text-[8px] uppercase tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">{c.label[lang]}</span>
                          <span className="text-slate-200 text-[11px] font-medium transition-colors group-hover:text-white">{c.value}</span>
                      </div>
                  ))}
              </div>
            </div>
          ))}

          {/* QR Code & Direct Action Column */}
          <div className="col-span-1 flex flex-col items-start lg:items-end">
            <h5 className="text-[10px] font-black mb-6 text-white border-b border-[#C1A376]/30 pb-2 inline-block uppercase tracking-widest">{lang === 'en' ? 'Scan to Connect' : '掃碼諮詢'}</h5>
            <div className="p-1 bg-white rounded-xl shadow-lg inline-block">
                <img 
                  src="https://raw.githubusercontent.com/StackBlitz/stackblitz-images/main/853-wechat-qr.png" 
                  alt="WeChat QR Code" 
                  className="w-20 h-20 block"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100?text=853+WeChat";
                  }}
                />
            </div>
            <p className="text-[8px] text-slate-500 mt-3 uppercase tracking-widest text-left lg:text-right">
                {lang === 'en' ? 'Official Business WeChat' : '官方業務微信'}
            </p>
          </div>
        </div>

        {/* Bottom Address & Rights */}
        <div className="border-t border-white/10 pt-8 flex flex-col items-center text-center space-y-4">
          <div className="flex items-start max-w-2xl justify-center">
              <i className="fa-solid fa-location-dot mt-0.5 mr-2 text-[#C1A376] text-[10px]"></i>
              <span className="text-slate-400 text-[10px] leading-relaxed uppercase tracking-wide">{footer.address[lang]}</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center w-full pt-2 text-[8px] text-slate-500 uppercase tracking-[0.1em]">
            <p>{footer.rights[lang]}</p>
            <div className="flex space-x-5 mt-2 md:mt-0 font-bold">
              <a href="#" className="hover:text-[#C1A376] transition-colors">{lang === 'en' ? 'Privacy' : '隱私'}</a>
              <a href="#" className="hover:text-[#C1A376] transition-colors">{lang === 'en' ? 'Terms' : '條款'}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
