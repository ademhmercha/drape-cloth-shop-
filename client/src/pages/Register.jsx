import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

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
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1000&auto=format&fit=crop"
          alt="DRAPE"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="absolute bottom-16 left-12">
          <p className="font-display text-5xl text-cream leading-tight">
            Rejoignez<br />
            <em>la communauté</em>
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <Link to="/" className="font-display text-2xl tracking-[0.3em] block mb-12 text-center">DRAPE</Link>

          <h1 className="font-display text-3xl mb-2">Créer un compte</h1>
          <p className="text-sm text-charcoal/50 mb-10">
            Déjà membre ?{' '}
            <Link to="/login" className="text-gold hover:underline">Se connecter</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2">Nom complet</label>
              <input
                {...register('name', { required: 'Nom requis' })}
                className="input-field"
                placeholder="Sarra Ben Ali"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

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
              <label className="block text-xs tracking-widest uppercase font-medium mb-2">Téléphone (optionnel)</label>
              <div className="flex">
                <span className="border border-charcoal/20 border-r-0 px-3 flex items-center text-sm text-charcoal/50">+216</span>
                <input
                  {...register('phone')}
                  className="input-field flex-1 border-l-0"
                  placeholder="50 000 000"
                />
              </div>
              <p className="text-xs text-charcoal/40 mt-1">Pour recevoir les mises à jour de commande par WhatsApp</p>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase font-medium mb-2">Mot de passe</label>
              <input
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Au moins 6 caractères' } })}
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
              {isSubmitting ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
