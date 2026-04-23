import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AdminPromoCodes() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchPromos = () => {
    setLoading(true);
    api.get('/promo').then(res => setPromos(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/promo/${id}/toggle`);
      setPromos(prev => prev.map(p => p._id === id ? res.data : p));
    } catch {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce code ?')) return;
    try {
      await api.delete(`/promo/${id}`);
      setPromos(prev => prev.filter(p => p._id !== id));
      toast.success('Code supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCreate = (promo) => {
    setPromos(prev => [promo, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-medium">Codes Promo</h1>
        <button onClick={() => setShowForm(v => !v)} className="btn-gold text-xs py-2.5 px-5">
          {showForm ? 'Annuler' : '+ Nouveau code'}
        </button>
      </div>

      {showForm && <CreatePromoForm onCreate={handleCreate} />}

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              {['Code', 'Réduction', 'Min commande', 'Utilisations', 'Expire le', 'Statut', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 skeleton" /></td></tr>
              ))
            ) : promos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">
                  Aucun code promo créé
                </td>
              </tr>
            ) : promos.map(p => (
              <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono font-medium tracking-widest">{p.code}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-sm font-medium ${
                    p.type === 'percent' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {p.type === 'percent' ? `${p.value}%` : `${p.value} DT`}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {p.minOrderAmount > 0 ? `${p.minOrderAmount} DT` : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {p.usedCount}{p.maxUses ? ` / ${p.maxUses}` : ''}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString('fr-TN') : '—'}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(p._id)}
                    className={`text-xs px-2.5 py-1 rounded-sm font-medium transition-colors ${
                      p.isActive
                        ? 'bg-gold/10 text-gold hover:bg-gold/20'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {p.isActive ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreatePromoForm({ onCreate }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: { type: 'percent' }
  });
  const type = watch('type');

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await api.post('/promo', {
        code: data.code,
        type: data.type,
        value: Number(data.value),
        minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : 0,
        maxUses: data.maxUses ? Number(data.maxUses) : null,
        expiresAt: data.expiresAt || null
      });
      onCreate(res.data);
      reset();
      toast.success(`Code "${res.data.code}" créé`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-gray-100 p-6 space-y-5">
      <h3 className="font-medium text-sm">Nouveau code promo</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
          <input
            {...register('code', { required: true })}
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold uppercase font-mono tracking-widest"
            placeholder="DRAPE20"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Type *</label>
          <select
            {...register('type')}
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold bg-white"
          >
            <option value="percent">Pourcentage (%)</option>
            <option value="fixed">Montant fixe (DT)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            Valeur * {type === 'percent' ? '(%)' : '(DT)'}
          </label>
          <input
            {...register('value', { required: true, min: 1 })}
            type="number"
            min="1"
            max={type === 'percent' ? 100 : undefined}
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
            placeholder={type === 'percent' ? '20' : '15'}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Min commande (DT)</label>
          <input
            {...register('minOrderAmount')}
            type="number"
            min="0"
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Max utilisations</label>
          <input
            {...register('maxUses')}
            type="number"
            min="1"
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
            placeholder="Illimité"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Expire le</label>
          <input
            {...register('expiresAt')}
            type="date"
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-gold text-xs py-2.5 px-6 disabled:opacity-50">
        {saving ? 'Création…' : 'Créer le code'}
      </button>
    </form>
  );
}
