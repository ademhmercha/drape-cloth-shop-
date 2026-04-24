import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import { useLang } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLang();

  return (
    <>
      <SEOHead
        title="Notre Histoire"
        description="DRAPE est né de la conviction qu'une garde-robe bien pensée peut transformer la façon dont vous traversez le monde."
      />

      <div className="pt-24 pb-20 dark:bg-charcoal dark:text-cream min-h-screen">
        {/* Hero */}
        <section className="relative h-[60vh] flex items-end pb-16 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&fit=crop&q=80"
            alt="DRAPE atelier"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-charcoal/20" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
            <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Notre Histoire</p>
            <h1 className="font-display text-5xl lg:text-6xl text-cream leading-tight">
              Le luxe n'est pas<br /><em>un prix.</em>
            </h1>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <div className="space-y-8 text-charcoal/80 dark:text-cream/80 text-lg leading-relaxed">
            <p>
              <strong className="text-charcoal dark:text-cream font-display text-2xl">DRAPE</strong> est né d'une conviction simple : une garde-robe bien pensée peut transformer la façon dont vous traversez le monde. Chaque matin, ce que vous portez est la première phrase que vous dites avant même d'ouvrir la bouche.
            </p>
            <p>
              Fondée en Tunisie, notre marque puise son inspiration dans l'élégance méditerranéenne — des matières nobles, des coupes qui respectent le corps, des silhouettes qui résistent aux tendances éphémères.
            </p>
            <p>
              Nous sélectionnons chaque pièce avec soin, en refusant le superflu. Chez DRAPE, moins c'est plus — et chaque article que nous proposons mérite sa place dans une garde-robe permanente.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-charcoal/10 dark:border-cream/10">
            {[
              { icon: '✦', title: 'Qualité', desc: 'Des matières sélectionnées pour leur durabilité et leur confort au quotidien.' },
              { icon: '◈', title: 'Intemporalité', desc: 'Des pièces pensées pour durer, loin des cycles de la fast fashion.' },
              { icon: '◉', title: 'Authenticité', desc: 'Une identité visuelle forte, fidèle à nos racines tunisiennes.' }
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
          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Rejoignez l'univers</p>
          <h2 className="font-display text-4xl mb-8">Découvrez nos collections</h2>
          <Link to="/shop" className="btn-ghost border-cream text-cream hover:bg-cream hover:text-charcoal">
            Explorer la boutique
          </Link>
        </section>
      </div>
    </>
  );
}
