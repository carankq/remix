import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { useState, useMemo, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { InstructorCard } from "../components/InstructorCard";
import { useAuth } from "../context/AuthContext";

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
  availability?:
    | Array<{ day: string; start?: string; end?: string; startTime?: string; endTime?: string }>
    | { working?: Array<{ day: string; startTime: string; endTime: string }>; exceptions?: Array<any> };
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
  
  // Note: Auth is handled client-side via localStorage, so loader fetches public data
  // The component will refetch with auth token on mount if user is logged in
  const headers: Record<string, string> = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br"
  };
  
  try {
    const res = await fetch(apiUrl, { headers });
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const data = await res.json().catch(() => ({}));
    const rawList: any[] = Array.isArray(data) ? data : (Array.isArray((data as any)?.instructors) ? (data as any).instructors : []);
    
    // Only include necessary fields to reduce payload size
    const list: Instructor[] = rawList.map((r) => ({
      id: String(r.id ?? r._id ?? ""),
      name: String(r.name ?? r.fullName ?? "Unknown"),
      description: typeof r.description === 'string' ? r.description?.substring(0, 200) : '', // Limit description length
      pricePerHour: Number(r.pricePerHour ?? r.hourlyRate ?? r.price ?? 0) || undefined,
      brandName: String(r.brandName) || undefined,
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
      languages: Array.isArray(r.languages) ? r.languages.slice(0, 3) : undefined, // Limit languages shown
      enabled: r.enabled,
      image: r.image || r.profileImage || r.avatar,
    })).filter(i => i.id);

    console.log('v2 I see these guys: list', list);

    return json({ instructors: list }, {
      headers: {
        // "Cache-Control": "public, max-age=300, s-maxage=600", // Cache for 5 min client, 10 min CDN
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
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('relevance');
  const { token, isAuthenticated } = useAuth();
  const [instructors, setInstructors] = useState<Instructor[]>(loaderData.instructors);
  const [isRefetching, setIsRefetching] = useState(false);
  
  // Refetch instructors with auth token if user is logged in
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    
    let cancelled = false;
    const refetchWithAuth = async () => {
      setIsRefetching(true);
      try {
        const apiHost = (window as any).__ENV__?.API_HOST || window.location.origin;
        const apiUrl = `${apiHost}/instructors?${searchParams.toString()}`;
        
        const res = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok && !cancelled) {
          const data = await res.json();
          const rawList: any[] = Array.isArray(data) ? data : (Array.isArray(data?.instructors) ? data.instructors : []);
          
          const list: Instructor[] = rawList.map((r) => ({
            id: String(r.id ?? r._id ?? ""),
            name: String(r.name ?? r.fullName ?? "Unknown"),
            description: typeof r.description === 'string' ? r.description?.substring(0, 200) : '',
            pricePerHour: Number(r.pricePerHour ?? r.hourlyRate ?? r.price ?? 0) || undefined,
            brandName: String(r.brandName) || undefined,
            vehicleType: r.vehicleType ?? r.transmission,
            yearsOfExperience: Number(r.yearsOfExperience ?? r.experienceYears ?? 0) || undefined,
            rating: Number(r.rating ?? r.averageRating ?? 0) || undefined,
            totalReviews: Number(r.totalReviews ?? r.reviewCount ?? 0) || undefined,
            postcode: Array.isArray(r.postcode) ? r.postcode : (r.postcode ? [String(r.postcode)] : undefined),
            gender: r.gender,
            company: r.company,
            phone: r.phone,
            email: r.email,
            specializations: Array.isArray(r.specializations) ? r.specializations.slice(0, 5) : undefined,
            availability: (() => {
              if (Array.isArray(r.availability)) {
                return r.availability.slice(0, 7);
              } else if (r.availability && typeof r.availability === 'object' && Array.isArray(r.availability.working)) {
                return { working: r.availability.working.slice(0, 7), exceptions: [] };
              }
              return undefined;
            })(),
            languages: Array.isArray(r.languages) ? r.languages.slice(0, 3) : undefined,
            enabled: r.enabled,
            image: r.image || r.profileImage || r.avatar,
          })).filter(i => i.id);
          
          setInstructors(list);
        }
      } catch (err) {
        console.error('Failed to refetch instructors with auth:', err);
      } finally {
        if (!cancelled) {
          setIsRefetching(false);
        }
      }
    };
    
    refetchWithAuth();
    
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, searchParams]);
  
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
              const postcodes = searchParams.getAll('postcode');
              const gender = searchParams.get('gender');
              const vehicleType = searchParams.get('vehicleType');
              const language = searchParams.get('language');
              const hasFilters = postcodes.length > 0 || gender || vehicleType || language;
              
              if (!hasFilters) return null;
              
              return (
                <div style={{ marginTop: '1rem' }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    {postcodes.map((pc, idx) => (
                      <span key={`pc-${idx}`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: '0',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                        gap: '0.4rem',
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: '0',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                        gap: '0.4rem',
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: '0',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255,255,255,0.2)'
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
                    )}
                    {language && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.75rem',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        borderRadius: '0',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        {language}
                      </span>
                    )}
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
