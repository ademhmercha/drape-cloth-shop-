import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const ref = id.slice(-6).toUpperCase();

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center">
      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <svg viewBox="0 0 52 52" className="w-24 h-24">
            <circle
              cx="26" cy="26" r="25"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="2"
              strokeDasharray="157"
              strokeDashoffset="157"
              style={{
                animation: 'drawCircle 0.6s ease forwards',
                animationFillMode: 'forwards'
              }}
            />
            <path
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="30"
              strokeDashoffset="30"
              style={{ animation: 'drawCheck 0.4s 0.6s ease forwards' }}
            />
          </svg>
        </div>

        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">Commande confirmée</p>
        <h1 className="font-display text-4xl mb-4">Merci pour votre commande !</h1>
        <p className="text-charcoal/60 mb-2">Référence de commande</p>
        <p className="font-display text-3xl text-charcoal mb-8">#{ref}</p>

        <div className="bg-charcoal/5 p-6 text-left space-y-3 mb-10 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl">📦</span>
            <div>
              <p className="font-medium">Livraison sous 3–5 jours</p>
              <p className="text-charcoal/50 text-xs">Vous recevrez vos articles très bientôt</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💵</span>
            <div>
              <p className="font-medium">Paiement en espèces</p>
              <p className="text-charcoal/50 text-xs">
                Préparez {order ? `${order.totalAmount.toFixed(2)} DT` : '…'} pour le livreur
              </p>
              {order?.discount > 0 && (
                <p className="text-gold text-xs mt-0.5">
                  Code {order.promoCode} appliqué — {order.discount.toFixed(2)} DT de réduction
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📱</span>
            <div>
              <p className="font-medium">Notification WhatsApp</p>
              <p className="text-charcoal/50 text-xs">Vous serez notifié à chaque mise à jour de votre commande</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-gold">
            Suivre ma commande
          </Link>
          <Link to="/shop" className="btn-ghost">
            Continuer mes achats
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
