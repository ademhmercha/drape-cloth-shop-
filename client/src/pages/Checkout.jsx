import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const STEPS = ['Livraison', 'Récapitulatif', 'Confirmation'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || ''
    }
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) navigate('/shop');
  }, [items]);

  const placeOrder = async () => {
    setPlacing(true);
    const values = getValues();
    try {
      const res = await api.post('/orders', {
        items: items.map(i => ({
          product: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price
        })),
        shippingAddress: {
          street: values.street,
          city: values.city,
          postalCode: values.postalCode,
          country: 'Tunisia'
        }
      });
      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl mb-10 text-center">Finaliser la commande</h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 text-xs tracking-widest uppercase ${
                i <= step ? 'text-charcoal font-medium' : 'text-charcoal/30'
              }`}>
                <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs ${
                  i < step ? 'bg-gold border-gold text-white' :
                  i === step ? 'border-charcoal' : 'border-charcoal/20 text-charcoal/30'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mx-3 ${i < step ? 'bg-gold' : 'bg-charcoal/15'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Shipping address */}
        {step === 0 && (
          <form onSubmit={handleSubmit(() => setStep(1))} className="space-y-6">
            <Field label="Nom complet" error={errors.fullName}>
              <input
                {...register('fullName', { required: 'Nom requis' })}
                className="input-field"
                placeholder="Sarra Ben Ali"
              />
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              <div className="flex">
                <span className="border border-charcoal/20 border-r-0 px-3 flex items-center text-sm text-charcoal/50">
                  +216
                </span>
                <input
                  {...register('phone', { required: 'Téléphone requis' })}
                  className="input-field flex-1 border-l-0"
                  placeholder="50 000 000"
                />
              </div>
            </Field>
            <Field label="Adresse" error={errors.street}>
              <input
                {...register('street', { required: 'Adresse requise' })}
                className="input-field"
                placeholder="Rue de la Liberté, Apt 3"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ville" error={errors.city}>
                <input
                  {...register('city', { required: 'Ville requise' })}
                  className="input-field"
                  placeholder="Tunis"
                />
              </Field>
              <Field label="Code postal">
                <input
                  {...register('postalCode')}
                  className="input-field"
                  placeholder="1001"
                />
              </Field>
            </div>
            <button type="submit" className="btn-gold w-full py-4 mt-4">
              Continuer →
            </button>
          </form>
        )}

        {/* Step 2: Order review */}
        {step === 1 && (
          <div>
            <div className="divide-y divide-charcoal/10 mb-8">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-4">
                  <div className="w-16 h-20 bg-gray-100 flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-charcoal/50 mt-0.5">{item.size} · {item.color} · ×{item.quantity}</p>
                  </div>
                  <p className="font-display text-sm">{(item.price * item.quantity).toFixed(2)} DT</p>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal/10 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm tracking-widest uppercase">Total</span>
                <span className="font-display text-2xl">{total.toFixed(2)} DT</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(0)} className="btn-ghost flex-1 py-4">← Retour</button>
              <button onClick={() => setStep(2)} className="btn-gold flex-1 py-4">Confirmer →</button>
            </div>
          </div>
        )}

        {/* Step 3: Payment confirmation */}
        {step === 2 && (
          <div className="text-center">
            <div className="bg-gold/10 border border-gold/30 p-8 mb-8">
              <div className="text-4xl mb-4">💵</div>
              <h2 className="font-display text-2xl mb-3">Paiement à la livraison</h2>
              <p className="text-charcoal/60 text-sm leading-relaxed max-w-sm mx-auto">
                Votre commande sera livrée sous 3–5 jours. Préparez <strong>{total.toFixed(2)} DT</strong> en espèces pour le livreur.
              </p>
            </div>

            <p className="text-xs text-charcoal/40 mb-8">
              En passant commande, vous acceptez nos conditions de vente. Paiement uniquement en espèces, aucune autre méthode disponible.
            </p>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-ghost flex-1 py-4" disabled={placing}>
                ← Retour
              </button>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn-gold flex-1 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? 'Envoi en cours...' : 'Passer la commande'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase font-medium mb-2">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
}
