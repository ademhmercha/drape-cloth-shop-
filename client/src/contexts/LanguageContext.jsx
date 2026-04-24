import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  fr: {
    // Nav
    shop: 'Boutique', newArrivals: 'Nouveautés', women: 'Femmes', men: 'Hommes',
    myAccount: 'Mon Compte', login: 'Connexion', logout: 'Déconnexion', register: "S'inscrire",
    // Home
    heroSubtitle: "Nouvelle Collection 2025",
    heroTitle: "L'Art de s'habiller",
    heroDesc: "Des pièces intemporelles pour ceux qui comprennent que le style est une forme d'expression silencieuse.",
    exploreCollection: 'Explorer la Collection',
    newArrivalsSection: 'Nouveautés', seeAll: 'Voir tout →',
    explore: 'Explorez',
    featured: 'Coups de Cœur',
    // Shop
    shopTitle: 'Boutique', filters: 'Filtres', noResults: 'Aucun résultat',
    noResultsDesc: "Essayez d'ajuster vos filtres", clearFilters: 'Effacer les filtres',
    // Product
    addToCart: 'Ajouter au Panier', addingToCart: 'Ajout en cours…',
    sizeGuide: 'Guide des tailles', color: 'Couleur', size: 'Taille', quantity: 'Quantité',
    inStock: 'en stock', relatedProducts: 'Vous aimerez aussi',
    description: 'Description', shipping: 'Livraison & Retours',
    // Cart
    myCart: 'Mon Panier', emptyCart: 'Votre panier est vide',
    exploreShop: 'Explorer la boutique', checkout: 'Commander',
    // Reviews
    reviews: 'Avis clients', writeReview: 'Laisser un avis', yourRating: 'Votre note',
    yourComment: 'Votre commentaire', submitReview: 'Publier l\'avis',
    loginToReview: 'Connectez-vous pour laisser un avis',
    noReviews: 'Aucun avis pour ce produit. Soyez le premier !',
    // About
    aboutTitle: 'Notre Histoire', aboutDesc: "DRAPE est né de la conviction qu'une garde-robe bien pensée peut transformer la façon dont vous traversez le monde.",
    // Contact
    contactTitle: 'Contactez-nous', name: 'Nom', email: 'Email',
    subject: 'Sujet', message: 'Message', send: 'Envoyer', sending: 'Envoi…',
    // Dashboard
    dashboard: 'Tableau de bord', hello: 'Bonjour',
    orders: 'Mes Commandes', favorites: 'Favoris', profile: 'Mon Profil', notifications: 'Notifications',
  },
  ar: {
    // Nav
    shop: 'المتجر', newArrivals: 'الجديد', women: 'نساء', men: 'رجال',
    myAccount: 'حسابي', login: 'تسجيل الدخول', logout: 'تسجيل الخروج', register: 'إنشاء حساب',
    // Home
    heroSubtitle: 'مجموعة 2025 الجديدة',
    heroTitle: 'فن الأناقة',
    heroDesc: 'قطع خالدة لمن يفهم أن الأسلوب هو شكل من أشكال التعبير الصامت.',
    exploreCollection: 'اكتشف المجموعة',
    newArrivalsSection: 'وصل حديثاً', seeAll: 'عرض الكل →',
    explore: 'استكشف',
    featured: 'المختارات',
    // Shop
    shopTitle: 'المتجر', filters: 'الفلاتر', noResults: 'لا توجد نتائج',
    noResultsDesc: 'حاول تعديل الفلاتر', clearFilters: 'مسح الفلاتر',
    // Product
    addToCart: 'أضف إلى السلة', addingToCart: 'جاري الإضافة…',
    sizeGuide: 'دليل المقاسات', color: 'اللون', size: 'المقاس', quantity: 'الكمية',
    inStock: 'في المخزن', relatedProducts: 'قد يعجبك أيضاً',
    description: 'الوصف', shipping: 'الشحن والإرجاع',
    // Cart
    myCart: 'سلة التسوق', emptyCart: 'سلتك فارغة',
    exploreShop: 'تصفح المتجر', checkout: 'إتمام الطلب',
    // Reviews
    reviews: 'آراء العملاء', writeReview: 'اترك تقييماً', yourRating: 'تقييمك',
    yourComment: 'تعليقك', submitReview: 'نشر التقييم',
    loginToReview: 'سجّل دخولك لترك تقييم',
    noReviews: 'لا توجد تقييمات بعد. كن الأول!',
    // About
    aboutTitle: 'قصتنا', aboutDesc: 'وُلد DRAPE من الإيمان بأن خزانة ملابس مدروسة تغير طريقة تعاملك مع العالم.',
    // Contact
    contactTitle: 'تواصل معنا', name: 'الاسم', email: 'البريد الإلكتروني',
    subject: 'الموضوع', message: 'الرسالة', send: 'إرسال', sending: 'جاري الإرسال…',
    // Dashboard
    dashboard: 'لوحة التحكم', hello: 'مرحباً',
    orders: 'طلباتي', favorites: 'المفضلة', profile: 'ملفي الشخصي', notifications: 'الإشعارات',
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('drape-lang') || 'fr');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('drape-lang', lang);
  }, [lang]);

  const t = (key) => translations[lang]?.[key] || translations.fr[key] || key;
  const toggle = () => setLang(l => l === 'fr' ? 'ar' : 'fr');
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, t, toggle, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
