import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface InstructorStripeAccountSectionProps {
  instructorId: string;
  trueInstructor: any;
}

function getApiHost(): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_HOST) {
    const host = String((window as any).__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || window.location.origin;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

export function InstructorStripeAccountSection({ instructorId, trueInstructor }: InstructorStripeAccountSectionProps) {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isDashboardLinking, setIsDashboardLinking] = useState(false);
  const [isCheckingOnboard, setIsCheckingOnboard] = useState(false);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [onboardError, setOnboardError] = useState<string | null>(null);
  const [showReasons, setShowReasons] = useState(false);
  const [isFetchingReasons, setIsFetchingReasons] = useState(false);
  const [reasonsData, setReasonsData] = useState<any>(null);
  const [reasonsError, setReasonsError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!instructorId) return;
      const host = getApiHost();
      if (!host) return;
      
      setIsLoading(true);
      setError(null);
      setExists(null);
      
      try {
        const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const maybeJson = await res.json().catch(() => undefined as any);
        
        if (res.status === 200) {
          setExists(true);
        } else if (res.status === 404) {
          setExists(false);
        } else if (res.status === 401) {
          setError('You are not authorized to view Stripe account details. Please sign in again.');
          setExists(null);
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
  }, [instructorId, token]);

  const handleCreateAccount = async () => {
    if (!instructorId) return;
    const host = getApiHost();
    if (!host) return;
    if (!token) { setError('You must be signed in to create a Stripe account.'); return; }
    
    setIsCreating(true);
    setError(null);
    
    try {
      const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const maybeJson = await res.json().catch(() => undefined as any);
      
      if (res.status === 201 || res.status === 200) {
        setExists(true);
      } else if (res.status === 401) {
        setError('You are not authorized to create a Stripe account. Please sign in again.');
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
    if (!token) { setError('You must be signed in to access your Stripe onboarding.'); return; }
    
    setIsLinking(true);
    setError(null);
    
    try {
      const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      
      if (res.status === 200 && data && typeof data.url === 'string' && data.url.length > 0) {
        window.location.href = data.url as string;
        return;
      } else if (res.status === 404) {
        setExists(false);
        setError('Stripe account not initialized yet. Please create one first.');
      } else if (res.status === 401) {
        setError('You are not authorized to create a Stripe onboarding link. Please sign in again.');
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

  const handleDashboardLink = async () => {
    const host = getApiHost();
    if (!host) return;
    
    if (!token) {
      setError('You must be signed in to access your Stripe dashboard.');
      return;
    }
    
    const listingId = trueInstructor?._id || trueInstructor?.id;
    if (!listingId) {
      setError('Instructor listing not found. Please create your instructor profile first.');
      return;
    }
    
    setIsDashboardLinking(true);
    setError(null);
    
    try {
      const res = await fetch(`${host}/instructors/${encodeURIComponent(listingId)}/account/dashboard-link`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await res.json().catch(() => ({}));
      
      if (res.status === 200 && data && typeof data.url === 'string' && data.url.length > 0) {
        window.location.href = data.url as string;
        return;
      } else if (res.status === 404) {
        setError('Stripe account not initialized yet. Please create one first.');
      } else {
        const message = (data && (data.error || data.message)) || `Unexpected status ${res.status}`;
        setError(message);
      }
    } catch {
      setError('Network error while accessing your Stripe dashboard.');
    } finally {
      setIsDashboardLinking(false);
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
        const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account/onboarded`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const data = await res.json().catch(() => ({}));
        
        if (res.status === 200 && typeof data?.onboarded === 'boolean') {
          setOnboarded(Boolean(data.onboarded));
        } else if (res.status === 404) {
          setExists(false);
          setOnboarded(null);
        } else if (res.status === 401) {
          setOnboardError('You are not authorized to read onboarding status. Please sign in again.');
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
  }, [exists, instructorId, token]);

  const handleFetchReasons = async () => {
    if (!instructorId) return;
    const host = getApiHost();
    if (!host) return;
    if (!token) {
      setReasonsError('You must be signed in to view onboarding details.');
      return;
    }

    setIsFetchingReasons(true);
    setReasonsError(null);
    setReasonsData(null);

    try {
      const res = await fetch(`${host}/instructors/${encodeURIComponent(instructorId)}/account/onboarding-reasons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 200 && data) {
        setReasonsData(data);
        setShowReasons(true);
      } else if (res.status === 404) {
        setReasonsError('Stripe account not found. Please create one first.');
      } else if (res.status === 401) {
        setReasonsError('You are not authorized to view onboarding details. Please sign in again.');
      } else {
        const message = (data && (data.error || data.message)) || `Unexpected status ${res.status}`;
        setReasonsError(message);
      }
    } catch {
      setReasonsError('Network error while fetching onboarding details.');
    } finally {
      setIsFetchingReasons(false);
    }
  };

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
                <div style={{ marginBottom: '0.75rem' }}>
                  <button
                    onClick={handleFetchReasons}
                    disabled={isFetchingReasons}
                    className="btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      padding: '0.5rem 1rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      opacity: isFetchingReasons ? 0.7 : 1
                    }}
                  >
                    {isFetchingReasons ? (
                      <>
                        <span className="spinner" style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid rgba(55,65,81,0.3)',
                          borderTopColor: '#374151',
                          borderRadius: '50%',
                          animation: 'spin 0.6s linear infinite'
                        }} />
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Why is onboarding incomplete?
                      </>
                    )}
                  </button>
                </div>
                {reasonsError && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#dc2626',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.75rem'
                  }}>
                    {reasonsError}
                  </div>
                )}
                {showReasons && reasonsData && (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    marginBottom: '0.75rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.75rem',
                          background: reasonsData.state === 'completed' ? '#dcfce7' : reasonsData.state === 'under_review' ? '#dbeafe' : reasonsData.state === 'needs_information' ? '#fef3c7' : '#f3f4f6',
                          color: reasonsData.state === 'completed' ? '#166534' : reasonsData.state === 'under_review' ? '#1e40af' : reasonsData.state === 'needs_information' ? '#92400e' : '#6b7280'
                        }}>
                          {reasonsData.state.replace('_', ' ')}
                        </div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                          {reasonsData.title}
                        </h4>
                        <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: '1.6' }}>
                          {reasonsData.message}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowReasons(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          color: '#9ca3af',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Close"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>

                    {reasonsData.details && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Required Information
                        </h5>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          {reasonsData.details.disabledReason && (
                            <div style={{ fontSize: '0.875rem', color: '#dc2626', background: '#fef2f2', padding: '0.625rem 0.875rem', borderRadius: '0.375rem', border: '1px solid #fecaca' }}>
                              <strong>Account Disabled:</strong> {reasonsData.details.disabledReason}
                            </div>
                          )}
                          {reasonsData.details.currentlyDue && reasonsData.details.currentlyDue.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.375rem' }}>Currently Due:</div>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {reasonsData.details.currentlyDue.map((item: string, i: number) => (
                                  <li key={i} style={{ fontSize: '0.8125rem', background: '#fee2e2', color: '#991b1b', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontWeight: '500' }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {reasonsData.details.pastDue && reasonsData.details.pastDue.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.375rem' }}>Past Due:</div>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {reasonsData.details.pastDue.map((item: string, i: number) => (
                                  <li key={i} style={{ fontSize: '0.8125rem', background: '#fecaca', color: '#7f1d1d', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontWeight: '500' }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {reasonsData.details.pendingVerification && reasonsData.details.pendingVerification.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#2563eb', marginBottom: '0.375rem' }}>Pending Verification:</div>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {reasonsData.details.pendingVerification.map((item: string, i: number) => (
                                  <li key={i} style={{ fontSize: '0.8125rem', background: '#dbeafe', color: '#1e40af', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontWeight: '500' }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {reasonsData.details.eventuallyDue && reasonsData.details.eventuallyDue.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.375rem' }}>Eventually Due:</div>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {reasonsData.details.eventuallyDue.map((item: string, i: number) => (
                                  <li key={i} style={{ fontSize: '0.8125rem', background: '#f3f4f6', color: '#4b5563', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', fontWeight: '500' }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {reasonsData.nextSteps && reasonsData.nextSteps.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                        <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Next Steps
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {reasonsData.nextSteps.map((step: any, i: number) => (
                            <div key={i} style={{ fontSize: '0.875rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981', flexShrink: 0 }}>
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                              </svg>
                              <span>{step.label}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.6' }}>
                          <strong>💡 Tip:</strong> Use the "Complete Onboarding" button above to update your details and resolve any missing information.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleManageLink}
              disabled={isLinking || isDashboardLinking}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: (isLinking || isDashboardLinking) ? 0.7 : 1,
                cursor: (isLinking || isDashboardLinking) ? 'not-allowed' : 'pointer',
                position: 'relative'
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
                  Redirecting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Complete Onboarding
                </>
              )}
            </button>
            
            <button
              onClick={handleDashboardLink}
              disabled={isLinking || isDashboardLinking}
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: (isLinking || isDashboardLinking) ? 0.7 : 1,
                cursor: (isLinking || isDashboardLinking) ? 'not-allowed' : 'pointer',
                background: '#6366f1',
                color: 'white',
                border: 'none'
              }}
            >
              {isDashboardLinking ? (
                <>
                  <span className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Redirecting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>
                  Manage Stripe Dashboard
                </>
              )}
            </button>
          </div>
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

