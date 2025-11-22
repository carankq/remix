import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getUserFromSession } from "../session.server";
import { useState } from "react";
import InstructorCreateForm from "../components/InstructorCreateForm";

interface InstructorProfile {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  hourlyRate?: number;
  yearsExperience?: number;
  qualifications?: string[];
  verified?: boolean;
  location?: {
    postcode?: string;
    city?: string;
    county?: string;
  };
  availability?: string;
  languages?: string[];
  image?: string;
  company?: string;
  areas?: string[];
}

interface LoaderData {
  profile: InstructorProfile | null;
  profileError: string | null;
  isInstructor: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  // Redirect to login if not authenticated
  if (!userSession) {
    return redirect('/auth');
  }
  
  // If not an instructor, redirect to home or show error
  if (userSession.accountType !== 'instructor') {
    return json<LoaderData>({ 
      profile: null,
      profileError: 'Only instructors can access this page.',
      isInstructor: false
    });
  }
  
  // Get API host from environment
  const apiHost = (process.env.API_HOST || request.url.split('/')[0] + '//' + request.url.split('/')[2]).replace(/\/$/, '');
  
  try {
    // Fetch instructor profile
    const response = await fetch(`${apiHost}/instructors/find/owner`, {
      headers: {
        'Authorization': `Bearer ${userSession.token}`,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    if (response.status === 404) {
      // No profile found - this is okay, they can create one
      return json<LoaderData>({ 
        profile: null,
        profileError: null,
        isInstructor: true
      });
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return json<LoaderData>({ 
        profile: null,
        profileError: errorData?.error || 'Unable to load instructor profile.',
        isInstructor: true
      });
    }
    
    const data = await response.json();
    const profile = data?.instructor || data;
    
    return json<LoaderData>({ 
      profile,
      profileError: null,
      isInstructor: true
    });
    
  } catch (error) {
    console.error('Error fetching instructor profile:', error);
    return json<LoaderData>({ 
      profile: null,
      profileError: 'Network error while loading instructor profile.',
      isInstructor: true
    });
  }
}

export default function DashboardInstructorProfileRoute() {
  const { profile, profileError, isInstructor } = useLoaderData<typeof loader>();
  const [showForm, setShowForm] = useState(false);
  
  // Callback to handle profile creation/update - reload the page to get fresh data
  const handleProfileCreated = () => {
    // Reload the page to fetch updated data from server
    window.location.reload();
  };
  
  // Calculate profile completion percentage
  const calculateCompletion = (profile: InstructorProfile | null) => {
    if (!profile) return 0;
    let completed = 0;
    let total = 10;
    
    if (profile.name) completed++;
    if (profile.description && profile.description.length > 50) completed++;
    if (profile.hourlyRate) completed++;
    if (profile.yearsExperience) completed++;
    if (profile.qualifications && profile.qualifications.length > 0) completed++;
    if (profile.location?.postcode) completed++;
    if (profile.availability) completed++;
    if (profile.languages && profile.languages.length > 0) completed++;
    if (profile.image) completed++;
    if (profile.verified) completed++;
    
    return Math.round((completed / total) * 100);
  };
  
  const profileComplete = calculateCompletion(profile);
  
  // Extract display data from profile
  const hourlyRate = profile?.hourlyRate ? `£${profile.hourlyRate}` : 'Not set';
  const experience = profile?.yearsExperience ? `${profile.yearsExperience} years` : 'Not set';
  const areas = profile?.areas || (profile?.location?.city ? [profile.location.city] : []);
  const languages = profile?.languages || ['English'];
  const availability = profile?.availability || 'Not set';
  const bio = profile?.description || 'No bio provided yet.';
  const verified = profile?.verified || false;
  
  // If not an instructor, show error
  if (!isInstructor) {
    return (
      <div>
        <Header />
        <main style={{ 
          minHeight: '70vh',
          background: '#f9fafb',
          padding: '3rem 0'
        }}>
          <div className="container mx-auto px-4 md:px-8">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{
                background: 'white',
                border: '2px solid #ef4444',
                borderRadius: '0',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Access Denied
                </h3>
                <p style={{ color: '#6b7280' }}>
                  {profileError || 'Only instructors can access this page.'}
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '3rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Instructor Profile
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Manage your public instructor profile and teaching information
              </p>
            </div>

            {/* Error State */}
            {profileError && (
              <div style={{
                background: 'white',
                border: '2px solid #ef4444',
                borderRadius: '0',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <p style={{ color: '#dc2626', fontWeight: '600' }}>
                  {profileError}
                </p>
              </div>
            )}

            {/* No Profile State or Form */}
            {!profile && !profileError && (
              <>
                {!showForm ? (
                  <div style={{
                    background: 'white',
                    border: '2px solid #f59e0b',
                    borderRadius: '0',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                      No Instructor Profile Found
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                      You haven't created your instructor profile yet. Create one to start receiving bookings!
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowForm(true)}
                    >
                      Create Instructor Profile
                    </button>
                  </div>
                ) : (
                  <InstructorCreateForm onCreated={handleProfileCreated} />
                )}
              </>
            )}

            {/* Profile Content */}
            {profile && (
              <>
                {!showForm ? (
                  <>
                    {/* Profile Completion */}
                    <div style={{
                      background: 'white',
                      border: '2px solid #2563eb',
                      borderRadius: '0',
                      padding: '1.5rem',
                      marginBottom: '2rem'
                    }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Profile Completion</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb' }}>{profileComplete}%</span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#e5e7eb',
                          borderRadius: '0',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${profileComplete}%`,
                            height: '100%',
                            background: '#2563eb',
                            transition: 'width 0.3s ease'
                          }}/>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Complete your profile to attract more students and appear higher in search results
                      </p>
                    </div>

                {/* Two Column Layout */}
                <div className="instructor-profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Basic Info */}
                    <div style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      padding: '1.5rem'
                    }}>
                      <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1.5rem'
                      }}>
                        Basic Information
                      </h2>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Name</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{profile.name || 'Not set'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Hourly Rate</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{hourlyRate}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Experience</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{experience}</div>
                        </div>
                        {areas.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Teaching Areas</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {areas.map((area, i) => (
                                <span key={i} style={{
                                  padding: '0.25rem 0.75rem',
                                  background: '#dbeafe',
                                  color: '#1e40af',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  borderRadius: '0'
                                }}>
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Languages</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {languages.map((lang, i) => (
                              <span key={i} style={{
                                padding: '0.25rem 0.75rem',
                                background: '#f3f4f6',
                                color: '#111827',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                borderRadius: '0'
                              }}>
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Bio */}
                    <div style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      padding: '1.5rem'
                    }}>
                      <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1.5rem'
                      }}>
                        About Me
                      </h2>
                      <p style={{ color: '#374151', lineHeight: '1.6' }}>
                        {bio}
                      </p>
                    </div>

                    {/* Availability */}
                    <div style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      padding: '1.5rem'
                    }}>
                      <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1.5rem'
                      }}>
                        Availability
                      </h2>
                      <p style={{ color: '#374151', lineHeight: '1.6' }}>
                        {availability}
                      </p>
                    </div>

                    {/* Verification Status */}
                    {verified ? (
                      <div style={{
                        background: 'white',
                        border: '2px solid #10b981',
                        borderRadius: '0',
                        padding: '1.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0',
                            background: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                              Verified Instructor
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              Identity & credentials verified
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'white',
                        border: '2px solid #f59e0b',
                        borderRadius: '0',
                        padding: '1.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0',
                            background: '#f59e0b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                              Verification Pending
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                              Complete verification to build trust
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="instructor-profile-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Edit Profile
                  </button>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #e5e7eb',
                    background: 'white',
                    color: '#6b7280',
                    borderRadius: '0',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease'
                  }}>
                    Preview Public Profile
                  </button>
                </div>
              </>
            ) : (
              <InstructorCreateForm onCreated={handleProfileCreated} />
            )}
          </>
        )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

