import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';

const PERIODS = [
  { label: '7j', days: 7 },
  { label: '30j', days: 30 },
  { label: '90j', days: 90 }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [series, setSeries] = useState([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/orders/stats'),
      api.get('/orders?limit=10'),
      api.get('/products?limit=100'),
      api.get(`/orders/revenue-series?days=${period}`)
    ]).then(([statsRes, ordersRes, productsRes, seriesRes]) => {
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.orders);
      setSeries(seriesRes.data);

      const alerts = [];
      productsRes.data.products.forEach(p => {
        p.sizes.forEach(s => {
          if (s.stock <= 5) alerts.push({ product: p.name, size: s.size, stock: s.stock });
        });
      });
      setLowStock(alerts.sort((a, b) => a.stock - b.stock));
    }).finally(() => setLoading(false));
  }, []);

  const changePeriod = (days) => {
    setPeriod(days);
    setSeriesLoading(true);
    api.get(`/orders/revenue-series?days=${days}`)
      .then(res => setSeries(res.data))
      .finally(() => setSeriesLoading(false));
  };

  // Format date for chart axis
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const totalRevenue = series.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = series.reduce((s, d) => s + d.orders, 0);
  const bestDay = series.length ? series.reduce((a, b) => a.revenue > b.revenue ? a : b) : null;

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
          { label: 'Commandes totales', value: stats?.totalOrders || 0, icon: '📦', trend: null },
          { label: 'Revenus totaux', value: `${(stats?.totalRevenue || 0).toFixed(0)} DT`, icon: '💰' },
          { label: 'En attente', value: stats?.pendingOrders || 0, icon: '⏳', highlight: true },
          { label: 'Produits actifs', value: stats?.activeProducts || 0, icon: '👗' }
        ].map(card => (
          <div key={card.label} className={`bg-white p-5 border ${card.highlight && card.value > 0 ? 'border-gold/40 bg-gold/5' : 'border-gray-100'}`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-2xl font-display font-medium">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-medium">Chiffre d'affaires</h2>
            {!seriesLoading && (
              <p className="text-xs text-gray-400 mt-0.5">
                {totalRevenue.toFixed(0)} DT · {totalOrders} commandes sur {period} jours
                {bestDay?.revenue > 0 && ` · meilleur jour: ${formatDate(bestDay.date)} (${bestDay.revenue} DT)`}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button
                key={p.days}
                onClick={() => changePeriod(p.days)}
                className={`px-3 py-1.5 text-xs rounded-sm transition-colors ${
                  period === p.days ? 'bg-charcoal text-cream' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {seriesLoading ? (
          <div className="h-56 skeleton" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={series} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: '#999' }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(series.length / 6)}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#999' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v} DT`}
                width={60}
              />
              <Tooltip
                formatter={(v) => [`${v} DT`, 'CA']}
                labelFormatter={(l) => new Date(l).toLocaleDateString('fr-TN', { day: 'numeric', month: 'long' })}
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 0, fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C9A84C"
                strokeWidth={2}
                fill="url(#goldGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#C9A84C' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Orders per day bar chart (compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white border border-gray-100 p-6">
          <h2 className="font-medium mb-4">Commandes / jour</h2>
          {seriesLoading ? (
            <div className="h-40 skeleton" />
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={series.slice(-14)} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 10, fill: '#bbb' }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v) => [v, 'Commandes']}
                  labelFormatter={(l) => formatDate(l)}
                  contentStyle={{ border: '1px solid #e5e7eb', borderRadius: 0, fontSize: 11 }}
                />
                <Bar dataKey="orders" fill="#C9A84C" radius={[2, 2, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-medium">Commandes récentes</h2>
            <Link to="/admin/orders" className="text-xs text-gold hover:underline">Voir tout →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              Array(5).fill(0).map((_, i) => <div key={i} className="h-14 skeleton mx-5 my-2" />)
            ) : recentOrders.slice(0, 6).map(order => (
              <div key={order._id} className="flex items-center justify-between px-5 py-3">
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
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-white border border-orange-100">
          <div className="p-5 border-b border-orange-100 flex items-center gap-2">
            <span className="text-orange-500">⚠️</span>
            <h2 className="font-medium">Alertes stock faible</h2>
            <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-sm">{lowStock.length}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-y divide-gray-50">
            {lowStock.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-medium truncate max-w-[120px]">{alert.product}</p>
                  <p className="text-xs text-gray-400">Taille {alert.size}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${
                  alert.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {alert.stock === 0 ? 'Épuisé' : `${alert.stock} restant${alert.stock > 1 ? 's' : ''}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
