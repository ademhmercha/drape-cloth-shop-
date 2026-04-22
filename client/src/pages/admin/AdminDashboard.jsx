import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/stats'),
      api.get('/orders?limit=10'),
      api.get('/products?limit=100')
    ]).then(([statsRes, ordersRes, productsRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.orders);

      // Find sizes with stock ≤ 5
      const alerts = [];
      productsRes.data.products.forEach(p => {
        p.sizes.forEach(s => {
          if (s.stock <= 5) alerts.push({ product: p.name, size: s.size, stock: s.stock });
        });
      });
      setLowStock(alerts);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-medium text-gray-900">Vue d'ensemble</h1>
        <p className="text-sm text-gray-500 mt-1">Tableau de bord DRAPE Admin</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <div key={i} className="h-28 skeleton rounded-sm" />)
        ) : [
          { label: 'Commandes totales', value: stats?.totalOrders || 0, icon: '📦' },
          { label: 'Revenus totaux', value: `${(stats?.totalRevenue || 0).toFixed(0)} DT`, icon: '💰' },
          { label: 'En attente', value: stats?.pendingOrders || 0, icon: '⏳', highlight: true },
          { label: 'Produits actifs', value: stats?.activeProducts || 0, icon: '👗' }
        ].map(card => (
          <div key={card.label} className={`bg-white p-5 border ${card.highlight ? 'border-gold/40' : 'border-gray-100'}`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-2xl font-display font-medium">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium">Commandes récentes</h2>
            <Link to="/admin/orders" className="text-xs text-gold hover:underline">Voir tout</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              Array(5).fill(0).map((_, i) => <div key={i} className="h-14 skeleton mx-5 my-2" />)
            ) : recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{order.user?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-medium">{order.totalAmount.toFixed(0)} DT</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="bg-white border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-medium">Alertes stock faible</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tailles avec ≤ 5 unités</p>
          </div>
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-12 skeleton mx-4 my-2" />)
            ) : lowStock.length === 0 ? (
              <p className="p-5 text-sm text-gray-400">Tous les stocks sont OK ✓</p>
            ) : lowStock.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-medium truncate max-w-[140px]">{alert.product}</p>
                  <p className="text-xs text-gray-400">Taille {alert.size}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                  alert.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {alert.stock} restant{alert.stock > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
