import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

export default function OrderSuccess() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const ref = id.slice(-6).toUpperCase();

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center dark:bg-charcoal">
      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Animated checkmark */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <svg viewBox="0 0 52 52" className="w-24 h-24">
            <circle cx="26" cy="26" r="25" fill="none" stroke="#C9A84C" strokeWidth="2"
              strokeDasharray="157" strokeDashoffset="157"
              style={{ animation: 'drawCircle 0.6s ease forwards', animationFillMode: 'forwards' }} />
            <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#C9A84C" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="30" strokeDashoffset="30"
              style={{ animation: 'drawCheck 0.4s 0.6s ease forwards' }} />
          </svg>
        </div>

        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">{t('success.label')}</p>
        <h1 className="font-display text-4xl mb-4 dark:text-cream">{t('success.title')}</h1>
        <p className="text-charcoal/60 dark:text-cream/60 mb-2">{t('success.ref')}</p>
        <p className="font-display text-3xl text-charcoal dark:text-cream mb-8">#{ref}</p>

        <div className="bg-charcoal/5 dark:bg-cream/5 p-6 text-left space-y-3 mb-10 text-sm">
          <div className="flex items-start gap-3">
            <BoxIcon />
            <div>
              <p className="font-medium dark:text-cream">{t('success.deliveryTitle')}</p>
              <p className="text-charcoal/50 dark:text-cream/50 text-xs">{t('success.deliveryDesc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BanknoteIcon />
            <div>
              <p className="font-medium dark:text-cream">{t('success.paymentTitle')}</p>
              <p className="text-charcoal/50 dark:text-cream/50 text-xs">
                {order ? t('success.paymentDesc', { amount: order.totalAmount.toFixed(2) }) : '…'}
              </p>
              {order?.discount > 0 && (
                <p className="text-gold text-xs mt-0.5">
                  {t('success.promoApplied', { code: order.promoCode, amount: order.discount.toFixed(2) })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PhoneIcon />
            <div>
              <p className="font-medium dark:text-cream">{t('success.whatsappTitle')}</p>
              <p className="text-charcoal/50 dark:text-cream/50 text-xs">{t('success.whatsappDesc')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-gold">{t('success.trackOrder')}</Link>
          <Link to="/shop" className="btn-ghost dark:border-cream dark:text-cream">{t('success.continueShopping')}</Link>
        </div>
      </div>

      <style>{`
        @keyframes drawCircle { to { stroke-dashoffset: 0; } }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
      `}</style>

    </div>
  );
}

function BoxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 mt-0.5 text-charcoal/50 dark:text-cream/50">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 mt-0.5 text-charcoal/50 dark:text-cream/50">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 mt-0.5 text-charcoal/50 dark:text-cream/50">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
