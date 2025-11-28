import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState, useMemo, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InstructorCard } from "../components/InstructorCard";
import { useAuth } from "../context/AuthContext";
import { getUserFromSession } from "../session.server";

type Instructor = {
  id: string;
  brandName?: string;
  name: string;
  description?: string;
  pricePerHour?: number;
  outcodes?: string[];
  gender?: string;
  vehicles?: Array<{ type: string; licensePlateNumber?: string }>;
  yearsOfExperience?: number;
  deals?: string[];
  instructorType?: 'ADI' | 'PDI';
  languages?: string[];
  rating?: number;
  totalReviews?: number;
  company?: string;
  phone?: string;
  email?: string;
  availability?:
    | Array<{ day: string; start?: string; end?: string; startTime?: string; endTime?: string }>
    | { working?: Array<{ day: string; startTime: string; endTime: string }>; exceptions?: Array<any> };
  enabled?: boolean;
  image?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = url.searchParams;
  
  // Get user session for auth token
  const userSession = await getUserFromSession(request);
  
  // Build API base: prefer env, otherwise same origin as the current request
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  const apiUrl = `${base}/instructors?${params.toString()}`;
  
  // Include auth token if user is logged in
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br"
  };
  
  if (userSession?.token) {
    headers["Authorization"] = `Bearer ${userSession.token}`;
  }
  
  try {
    const res = await fetch(apiUrl, { headers });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const rawList: any[] = Array.isArray(data) ? data : (Array.isArray((data as any)?.instructors) ? (data as any).instructors : []);
    
    // Only include necessary fields to reduce payload size
    const list: Instructor[] = rawList.map((r) => ({
      id: String(r.id ?? r._id ?? ""),
      brandName: String(r.brandName) || undefined,
      name: String(r.name ?? r.fullName ?? "Unknown"),
      description: typeof r.description === 'string' ? r.description?.substring(0, 200) : '', // Limit description length
      pricePerHour: Number(r.pricePerHour ?? r.hourlyRate ?? r.price ?? 0) || undefined,
      outcodes: Array.isArray(r.outcodes) ? r.outcodes : (r.outcodes ? [String(r.outcodes)] : undefined),
      gender: r.gender,
      vehicles: Array.isArray(r.vehicles) ? r.vehicles.map((v: any) => ({ 
        type: v.type,
        licensePlateNumber: v.licensePlateNumber 
      })) : undefined,
      yearsOfExperience: Number(r.yearsOfExperience ?? r.experienceYears ?? 0) || undefined,
      deals: Array.isArray(r.deals) ? r.deals : undefined,
      instructorType: r.instructorType,
      languages: Array.isArray(r.languages) ? r.languages.slice(0, 3) : undefined, // Limit languages shown
      rating: Number(r.rating ?? r.averageRating ?? 0) || undefined,
      totalReviews: Number(r.totalReviews ?? r.reviewCount ?? 0) || undefined,
      company: r.company,
      phone: r.phone,
      email: r.email,
      availability: (() => {
        // Handle both old array format and new object format
        if (Array.isArray(r.availability)) {
          return r.availability.slice(0, 7); // Legacy format
        } else if (r.availability && typeof r.availability === 'object' && Array.isArray(r.availability.working)) {
          // New format: return the working schedule
          return { working: r.availability.working.slice(0, 7), exceptions: [] };
        }
        return undefined;
      })(),
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
  const outcode = String(form.get("outcode") || "");
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (outcode) outcode.split(',').map(s => s.trim()).filter(Boolean).forEach(oc => params.append('outcode', oc));
  return redirect("/results?" + params.toString());
}

export default function ResultsRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('relevance');
  const { token, isAuthenticated } = useAuth();
  const [instructors, setInstructors] = useState<Instructor[]>(loaderData.instructors);
  const [isRefetching, setIsRefetching] = useState(false);
  const [includeNearest, setIncludeNearest] = useState(searchParams.get('getNearest') === 'true' || searchParams.get('getNearest') === '1');
  const [userToggledNearest, setUserToggledNearest] = useState(false);
  

  // Handle toggle for include nearest
  const handleToggleNearest = () => {
    const newValue = !includeNearest;
    setIncludeNearest(newValue);
    setUserToggledNearest(true);
    
    const newParams = new URLSearchParams(searchParams.toString());
    if (newValue) {
      newParams.set('getNearest', 'true');
    } else {
      newParams.delete('getNearest');
    }
    // Use navigate instead of replace to trigger a full page reload
    setSearchParams(newParams);
  };

  // Sync instructors state with loader data when it changes
  useEffect(() => {
    setInstructors(loaderData.instructors);
  }, [loaderData.instructors]);

  // Auto-enable getNearest when no instructors found (only if user hasn't manually toggled)
  useEffect(() => {
    if (instructors.length === 0 && !includeNearest && !isRefetching && !userToggledNearest) {
      const outcodes = searchParams.getAll('outcode');
      // Only auto-enable if there's an outcode search
      if (outcodes.length > 0) {
        setIncludeNearest(true);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('getNearest', 'true');
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [instructors.length, includeNearest, searchParams, setSearchParams, isRefetching, userToggledNearest]);

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
      <section className="results-header-section" style={{ background: '#1e40af', padding: '1.5rem 0' }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Desktop: space-between, Mobile: row */}
            <div className="results-header-layout">
              {/* Title + Count */}
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-white brand-name">
                  Results
                </h1>
                <span style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  ({sortedInstructors.length})
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link 
                  to={backToSearchUrl}
                  style={{
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    textDecoration: 'none',
                    opacity: 0.9,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Refine
                </Link>
                
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                
                <button
                  onClick={handleToggleNearest}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    opacity: 0.9,
                    transition: 'opacity 0.2s ease',
                    padding: '0'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                >
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid white',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: includeNearest ? 'white' : 'transparent'
                  }}>
                    {includeNearest && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  Include Nearby
                </button>
                
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                
                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: '0',
                      paddingRight: '1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      appearance: 'none',
                      outline: 'none',
                      opacity: 0.9
                    }}
                  >
                    <option value="relevance" style={{ background: '#1e293b', color: 'white' }}>Relevance</option>
                    <option value="price-low" style={{ background: '#1e293b', color: 'white' }}>Price: Low-High</option>
                    <option value="price-high" style={{ background: '#1e293b', color: 'white' }}>Price: High-Low</option>
                    <option value="experience" style={{ background: '#1e293b', color: 'white' }}>Experience</option>
                    <option value="rating" style={{ background: '#1e293b', color: 'white' }}>Rating</option>
                  </select>
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      opacity: 0.7
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Second Row: Active Filters */}
            {(() => {
              const outcodes = searchParams.getAll('outcode');
              const gender = searchParams.get('gender');
              const vehicleType = searchParams.get('vehicleType');
              const language = searchParams.get('language');
              const hasFilters = outcodes.length > 0 || gender || vehicleType || language;
              
              if (!hasFilters) return null;
              
              const filters = [];
              outcodes.forEach((oc) => {
                filters.push(
                  <span key={`oc-${oc}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {oc}
                  </span>
                );
              });
              
              if (gender) {
                if (filters.length > 0) filters.push(<span key="sep-gender" style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>);
                filters.push(
                  <span key="gender" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {gender}
                  </span>
                );
              }
              
              if (vehicleType) {
                if (filters.length > 0) filters.push(<span key="sep-vehicle" style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>);
                filters.push(
                  <span key="vehicle" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17h2l.5-1.5h9L17 17h2"/>
                      <path d="M12 17v-6"/>
                      <path d="M9 5h6l3 6H6l3-6z"/>
                      <circle cx="8" cy="17" r="2"/>
                      <circle cx="16" cy="17" r="2"/>
                    </svg>
                    {vehicleType}
                  </span>
                );
              }
              
              if (language) {
                if (filters.length > 0) filters.push(<span key="sep-language" style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>);
                filters.push(
                  <span key="language" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    {language}
                  </span>
                );
              }
              
              return (
                <div style={{ marginTop: '1rem' }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    {filters}
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
                borderRadius: '0',
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
                <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '1.5rem' }}>
                  {includeNearest 
                    ? 'No instructors found in your area or nearby locations. Try adjusting your search filters.' 
                    : 'Try adjusting your search filters or enable "Include Nearby" to expand your search area'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {!includeNearest && (
                    <button
                      onClick={handleToggleNearest}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#1e40af',
                        color: 'white',
                        border: '2px solid #1e40af',
                        borderRadius: '0',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1e3a8a';
                        e.currentTarget.style.borderColor = '#1e3a8a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#1e40af';
                        e.currentTarget.style.borderColor = '#1e40af';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Include Nearby Areas
                    </button>
                  )}
                  <Link 
                    to="/" 
                    style={{ 
                      padding: '0.75rem 1.5rem',
                      background: 'white',
                      color: '#1e40af',
                      border: '2px solid #1e40af',
                      borderRadius: '0',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eff6ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    Back to Search
                  </Link>
                </div>
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
