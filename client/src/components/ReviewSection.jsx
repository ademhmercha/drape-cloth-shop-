import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function ReviewSection({ productId }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [data, setData] = useState({ reviews: [], average: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const hasReviewed = user && data.reviews.some(r => r.user?._id === user._id);

  useEffect(() => {
    api.get(`/reviews/${productId}`)
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Choisissez une note'); return; }
    if (!comment.trim()) { toast.error('Écrivez un commentaire'); return; }
    setSubmitting(true);
    try {
      const res = await api.post(`/reviews/${productId}`, { rating, comment });
      setData(prev => ({
        reviews: [res.data, ...prev.reviews],
        total: prev.total + 1,
        average: Math.round(((prev.average * prev.total + rating) / (prev.total + 1)) * 10) / 10
      }));
      setShowForm(false);
      setRating(0);
      setComment('');
      toast.success('Avis publié !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setData(prev => {
        const updated = prev.reviews.filter(r => r._id !== reviewId);
        const avg = updated.length
          ? Math.round((updated.reduce((s, r) => s + r.rating, 0) / updated.length) * 10) / 10
          : 0;
        return { reviews: updated, total: updated.length, average: avg };
      });
      toast.success('Avis supprimé');
    } catch { toast.error('Erreur'); }
  };

  return (
    <section className="mt-20 pt-12 border-t border-charcoal/10 dark:border-cream/10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl dark:text-cream">{t('reviews.title')}</h2>
          {data.total > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Stars rating={data.average} size={16} />
              <span className="text-sm font-medium dark:text-cream">{data.average}</span>
              <span className="text-sm text-charcoal/50 dark:text-cream/50">({data.total} avis)</span>
            </div>
          )}
        </div>
        {user && !hasReviewed && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-ghost text-xs py-2.5 px-5 dark:border-cream dark:text-cream dark:hover:bg-cream dark:hover:text-charcoal">
            {t('reviews.write')}
          </button>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-charcoal/10 dark:border-cream/10 p-6 mb-8 space-y-4">
          <div>
            <p className="text-xs tracking-widest uppercase font-medium mb-3 dark:text-cream">{t('reviews.rating')}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                >
                  <StarIcon
                    filled={s <= (hoverRating || rating)}
                    size={28}
                    className={s <= (hoverRating || rating) ? 'text-gold' : 'text-charcoal/20 dark:text-cream/20'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase font-medium mb-2 dark:text-cream">{t('reviews.comment')}</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="input-field resize-none dark:bg-charcoal dark:text-cream dark:border-cream/20"
              placeholder="Partagez votre expérience avec ce produit…"
            />
            <p className="text-xs text-charcoal/30 dark:text-cream/30 text-right mt-1">{comment.length}/500</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-gold flex items-center gap-2 disabled:opacity-50">
              {submitting ? <><Spinner />{t('contact.sending')}…</> : t('reviews.submit')}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-xs py-3 px-6 dark:border-cream dark:text-cream">
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Login prompt */}
      {!user && (
        <p className="text-sm text-charcoal/50 dark:text-cream/50 mb-6">
          <Link to="/login" className="text-gold hover:underline">{t('nav.login')}</Link> {t('reviews.loginToReview').toLowerCase()}
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-24 skeleton" />)}
        </div>
      ) : data.reviews.length === 0 ? (
        <p className="text-charcoal/40 dark:text-cream/40 text-sm py-8 text-center">{t('reviews.noReviews')}</p>
      ) : (
        <div className="space-y-6">
          {data.reviews.map(r => (
            <div key={r._id} className="border-b border-charcoal/5 dark:border-cream/5 pb-6 last:border-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gold/10 flex items-center justify-center flex-shrink-0">
                    {r.user?.avatar
                      ? <img src={r.user.avatar} alt={r.user.name} className="w-full h-full object-cover" />
                      : <span className="font-display text-gold text-xs">{r.user?.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium dark:text-cream">{r.user?.name}</p>
                    <p className="text-xs text-charcoal/40 dark:text-cream/40">
                      {new Date(r.createdAt).toLocaleDateString('fr-TN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Stars rating={r.rating} size={14} />
                  {(user?._id === r.user?._id || user?.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-xs text-charcoal/30 hover:text-red-500 dark:text-cream/30 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-charcoal/70 dark:text-cream/70 leading-relaxed mt-3">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <StarIcon
          key={s}
          size={size}
          filled={s <= Math.round(rating)}
          className={s <= Math.round(rating) ? 'text-gold' : 'text-charcoal/15 dark:text-cream/15'}
        />
      ))}
    </div>
  );
}

function StarIcon({ size = 14, filled, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  );
}
