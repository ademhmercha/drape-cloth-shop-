import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      const user = await login(email, password);
      toast.success(`Bienvenue, ${user.name.split(' ')[0]} !`);
      navigate(state?.from || (user.role === 'admin' ? '/admin' : '/'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-charcoal">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop"
          alt="DRAPE"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute bottom-16 left-12">
          <p className="font-display text-5xl text-cream leading-tight">
            {t('auth.heroQuote').split(' ').slice(0, 2).join(' ')}<br />
            <em>{t('auth.heroQuote').split(' ').slice(2).join(' ')}</em>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 dark:bg-charcoal">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal dark:text-cream block mb-12 text-center">
            DRAPE
          </Link>

          <h1 className="font-display text-3xl mb-2 dark:text-cream">{t('auth.loginTitle')}</h1>
          <p className="text-sm text-charcoal/50 dark:text-cream/50 mb-10">
            {t('auth.loginSubtitle')}{' '}
            <Link to="/register" className="text-gold hover:underline">{t('auth.registerLink')}</Link>
          </p>

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

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs tracking-widest uppercase font-medium dark:text-cream">{t('auth.password')}</label>
                <Link to="/forgot-password" className="text-xs text-charcoal/40 dark:text-cream/40 hover:text-gold transition-colors">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <input
                {...register('password', { required: t('auth.passwordRequired') })}
                type="password"
                className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="btn-gold w-full py-4 mt-4 disabled:opacity-50">
              {isSubmitting ? t('auth.logging') : t('auth.loginBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
