
export type Language = 'en' | 'zh_tw' | 'zh_cn';

export interface NavItem {
  id: string;
  label: Record<Language, string>;
}

export interface TranslationData {
  nav: NavItem[];
  hero: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    cta: Record<Language, string>;
  };
  intro: {
    title: Record<Language, string>;
    milestone: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    };
    strategy: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    };
  };
  services: {
    title: Record<Language, string>;
    manufacturing: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    };
    oem: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    };
  };
  innovation: {
    title: Record<Language, string>;
    materials: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    };
    future: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    };
    digital: {
      headline: Record<Language, string>;
      paragraph: Record<Language, string>;
    }
  };
  news: {
    title: Record<Language, string>;
    featured: {
      date: string;
      headline: Record<Language, string>;
      subheadline: Record<Language, string>;
      content: Record<Language, string>;
      partners: {
        name: Record<Language, string>;
        role: Record<Language, string>;
        desc: Record<Language, string>;
      }[];
    };
  };
  footer: {
    address: Record<Language, string>;
    rights: Record<Language, string>;
    contactList: {
      label: Record<Language, string>;
      value: string;
    }[];
  };
  milestone: {
    title: Record<Language, string>;
    items: {
      date: Record<Language, string>;
      text: Record<Language, string>;
    }[];
  };
  advantages: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    items: {
      highlight: Record<Language, string>;
      title: Record<Language, string>;
      desc: Record<Language, string>;
    }[];
  };
  dosageForms: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    items: {
      id: string;
      name: Record<Language, string>;
      desc: Record<Language, string>;
      specs: Record<Language, string>[];
    }[];
  };
  caseStudies: {
    title: Record<Language, string>;
    items: {
      type: Record<Language, string>;
      title: Record<Language, string>;
      desc: Record<Language, string>;
      points: Record<Language, string>[];
      image: string;
    }[];
  };
  hengqin: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    paragraph: Record<Language, string>;
    sections: {
      title: Record<Language, string>;
      list: Record<Language, string>[];
      desc: Record<Language, string>;
    }[];
  };
  vision: {
    title: Record<Language, string>;
    items: {
      title: Record<Language, string>;
      desc: Record<Language, string>;
    }[];
  };
}
