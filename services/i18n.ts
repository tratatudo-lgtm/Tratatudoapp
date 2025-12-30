
export type LanguageCode = 'pt' | 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar' | 'ru' | 'uk';

const translations: Record<LanguageCode, any> = {
  pt: {
    welcome: "Olá",
    slogan: "Viver em Portugal, sem Burocracia.",
    subSlogan: "Concierge Digital 360º para todos os Residentes",
    cta_start: "Começar Grátis",
    dashboard_title: "Início",
    invoices: "Faturas",
    billing: "Faturação",
    documents: "Documentos",
    profile: "Perfil",
    upgrade_needed: "Upgrade Disponível",
    upgrade_desc: "Ative o plano Gold para desbloquear todos os serviços administrativos.",
    recent_invoices: "Histórico de Faturas",
    catalog: "Catálogo Burocrático",
    protection: "Dados Protegidos",
    protection_desc: "A sua documentação é gerida sob sigilo total e encriptação militar.",
  },
  en: {
    welcome: "Hello",
    slogan: "Living in Portugal, without Bureaucracy.",
    subSlogan: "360º Digital Concierge for all Residents",
    cta_start: "Start for Free",
    dashboard_title: "Home",
    invoices: "Invoices",
    billing: "Billing",
    documents: "Documents",
    profile: "Profile",
    upgrade_needed: "Upgrade Available",
    upgrade_desc: "Activate the Gold plan to unlock all administrative services.",
    recent_invoices: "Invoice History",
    catalog: "Bureaucratic Catalog",
    protection: "Protected Data",
    protection_desc: "Your documentation is managed under total secrecy and military encryption.",
  },
  fr: {
    welcome: "Bonjour",
    slogan: "Vivre au Portugal, sans Bureaucratie.",
    subSlogan: "Conciergerie Digitale 360º pour tous les Résidents",
    cta_start: "Commencer Gratuitement",
    dashboard_title: "Accueil",
    invoices: "Factures",
    billing: "Facturation",
    documents: "Documents",
    profile: "Profil",
    upgrade_needed: "Mise à niveau requise",
    upgrade_desc: "Activez le plan Gold pour débloquer tous les services.",
    recent_invoices: "Historique des factures",
    catalog: "Catalogue Bureaucratique",
    protection: "Données Protégées",
    protection_desc: "Vos documents sont gérés dans le secret total et cryptage militaire.",
  },
  es: {
    welcome: "Hola",
    slogan: "Vivir en Portugal, sin Burocracia.",
    subSlogan: "Conserje Digital 360º para todos los Residentes",
    cta_start: "Empezar Gratis",
    dashboard_title: "Inicio",
    invoices: "Facturas",
    billing: "Facturación",
    documents: "Documentos",
    profile: "Perfil",
    upgrade_needed: "Mejora Necesaria",
    upgrade_desc: "Activa el plan Gold para desbloquear todos los servicios.",
    recent_invoices: "Historial de Facturas",
    catalog: "Catálogo Burocrático",
    protection: "Datos Protegidos",
    protection_desc: "Su documentación se gestiona bajo secreto total y cifrado militar.",
  },
  de: {
    welcome: "Hallo",
    dashboard_title: "Startseite",
    slogan: "In Portugal leben, ohne Bürokratie.",
    invoices: "Rechnungen",
    catalog: "Bürokratie-Katalog",
  },
  it: {
    welcome: "Ciao",
    dashboard_title: "Home",
    slogan: "Vivere in Portogallo, senza Burocrazia.",
    invoices: "Fatture",
    catalog: "Catalogo Burocratico",
  },
  ar: {
    welcome: "مرحباً",
    dashboard_title: "الرئيسية",
    slogan: "العيش في البرتغال بدون بيروقراطية.",
    invoices: "الفواتير",
    catalog: "كتالوج الخدمات",
  },
  ru: {
    welcome: "Привет",
    dashboard_title: "Главная",
    slogan: "Жизнь в Португалии без бюрократии.",
    invoices: "Счета",
    catalog: "Каталог услуг",
  },
  uk: {
    welcome: "Привіт",
    dashboard_title: "Головна",
    slogan: "Життя в Португалії без бюрократії.",
    invoices: "Рахунки",
    catalog: "Каталог послуг",
  }
};

export const getBrowserLang = (): LanguageCode => {
  const saved = localStorage.getItem('tratatudo_lang') as LanguageCode;
  if (saved && translations[saved]) return saved;

  const browserLang = navigator.language.split('-')[0] as LanguageCode;
  if (translations[browserLang]) return browserLang;

  return 'pt'; // Fallback
};

export const t = (key: string, lang: LanguageCode): string => {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};

export const languages = [
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' }
];
