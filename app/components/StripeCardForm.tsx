import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window { 
    Stripe?: any;
    __ENV__?: {
      API_HOST?: string;
      STRIPE_PUBLISHABLE_KEY?: string;
    };
  }
}

interface StripeCardFormProps {
  onPaymentMethod?: (paymentMethodId: string) => void;
  onSaved?: () => void;
  onCancel?: () => void;
}

function getApiHost(): string {
  if (typeof window !== 'undefined' && window.__ENV__?.API_HOST) {
    const host = String(window.__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || window.location.origin;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

function getStripeKey(): string | null {
  if (typeof window !== 'undefined' && window.__ENV__?.STRIPE_PUBLISHABLE_KEY) {
    return String(window.__ENV__.STRIPE_PUBLISHABLE_KEY).trim() || null;
  }
  return null;
}

export function StripeCardForm({ onPaymentMethod, onSaved, onCancel }: StripeCardFormProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stripe, setStripe] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const [cardholderName, setCardholderName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [addressCountry, setAddressCountry] = useState('GB');

  const STRIPE_KEY = getStripeKey();

  useEffect(() => {
    if (!window.Stripe || !STRIPE_KEY) return;
    
    const s = window.Stripe(STRIPE_KEY);
    const elements = s.elements({ locale: 'en-GB' });
    const cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#111827',
          '::placeholder': {
            color: '#9ca3af',
          },
        },
      },
    });
    
    if (containerRef.current) {
      cardElement.mount(containerRef.current);
      cardElement.on('ready', () => setIsReady(true));
      cardElement.on('change', (event: any) => setError(event.error?.message || null));
    }
    
    setStripe(s);
    setCard(cardElement);
    
    return () => {
      try { cardElement.destroy(); } catch {}
    };
  }, [STRIPE_KEY]);

  // Prefill billing information from saved payment method (if available)
  useEffect(() => {
    const host = getApiHost();
    if (!host || !user?.id) return;
    
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${host}/users/${encodeURIComponent(user.id)}/payment-method`);
        const data = await res.json().catch(() => ({}));
        
        if (!cancelled && res.ok && data?.billing) {
          const b = data.billing || {};
          setCardholderName(prev => prev || (user?.fullName || ''));
          setAddressLine1(prev => prev || (b.line1 || b.addressLine1 || ''));
          setAddressLine2(prev => prev || (b.line2 || b.addressLine2 || ''));
          setAddressCity(prev => prev || (b.city || ''));
          setPostcode(prev => prev || ((b.postal_code || b.postcode || '').toUpperCase()));
          setAddressCountry(prev => prev || (b.country || 'GB'));
        }
      } catch {
        // Silent fail; prefill is best-effort
      }
    };
    load();
    
    return () => { cancelled = true; };
  }, [user?.id, user?.fullName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setServerMessage(null);
    
    if (!stripe || !card) {
      setError('Stripe is not ready.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const billingDetails: any = {
        name: cardholderName || undefined,
        email: user?.email || undefined,
        phone: user?.phoneNumber || undefined,
        address: {
          line1: addressLine1 || undefined,
          line2: addressLine2 || undefined,
          city: addressCity || undefined,
          postal_code: postcode || undefined,
          country: addressCountry || undefined,
        }
      };

      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({ 
        type: 'card', 
        card, 
        billing_details: billingDetails 
      });
      
      if (pmError) {
        setError(pmError.message || 'Unable to create payment method.');
      } else if (paymentMethod) {
        onPaymentMethod && onPaymentMethod(paymentMethod.id);

        // Send to backend to store on user
        const host = getApiHost();
        if (host && user?.id) {
          try {
            const last4 = paymentMethod?.card?.last4 || '';
            const res = await fetch(`${host}/users/${encodeURIComponent(user.id)}/payment-method`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentMethodId: paymentMethod.id,
                last4,
                billing: {
                  addressLine1: addressLine1 || undefined,
                  addressLine2: addressLine2 || undefined,
                  city: addressCity || undefined,
                  postcode: postcode || undefined,
                  country: addressCountry || undefined,
                }
              })
            });
            
            let data: any = null;
            try { data = await res.json(); } catch {}
            
            if (res.ok) {
              setServerMessage('Payment method saved.');
              try { onSaved && onSaved(); } catch {}
            } else {
              setError(data?.error || 'Unable to save payment method.');
            }
          } catch {
            setError('Network error while saving your payment method.');
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressValid = Boolean((addressLine1 || '').trim() && (addressCity || '').trim() && (postcode || '').trim() && (addressCountry || '').trim());
  const formValid = Boolean(addressValid && (cardholderName || '').trim());

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        fontSize: '0.875rem',
        color: '#1e40af',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem'
      }}>
        <strong>Sandbox:</strong> Use test card numbers (e.g., 4242 4242 4242 4242) with any future expiry and CVC.
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Cardholder name"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
          <select
            value={addressCountry}
            onChange={(e) => setAddressCountry(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          >
            <option value="GB">United Kingdom (GB)</option>
            <option value="US">United States (US)</option>
            <option value="IE">Ireland (IE)</option>
            <option value="FR">France (FR)</option>
            <option value="DE">Germany (DE)</option>
          </select>
        </div>
        
        <input
          type="text"
          placeholder="Address line 1"
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            outline: 'none'
          }}
        />
        
        <input
          type="text"
          placeholder="Address line 2 (optional)"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            color: '#111827',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            outline: 'none'
          }}
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <input
            type="text"
            placeholder="City"
            value={addressCity}
            onChange={(e) => setAddressCity(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              color: '#111827',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              outline: 'none'
            }}
          />
        </div>
      </div>
      
      <div style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '0.75rem'
      }} ref={containerRef} />
      
      {error && (
        <div style={{
          fontSize: '0.875rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem'
        }}>
          {error}
        </div>
      )}
      
      {serverMessage && (
        <div style={{
          fontSize: '0.875rem',
          color: '#15803d',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem'
        }}>
          {serverMessage}
        </div>
      )}
      
      {!formValid && (
        <div style={{
          fontSize: '0.875rem',
          color: '#92400e',
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem'
        }}>
          Please complete cardholder name, address line 1, city, postcode and country.
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={!isReady || isSubmitting || !STRIPE_KEY || !formValid}
          style={{ opacity: (!isReady || isSubmitting || !STRIPE_KEY || !formValid) ? 0.5 : 1 }}
        >
          {isSubmitting ? 'Saving…' : 'Save Payment Method'}
        </button>
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => onCancel && onCancel()} 
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
      
      {!STRIPE_KEY && (
        <div style={{
          fontSize: '0.875rem',
          color: '#c2410c',
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem'
        }}>
          Missing STRIPE_PUBLISHABLE_KEY in environment. Add it to enable Stripe payments.
        </div>
      )}
    </form>
  );
}

