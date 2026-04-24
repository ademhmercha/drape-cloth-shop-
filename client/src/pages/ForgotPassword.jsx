import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm();

  const onSubmit = async ({ email }) => {
    await api.post('/auth/forgot-password', { email });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 dark:bg-charcoal">
        <div className="max-w-md w-full text-center">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal dark:text-cream block mb-12">DRAPE</Link>
          <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="font-display text-3xl mb-3 dark:text-cream">{t('auth.emailSentTitle')}</h1>
          <p className="text-charcoal/60 dark:text-cream/60 text-sm leading-relaxed mb-2">
            {t('auth.emailSentDesc', { email: getValues('email') })}
          </p>
          <p className="text-charcoal/40 dark:text-cream/40 text-xs mb-10">{t('auth.checkSpam')}</p>
          <Link to="/login" className="text-xs tracking-widest uppercase hover:text-gold transition-colors dark:text-cream">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex dark:bg-charcoal">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop" alt="DRAPE" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute bottom-16 left-12">
          <p className="font-display text-5xl text-cream leading-tight">
            Retrouvez<br /><em>votre accès</em>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal dark:text-cream block mb-12 text-center">DRAPE</Link>
          <h1 className="font-display text-3xl mb-2 dark:text-cream">{t('auth.forgotTitle')}</h1>
          <p className="text-sm text-charcoal/50 dark:text-cream/50 mb-10 leading-relaxed">{t('auth.forgotDesc')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('auth.email')}</label>
              <input
                {...register('email', {
                  required: t('auth.emailRequired'),
                  pattern: { value: /\S+@\S+\.\S+/, message: t('auth.emailInvalid') }
                })}
                type="email"
                className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                placeholder="vous@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <><Spinner />{t('auth.sending')}</> : t('auth.sendLink')}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal/50 dark:text-cream/50 mt-8">
            <Link to="/login" className="hover:text-gold transition-colors">{t('auth.backToLogin')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const Spinner = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
);
