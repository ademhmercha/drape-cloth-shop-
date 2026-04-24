import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../utils/api';
import SEOHead from '../components/SEOHead';
import { useLang } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/contact', data);
      setSent(true);
      reset();
      toast.success('Message envoyé !');
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.');
    }
  };

  return (
    <>
      <SEOHead
        title="Contact"
        description="Contactez l'équipe DRAPE pour toute question sur nos collections, commandes ou partenariats."
      />

      <div className="pt-24 pb-20 min-h-screen dark:bg-charcoal dark:text-cream">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left: Info */}
            <div>
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">Contact</p>
              <h1 className="font-display text-4xl lg:text-5xl mb-6 dark:text-cream">
                {t('contactTitle')}
              </h1>
              <p className="text-charcoal/60 dark:text-cream/60 text-lg leading-relaxed mb-12">
                Une question sur une commande, nos produits ou un partenariat ?<br />
                Notre équipe vous répond sous 24h.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: '📱',
                    label: 'WhatsApp',
                    value: '+216 50733444',
                    href: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '21650000000'}`
                  },
                  {
                    icon: '📧',
                    label: 'Email',
                    value: 'contact@drape.tn',
                    href: 'mailto:contact@drape.tn'
                  },
                  {
                    icon: '📍',
                    label: 'Adresse',
                    value: 'Tunis, Tunisie'
                  }
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-charcoal/40 dark:text-cream/40 mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium hover:text-gold transition-colors dark:text-cream">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium dark:text-cream">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="font-display text-2xl mb-3 dark:text-cream">Message envoyé !</h2>
                  <p className="text-charcoal/50 dark:text-cream/50 text-sm">
                    Nous vous répondrons dans les 24 heures.
                  </p>
                  <button onClick={() => setSent(false)} className="mt-8 text-xs tracking-widest uppercase hover:text-gold transition-colors dark:text-cream">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('name')}</label>
                      <input
                        {...register('name', { required: true })}
                        className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                        placeholder="Sarra Ben Ali"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('email')}</label>
                      <input
                        {...register('email', { required: true, pattern: /\S+@\S+\.\S+/ })}
                        type="email"
                        className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                        placeholder="vous@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('subject')}</label>
                    <select
                      {...register('subject')}
                      className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                    >
                      <option value="Commande">Question sur une commande</option>
                      <option value="Produit">Question sur un produit</option>
                      <option value="Retour">Retour / Échange</option>
                      <option value="Partenariat">Partenariat</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('message')}</label>
                    <textarea
                      {...register('message', { required: true, minLength: 10 })}
                      rows={6}
                      className="input-field resize-none dark:bg-charcoal dark:text-cream dark:border-cream/20"
                      placeholder="Décrivez votre demande en détail…"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">Message trop court</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <><Spinner />{t('sending')}</> : t('send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  );
}
