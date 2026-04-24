import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal text-cream/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="font-display text-3xl text-cream tracking-[0.3em] block mb-4">DRAPE</Link>
          <p className="text-sm leading-relaxed text-cream/60 max-w-xs">{t('footer.tagline')}.</p>
        </div>

        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-5 font-medium">{t('footer.collections')}</h3>
          <ul className="space-y-3">
            {[
              { key: 'footer.women', href: '/shop?category=women' },
              { key: 'footer.men', href: '/shop?category=men' },
              { key: 'footer.kids', href: '/shop?category=kids' },
              { key: 'footer.accessories', href: '/shop?category=accessories' },
              { key: 'home.newArrivals', href: '/shop?sort=newest' }
            ].map(({ key, href }) => (
              <li key={href}>
                <Link to={href} className="text-sm hover:text-gold transition-colors">{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-5 font-medium">{t('footer.info')}</h3>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-sm hover:text-gold transition-colors">{t('footer.about')}</Link></li>
            <li><Link to="/contact" className="text-sm hover:text-gold transition-colors">{t('footer.contact')}</Link></li>
            <li className="text-sm text-cream/60">{t('footer.delivery')}</li>
            <li className="text-sm text-cream/60">{t('footer.returns')}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/30 tracking-widest">
        {t('footer.rights')} · {t('footer.madeWith')}
      </div>
    </footer>
  );
}
