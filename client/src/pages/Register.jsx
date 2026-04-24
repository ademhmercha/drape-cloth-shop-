import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async ({ name, email, password, phone }) => {
    try {
      const formattedPhone = phone ? `216${phone.replace(/^(216|\+216)/, '')}` : undefined;
      await registerUser({ name, email, password, phone: formattedPhone });
      toast.success('Bienvenue chez DRAPE !');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-charcoal">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&auto=format&fit=crop"
          alt="DRAPE"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="absolute bottom-16 left-12">
          <p className="font-display text-5xl text-cream leading-tight">
            Rejoignez<br /><em>la communauté</em>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20 dark:bg-charcoal">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal dark:text-cream block mb-12 text-center">DRAPE</Link>

          <h1 className="font-display text-3xl mb-2 dark:text-cream">{t('auth.registerTitle')}</h1>
          <p className="text-sm text-charcoal/50 dark:text-cream/50 mb-10">
            {t('auth.registerSubtitle')}{' '}
            <Link to="/login" className="text-gold hover:underline">{t('auth.loginLink')}</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('auth.fullName')}</label>
              <input
                {...register('name', { required: t('auth.nameRequired') })}
                className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                placeholder="Sarra Ben Ali"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('auth.phone')}</label>
              <div className="flex">
                <span className="border border-charcoal/20 dark:border-cream/20 border-r-0 px-3 flex items-center text-sm text-charcoal/50 dark:text-cream/50">+216</span>
                <input
                  {...register('phone')}
                  className="input-field flex-1 border-l-0 dark:bg-charcoal dark:text-cream dark:border-cream/20"
                  placeholder="50 000 000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('auth.password')}</label>
              <input
                {...register('password', {
                  required: t('auth.passwordRequired'),
                  minLength: { value: 6, message: t('auth.passwordMin') }
                })}
                type="password"
                className="input-field dark:bg-charcoal dark:text-cream dark:border-cream/20"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="btn-gold w-full py-4 mt-4 disabled:opacity-50">
              {isSubmitting ? t('auth.registering') : t('auth.registerBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
