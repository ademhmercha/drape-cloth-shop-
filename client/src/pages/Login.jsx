import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
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
    <div className="min-h-screen flex">
      {/* Left: editorial image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop"
          alt="DRAPE"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/30" />
        <div className="absolute bottom-16 left-12">
          <p className="font-display text-5xl text-cream leading-tight">
            Le style est<br />
            <em>une langue</em>
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal block mb-12 text-center">
            DRAPE
          </Link>

          <h1 className="font-display text-3xl mb-2">Connexion</h1>
          <p className="text-sm text-charcoal/50 mb-10">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-gold hover:underline">S'inscrire</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2">Email</label>
              <input
                {...register('email', { required: 'Email requis', pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
                type="email"
                className="input-field"
                placeholder="vous@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2">Mot de passe</label>
              <input
                {...register('password', { required: 'Mot de passe requis' })}
                type="password"
                className="input-field"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full py-4 mt-4 disabled:opacity-50"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
