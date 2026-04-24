import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../utils/api';
import SEOHead from '../components/SEOHead';

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;
const STORE_ADDRESS = import.meta.env.VITE_STORE_ADDRESS;

function formatPhone(raw) {
  if (!raw) return null;
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('216') && d.length >= 11) return `+216 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return `+${d}`;
}

export default function Contact() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/contact', data);
      setSent(true);
      reset();
      toast.success(t('contact.sentTitle'));
    } catch {
      toast.error("Erreur lors de l'envoi. Réessayez.");
    }
  };

  const contacts = [
    WHATSAPP && { icon: '📱', label: t('contact.whatsapp'), value: formatPhone(WHATSAPP), href: `https://wa.me/${WHATSAPP}` },
    CONTACT_EMAIL && { icon: '📧', label: t('contact.email'), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    STORE_ADDRESS && { icon: '📍', label: t('contact.address'), value: STORE_ADDRESS }
  ].filter(Boolean);

  return (
    <>
      <SEOHead title={t('contact.title')} description={t('contact.subtitle')} />
      <div className="pt-24 pb-20 min-h-screen dark:bg-charcoal dark:text-cream">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-gold text-xs tracking-[0.4em] uppercase mb-3">{t('contact.label')}</p>
              <h1 className="font-display text-4xl lg:text-5xl mb-6 dark:text-cream">{t('contact.title')}</h1>
              <p className="text-charcoal/60 dark:text-cream/60 text-lg leading-relaxed mb-12 whitespace-pre-line">
                {t('contact.subtitle')}
              </p>
              {contacts.length > 0 && (
                <div className="space-y-6">
                  {contacts.map(item => (
                    <div key={item.label} className="flex items-start gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-xs tracking-widest uppercase text-charcoal/40 dark:text-cream/40 mb-0.5">{item.label}</p>
                        {item.href
                          ? <a href={item.href} className="text-sm font-medium hover:text-gold transition-colors dark:text-cream">{item.value}</a>
                          : <p className="text-sm font-medium dark:text-cream">{item.value}</p>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="font-display text-2xl mb-3 dark:text-cream">{t('contact.sentTitle')}</h2>
                  <p className="text-charcoal/50 dark:text-cream/50 text-sm">{t('contact.sentDesc')}</p>
                  <button onClick={() => setSent(false)} className="mt-8 text-xs tracking-widest uppercase hover:text-gold transition-colors dark:text-cream">
                    {t('contact.sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('contact.name')}</label>
                      <input {...register('name', { required: true })}
                        className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20" placeholder="Sarra Ben Ali" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('contact.emailField')}</label>
                      <input {...register('email', { required: true, pattern: /\S+@\S+\.\S+/ })}
                        type="email" className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20" placeholder="vous@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('contact.subject')}</label>
                    <select {...register('subject')} className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20">
                      <option value="Commande">{t('contact.subject_order')}</option>
                      <option value="Produit">{t('contact.subject_product')}</option>
                      <option value="Retour">{t('contact.subject_return')}</option>
                      <option value="Partenariat">{t('contact.subject_partnership')}</option>
                      <option value="Autre">{t('contact.subject_other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('contact.message')}</label>
                    <textarea {...register('message', { required: true, minLength: 10 })} rows={6}
                      className="input-field resize-none dark:bg-charcoal dark:text-cream dark:border-cream/20"
                      placeholder={t('contact.messagePlaceholder')} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{t('contact.messageTooShort')}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting}
                    className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <><Spinner />{t('contact.sending')}</> : t('contact.send')}
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

const Spinner = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
);
