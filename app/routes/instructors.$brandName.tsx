import { useLoaderData, useNavigate, useSearchParams, useRouteError, isRouteErrorResponse } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { getUserFromSession } from '../session.server';

interface InstructorData {
  _id?: string;
  id?: string;
  name: string;
  brandName?: string;
  description?: string;
  pricePerHour?: number;
  outcodes?: string[];
  gender?: string;
  vehicles?: Array<{ type: string; licensePlateNumber?: string }>;
  yearsOfExperience?: number;
  deals?: string[];
  instructorType?: 'ADI' | 'PDI';
  availability?:
    | Array<{ day: string; start?: string; end?: string; startTime?: string; endTime?: string }>
    | { working?: Array<{ day: string; startTime: string; endTime: string }>; exceptions?: Array<any> };
  languages?: string[];
  enabled?: boolean;
  image?: string;
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.instructor) {
    return [
      { title: 'Instructor Not Found | CarAnk' },
      { name: 'description', content: 'Instructor not found' }
    ];
  }
  
  const instructor = data.instructor;
  return [
    { title: `${instructor.name} - Driving Instructor | CarAnk` },
    { name: 'description', content: instructor.description || `Book driving lessons with ${instructor.name}` },
    { name: 'og:title', content: `${instructor.name} - Driving Instructor` },
    { name: 'og:description', content: instructor.description || `Book driving lessons with ${instructor.name}` }
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const brandName = params.brandName;
  
  if (!brandName) {
    throw new Response('Brand name is required', { status: 400 });
  }
  
  const userSession = await getUserFromSession(request);
  const apiHost = process.env.API_HOST || 'http://localhost:3001';
  
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  if (userSession?.token) {
    headers['Authorization'] = `Bearer ${userSession.token}`;
  }
  
  try {
    const response = await fetch(`${apiHost}/instructors/${encodeURIComponent(brandName)}`, { headers });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Response('Instructor not found', { status: 404 });
      }
      throw new Response('Failed to load instructor', { status: response.status });
    }
    
    const data = await response.json();
    const instructor = data?.instructor || data;
    
    return json({ instructor, brandName });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    throw new Response('Failed to load instructor', { status: 500 });
  }
}

export default function InstructorProfilePage() {
  const { instructor } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showTypeInfo, setShowTypeInfo] = useState(false);
  
  const hasImage = instructor.image && instructor.image.trim() !== '';
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23e5e7eb"/><circle cx="100" cy="76" r="36" fill="%239ca3af"/><path d="M40 172c8-36 36-56 60-56s52 20 60 56" fill="%239ca3af"/></svg>';
  const imgSrc = hasImage ? instructor.image : placeholder;
  const instructorId = instructor._id || instructor.id;
  
  // Get outcode from URL params for default postcode
  const currentOutcode = searchParams.getAll('outcode').join(', ');

  const workingSlots: Array<{ day: string; startTime: string; endTime: string }> = (() => {
    const a: any = instructor.availability as any;
    if (!a) return [];
    if (Array.isArray(a)) {
      return (a as any[])
        .map((s: any) => ({
          day: String(s.day || ''),
          startTime: String(s.startTime || s.start || ''),
          endTime: String(s.endTime || s.end || ''),
        }))
        .filter(s => s.day && s.startTime && s.endTime);
    }
    const w: any[] = Array.isArray(a.working) ? a.working : [];
    return w
      .map((s: any) => ({ day: String(s.day || ''), startTime: String(s.startTime || ''), endTime: String(s.endTime || '') }))
      .filter(s => s.day && s.startTime && s.endTime);
  })();
  
  const handleEnquiry = () => {
    const params = new URLSearchParams({
      instructorId: instructorId || '',
      instructorName: instructor.name,
      postcode: currentOutcode || instructor.outcodes?.[0] || '',
      returnUrl: window.location.pathname + window.location.search
    });
    navigate(`/enquiry?${params.toString()}`);
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <div style={{
          background: '#1e40af',
          paddingTop: '2rem',
          paddingBottom: '3rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem'
          }}
          className="instructor-profile-hero">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '2rem',
                fontSize: '0.875rem',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '0',
                color: 'white',
                padding: '0.5rem 1rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Results
            </button>
            
            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'start', gap: '2rem' }}
              className="instructor-profile-header">
              {/* Profile Image */}
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '0',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                overflow: 'hidden',
                background: '#ffffff',
                flexShrink: 0
              }}
              className="instructor-profile-image">
                <img
                  src={imgSrc}
                  onError={(e) => { 
                    const img = e.currentTarget as HTMLImageElement; 
                    if (img.src !== placeholder) { 
                      img.src = placeholder; 
                    } 
                  }}
                  alt={instructor.name}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              {/* Name and Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    margin: 0,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}
                  className="instructor-profile-name">
                    {instructor.name}
                  </h1>
                  
                  {instructor.instructorType && (
                    <div style={{ position: 'relative' }}>
                      <span 
                        onClick={() => setShowTypeInfo(!showTypeInfo)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          borderRadius: '0',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem'
                        }}>
                        {instructor.instructorType}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </span>
                      {showTypeInfo && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          marginTop: '0.5rem',
                          background: '#ffffff',
                          color: '#111827',
                          padding: '1rem',
                          borderRadius: '0',
                          border: `2px solid ${instructor.instructorType === 'ADI' ? '#10b981' : '#ec4899'}`,
                          fontSize: '0.8125rem',
                          width: '280px',
                          zIndex: 10,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          lineHeight: '1.5'
                        }}>
                          <div style={{ fontWeight: '700', marginBottom: '0.5rem', color: instructor.instructorType === 'ADI' ? '#065f46' : '#831843' }}>
                            {instructor.instructorType === 'ADI' ? 'Approved Driving Instructor (ADI)' : 'Potential Driving Instructor (PDI)'}
                          </div>
                          <div style={{ color: '#374151' }}>
                            {instructor.instructorType === 'ADI' 
                              ? 'Fully qualified and certified by the DVSA to provide professional driving instruction.'
                              : 'In training and supervised by an ADI. Working towards full qualification.'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Quick Info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  {instructor.yearsOfExperience && (
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.95)', 
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <span style={{ fontWeight: '700' }}>{instructor.yearsOfExperience}</span>
                      <span>years experience</span>
                    </div>
                  )}
                  {instructor.gender && (
                    <div style={{ 
                      color: 'rgba(255, 255, 255, 0.95)', 
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <span>{instructor.gender}</span>
                    </div>
                  )}
                </div>
                
                {/* Price */}
                {instructor.pricePerHour && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                    background: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0',
                    border: '2px solid #1e3a8a'
                  }}>
                    <span style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>
                      £{instructor.pricePerHour}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                      per hour
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem'
        }}>
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}
          className="instructor-profile-actions">
            <button
              onClick={handleEnquiry}
              className="btn btn-primary"
              style={{
                flex: 1,
                minWidth: '150px',
                fontSize: '1rem',
                padding: '0.875rem 1.5rem',
                borderRadius: '0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Make Enquiry
            </button>
          </div>
          
          {/* Contact Information */}
          {(instructor.phone || instructor.email) && (
            <div style={{
              background: '#ffffff',
              borderRadius: '0',
              padding: '2rem',
              border: '2px solid #e5e7eb',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Contact Information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {instructor.phone && (
                  <a 
                    href={`tel:${instructor.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: '#f8fafc',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      textDecoration: 'none',
                      color: '#0f172a',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Phone
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a' }}>
                        {instructor.phone}
                      </div>
                    </div>
                  </a>
                )}
                {instructor.email && (
                  <a 
                    href={`mailto:${instructor.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: '#f8fafc',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      textDecoration: 'none',
                      color: '#0f172a',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email
                      </div>
                      <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', wordBreak: 'break-all' }}>
                        {instructor.email}
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
          
          {/* About */}
          {instructor.description && (
            <div style={{
              background: '#ffffff',
              borderRadius: '0',
              padding: '2rem',
              border: '2px solid #e5e7eb',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                About
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#475569',
                lineHeight: '1.7',
                margin: 0
              }}>
                {instructor.description}
              </p>
            </div>
          )}
          
          {/* Details Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
            marginBottom: '2rem'
          }}
          className="instructor-profile-grid">
            {/* Coverage Areas */}
            {instructor.outcodes && instructor.outcodes.length > 0 && (
              <div style={{
                background: '#ffffff',
                borderRadius: '0',
                padding: '1.5rem',
                border: '2px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Coverage Areas
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem'
                }}>
                  {instructor.outcodes.map((code: string, i: number) => (
                    <span key={i} style={{
                      padding: '0.5rem 0.875rem',
                      background: '#eff6ff',
                      color: '#1e40af',
                      border: '2px solid #3b82f6',
                      borderRadius: '0',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Vehicles */}
            {instructor.vehicles && instructor.vehicles.length > 0 && (
              <div style={{
                background: '#ffffff',
                borderRadius: '0',
                padding: '1.5rem',
                border: '2px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Vehicles
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem'
                }}>
                  {instructor.vehicles.map((vehicle: { type: string; licensePlateNumber?: string }, i: number) => (
                    <span key={i} style={{
                      padding: '0.5rem 0.875rem',
                      background: '#f0fdf4',
                      color: '#15803d',
                      border: '2px solid #22c55e',
                      borderRadius: '0',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {vehicle.type}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Languages */}
            {instructor.languages && instructor.languages.length > 0 && (
              <div style={{
                background: '#ffffff',
                borderRadius: '0',
                padding: '1.5rem',
                border: '2px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#6b7280',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Languages
                </h3>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem'
                }}>
                  {instructor.languages.map((lang: string, i: number) => (
                    <span key={i} style={{
                      padding: '0.5rem 0.875rem',
                      background: '#faf5ff',
                      color: '#7c3aed',
                      border: '2px solid #a78bfa',
                      borderRadius: '0',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Deals & Offers */}
          {instructor.deals && instructor.deals.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '0',
              padding: '2rem',
              border: '2px solid #e5e7eb',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Deals & Offers
              </h2>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.75rem'
              }}>
                {instructor.deals.map((deal: string, i: number) => (
                  <span key={i} style={{
                    padding: '0.75rem 1.25rem',
                    background: '#ecfdf5',
                    color: '#065f46',
                    border: '2px solid #10b981',
                    borderRadius: '0',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {deal}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Availability */}
          {workingSlots.length > 0 && (
            <div style={{
              background: '#ffffff',
              borderRadius: '0',
              padding: '2rem',
              border: '2px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Availability
              </h2>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0.75rem'
              }}>
                {workingSlots.map((slot, i) => (
                  <div key={i} style={{
                    padding: '0.875rem 1rem',
                    background: '#fef3c7',
                    border: '2px solid #fbbf24',
                    borderRadius: '0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#78350f' }}>
                      {slot.day}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
                      {slot.startTime}–{slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  let title = 'Something went wrong';
  let message = 'An unexpected error occurred while loading this instructor profile.';
  let statusCode = 500;
  
  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    
    if (error.status === 404) {
      title = 'Instructor Not Found';
      message = 'We couldn\'t find an instructor with that profile name. They may have changed their profile URL or the listing may no longer be available.';
    } else if (error.status === 400) {
      title = 'Invalid Request';
      message = 'The instructor profile URL is invalid.';
    } else if (error.status >= 500) {
      title = 'Server Error';
      message = 'Our servers encountered an error while loading this profile. Please try again later.';
    }
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          background: '#ffffff',
          border: '2px solid #e5e7eb',
          borderRadius: '0',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          {/* Error Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            background: statusCode === 404 ? '#fef3c7' : '#fee2e2',
            border: `2px solid ${statusCode === 404 ? '#fbbf24' : '#ef4444'}`,
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={statusCode === 404 ? '#92400e' : '#991b1b'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {statusCode === 404 ? (
                <>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </>
              ) : (
                <>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </>
              )}
            </svg>
          </div>
          
          {/* Title */}
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '1rem',
            fontFamily: "'Space Grotesk', sans-serif"
          }}>
            {title}
          </h1>
          
          {/* Message */}
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {message}
          </p>
          
          {/* Status Code */}
          {statusCode && (
            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginBottom: '2rem'
            }}>
              Error Code: {statusCode}
            </p>
          )}
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate(-1)}
              className="btn"
              style={{
                fontSize: '0.9375rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0',
                background: '#f3f4f6',
                border: '2px solid #e5e7eb',
                color: '#374151',
                fontWeight: '600'
              }}
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
              style={{
                fontSize: '0.9375rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0',
                fontWeight: '600'
              }}
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
