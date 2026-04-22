import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  const openUser = async (user) => {
    setSelectedUser(user);
    setLoadingOrders(true);
    try {
      const res = await api.get(`/users/${user._id}`);
      setUserOrders(res.data.orders);
    } finally {
      setLoadingOrders(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Supprimer définitivement cet utilisateur ?')) return;
    await api.delete(`/users/${id}`);
    setUsers(prev => prev.filter(u => u._id !== id));
    toast.success('Utilisateur supprimé');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-medium">Clients</h1>

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              {['Nom', 'Email', 'Téléphone', 'Ville', 'Commandes', 'Total dépensé', 'Inscription', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-8 skeleton" /></td></tr>
              ))
            ) : users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  {user.phone ? (
                    <a href={`https://wa.me/${user.phone}`} target="_blank" rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-xs">
                      {user.phone}
                    </a>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">{user.address?.city || '—'}</td>
                <td className="px-4 py-3">{user.orderCount}</td>
                <td className="px-4 py-3 font-medium">{user.totalSpent?.toFixed(0)} DT</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('fr-TN')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openUser(user)} className="text-xs text-gold hover:underline">
                      Détails
                    </button>
                    <button onClick={() => deleteUser(user._id)} className="text-xs text-red-400 hover:underline">
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-2xl text-gray-400">✕</button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Téléphone</p>
                  <p>{selectedUser.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Ville</p>
                  <p>{selectedUser.address?.city || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Adresse</p>
                  <p>{selectedUser.address?.street || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Code postal</p>
                  <p>{selectedUser.address?.postalCode || '—'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Historique des commandes</h4>
                {loadingOrders ? (
                  <div className="space-y-2">
                    {Array(3).fill(0).map((_, i) => <div key={i} className="h-12 skeleton" />)}
                  </div>
                ) : userOrders.length === 0 ? (
                  <p className="text-sm text-gray-400">Aucune commande</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {userOrders.map(order => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 text-sm">
                        <div>
                          <p className="font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('fr-TN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.totalAmount.toFixed(0)} DT</p>
                          <p className="text-xs text-gray-400 capitalize">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
