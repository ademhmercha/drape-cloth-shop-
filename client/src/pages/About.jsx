import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/SEOHead';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <SEOHead title={t('nav.about')} description={t('about.p1')} />
      <div className="pt-24 pb-20 dark:bg-charcoal dark:text-cream min-h-screen">
        {/* Hero */}
        <section className="relative h-[60vh] flex items-end pb-16 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&fit=crop&q=80"
            alt="DRAPE atelier" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-charcoal/20" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">{t('about.label')}</p>
            <h1 className="font-display text-5xl lg:text-6xl text-cream leading-tight">
              {t('about.heroTitle')}<br /><em>{t('about.heroTitleItalic')}</em>
            </h1>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <div className="space-y-8 text-charcoal/80 dark:text-cream/80 text-lg leading-relaxed">
            <p><strong className="text-charcoal dark:text-cream font-display text-2xl">DRAPE</strong> {t('about.p1').replace('DRAPE est né', 'est né')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-charcoal/10 dark:border-cream/10">
            {[
              { icon: '✦', title: t('about.value1Title'), desc: t('about.value1Desc') },
              { icon: '◈', title: t('about.value2Title'), desc: t('about.value2Desc') },
              { icon: '◉', title: t('about.value3Title'), desc: t('about.value3Desc') }
            ].map(v => (
              <div key={v.title}>
                <p className="text-gold text-xl mb-3">{v.icon}</p>
                <h3 className="font-display text-lg mb-2 dark:text-cream">{v.title}</h3>
                <p className="text-sm text-charcoal/60 dark:text-cream/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal dark:bg-[#111] text-cream py-20 text-center">
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">{t('about.ctaLabel')}</p>
          <h2 className="font-display text-4xl mb-8">{t('about.ctaTitle')}</h2>
          <Link to="/shop" className="btn-ghost border-cream text-cream hover:bg-cream hover:text-charcoal">
            {t('about.ctaBtn')}
          </Link>
        </section>
      </div>
    </>
  );
}
