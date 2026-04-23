import { useState, useEffect } from 'react';
import api from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' }
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;

    api.get('/orders', { params })
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus, fromDate, toDate]);

  const updateStatus = async (orderId, status, adminNote) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status, adminNote });
      setOrders(prev => prev.map(o => o._id === orderId ? res.data : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-medium">Commandes</h1>

      {/* Filters */}
      <div className="bg-white border border-gray-100 p-4 flex flex-wrap gap-4 items-center">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-3 py-1.5 text-xs tracking-wider rounded-sm transition-colors ${
                filterStatus === s.value
                  ? 'bg-charcoal text-cream'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            className="text-xs border border-gray-200 px-3 py-1.5 outline-none focus:border-gold" />
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            className="text-xs border border-gray-200 px-3 py-1.5 outline-none focus:border-gold" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Orders table */}
        <div className={`bg-white border border-gray-100 flex-1 overflow-x-auto ${selectedOrder ? 'hidden lg:block' : ''}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                {['Commande', 'Client', 'Articles', 'Total', 'Statut', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 skeleton" /></td></tr>
                ))
              ) : orders.map(order => (
                <tr
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedOrder?._id === order._id ? 'bg-gold/5 border-l-2 border-l-gold' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p>{order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length}</td>
                  <td className="px-4 py-3 font-medium">{order.totalAmount.toFixed(0)} DT</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('fr-TN')}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-gold hover:underline">Détails →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order detail side panel */}
        {selectedOrder && (
          <OrderPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={updateStatus}
          />
        )}
      </div>
    </div>
  );
}

function OrderPanel({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState(order.adminNote || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStatus(order.status);
    setNote(order.adminNote || '');
  }, [order]);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(order._id, status, note);
    setSaving(false);
  };

  return (
    <div className="w-full lg:w-96 bg-white border border-gray-100 flex-shrink-0 overflow-y-auto max-h-[calc(100vh-180px)]">
      <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
        <h3 className="font-medium">#{order._id.slice(-6).toUpperCase()}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700">✕</button>
      </div>

      <div className="p-4 space-y-5">
        {/* Items */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Articles</p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-2 text-sm">
                {item.product?.images?.[0] && (
                  <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover flex-shrink-0" loading="lazy" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.product?.name}</p>
                  <p className="text-xs text-gray-400">{item.size} · {item.color} · ×{item.quantity}</p>
                </div>
                <p className="text-xs font-medium">{(item.price * item.quantity).toFixed(0)} DT</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Sous-total</span>
              <span>{(order.totalAmount - (order.shippingFee ?? 8) + (order.discount ?? 0)).toFixed(2)} DT</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Livraison</span>
              <span>{(order.shippingFee ?? 8).toFixed(2)} DT</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-xs text-amber-600">
                <span>Promo {order.promoCode && `(${order.promoCode})`}</span>
                <span>− {order.discount.toFixed(2)} DT</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-100">
              <span>Total</span>
              <span>{order.totalAmount.toFixed(2)} DT</span>
            </div>
          </div>
        </div>

        {/* Client info */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Client</p>
          <p className="text-sm font-medium">{order.user?.name}</p>
          <a
            href={`https://wa.me/${order.user?.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-green-600 hover:underline flex items-center gap-1"
          >
            📱 {order.user?.phone}
          </a>
          <p className="text-xs text-gray-400 mt-1">
            {order.shippingAddress?.street}, {order.shippingAddress?.city}
          </p>
        </div>

        {/* Status update */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Statut</p>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Admin note */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Note admin</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gold resize-none"
            placeholder="Ajouter une note interne..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-charcoal text-cream py-2.5 text-sm tracking-wider hover:bg-charcoal/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer — WhatsApp auto'}
        </button>

        {/* Timestamps */}
        <div className="text-xs text-gray-400 space-y-1">
          <p>Créée le {new Date(order.createdAt).toLocaleString('fr-TN')}</p>
          {order.confirmedAt && <p>Confirmée le {new Date(order.confirmedAt).toLocaleString('fr-TN')}</p>}
        </div>
      </div>
    </div>
  );
}
