import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import StatusBadge from '../components/StatusBadge';

const TABS = ['Mes Commandes', 'Mon Profil', 'Notifications'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const { user, updateUser } = useAuth();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data)).finally(() => setLoadingOrders(false));
    api.get('/notifications/my').then(res => setNotifications(res.data)).finally(() => setLoadingNotifs(false));
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="pt-24 pb-32 lg:pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-gold mb-1">Tableau de bord</p>
          <h1 className="font-display text-3xl">Bonjour, {user?.name?.split(' ')[0]}</h1>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-charcoal/10 mb-10">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`relative py-3 mr-8 text-xs tracking-widest uppercase font-medium transition-colors ${
                activeTab === i ? 'text-charcoal' : 'text-charcoal/40 hover:text-charcoal/70'
              }`}
            >
              {tab}
              {i === 2 && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-gold text-white text-[9px] rounded-full">
                  {unreadCount}
                </span>
              )}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-charcoal" />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 0 && (
          <div>
            {loadingOrders ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => <div key={i} className="h-20 skeleton" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-display text-2xl mb-2">Aucune commande</p>
                <p className="text-charcoal/50 text-sm mb-8">Votre historique de commandes apparaîtra ici</p>
                <a href="/shop" className="btn-gold">Découvrir la boutique</a>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="border border-charcoal/10 p-5 cursor-pointer hover:border-gold transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('fr-TN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={order.status} />
                        <p className="font-display text-sm mt-1">{order.totalAmount.toFixed(2)} DT</p>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal/40">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 1 && <ProfileTab user={user} updateUser={updateUser} />}

        {/* Tab 3: Notifications */}
        {activeTab === 2 && (
          <div>
            {unreadCount > 0 && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={markAllRead}
                  className="text-xs tracking-widest uppercase text-gold hover:underline"
                >
                  Tout marquer lu
                </button>
              </div>
            )}
            {loadingNotifs ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 skeleton" />)}
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-center text-charcoal/50 py-12">Aucune notification</p>
            ) : (
              <div className="space-y-2">
                {notifications.map(n => (
                  <div
                    key={n._id}
                    onClick={() => !n.isRead && markRead(n._id)}
                    className={`p-4 border transition-colors cursor-pointer ${
                      n.isRead ? 'border-charcoal/10' : 'border-gold/30 bg-gold/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-gold'}`} />
                      <div className="flex-1">
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-charcoal/40 mt-1">
                          {new Date(n.createdAt).toLocaleDateString('fr-TN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function ProfileTab({ user, updateUser }) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name,
      phone: user?.phone?.replace(/^216/, ''),
      street: user?.address?.street,
      city: user?.address?.city,
      postalCode: user?.address?.postalCode
    }
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await api.put('/users/me', {
        name: data.name,
        phone: `216${data.phone}`,
        address: { street: data.street, city: data.city, postalCode: data.postalCode }
      });
      updateUser(res.data);
      toast.success('Profil mis à jour !');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-6">
      <div>
        <label className="block text-xs tracking-widest uppercase font-medium mb-2">Nom complet</label>
        <input {...register('name', { required: true })} className="input-field" />
        {errors.name && <p className="text-red-500 text-xs mt-1">Nom requis</p>}
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase font-medium mb-2">Email</label>
        <input value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed" />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase font-medium mb-2">Téléphone</label>
        <div className="flex">
          <span className="border border-charcoal/20 border-r-0 px-3 flex items-center text-sm text-charcoal/50">
            +216
          </span>
          <input {...register('phone')} className="input-field flex-1 border-l-0" placeholder="50 000 000" />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase font-medium mb-2">Adresse</label>
        <input {...register('street')} className="input-field" placeholder="Rue et numéro" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Ville</label>
          <input {...register('city')} className="input-field" />
        </div>
        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Code postal</label>
          <input {...register('postalCode')} className="input-field" />
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-gold w-full py-3.5 disabled:opacity-50">
        {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  );
}

function OrderModal({ order, onClose }) {
  const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];
  const currentStep = STATUS_STEPS.indexOf(order.status);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-cream max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-cream border-b border-charcoal/10 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">Commande #{order._id.slice(-6).toUpperCase()}</h3>
            <p className="text-xs text-charcoal/50 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="text-2xl text-charcoal/50 hover:text-charcoal">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status timeline */}
          {order.status !== 'cancelled' && (
            <div className="flex items-center">
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    i <= currentStep ? 'bg-gold' : 'bg-charcoal/20'
                  }`} />
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-gold' : 'bg-charcoal/10'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Items */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-medium mb-3">Articles</h4>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt="" className="w-12 h-16 object-cover flex-shrink-0" loading="lazy" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product?.name || 'Produit'}</p>
                    <p className="text-xs text-charcoal/50">{item.size} · {item.color} · ×{item.quantity}</p>
                  </div>
                  <p className="text-sm">{(item.price * item.quantity).toFixed(2)} DT</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-charcoal/10 pt-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-display text-xl">{order.totalAmount.toFixed(2)} DT</span>
          </div>

          {/* Shipping address */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-medium mb-2">Adresse de livraison</h4>
            <p className="text-sm text-charcoal/70">
              {order.shippingAddress.street}, {order.shippingAddress.city}
              {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
            </p>
          </div>

          {/* Admin note */}
          {order.adminNote && (
            <div className="bg-gold/10 border border-gold/20 p-4">
              <p className="text-xs tracking-widest uppercase font-medium mb-1 text-gold">Note</p>
              <p className="text-sm">{order.adminNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
