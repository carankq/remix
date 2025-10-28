import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StripeCardForm } from './StripeCardForm';

interface PaymentMethodSectionProps {
  title?: string;
  allowDelete?: boolean;
  onStatusChange?: (hasSaved: boolean, last4?: string | null) => void;
}

function getApiHost(): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_HOST) {
    const host = String((window as any).__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || window.location.origin;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export function PaymentMethodSection({ title = 'Payment Method', allowDelete = false, onStatusChange }: PaymentMethodSectionProps) {
  const { isAuthenticated, user, token } = useAuth();
  const [savedPm, setSavedPm] = useState<{ paymentMethodId?: string | null; last4?: string | null } | null>(null);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmError, setPmError] = useState<string | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [pmDeleting, setPmDeleting] = useState(false);
  const [pmActionError, setPmActionError] = useState<string | null>(null);

  const notify = (hasSaved: boolean, last4?: string | null) => {
    try { onStatusChange && onStatusChange(hasSaved, last4 ?? null); } catch {}
  };

  const reload = async () => {
    if (!isAuthenticated || !user?.id) return;
    if (user?.accountType === 'instructor') return; // instructors don't manage payment methods
    
    const host = getApiHost();
    if (!host) return;
    
    setPmLoading(true);
    setPmError(null);
    
    try {
      const res = await fetch(`${host}/users/${encodeURIComponent(user.id)}/payment-method`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data: any = null;
      try { data = await res.json(); } catch {}
      
      if (res.ok) {
        const next = { paymentMethodId: data?.paymentMethodId ?? null, last4: data?.last4 ?? null };
        setSavedPm(next);
        setShowUpdateForm(!next.last4);
        notify(Boolean(next.last4), next.last4 ?? null);
      } else {
        setPmError(data?.error || 'Could not load your saved payment method.');
        notify(false, null);
      }
    } catch {
      setPmError('Network error while loading your saved payment method.');
      notify(false, null);
    } finally {
      setPmLoading(false);
    }
  };

  useEffect(() => { reload(); }, [isAuthenticated, user?.id, user?.accountType]);

  const handleDelete = async () => {
    if (!allowDelete) return;
    if (!isAuthenticated || !user?.id) return;
    
    const host = getApiHost();
    if (!host) return;
    
    if (!window.confirm('Remove your saved payment method?')) return;
    
    setPmActionError(null);
    setPmDeleting(true);
    
    try {
      const res = await fetch(`${host}/users/${encodeURIComponent(user.id)}/payment-method`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      let data: any = null;
      try { data = await res.json(); } catch {}
      
      if (res.ok) {
        setSavedPm({ paymentMethodId: null, last4: null });
        setShowUpdateForm(true);
        notify(false, null);
      } else {
        setPmActionError(data?.error || 'Unable to remove payment method.');
      }
    } catch {
      setPmActionError('Network error while removing your payment method.');
    } finally {
      setPmDeleting(false);
    }
  };

  // Instructors do not manage payment details; render nothing
  if (user?.accountType === 'instructor') {
    return null;
  }

  return (
    <div>
      {title && (
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          {title}
        </h3>
      )}
      
      {pmLoading ? (
        <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>Loading payment information…</p>
      ) : pmError ? (
        <div style={{
          fontSize: '0.95rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem'
        }}>
          {pmError}
        </div>
      ) : (showUpdateForm || !savedPm?.last4) ? (
        <StripeCardForm 
          onSaved={() => { reload(); setShowUpdateForm(false); }}
          onCancel={savedPm?.last4 ? (() => { setShowUpdateForm(false); setPmActionError(null); }) : undefined}
        />
      ) : (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.75rem',
            padding: '1rem',
            background: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Saved Card</p>
              <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500', fontFamily: 'monospace' }}>
                •••• {savedPm.last4}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                onClick={() => setShowUpdateForm(true)}
              >
                Update
              </button>
              {allowDelete && (
                <button
                  type="button"
                  className="btn"
                  style={{ 
                    fontSize: '0.875rem', 
                    padding: '0.5rem 1rem',
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca'
                  }}
                  onClick={handleDelete}
                  disabled={pmDeleting}
                >
                  {pmDeleting ? 'Deleting…' : 'Delete'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {pmActionError && (
        <div style={{
          fontSize: '0.95rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginTop: '0.75rem'
        }}>
          {pmActionError}
        </div>
      )}
    </div>
  );
}

