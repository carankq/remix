import { useLoaderData, useNavigate } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface InstructorData {
  _id?: string;
  id?: string;
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
  
  const apiHost = (process.env.API_HOST || request.url.split('/')[0] + '//' + request.url.split('/')[2]).replace(/\/$/, '');
  
  try {
    const response = await fetch(`${apiHost}/instructors/${encodeURIComponent(brandName)}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
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
  
  const hasRating = instructor.rating && instructor.rating > 0;
  const hasImage = instructor.image && instructor.image.trim() !== '';
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="100" fill="%23e5e7eb"/><circle cx="100" cy="76" r="36" fill="%239ca3af"/><path d="M40 172c8-36 36-56 60-56s52 20 60 56" fill="%239ca3af"/></svg>';
  const imgSrc = hasImage ? instructor.image : placeholder;
  const instructorId = instructor._id || instructor.id;

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
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      
      <main style={{ flex: 1 }}>
        {/* Hero Banner with Gradient and Profile */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          paddingTop: '2rem',
          paddingBottom: '8rem'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
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
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                backdropFilter: 'blur(10px)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back
            </button>
            
            {/* Profile Header */}
            <div style={{ display: 'flex', alignItems: 'end', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Profile Image */}
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '1rem',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                background: '#ffffff',
                flexShrink: 0
              }}>
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
              
              {/* Name and Quick Info */}
              <div style={{ flex: 1, paddingBottom: '1rem' }}>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}>
                  {instructor.name}
                </h1>
                
                {instructor.company && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: '500' }}>
                      {instructor.company}
                    </span>
                  </div>
                )}
                
                {/* Rating & Experience */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  {hasRating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.125rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i < Math.floor(instructor.rating!) ? "#fbbf24" : "rgba(255, 255, 255, 0.3)"} stroke={i < Math.floor(instructor.rating!) ? "#fbbf24" : "rgba(255, 255, 255, 0.3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                      <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ffffff' }}>
                        {instructor.rating?.toFixed(1)}
                      </span>
                      <span style={{ fontSize: '0.9375rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                        ({instructor.totalReviews || 0} reviews)
                      </span>
                    </div>
                  )}
                  {instructor.yearsOfExperience && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: '500' }}>
                        {instructor.yearsOfExperience} years experience
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Price Badge */}
              {instructor.pricePerHour && (
                <div style={{
                  padding: '1.5rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                  minWidth: '180px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '3rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.25rem', lineHeight: 1 }}>
                    £{instructor.pricePerHour}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
                    per hour
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div style={{
          maxWidth: '1200px',
          margin: '-6rem auto 0',
          padding: '0 2rem 4rem',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Action Buttons Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {instructorId && (
                <button
                  onClick={() => navigate(`/book?instructor=${instructorId}`)}
                  className="btn btn-primary"
                  style={{
                    fontSize: '1.125rem',
                    padding: '1rem 2.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Book a Lesson
                </button>
              )}
              
              {instructor.phone && (
                <a
                  href={`tel:${instructor.phone}`}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '1.125rem',
                    padding: '1rem 2.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call Now
                </a>
              )}
              
              {instructor.email && (
                <a
                  href={`mailto:${instructor.email}`}
                  className="btn"
                  style={{
                    fontSize: '1.125rem',
                    padding: '1rem 2.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    minWidth: '200px',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Send Email
                </a>
              )}
            </div>
          </div>
          
          {/* About Section */}
          {instructor.description && (
            <div style={{
              background: '#ffffff',
              borderRadius: '1rem',
              padding: '2.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '1.25rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                About {instructor.name}
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: '#475569',
                lineHeight: '1.8',
                margin: 0
              }}>
                {instructor.description}
              </p>
            </div>
          )}
          
          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Details & Location Card */}
            {(instructor.postcode || instructor.vehicleType) && (
              <div style={{
                background: '#ffffff',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '1.5rem',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {instructor.postcode && instructor.postcode.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '0.75rem',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.375rem', fontWeight: '500' }}>Coverage Areas</div>
                        <div style={{ fontSize: '1.0625rem', fontWeight: '600', color: '#0f172a' }}>
                          {instructor.postcode.join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                  {instructor.vehicleType && (
                    <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '0.75rem',
                        background: '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="6" width="22" height="11" rx="2" ry="2"/>
                          <line x1="7" y1="11" x2="7" y2="11.01"/>
                          <line x1="11" y1="11" x2="17" y2="11"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.375rem', fontWeight: '500' }}>Vehicle Type</div>
                        <div style={{ fontSize: '1.0625rem', fontWeight: '600', color: '#0f172a' }}>
                          {instructor.vehicleType}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Availability Card (working only) */}
            {workingSlots.length > 0 && (
              <div style={{
                background: '#ffffff',
                borderRadius: '1rem',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '1.5rem',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  Availability
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {workingSlots.map((a: any, i: number) => (
                    <div key={i} style={{
                      padding: '1rem 1.25rem',
                      background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
                      border: '1px solid #fde047',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: '#713f12' }}>
                        {a.day}
                      </span>
                      <span style={{ fontSize: '0.9375rem', color: '#854d0e', fontWeight: '500' }}>
                        {a.startTime} – {a.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Skills Section */}
          {((instructor.specializations && instructor.specializations.length > 0) || (instructor.languages && instructor.languages.length > 0)) && (
            <div style={{
              background: '#ffffff',
              borderRadius: '1rem',
              padding: '2.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              border: '1px solid #e2e8f0'
            }}>
              {/* Specializations */}
              {instructor.specializations && instructor.specializations.length > 0 && (
                <div style={{ marginBottom: instructor.languages && instructor.languages.length > 0 ? '2.5rem' : 0 }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    marginBottom: '1.25rem',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    Specializations
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {instructor.specializations.map((spec: string, i: number) => (
                      <span key={i} style={{
                        padding: '0.875rem 1.5rem',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: '#1e40af',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                        border: '1px solid #93c5fd'
                      }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Languages */}
              {instructor.languages && instructor.languages.length > 0 && (
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    marginBottom: '1.25rem',
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    Languages
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {instructor.languages.map((lang: string, i: number) => (
                      <span key={i} style={{
                        padding: '0.875rem 1.5rem',
                        background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                        color: '#6b21a8',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(124, 58, 237, 0.15)',
                        border: '1px solid #d8b4fe'
                      }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
