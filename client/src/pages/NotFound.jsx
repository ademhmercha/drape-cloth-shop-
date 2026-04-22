import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <p className="font-display text-[120px] leading-none text-charcoal/5 select-none">404</p>
        <div className="-mt-8">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4">Page introuvable</p>
          <h1 className="font-display text-4xl sm:text-5xl mb-6">
            Cette page s'est évaporée...
          </h1>
          <p className="text-charcoal/50 mb-12 leading-relaxed">
            Comme une pièce de collection déjà vendue, cette page n'existe plus. Mais notre boutique, elle, regorge de trésors.
          </p>
          <Link to="/shop" className="btn-gold">
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
