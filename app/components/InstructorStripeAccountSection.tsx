import { useEffect, useState } from 'react';

interface InstructorStripeAccountSectionProps {
  instructorId: string;
}

function getApiHost(): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_HOST) {
    const host = String((window as any).__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || window.location.origin;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export function InstructorStripeAccountSection({ instructorId }: InstructorStripeAccountSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isCheckingOnboard, setIsCheckingOnboard] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [onboardError, setOnboardError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!instructorId) return;
      const host = getApiHost();
      if (!host) return;
      
      setIsLoading(true);
      setError(null);
      setExists(null);
      
      try {
        const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account`);
        const maybeJson = await res.json().catch(() => undefined as any);
        
        if (res.status === 200) {
          setExists(true);
        } else if (res.status === 404) {
          setExists(false);
        } else {
          const message = (maybeJson && (maybeJson.error || maybeJson.message)) || `Unexpected status ${res.status}`;
          setError(message);
          setExists(null);
        }
      } catch {
        setError('Network error while checking your Stripe account.');
        setExists(null);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [instructorId]);

  const handleCreateAccount = async () => {
    if (!instructorId) return;
    const host = getApiHost();
    if (!host) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const maybeJson = await res.json().catch(() => undefined as any);
      
      if (res.status === 201 || res.status === 200) {
        setExists(true);
      } else {
        const message = (maybeJson && (maybeJson.error || maybeJson.message)) || `Unexpected status ${res.status}`;
        setError(message);
      }
    } catch {
      setError('Network error while creating your Stripe account.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleManageLink = async () => {
    if (!instructorId) return;
    const host = getApiHost();
    if (!host) return;
    
    setIsLinking(true);
    setError(null);
    
    try {
      const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      
      if (res.status === 200 && data && typeof data.url === 'string' && data.url.length > 0) {
        window.location.href = data.url as string;
        return;
      } else if (res.status === 404) {
        setExists(false);
        setError('Stripe account not initialized yet. Please create one first.');
      } else {
        const message = (data && (data.error || data.message)) || `Unexpected status ${res.status}`;
        setError(message);
      }
    } catch {
      setError('Network error while generating your Stripe account link.');
    } finally {
      setIsLinking(false);
    }
  };

  // When account exists, check onboarding status
  useEffect(() => {
    const checkOnboard = async () => {
      if (!instructorId || exists !== true) return;
      const host = getApiHost();
      if (!host) return;
      
      setIsCheckingOnboard(true);
      setOnboardError(null);
      setOnboarded(null);
      
      try {
        const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account/onboarded`);
        const data = await res.json().catch(() => ({}));
        
        if (res.status === 200 && typeof data?.onboarded === 'boolean') {
          setOnboarded(Boolean(data.onboarded));
        } else if (res.status === 404) {
          setExists(false);
          setOnboarded(null);
        } else {
          const message = (data && (data.error || data.message)) || `Unexpected status ${res.status}`;
          setOnboardError(message);
        }
      } catch {
        setOnboardError('Network error while checking onboarding status.');
      } finally {
        setIsCheckingOnboard(false);
      }
    };
    checkOnboard();
  }, [exists, instructorId]);

  return (
    <div>
      {isLoading && (
        <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>Checking Stripe account…</p>
      )}

      {!isLoading && error && (
        <div style={{
          fontSize: '0.95rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem'
        }}>
          {error}
        </div>
      )}

      {!isLoading && error == null && exists === true && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            {isCheckingOnboard && (
              <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                Checking onboarding status…
              </p>
            )}
            
            {!isCheckingOnboard && onboardError && (
              <div style={{
                fontSize: '0.95rem',
                color: '#dc2626',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.75rem'
              }}>
                {onboardError}
              </div>
            )}
            
            {!isCheckingOnboard && onboardError == null && onboarded === true && (
              <div style={{
                fontSize: '0.95rem',
                color: '#15803d',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Onboarding is fully set up
              </div>
            )}
            
            {!isCheckingOnboard && onboardError == null && onboarded === false && (
              <>
                <div style={{
                  fontSize: '0.95rem',
                  color: '#92400e',
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Onboarding is not complete yet
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                  Students can't book lessons with you until onboarding is complete.
                </p>
              </>
            )}
          </div>
          
          <button
            onClick={handleManageLink}
            disabled={isLinking}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isLinking ? 0.7 : 1
            }}
          >
            {isLinking ? (
              <>
                <span className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
                Loading...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Manage Stripe Account
              </>
            )}
          </button>
        </div>
      )}

      {!isLoading && error == null && exists === false && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              No Stripe account found. Create one to receive payments from students.
            </p>
          </div>
          <button
            onClick={handleCreateAccount}
            disabled={isCreating}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isCreating ? 0.7 : 1
            }}
          >
            {isCreating ? (
              <>
                <span className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
                Creating...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Create Stripe Account
              </>
            )}
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

