import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="font-display text-3xl text-cream tracking-[0.3em] block mb-4">
            DRAPE
          </Link>
          <p className="text-sm leading-relaxed text-cream/60 max-w-xs">
            Mode de luxe éditorial. Des pièces intemporelles pour ceux qui comprennent que le style est une forme d'art.
          </p>
          {/* Newsletter */}
          <div className="mt-6 flex">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 bg-cream/10 border border-cream/20 px-4 py-2 text-sm text-cream placeholder-cream/40 outline-none focus:border-gold transition-colors"
            />
            <button className="bg-gold text-white px-4 py-2 text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-colors">
              OK
            </button>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-5 font-medium">Collections</h3>
          <ul className="space-y-3">
            {[
              { label: 'Femmes', href: '/shop?category=women' },
              { label: 'Hommes', href: '/shop?category=men' },
              { label: 'Enfants', href: '/shop?category=kids' },
              { label: 'Accessoires', href: '/shop?category=accessories' },
              { label: 'Nouveautés', href: '/shop?sort=newest' }
            ].map(({ label, href }) => (
              <li key={href}>
                <Link to={href} className="text-sm hover:text-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-5 font-medium">Informations</h3>
          <ul className="space-y-3 text-sm text-cream/60">
            <li>Livraison en 3–5 jours</li>
            <li>Paiement à la livraison</li>
            <li>Retours sous 14 jours</li>
            <li className="pt-2">
              <a href="mailto:contact@drape.tn" className="hover:text-gold transition-colors">
                contact@drape.tn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/30 tracking-widest">
        © {new Date().getFullYear()} DRAPE — Tous droits réservés
      </div>
    </footer>
  );
}
