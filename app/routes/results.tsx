import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type Instructor = {
  id: string;
  name: string;
  description?: string;
  pricePerHour?: number;
  vehicleType?: string;
  yearsOfExperience?: number;
  rating?: number;
  totalReviews?: number;
  postcode?: string[];
  gender?: string;
  company?: string;
  phone?: string;
  email?: string;
  specializations?: string[];
  availability?: string[];
  languages?: string[];
  enabled?: boolean;
  image?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  // Build API base: prefer env, otherwise same origin as the current request
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  const apiUrl = `${base}/instructors?${params.toString()}`;
  try {
    const res = await fetch(apiUrl, { 
      headers: { 
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate, br"
      } 
    });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const rawList: any[] = Array.isArray(data) ? data : (Array.isArray((data as any)?.instructors) ? (data as any).instructors : []);
    
    // Only include necessary fields to reduce payload size
    const list: Instructor[] = rawList.map((r) => ({
      id: String(r.id ?? r._id ?? ""),
      name: String(r.name ?? r.fullName ?? "Unknown"),
      description: typeof r.description === 'string' ? r.description?.substring(0, 200) : '', // Limit description length
      pricePerHour: Number(r.pricePerHour ?? r.hourlyRate ?? r.price ?? 0) || undefined,
      vehicleType: r.vehicleType ?? r.transmission,
      yearsOfExperience: Number(r.yearsOfExperience ?? r.experienceYears ?? 0) || undefined,
      rating: Number(r.rating ?? r.averageRating ?? 0) || undefined,
      totalReviews: Number(r.totalReviews ?? r.reviewCount ?? 0) || undefined,
      postcode: Array.isArray(r.postcode) ? r.postcode : (r.postcode ? [String(r.postcode)] : undefined),
      gender: r.gender,
      company: r.company,
      phone: r.phone,
      email: r.email,
      specializations: Array.isArray(r.specializations) ? r.specializations.slice(0, 5) : undefined, // Limit array size
      availability: Array.isArray(r.availability) ? r.availability.slice(0, 7) : undefined, // Limit to one week
      languages: Array.isArray(r.languages) ? r.languages.slice(0, 3) : undefined, // Limit languages shown
      enabled: r.enabled,
      image: r.image || r.profileImage || r.avatar,
    })).filter(i => i.id);
    
    return json({ instructors: list }, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600", // Cache for 5 min client, 10 min CDN
      }
    });
  } catch (e) {
    return json({ instructors: [] as any[], error: "Unable to load instructors" }, { status: 200 });
  }
}

// Add headers for better caching
export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "Cache-Control": loaderHeaders.get("Cache-Control") || "public, max-age=300",
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const q = String(form.get("q") || "");
  const postcode = String(form.get("postcode") || "");
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (postcode) postcode.split(',').map(s => s.trim()).filter(Boolean).forEach(pc => params.append('postcode', pc));
  return redirect("/results?" + params.toString());
}

export default function ResultsRoute() {
  const { instructors } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('relevance');
  
  // Sort instructors based on selected option
  const sortedInstructors = useMemo(() => {
    const sorted = [...instructors];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.pricePerHour || 999) - (b.pricePerHour || 999));
      case 'price-high':
        return sorted.sort((a, b) => (b.pricePerHour || 0) - (a.pricePerHour || 0));
      case 'experience':
        return sorted.sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: // relevance
        return sorted;
    }
  }, [instructors, sortBy]);
  
  // Build the back to search URL with current params
  const backToSearchUrl = searchParams.toString() ? `/?${searchParams.toString()}` : '/';
  
  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Header */}
      <section className="bg-deep-navy py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* First Row: Title, Count, Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-white brand-name">
                  Available Instructors
                </h1>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.3)',
                  whiteSpace: 'nowrap'
                }}>
                  {sortedInstructors.length} {sortedInstructors.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                <Link 
                  to={backToSearchUrl}
                  className="btn btn-secondary"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Refine Search
                </Link>
                
                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      padding: '0.75rem 2.5rem 0.75rem 1.25rem',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      appearance: 'none',
                      outline: 'none'
                    }}
                  >
                    <option value="relevance" style={{ background: '#1e293b', color: 'white' }}>Sort by: Relevance</option>
                    <option value="price-low" style={{ background: '#1e293b', color: 'white' }}>Price: Low to High</option>
                    <option value="price-high" style={{ background: '#1e293b', color: 'white' }}>Price: High to Low</option>
                    <option value="experience" style={{ background: '#1e293b', color: 'white' }}>Most Experience</option>
                    <option value="rating" style={{ background: '#1e293b', color: 'white' }}>Highest Rated</option>
                  </select>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Second Row: Active Filters */}
            {(() => {
              const postcodes = searchParams.getAll('postcode');
              const gender = searchParams.get('gender');
              const vehicleType = searchParams.get('vehicleType');
              const language = searchParams.get('language');
              const hasFilters = postcodes.length > 0 || gender || vehicleType || language;
              
              if (!hasFilters) return null;
              
              return (
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.75rem',
                  padding: '1rem 1.25rem'
                }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span style={{
                      color: '#d1d5db',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      Active Filters:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {postcodes.map((pc, idx) => (
                        <span key={`pc-${idx}`} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {pc}
                        </span>
                      ))}
                      {gender && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          {gender}
                        </span>
                      )}
                      {vehicleType && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 17h2l.5-1.5h9L17 17h2"/>
                            <path d="M12 17v-6"/>
                            <path d="M9 5h6l3 6H6l3-6z"/>
                            <circle cx="8" cy="17" r="2"/>
                            <circle cx="16" cy="17" r="2"/>
                          </svg>
                          {vehicleType}
                        </span>
                      )}
                      {language && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          border: '1px solid rgba(255,255,255,0.3)'
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                          {language}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {sortedInstructors.length === 0 ? (
              <div style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                padding: '4rem 2rem',
                textAlign: 'center'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1.5rem' }}>
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  No instructors found
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                  Try adjusting your search filters to see more results
                </p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                  Back to Search
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {sortedInstructors.map((instructor) => (
                  <InstructorCard key={instructor.id} instructor={instructor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function InstructorCard({ instructor }: { instructor: Instructor }) {
  const hasRating = instructor.rating && instructor.rating > 0;
  const hasImage = instructor.image && instructor.image.trim() !== '';
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23e5e7eb"/><circle cx="50" cy="38" r="18" fill="%239ca3af"/><path d="M20 86c4-18 18-28 30-28s26 10 30 28" fill="%239ca3af"/></svg>';
  const imgSrc = hasImage ? instructor.image : placeholder;
  
  return (
    <article style={{
      background: '#ffffff',
      borderRadius: '1rem',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease'
    }}
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
          <div style={{ marginBottom: '1.5rem' }}>
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
          <Link 
            to={`/contact?id=${instructor.id}`}
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Send Message
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
      </div>
    </article>
  );
}


