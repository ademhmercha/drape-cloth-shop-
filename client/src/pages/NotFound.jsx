import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 dark:bg-charcoal">
      <div className="text-center max-w-lg">
        <p className="font-display text-[120px] leading-none text-charcoal/5 dark:text-cream/5 select-none">404</p>
        <div className="-mt-8">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">{t('notFound.title')}</p>
          <h1 className="font-display text-4xl sm:text-5xl mb-6 dark:text-cream">
            {t('notFound.title')}
          </h1>
          <p className="text-charcoal/50 dark:text-cream/50 mb-12 leading-relaxed">
            {t('notFound.desc')}
          </p>
          <Link to="/shop" className="btn-gold">{t('notFound.backBtn')}</Link>
        </div>
      </div>
    </div>
  );
}
