import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";

type Instructor = {
  id: string;
  name: string;
  brandName?: string;
  description?: string;
  pricePerHour?: number;
  vehicleType?: string;
  yearsOfExperience?: number;
  rating?: number;
  totalReviews?: number;
  postcode?: string[];
  company?: string;
  phone?: string;
  email?: string;
  specializations?: string[];
  instructorType?: 'ADI' | 'PDI';
  availability?:
    | Array<{ day: string; start?: string; end?: string; startTime?: string; endTime?: string }>
    | { working?: Array<{ day: string; startTime: string; endTime: string }>; exceptions?: Array<any> };
  languages?: string[];
  enabled?: boolean;
  image?: string;
};

type InstructorCardProps = {
  instructor: Instructor;
  showActions?: boolean;
};

export function InstructorCard({ instructor, showActions = true }: InstructorCardProps) {
  const navigate = useNavigate();
  const [showTypeInfo, setShowTypeInfo] = useState(false);
  const hasRating = instructor.rating && instructor.rating > 0;
  const hasImage = instructor.image && instructor.image.trim() !== '';
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23e5e7eb"/><circle cx="50" cy="38" r="18" fill="%239ca3af"/><path d="M20 86c4-18 18-28 30-28s26 10 30 28" fill="%239ca3af"/></svg>';
  const imgSrc = hasImage ? instructor.image : placeholder;

  // Normalize availability to a simple array of slots we can render
  const workingSlots: Array<{ day: string; startTime: string; endTime: string }> = (() => {
    const a: any = instructor.availability as any;
    if (!a) return [];
    if (Array.isArray(a)) {
      // legacy shape: array of { day, start|startTime, end|endTime }
      return (a as any[])
        .map((s: any) => ({
          day: String(s.day || ''),
          startTime: String(s.startTime || s.start || ''),
          endTime: String(s.endTime || s.end || ''),
        }))
        .filter(s => s.day && s.startTime && s.endTime);
    }
    // new shape: { working: [ { day, startTime, endTime } ], exceptions: [...] }
    const w: any[] = Array.isArray(a.working) ? a.working : [];
    return w
      .map((s: any) => ({ day: String(s.day || ''), startTime: String(s.startTime || ''), endTime: String(s.endTime || '') }))
      .filter(s => s.day && s.startTime && s.endTime);
  })();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button or link
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      return;
    }
    
    // Navigate to instructor profile if brandName exists
    if (instructor.brandName) {
      navigate(`/instructors/${encodeURIComponent(instructor.brandName)}`);
    }
  };
  
  return (
    <article 
      style={{
        background: '#ffffff',
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        cursor: instructor.brandName ? 'pointer' : 'default'
      }}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
      
      {/* Hero Section with Gradient Background */}
      <div style={{ padding: '2rem', background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Profile Image */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={imgSrc}
              onError={(e) => { const img = e.currentTarget as HTMLImageElement; if (img.src !== placeholder) { img.src = placeholder; } }}
              alt={instructor.name}
              style={{ 
                width: '120px', 
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
          </div>
          
          {/* Name & Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#0f172a', 
              marginBottom: '0.375rem',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              {instructor.name}
            </h4>
            {instructor.company && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{instructor.company}</span>
              </div>
            )}
            
            {/* Instructor Type Badge */}
            {instructor.instructorType && (
              <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
                <div 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.375rem 0.875rem',
                    background: instructor.instructorType === 'ADI' ? '#ecfdf5' : '#fdf2f8',
                    border: `2px solid ${instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899'}`,
                    borderRadius: '0',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTypeInfo(!showTypeInfo);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: '700',
                    color: instructor.instructorType === 'ADI' ? '#065f46' : '#831843',
                    letterSpacing: '0.025em'
                  }}>
                    {instructor.instructorType}
                  </span>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899'} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
                
                {/* Popup Info Box */}
                {showTypeInfo && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '0.5rem',
                      padding: '1rem',
                      background: '#ffffff',
                      border: `2px solid ${instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899'}`,
                      borderRadius: '0',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      zIndex: 1000,
                      minWidth: '280px',
                      maxWidth: '320px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.5rem',
                        background: instructor.instructorType === 'ADI' ? '#ecfdf5' : '#fdf2f8',
                        borderRadius: '0'
                      }}>
                        <svg 
                          width="20" 
                          height="20" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke={instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899'} 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '700', 
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }}>
                          {instructor.instructorType === 'ADI' ? 'Approved Driving Instructor' : 'Potential Driving Instructor'}
                        </h5>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: '#6b7280',
                          lineHeight: '1.5',
                          marginBottom: '0.5rem'
                        }}>
                          {instructor.instructorType === 'ADI' 
                            ? 'A fully qualified and DVSA-approved instructor licensed to teach learner drivers independently.'
                            : 'A trainee instructor learning to teach under supervision, working towards becoming a fully qualified ADI.'}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTypeInfo(false);
                          }}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '0',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          Got it
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {hasRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0f172a' }}>
                    {instructor.rating?.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                    ({instructor.totalReviews || 0} reviews)
                  </span>
                </div>
              )}
              {instructor.yearsOfExperience && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {instructor.yearsOfExperience} years experience
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Price Card */}
          {instructor.pricePerHour && (
            <div style={{ 
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              minWidth: '140px'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.25rem' }}>
                £{instructor.pricePerHour}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#dbeafe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                per hour
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '0 2rem 2rem 2rem' }}>
        {/* Location & Vehicle Bar */}
        {(instructor.postcode || instructor.vehicleType) && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem', 
            padding: '1.25rem',
            background: '#f8fafc',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {instructor.postcode && instructor.postcode.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
                  {instructor.postcode.join(', ')}
                </span>
              </div>
            )}
            {instructor.vehicleType && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="6" width="22" height="11" rx="2" ry="2"/>
                  <line x1="7" y1="11" x2="7" y2="11.01"/>
                  <line x1="11" y1="11" x2="17" y2="11"/>
                </svg>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155' }}>
                  {instructor.vehicleType}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {instructor.description && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              About
            </h5>
            <p style={{ 
              fontSize: '0.9375rem', 
              color: '#475569', 
              lineHeight: '1.6',
              margin: 0
            }}>
              {instructor.description}
            </p>
          </div>
        )}

        {/* Specializations */}
        {instructor.specializations && instructor.specializations.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h5 style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Specializations
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {instructor.specializations.map((spec, i) => (
                <span key={i} style={{
                  padding: '0.5rem 0.875rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: '500'
                }}>
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {instructor.languages && instructor.languages.length > 0 && (
          <div style={{ marginBottom: workingSlots.length > 0 ? '1.5rem' : (showActions ? '1.5rem' : 0) }}>
            <h5 style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Languages
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {instructor.languages.map((lang, i) => (
                <span key={i} style={{
                  padding: '0.5rem 0.875rem',
                  background: '#f3e8ff',
                  color: '#7c3aed',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: '500'
                }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability (working only) */}
        {workingSlots.length > 0 && (
          <div style={{ marginBottom: showActions ? '1.5rem' : 0 }}>
            <h5 style={{ 
              fontSize: '0.75rem', 
              fontWeight: '600', 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '0.75rem'
            }}>
              Availability
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {workingSlots.slice(0, 6).map((a, i) => (
                <span key={i} style={{
                  padding: '0.5rem 0.875rem',
                  background: '#fef3c7',
                  color: '#78350f',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: '500'
                }}>
                  {a.day.slice(0, 3)} {a.startTime}–{a.endTime}
                </span>
              ))}
              {workingSlots.length > 6 && (
                <span style={{
                  padding: '0.5rem 0.875rem',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: '500'
                }}>
                  +{workingSlots.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
            <Link 
              to={`/book?instructor=${instructor.id}`}
              className="btn btn-primary"
              style={{
                flex: '1',
                minWidth: '150px',
                textAlign: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Book Lesson
            </Link>
            
            {instructor.phone && (
              <a 
                href={`tel:${instructor.phone}`}
                className="btn btn-secondary"
                style={{
                  flex: '1',
                  minWidth: '150px',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Call Now
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

