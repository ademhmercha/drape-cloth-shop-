import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminNotifications() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('promo');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return toast.error('Message requis');
    setSending(true);

    try {
      const body = { message, type };
      if (recipientType === 'specific' && selectedUserId) {
        body.userId = selectedUserId;
      }

      const res = await api.post('/notifications/broadcast', body);
      toast.success(res.data.message);
      setHistory(prev => [{ message, type, recipients: res.data.message, sentAt: new Date() }, ...prev]);
      setMessage('');
    } catch {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-display font-medium">Notifications</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send form */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-medium mb-5">Envoyer une notification</h2>

          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Destinataires</label>
              <select
                value={recipientType}
                onChange={e => setRecipientType(e.target.value)}
                className="admin-input w-full"
              >
                <option value="all">Tous les clients</option>
                <option value="specific">Un client spécifique</option>
              </select>
            </div>

            {recipientType === 'specific' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sélectionner le client</label>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="admin-input w-full"
                  required
                >
                  <option value="">-- Choisir --</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="admin-input w-full">
                <option value="promo">Promotion</option>
                <option value="order_update">Mise à jour commande</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                required
                placeholder="Votre message de notification..."
                className="admin-input w-full resize-none"
              />
              <p className="text-xs text-gray-300 mt-1">{message.length} caractères</p>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-charcoal text-cream py-3 text-sm tracking-wider hover:bg-charcoal/90 transition-colors disabled:opacity-50"
            >
              {sending ? 'Envoi en cours...' : 'Envoyer la notification'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white border border-gray-100 p-6">
          <h2 className="font-medium mb-5">Historique de la session</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun envoi dans cette session</p>
          ) : (
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="border border-gray-100 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm ${
                      h.type === 'promo' ? 'bg-gold/20 text-gold' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {h.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(h.sentAt).toLocaleTimeString('fr-TN')}
                    </span>
                  </div>
                  <p className="text-sm">{h.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{h.recipients}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
