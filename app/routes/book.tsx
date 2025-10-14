import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { PaymentMethodSection } from '../components/PaymentMethodSection';

type Instructor = {
  _id: string;
  id: string;
  name: string;
  image?: string;
  company?: string;
  pricePerHour?: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const instructorId = url.searchParams.get('instructor') || '';
  
  if (!instructorId) {
    return json({ instructor: null, error: 'No instructor specified' });
  }

  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  
  try {
    const res = await fetch(`${base}/instructors/${encodeURIComponent(instructorId)}`, {
      headers: { 
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br"
      }
    });
    
    if (!res.ok) {
      return json({ instructor: null, error: 'Instructor not found' });
    }
    
    const data = await res.json();
    const item = data?.instructor || data;
    
    return json({ 
      instructor: {
        _id: item._id || item.id || instructorId,
        id: item.id || item._id || instructorId,
        name: item.name || 'Instructor',
        image: item.image,
        company: item.company,
        pricePerHour: item.pricePerHour
      },
      error: null 
    });
  } catch {
    return json({ instructor: null, error: 'Could not load instructor' });
  }
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const instructorId = searchParams.get('instructor') || '';
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const loaderData = useLoaderData<typeof loader>();
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ bookingId?: string } | null>(null);
  const [hasSavedPm, setHasSavedPm] = useState(false);
  const [savedLast4, setSavedLast4] = useState<string | null>(null);

  const instructor = loaderData.instructor;
  const loadError = loaderData.error;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to auth page with return URL
      navigate(`/auth?redirect=/book?instructor=${instructorId}`);
    }
  }, [isAuthenticated, navigate, instructorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      setSubmitError('Please select a date and time.');
      return;
    }

    const iso = `${date}T${time}:00`;
    const start = new Date(iso).getTime();
    const end = start + duration * 60 * 1000;
    const payload = { instructorId, studentId: user?.id || '', start, end, notes };
    
    setSubmitError(null);
    setIsSubmitting(true);
    
    try {
      const apiHost = (window as any).__ENV__?.API_HOST || 'http://localhost:3001';
      const res = await fetch(`${apiHost}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      let data: any = null;
      try { data = await res.json(); } catch { /* ignore if no body */ }
      
      if (res.status === 201) {
        setConfirmed({ bookingId: data?.bookingId || data?.id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (res.status === 400) {
        setSubmitError(data?.error || 'There was a validation error. Please check your details and try again.');
      } else if (res.status === 404) {
        setSubmitError(data?.error || 'Instructor or student not found. Please go back and try again.');
      } else {
        setSubmitError(data?.error || 'Something went wrong. Please try booking again.');
      }
    } catch (e) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23e5e7eb"/><circle cx="50" cy="38" r="18" fill="%239ca3af"/><path d="M20 86c4-18 18-28 30-28s26 10 30 28" fill="%239ca3af"/></svg>';
  const imgSrc = instructor?.image && instructor.image.trim().length > 0 ? instructor.image : placeholder;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, background: 'linear-gradient(to bottom right, #f8fafc 0%, #ffffff 100%)', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64748b',
                fontSize: '0.9375rem',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem 0',
                marginBottom: '1rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to results
            </button>
            
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '0.5rem',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.025em'
            }}>
              Book a Driving Lesson
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#64748b',
              margin: 0
            }}>
              Schedule your lesson and get ready to hit the road
            </p>
          </div>

          {/* Main Content Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '1.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden'
          }}>
            
            {/* Success Message */}
            {confirmed && (
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '2rem',
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <div style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                      Booking Confirmed!
                    </h3>
                    <p style={{ fontSize: '1rem', opacity: 0.95, margin: 0 }}>
                      {confirmed.bookingId 
                        ? `Your lesson has been booked successfully. Reference: ${confirmed.bookingId}`
                        : 'Your lesson has been booked successfully. Check your portal for details.'}
                    </p>
                    <button
                      onClick={() => navigate('/portal')}
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: '#ffffff',
                        color: '#10b981',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontWeight: '600',
                        fontSize: '0.9375rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      View in Portal
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {submitError && (
              <div style={{
                background: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                padding: '1.25rem 1.5rem',
                margin: '1.5rem',
                borderRadius: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ color: '#dc2626', fontSize: '0.9375rem', margin: 0, lineHeight: '1.6' }}>
                    {submitError}
                  </p>
                </div>
              </div>
            )}

            {loadError && (
              <div style={{
                background: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                padding: '1.25rem 1.5rem',
                margin: '1.5rem',
                borderRadius: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ color: '#dc2626', fontSize: '0.9375rem', margin: 0, lineHeight: '1.6' }}>
                    {loadError}
                  </p>
                </div>
              </div>
            )}

            {/* Form Content */}
            {!confirmed && !loadError && instructor && (
              <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                
                {/* Instructor Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '1rem',
                  marginBottom: '2rem'
                }}>
                  <img
                    src={imgSrc}
                    onError={(e) => { const img = e.currentTarget as HTMLImageElement; if (img.src !== placeholder) { img.src = placeholder; } }}
                    alt={instructor.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#0f172a',
                      marginBottom: '0.25rem',
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                      {instructor.name}
                    </h3>
                    {instructor.company && (
                      <p style={{ fontSize: '0.9375rem', color: '#64748b', margin: 0 }}>
                        {instructor.company}
                      </p>
                    )}
                  </div>
                  {instructor.pricePerHour && (
                    <div style={{
                      padding: '0.75rem 1.25rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#ffffff' }}>
                        £{instructor.pricePerHour}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#dbeafe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        per hour
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Details */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    marginBottom: '1.5rem',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    Lesson Details
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label htmlFor="booking-date" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Date <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        className="input w-full"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="booking-time" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Time <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        id="booking-time"
                        type="time"
                        className="input w-full"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="booking-duration" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Duration
                      </label>
                      <select
                        id="booking-duration"
                        className="select w-full"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                      >
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                        <option value={90}>90 minutes</option>
                        <option value={120}>120 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div style={{ marginBottom: '2rem' }}>
                  <label htmlFor="booking-notes" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Notes for your instructor (optional)
                  </label>
                  <textarea
                    id="booking-notes"
                    className="input w-full"
                    rows={4}
                    placeholder="Any specific topics you'd like to focus on, or areas you need help with..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Payment Method Section */}
                {user?.accountType !== 'instructor' && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      marginBottom: '1.5rem',
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                      Payment Method
                    </h3>
                    <PaymentMethodSection
                      onStatusChange={(has, last4) => {
                        setHasSavedPm(has);
                        setSavedLast4(last4 ?? null);
                      }}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '1rem',
                  paddingTop: '1.5rem',
                  borderTop: '2px solid #f1f5f9'
                }}>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || (user?.accountType !== 'instructor' && !hasSavedPm)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      minWidth: '200px',
                      justifyContent: 'center'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        Booking...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {user?.accountType === 'instructor' 
                          ? 'Confirm Booking' 
                          : (!hasSavedPm ? 'Add Payment Method' : 'Confirm Booking')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

