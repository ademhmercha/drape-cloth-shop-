import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function ResetPassword() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async ({ password }) => {
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lien invalide ou expiré');
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 dark:bg-charcoal">
        <div className="max-w-md w-full text-center">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal dark:text-cream block mb-12">DRAPE</Link>
          <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-3xl mb-3 dark:text-cream">{t('auth.passwordChangedTitle')}</h1>
          <p className="text-charcoal/60 dark:text-cream/60 text-sm mb-8">{t('auth.passwordChangedDesc')}</p>
          <Link to="/login" className="btn-gold inline-block">{t('auth.loginNow')}</Link>
        </div>
      </div>
    );
  }

  const strength = [
    password?.length >= 8,
    /[A-Z]/.test(password || ''),
    /[0-9]/.test(password || ''),
    /[^A-Za-z0-9]/.test(password || '')
  ].filter(Boolean).length;

  const strengthLabels = [t('auth.strength.weak'), t('auth.strength.fair'), t('auth.strength.good'), t('auth.strength.strong')];
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

  return (
    <div className="min-h-screen flex dark:bg-charcoal">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop" alt="DRAPE" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute bottom-16 left-12">
          <p className="font-display text-5xl text-cream leading-tight">Nouveau<br /><em>départ</em></p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal dark:text-cream block mb-12 text-center">DRAPE</Link>
          <h1 className="font-display text-3xl mb-2 dark:text-cream">{t('auth.newPasswordTitle')}</h1>
          <p className="text-sm text-charcoal/50 dark:text-cream/50 mb-10">{t('auth.newPasswordDesc')}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('auth.password')}</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: t('auth.passwordRequired'),
                    minLength: { value: 6, message: t('auth.passwordMin') }
                  })}
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10 dark:bg-charcoal dark:text-cream dark:border-cream/20"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream">
                  {showPass ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('auth.confirmPwd')}</label>
              <div className="relative">
                <input
                  {...register('confirm', {
                    required: t('auth.confirmRequired'),
                    validate: v => v === password || t('auth.passwordMismatch')
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  className="input-field pr-10 dark:bg-charcoal dark:text-cream dark:border-cream/20"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-cream/40 hover:text-charcoal dark:hover:text-cream">
                  {showConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            {password && (
              <div>
                <div className="flex gap-1 mb-1">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : 'bg-charcoal/10 dark:bg-cream/10'}`} />
                  ))}
                </div>
                <p className="text-xs text-charcoal/50 dark:text-cream/50">{strength > 0 ? strengthLabels[strength - 1] : ''}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="btn-gold w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <><Spinner />{t('auth.saving')}</> : t('auth.savePassword')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const Eye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" /><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
  </svg>
);
const Spinner = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
  </svg>
);
