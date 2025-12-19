
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
export type Language = 'en' | 'zh_tw' | 'zh_cn';

export interface NavItem {
  id: string;
  label: Record<Language, string>;
}

// --- Constants & Translations ---
const TRANSLATIONS = {
  nav: [
    { id: 'home', label: { en: 'Home', zh_tw: '首頁', zh_cn: '首页' } },
    { id: 'news', label: { en: 'News', zh_tw: '新聞中心', zh_cn: '新闻中心' } },
    { id: 'contact', label: { en: 'Contact', zh_tw: '聯絡我們', zh_cn: '联系我们' } },
  ],
  hero: {
    title: {
      en: '853 Bio-Medical: Pioneering the Future of High-End Medical Manufacturing',
      zh_tw: '澳門 853 國際生物醫藥：開啟澳門高端醫療製造新紀元',
      zh_cn: '澳门 853 国际生物医药：开启澳门高端医疗制造新纪元',
    },
    subtitle: {
      en: 'Integrating advanced R&D with precision manufacturing to establish a new benchmark for biomedical excellence in Macau and the Greater Bay Area.',
      zh_tw: '以「研發製造一體化」為核心，致力於構建跨地域的大健康產業生態系統，為全球市場提供高品質醫療解決方案。',
      zh_cn: '以「研发制造一体化」为核心，致力于构建跨地域的大健康产业生态系统，为全球市场提供高质量医疗解决方案。',
    },
    cta: {
      en: 'Explore Our Vision',
      zh_tw: '探索企業願景',
      zh_cn: '探索企业愿景',
    },
  },
  intro: {
    title: { en: 'A New Paradigm in Bio-Medical Science', zh_tw: '生物醫藥科技的新典範', zh_cn: '生物医药科技的新典范' },
    milestone: {
      headline: { en: '2025: A Landmark Year for Industrial Recognition', zh_tw: '2025：工業製造實力的里程碑', zh_cn: '2025：工业制造实力的里程碑' },
      paragraph: { 
        en: 'In September 2025, 853 International Bio-Medical Technology Co., Ltd. achieved a historic milestone by securing its official Industrial License from the Economic and Technological Development Bureau (DSEDT) of the Macau SAR Government. This credential formalizes our position as one of Macau\'s elite biomedical entities capable of bridging the gap between innovative laboratory research and large-scale, compliant industrial production. By establishing Macau\'s first specialized high-performance medical plaster production line, we are not only addressing a local market void but also setting the stage for high-end "Macau Made" health products to enter international supply chains.',
        zh_tw: '2025 年 9 月，澳門 853 國際生物醫藥正式榮獲澳門特區政府經濟及科技發展局頒發的工業准照，標誌著公司在合規化與工業化進程中邁出了里程碑式的一步。作為澳門極少數擁有完整自主研發及自動化生產能力的生物醫藥企業，我們專注於高端醫藥貼劑及功能性保健品的深度開發。憑藉澳門首條專業膏貼類自動化生產線，我們成功突破了傳統製藥與現代功能性敷料的技術壁壘，為推動「澳門製造」向高端化、科技化轉型提供了堅實的產業支撐。',
        zh_cn: '2025 年 9 月，澳门 853 国际生物医药正式荣获澳门特区政府经济及科技发展局颁发的工业准照，标志着公司在合规化与工业化进程中迈出了里程碑式的一步。作为澳门极少数拥有完整自主研发及自动化生产能力的生物医药企业，我们专注于高端医药贴剂及功能性保健品的深度开发。凭借澳门首条专业膏贴类自动化生产线， we 成功突破了传统制药与现代功能性敷料的技术壁垒，为推动「澳门制造」向高端化、科技化转型提供了坚实的产业支撑。'
      }
    },
    strategy: {
      headline: { en: 'Strategic Synergy: R&D and Manufacturing Integration', zh_tw: '戰略協同：研發與製造的無縫集成', zh_cn: '战略协同：研发与制造的无缝集成' },
      paragraph: {
        en: 'Our operational philosophy is rooted in the "R&D-Manufacturing Integration" strategy. This approach ensures that every scientific discovery made in collaboration with institutions like the University of Macau is meticulously translated into a scalable, high-quality product. With an initial investment exceeding MOP 3 million and a dedicated team of engineers, we prioritize technical precision and hardware excellence. This technical foundation allows us to serve as a world-class CDMO partner, offering customized formulation and production services that meet the most rigorous international standards.',
        zh_tw: '公司的核心發展邏輯建立在「研發製造一體化」之上。自 2024 年 7 月項目啟動以來，我們投入超三百萬澳門元用於基礎設施建設與高端設備引進。通過與澳門大學等權威科研機構的緊密合作，我們構建了一套從前沿分子研發到工業化試產的高效轉化體系。專業的工程師與醫療技術團隊確保了每一道工序都符合國際品質標準，使我們不僅能自主研發核心品牌，更能為全球夥伴提供從配方優化到終端包裝的一站式定制化 OEM/CDMO 服務。',
        zh_cn: '公司的核心发展逻辑建立在「研发制造一体化」之上。自 2024 年 7 月项目启动以来，我们投入超三百万澳门元用于基础设施建设与高端设备引进. 通过与澳门大学等权威科研机构的紧密合作，我们构建了一套从前沿分子研发到工业化试产的高效转化体系。专业的工程师与医疗技术团队确保了每一道工序都符合国际品质标准，使我们不仅能自主研发核心品牌，更能为全球伙伴提供从配方优化到终端包装的一站式定制化 OEM/CDMO 服务。'
      }
    }
  },
  services: {
    title: { en: 'Product Pillars & Global Service Architecture', zh_tw: '產品矩陣與全球服務體系', zh_cn: '产品矩阵与全球服务体系' },
    manufacturing: {
      headline: { en: 'Precision Production for the Big Health Era', zh_tw: '大健康時代的精準製造', zh_cn: '大健康时代的精密制造' },
      paragraph: {
        en: 'Our product ecosystem is strategically diversified into four core pillars: Medical Protective Series, Pharmaceutical Patches & Functional Plasters, Health Foods & Nutritional Supplements, and Professional Pharmacy Services. Each category is backed by intensive technical research. Our specialized medical plaster line, for instance, utilizes advanced polymer chemistry to create patches with superior breathability and controlled drug release. This multi-layered approach allows us to address diverse healthcare needs, from professional medical environments to daily wellness management.',
        zh_tw: '我們的產品體系由四大核心板塊構成，涵蓋了醫療防護、醫藥貼劑、保健食品及專業藥事服務。在醫藥貼劑領域，我們引進了自動化精密塗布與分切設備，專注於研發具備高透氣性、高貼合度及精準釋放功能的高分子材料膏貼。在保健食品板塊，我們聚焦中醫現代化轉化，推出融合天然植物提取物的營養補充劑。此外，我們不僅提供產品，更致力於建設「智慧健康管理系統」，通過專業的藥事服務與健康管理方案，為用戶提供全生命週期的健康保障。',
        zh_cn: '我们的产品体系由四大核心板块构成，涵盖了医疗防护、医药贴剂、保健食品及专业药事服务。在医药贴剂领域，我们引进了自动化精密涂布与分切设备，专注于研发具备高透气性、高贴合度及精准释放功能的高分子材料膏贴。在保健食品板块，我们聚焦中医现代化转化，推出融合天然植物提取物的营养补充剂。此外，我们不仅提供产品，更致力于建设「智慧健康管理系统」，通过专业的药事服务与健康管理方案，为用户提供全生命周期的健康保障。'
      }
    },
    oem: {
      headline: { en: 'Empowering Brands Through Advanced OEM Solutions', zh_tw: '高端 OEM 方案賦能品牌價值', zh_cn: '高端 OEM 方案赋能品牌价值' },
      paragraph: {
        en: '853 Bio-Medical leverages its robust manufacturing capacity to provide full-lifecycle OEM services to over 367 pharmacies across the region. We don\'t just manufacture; we innovate alongside our partners. By introducing natural essential oil scented plasters—featuring aromas like strawberry, mint, and apple—we have successfully transformed traditional medical products into consumer-friendly wellness items. Our ability to blend premium materials like PP and TPU ensures that "Macau-designed" products stand out in the competitive global market for their functionality and aesthetic appeal.',
        zh_tw: '依託強大的工業製造基礎，我們為全澳 367 家藥房提供深度的定制化 OEM 服務，助力鳳凰堂、紅寶堂等本土藥號實現品牌升級。我們的技術優勢在於能夠將傳統醫藥智慧與現代材料科學無縫對接。例如，我們研發的高分子功能性貼布融合了先進的 PP 與 TPU 材質，顯著提升了產品的使用體驗。我們還創新地推出了多款植物精油香型膏貼，將療效與愉悅的官能體驗相結合，成功打造了具備國際競爭力的「853」自主膏貼品牌。',
        zh_cn: '依托强大的工业制造基础，我们为全澳 367 家药房提供深度的定制化 OEM 服务，助力凤凰堂、红宝堂等本土药号实现品牌升级。我们的技术优势在于能够将传统医药智慧与现代材料科学无缝对接。例如，我们研发的高分子功能性贴布融合了先进的 PP 与 TPU 材质，显著提升了产品的使用体验. 我们还创新地推出了多款植物精油香型膏贴，将疗效与愉悦的官能体验相结合，成功打造了具备国际竞争力的「853」自主膏贴品牌。'
      }
    }
  },
  innovation: {
    title: { en: 'Digitalization & Technological Evolution', zh_tw: '數字化轉型與技術演進', zh_cn: '数字化转型与技术演进' },
    materials: {
      headline: { en: 'Advancements in High-Polymer Functional Science', zh_tw: '高分子功能科學的深度實踐', zh_cn: '高分子功能科学的深度实践' },
      paragraph: {
        en: 'Innovation is the DNA of 853. We are currently focusing on the intersection of polymer science and pharmacology to develop the next generation of drug delivery patches. By optimizing the molecular structure of TPU and PP interfaces, we have achieved higher active ingredient permeability without compromising skin safety. This technical leadership is reflected in our specialized production lines that are capable of manufacturing specialized "One-Strap-Muscle" (Yi Tiao Jin) patches tailored for the intense recovery needs of professional and Olympic athletes.',
        zh_tw: '創新是 853 發展的核心動力。我們在高分子材料研發上投入了巨大精力，通過對 PP 與 TPU 等優質材質的物理改性，成功研發出具備極佳生物兼容性的功能性基材。這使得我們的膏貼在保證強效鎮痛與緩解腫痛的同時，能最大限度減少皮膚過敏。我們目前的技術輸出已覆蓋專業運動防護領域，致力於為職業運動員及奧運選手打造兼具療效與極致體驗的「一條筋」高效能貼劑，體現了我們在中西醫結合創新上的領先地位。',
        zh_cn: '创新是 853 发展的核心动力。我们在高分子材料研发上投入了巨大精力，通过对 PP 与 TPU 等优质材质的物理改性，成功研发 out 具备极佳生物兼容性的功能性基材. 这使得我们的膏贴在保证强效镇痛与缓解肿痛的同时，能最大限度减少皮肤过敏。我们目前的技术输出已覆盖专业运动防护领域，致力于为职业运动员及奥运选手打造兼具疗效与极致体验的「一条筋」高效能贴剂，体现了我们在中西医结合创新上的领先地位。'
      }
    },
    digital: {
      headline: { en: 'The Future of Digital Health Ecosystems', zh_tw: '數字大健康生態的未來藍圖', zh_cn: '数字大健康生态的未来蓝图' },
      paragraph: {
        en: '853 Bio-Medical is transitioning from a traditional manufacturer to a digital-first health advocate. We are actively constructing an "Integrated Big Health Data Platform" to streamline the connection between R&D, manufacturing, and consumer wellness. Our digitalization roadmap includes the deployment of a Smart Health Management System, which utilizes data analytics to provide personalized healthcare solutions. By building a seamless online-to-offline (O2O) experience, we aim to empower individuals with real-time health insights and customized medical product recommendations, truly digitizing the journey to well-being.',
        zh_tw: '我們正致力於從傳統製造商轉型為全方位健康生活的倡導者。數字化發展是我們長遠戰略的關鍵一環。我們正在建設完善的「大健康數據平台」，旨在打通研發、生產與終端消費的數據閉環。通過構建「智慧健康管理系統」，我們能為用戶提供個性化的健康服務方案，實現線上線下一體化的服務體驗。這種以數據為驅動的健康管理模式，不僅能提升藥事服務的精準度，更能助力澳門及大灣區居民實現更具預見性、精準性的健康生活。',
        zh_cn: '我们正致力于从传统制造商转型为全方位健康生活的倡导者。数字化发展是我们长远战略的关键一环。我们正在建设完善的大健康数据平台，旨在打通研发、生产与终端消费的数据闭环. 通过构建智慧健康管理系统，我们能为用户提供个性化的健康服务方案，实现线上线下一体化的服务体验。这种以数据为驱动的健康管理模式，不仅能提升药事服务的精准度，更能助力澳门及大湾区居民实现更具预见性、精准性的健康生活。'
      }
    }
  },
  news: {
    title: { en: 'News Center', zh_tw: '新聞中心', zh_cn: '新闻中心' },
    featured: {
      date: '2025-10-23',
      headline: { 
        en: 'Macau-Taiwan Bio-tech Strategic Linkage MOU Signing Ceremony', 
        zh_tw: '澳台雙域企業深度共融戰略聯結備忘協議簽署儀式在澳隆重舉行',
        zh_cn: '澳台双域企业深度共融战略联结备忘协议签署仪式在澳隆重举行'
      },
      subheadline: {
        en: 'Tripartite synergy building a "Brand-Raw Material-Production" closed-loop ecosystem.',
        zh_tw: '三方優勢疊加：構建「品牌-原料-生產」全鏈閉環',
        zh_cn: '三方优势叠加：构建「品牌-原料-生产」全链闭环'
      },
      content: {
        en: `2025-10-23, Macau — Today, Macau 853 International Bio-Medical Technology (Macau 853), Bowtee International (Bowtee), and Chenhui Bio-tech officially finalized their Strategic Cooperation MOU in Macau.\n\nThis agreement is a concrete response to the "Greater Bay Area Development Plan" and Macau's strategy for "Moderate Economic Diversification."\n\nBowtee will drive market insights and brand strategy; Chenhui will provide world-class functional raw materials; and 853 Bio-Medical will handle the transition to GMP-certified scale manufacturing. This partnership is expected to launch its first joint cardiovascular wellness product in late 2025.`,
        zh_tw: `2025年10月23日，澳門——今日，澳門853國際生物醫藥科技有限公司（以下簡稱「澳門853」）、寶體安國際生物科技澳門有限公司（以下簡稱「寶體安」）與晨暉生物科技股份有限公司（以下簡稱「晨暉生技物」）於澳門隆重舉行《澳台雙域企業深度共融戰略聯結備忘協議》簽約儀式。三方攜手聚焦生物科技領域，以「資源互補、技術共研、市場共拓」為核心，正式開啟澳台兩地跨域產業協同發展的新篇章。\n\n此次合作是響應國家「粵港澳大灣區」及澳門「經濟適度多元發展」戰略的重要實踐，更是澳台兩地生物科技企業深化產業鏈融合的創新嘗試。\n\n三方優勢疊加：構建「品牌-原料-生產」全鏈閉環\n\n作為協議牽頭方，寶體安國際生物科技澳門有限公司是立足澳門、輻射亞太的健康品牌運營商，深耕功能性食品、營養補充劑領域多年。\n\n晨暉生技物科技股份有限公司作為台灣領先的生物科技原料供應商，是亞洲地區功能性原料研發的標杆企業。\n\n澳門853國際生物醫藥科技有限公司則是澳門本土規模化、智能化生物醫藥委託生產（CDMO）龍頭企業，持有具備澳門地區生物醫藥生產的合規資質澳門首個GMP級生物製劑生產許可證。\n\n三方簽約後，將圍繞「功能性產品全鏈路開發」展開深度協作。據悉，首個合作項目已鎖定「心血管調節類功能性食品」，預計2025年Q4推向市場。`,
        zh_cn: `2025年10月23日，澳门——今日，澳门853国际生物医药科技有限公司（以下简称「澳门853」）、宝体安国际生物科技澳门有限公司（以下简称「宝体安」）与晨晖生物科技股份有限公司（以下简称「晨晖生技物」）于澳门隆重举行《澳台双域企业深度共融战略联结备忘协议》签约仪式。三方携手聚焦生物科技领域，以「资源互补、技术共研、市场共拓」为核心，正式开启澳台两地跨域产业协同发展的新篇章。\n\n此次合作是响应国家「粤港澳大湾区」及澳门「经济适度多元发展」战略的重要实践，更是澳台两地生物科技企业深化产业链融合的创新尝试。\n\n三方优势叠加：构建「品牌-原料-生产」全链闭环\n\n作为协议牵头方，宝体安国际生物科技澳门有限公司是立足澳门、辐射亚太的健康品牌运营商。\n\n晨晖生技物科技股份有限公司作为台湾领先的生物科技原料供应商，是亚洲地区功能性原料研发的标杆企业。\n\n澳门853国际生物医药科技有限公司则是澳门本土规模化、智能化生物医药委托生产（CDMO）龙头企业。\n\n三方签约后，将围绕「功能性产品全链路开发」展开深度协作。据悉，首个合作项目已锁定「心血管调节类功能性食品」，预计2025年Q4推向市场。`
      },
      partners: [
        {
          name: { en: 'Bowtee (Baoti\'an)', zh_tw: '寶體安', zh_cn: '宝体安' },
          role: { en: 'Brand Operator', zh_tw: '亞太健康品牌運營商', zh_cn: '亚太健康品牌运营商' },
          desc: { en: '20+ years of GBA market insight and global sales logistics.', zh_tw: '深耕健康補劑領域二十載，擁有遍佈葡語系國家的完善渠道。', zh_cn: '深耕健康补剂领域二十载，拥有遍布葡语系国家的完善渠道。' }
        },
        {
          name: { en: 'Chenhui Bio-tech', zh_tw: '晨暉生物', zh_cn: '晨晖生物' },
          role: { en: 'Technical Standard', zh_tw: '全球功能性原料研發標杆', zh_cn: '全球功能性原料研发标杆' },
          desc: { en: 'FDA NDI/GRAS certified probiotic and red yeast tech.', zh_tw: '亞洲頂尖原料商，掌握多項國際專利技術及 FDA 認證。', zh_cn: '亚洲顶尖原料商，掌握多项国际专利技术及 FDA 认证。' }
        },
        {
          name: { en: '853 Bio-Medical', zh_tw: '澳門 853', zh_cn: '澳门 853' },
          role: { en: 'Manufacturing CDMO', zh_tw: '合規化智能化 CDMO 龍頭', zh_cn: '合规化智能化 CDMO 龙头' },
          desc: { en: 'Holders of the milestone 2025 Macau Industrial License.', zh_tw: '具備 GMP 級生產資質，引領澳門生物醫藥工業化轉型。', zh_cn: '具备 GMP 级生产资质，引领澳门生物医药工业化转型。' }
        }
      ]
    }
  },
  footer: {
    address: { 
      en: '13/F (T) & 11/F (U), Phase 3, Keck Seng Industrial Center, No. 41 Av. do Almirante Magalhaes Correia, Macau', 
      zh_tw: '澳門高利亞海軍上將大馬路 41 號激成工業中心第 3 期 13 樓 T 及 11 樓 U',
      zh_cn: '澳门高利亚海军上将大马路 41 号激成工业中心第 3 期 13 楼 T 及 11 楼 U'
    },
    rights: { 
      en: '© 2025 853 International Bio-Medical Technology Co., Ltd. All Rights Reserved.', 
      zh_tw: '© 2025 澳門 853 國際生物醫藥科技有限公司 版權所有',
      zh_cn: '© 2025 澳门 853 国际生物医药科技有限公司 版权所有'
    },
    contactList: [
      { label: { en: 'Macau 853 Mask Factory', zh_tw: '濠概醫療用品有限公司 / 澳門853口罩廠', zh_cn: '濠概医疗用品有限公司 / 澳门853口罩厂' }, value: '+853 2821 6012' },
      { label: { en: 'Sales E-mail', zh_tw: 'Sales E-mail', zh_cn: 'Sales E-mail' }, value: 'sales@macaufacture.com' },
      { label: { en: 'Health Hub Pharmacy', zh_tw: '澳門853藥房有限公司 / 健康薈藥房', zh_cn: '澳门853药房有限公司 / 健康荟药房' }, value: '+853 2821 6013' },
      { label: { en: '853 Bio-Medical Base', zh_tw: '澳門853國際生物醫藥科技有限公司 / 澳科生技大健康製造廠', zh_cn: '澳门853国际生物医药科技有限公司 / 澳科生技大健康制造厂' }, value: '+853 2821 6014' },
      { label: { en: 'Enquiry E-mail', zh_tw: 'Enquiry E-mail', zh_cn: 'Enquiry E-mail' }, value: 'enquiry@macaufacture.com' },
      { label: { en: 'Ms. Chen (Business)', zh_tw: '陳小姐 (業務聯繫)', zh_cn: '陈小姐 (业务联系)' }, value: '+853 6203 3133' },
      { label: { en: 'Ms. Huang (Business)', zh_tw: '黃小姐 (業務聯繫)', zh_cn: '黄小姐 (业务联系)' }, value: '+853 6881 6853' },
      { label: { en: 'Fax Number', zh_tw: 'Fax 號碼', zh_cn: 'Fax 号码' }, value: '+853 2875 3044' },
    ]
  },
  hengqin: {
    title: { en: 'Guangdong Hengqin 853 Industrial Base', zh_tw: '廣東橫琴 853 生物醫藥產業基地', zh_cn: '广东横琴 853 生物医药产业基地' },
    subtitle: { en: 'Harnessing the Macau R&D + Hengqin Production Model', zh_tw: '構建「澳門研發 + 橫琴生產 + 全球市場」的跨境發展模式', zh_cn: '构建「澳门研发 + 横琴生产 + 全球市场」的跨境发展模式' },
    paragraph: {
      en: 'Guangdong Hengqin 853 International Bio-Medical Technology Co., Ltd. serves as our strategic industrial anchor within the Guangdong-Macao In-Depth Cooperation Zone in Hengqin. This base is essential for bridging the "One Country, Two Systems" policy advantages with industrial scalability.',
      zh_tw: '廣東橫琴 853 國際生物醫藥科技有限公司是公司在橫琴粵澳深度合作區設立的重要產業基地。依託「一國兩制」下的制度紅利，橫琴基地承載了公司大規模生產與全球物流分發的核心職能。',
      zh_cn: '广东横琴 853 国际生物医药科技有限公司是公司在横琴粤澳深度合作区设立的重要产业基地。依托「一国两制」下的制度红利，横琴基地承载了公司大规模生产与全球物流分发的核心职能.'
    },
    sections: [
      {
        title: { en: 'Technological R&D Center', zh_tw: '醫學與工程技術研發', zh_cn: '医学与工程技术研发' },
        desc: { en: 'Focusing on the transfer and application of cutting-edge biomedical and medical device research.', zh_tw: '專注於醫藥、健康產品及醫療器械的前沿科研成果轉化，提供技術諮詢與推廣一站式平台。', zh_cn: '专注于医药、健康产品及医疗器的前沿科研成果转化，提供技术咨询与推广一站式平台。' },
        list: [
          { en: 'Biomedical Innovation', zh_tw: '生物醫藥創新轉化', zh_cn: '生物医药创新转化' },
          { en: 'Medical Device Engineering', zh_tw: '醫療器械工程研究', zh_cn: '医疗器械工程研究' }
        ]
      }
    ]
  },
  vision: {
    title: { en: 'Our Vision & Mission', zh_tw: '企業願景與核心使命', zh_cn: '企业愿景与核心使命' },
    items: [
      {
        title: { en: 'Economic Diversification', zh_tw: '推動澳門經濟多元化', zh_cn: '推动澳门经济多元化' },
        desc: { en: 'Actively contributing to the industrial upgrading and economic resilience of the Macau SAR.', zh_tw: '積極響應特區政府號召，以高新技術製造助力澳門產業結構轉型與適度多元發展。', zh_cn: '积极响应特区政府号召，以高新技术制造助力澳门产业结构转型与适度多元发展。' }
      },
      {
        title: { en: 'Innovation Ecosystem', zh_tw: '建設大健康創新生態', zh_cn: '建设大健康创新生态' },
        desc: { en: 'Creating a synergistic network across the GBA that fosters cross-border biomedical growth.', zh_tw: '攜手大灣區優勢資源，構建橫跨珠澳兩地的生物醫藥創新集群，推動區域產業鏈深度融合。', zh_cn: '携手大湾区优势资源，构建横跨珠澳两地的生物医药创新集群，推动区域产业链深度融合。' }
      }
    ]
  }
};

// --- Shared Components ---

const Logo = ({ className = "w-10 h-10", light = false }) => {
  const color = light ? "#FFFFFF" : "#C1A376";
  return (
    <div className={`${className} flex items-center justify-center`} style={{ borderRadius: '8px' }}>
      <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M10 10 H90 V80 C90 95 50 110 50 110 C50 110 10 95 10 80 V10Z" stroke={color} strokeWidth="2" />
        <path d="M15 15 H85 V78 C85 90 50 103 50 103 C50 103 15 90 15 78 V15Z" stroke={color} strokeWidth="1" />
        <text x="50" y="38" fill={color} fontSize="18" fontWeight="bold" textAnchor="middle">853</text>
        <line x1="50" y1="55" x2="50" y2="95" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="53" r="3" fill={color} />
      </svg>
    </div>
  );
};

const Navbar = ({ currentLang, onLangChange, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (id === 'news') onNavigate('news');
    else if (id === 'home') onNavigate('home');
    else if (id === 'contact') {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 150);
      } else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || currentPage === 'news' ? 'bg-[#2A2016] shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => handleNavClick('home')} className="flex items-center space-x-3 group outline-none">
          <Logo className="w-12 h-12" light={true} />
          <span className="font-bold text-lg hidden md:block text-white">
            {currentLang === 'en' ? '853 Bio-Medical' : '853 國際生物醫藥'}
          </span>
        </button>

        <div className="hidden lg:flex items-center space-x-8">
          {TRANSLATIONS.nav.map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium transition-colors border-b-2 py-1 ${((currentPage === 'news' && item.id === 'news') || (currentPage === 'home' && item.id === 'home')) ? 'text-[#C1A376] border-[#C1A376]' : 'text-white border-transparent'}`}>
              {item.label[currentLang]}
            </button>
          ))}
          <div className="flex items-center space-x-2 border-l pl-8 border-white/20">
            {['en', 'zh_tw', 'zh_cn'].map((lang) => (
              <button key={lang} onClick={() => onLangChange(lang)} className={`text-xs px-2 py-1 rounded ${currentLang === lang ? 'bg-[#C1A376] text-[#2A2016]' : 'text-white/70'}`}>
                {lang === 'en' ? 'EN' : lang === 'zh_tw' ? '繁' : '簡'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Page Components ---

const Hero = ({ lang }) => (
  <section id="home" className="relative h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1920)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2A2016]/95 to-[#4E3B29]/70"></div>
    </div>
    <div className="container mx-auto px-6 relative z-10 text-white">
      <div className="max-w-3xl">
        <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[#C1A376]/20 border border-[#C1A376]/40 text-[#C1A376] text-sm font-semibold">
          {lang === 'en' ? 'OFFICIAL 853 MEDICAL BRAND' : '853 醫療官方品牌'}
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">{TRANSLATIONS.hero.title[lang]}</h1>
        <p className="text-lg md:text-xl text-slate-300 mb-6 font-light">{TRANSLATIONS.hero.subtitle[lang]}</p>
      </div>
    </div>
  </section>
);

const About = ({ lang }) => (
  <section id="about" className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-[#2A2016] mb-4">{TRANSLATIONS.intro.title[lang]}</h2>
        <div className="w-16 h-1 bg-[#C1A376] mx-auto rounded-full"></div>
      </div>
      <div className="space-y-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="lg:w-3/5">
            <h3 className="text-2xl font-bold mb-4">{TRANSLATIONS.intro.milestone.headline[lang]}</h3>
            <p className="text-slate-600 leading-relaxed font-light">{TRANSLATIONS.intro.milestone.paragraph[lang]}</p>
          </div>
          <div className="lg:w-2/5">
             <img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=800" className="rounded-3xl shadow-lg" alt="Facility" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Facilities = ({ lang }) => (
  <section id="services" className="py-24 bg-slate-50">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h2 className="text-4xl font-extrabold text-[#2A2016] mb-6 uppercase">{TRANSLATIONS.services.title[lang]}</h2>
      </div>
      <div className="grid grid-cols-1 gap-12">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h3 className="text-3xl font-bold mb-6">{TRANSLATIONS.services.manufacturing.headline[lang]}</h3>
            <p className="text-lg text-slate-600 font-light">{TRANSLATIONS.services.manufacturing.paragraph[lang]}</p>
          </div>
          <div className="lg:w-1/2 bg-[#2A2016] p-12 rounded-3xl text-white">
            <h3 className="text-2xl font-bold mb-4">{TRANSLATIONS.services.oem.headline[lang]}</h3>
            <p className="text-slate-300 font-light">{TRANSLATIONS.services.oem.paragraph[lang]}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const News = ({ lang }) => {
  const article = TRANSLATIONS.news.featured;
  const renderContent = (text) => text.split('\n').map((para, i) => para.trim() ? <p key={i} className="mb-6 leading-relaxed text-slate-700 text-lg text-justify font-light">{para.trim()}</p> : <div key={i} className="h-4" />);

  return (
    <div className="pt-24 pb-20 bg-white">
      <header className="bg-[#2A2016] py-20 text-white relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="text-[#C1A376] font-black text-xs uppercase mb-4">{article.date}</div>
            <h1 className="text-3xl md:text-5xl font-black mb-8">{article.headline[lang]}</h1>
            <div className="text-xl md:text-2xl text-[#C1A376] border-l-4 border-[#C1A376] pl-6">{article.subheadline[lang]}</div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="max-w-5xl mx-auto">
          <article className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="mb-12">
              <img src="Image_20251218155359_80_22.png" alt="Signing" className="w-full rounded-3xl" onError={(e) => e.currentTarget.src = "https://picsum.photos/seed/signing/1200/800"} />
              <div className="mt-4 text-center text-xs text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Protocol Signing Ceremony' : '協議簽署儀式現場'}</div>
            </div>
            <div className="prose prose-lg max-w-none text-slate-800">{renderContent(article.content[lang])}</div>
            <div className="my-12">
              <img src="Image_20251218155312_78_22.png" alt="Presentation" className="w-full rounded-3xl" onError={(e) => e.currentTarget.src = "https://picsum.photos/seed/presentation/1200/800"} />
              <div className="mt-4 text-center text-xs text-slate-400 uppercase tracking-widest">{lang === 'en' ? 'Product Presentation' : '產品發布儀式現場'}</div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

const Footer = ({ lang }) => (
  <footer id="contact" className="bg-[#2A2016] text-white pt-16 pb-10 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Logo className="w-10 h-10" light={true} />
            <span className="text-lg font-black uppercase">853 Bio-Medical</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{lang === 'en' ? 'Macau Bio-tech: New Engine for Healthcare.' : '濠概與 853：澳門大健康製造新引擎。'}</p>
        </div>
        <div className="col-span-1">
          <h5 className="text-xs font-black mb-6 text-white uppercase tracking-widest">{lang === 'en' ? 'Contacts' : '聯絡資訊'}</h5>
          <div className="space-y-4">
            {TRANSLATIONS.footer.contactList.slice(0, 4).map((c, i) => (
              <div key={i} className="flex flex-col text-[11px]"><span className="text-[#C1A376] font-bold uppercase">{c.label[lang]}</span><span className="text-slate-200">{c.value}</span></div>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <h5 className="text-xs font-black mb-6 text-white uppercase tracking-widest">{lang === 'en' ? 'Direct Business' : '業務諮詢'}</h5>
          <div className="space-y-4">
            {TRANSLATIONS.footer.contactList.slice(4).map((c, i) => (
              <div key={i} className="flex flex-col text-[11px]"><span className="text-[#C1A376] font-bold uppercase">{c.label[lang]}</span><span className="text-slate-200">{c.value}</span></div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start lg:items-end">
          <h5 className="text-xs font-black mb-6 text-white uppercase tracking-widest">{lang === 'en' ? 'Scan to Connect' : '掃碼諮詢'}</h5>
          <img src="image.png" alt="WeChat" className="w-24 h-auto rounded-xl bg-white p-1" onError={(e) => e.currentTarget.src = "https://placehold.co/150x200?text=853+WeChat"} />
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center">
        <p className="text-[10px] text-slate-400 mb-4">{TRANSLATIONS.footer.address[lang]}</p>
        <p className="text-[9px] text-slate-500">{TRANSLATIONS.footer.rights[lang]}</p>
      </div>
    </div>
  </footer>
);

// --- Root App ---

const App = () => {
  const [currentLang, setCurrentLang] = useState<Language>('zh_tw');
  const [currentPage, setCurrentPage] = useState<'home' | 'news'>('home');

  useEffect(() => window.scrollTo(0, 0), [currentPage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar currentLang={currentLang} onLangChange={setCurrentLang} onNavigate={setCurrentPage} currentPage={currentPage} />
      {currentPage === 'home' ? (
        <>
          <Hero lang={currentLang} />
          <About lang={currentLang} />
          <Facilities lang={currentLang} />
          <section id="contact" className="bg-white"><div className="h-2"></div></section>
        </>
      ) : (
        <News lang={currentLang} />
      )}
      <Footer lang={currentLang} />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
