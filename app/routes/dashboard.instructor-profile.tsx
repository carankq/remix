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
  brandName: string;
  ownerId: string;
  name: string;
  description?: string;
  pricePerHour?: number;
  outcodes?: string[];
  vehicles?: Array<{ type: string; licensePlateNumber?: string }>;
  deals?: string[];
  yearsOfExperience?: number;
  company?: string;
  phone?: string;
  email?: string;
  languages?: string[];
  image?: string;
  availability?: {
    working?: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    exceptions?: Array<{
      startTime: number;
      endTime: number;
    }>;
  };
  permissions?: {
    publicAvailability?: string;
    publicAvailabilityWhitelist?: string[];
    publicAvailabilityBlacklist?: string[];
    numberVisibility?: string;
    numberVisibilityWhitelist?: string[];
    numberVisibilityBlacklist?: string[];
  };
  adminDisabled?: boolean;
  adminDisabledReason?: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LoaderData {
  profile: InstructorProfile | null;
  profileError: string | null;
  isInstructor: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  // Redirect to auth if not authenticated
  // The session cookie will be set by the AuthContext after login
  if (!userSession) {
    return redirect('/auth');
  }
  
  // If not an instructor, return error state
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
    console.log(JSON.stringify(data));
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
    if (profile.pricePerHour) completed++;
    if (profile.yearsOfExperience) completed++;
    if (profile.vehicles && profile.vehicles.length > 0) completed++;
    if (profile.outcodes && profile.outcodes.length > 0) completed++;
    if (profile.availability?.working && profile.availability.working.length > 0) completed++;
    if (profile.languages && profile.languages.length > 0) completed++;
    if (profile.image) completed++;
    if (profile.deals && profile.deals.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };
  
  const profileComplete = calculateCompletion(profile);
  
  // Extract display data from profile
  const hourlyRate = profile?.pricePerHour ? `£${profile.pricePerHour}` : 'Not set';
  const experience = profile?.yearsOfExperience ? `${profile.yearsOfExperience} years` : 'Not set';
  const outcodes = profile?.outcodes || [];
  const languages = profile?.languages || ['English'];
  const vehicles = profile?.vehicles || [];
  const deals = profile?.deals || [];
  
  // Format availability for display
  const formatAvailability = () => {
    if (!profile?.availability?.working || profile.availability.working.length === 0) {
      return 'Not set';
    }
    return profile.availability.working.map(slot => 
      `${slot.day}: ${slot.startTime} - ${slot.endTime}`
    ).join(', ');
  };
  const availability = formatAvailability();
  const bio = profile?.description || 'No bio provided yet.';

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
            
            {/* Header - Only show when not in form view */}
            {(profile && !showForm) && (
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
            )}

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

            {/* No Profile State - Show Form Immediately */}
            {!profile && !profileError && (
              <InstructorCreateForm 
                onCreated={handleProfileCreated}
                initialProfile={null}
                skipFetch={true}
              />
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
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Brand Name</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{profile.brandName || 'Not set'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Hourly Rate</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{hourlyRate}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Experience</div>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{experience}</div>
                        </div>
                        {outcodes.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Coverage Outcodes</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {outcodes.map((outcode, i) => (
                                <span key={i} style={{
                                  padding: '0.25rem 0.75rem',
                                  background: '#dbeafe',
                                  color: '#1e40af',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  borderRadius: '0'
                                }}>
                                  {outcode}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {vehicles.length > 0 && (
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Vehicles</div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {vehicles.map((vehicle, i) => (
                                <span key={i} style={{
                                  padding: '0.25rem 0.75rem',
                                  background: '#f3f4f6',
                                  color: '#111827',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  borderRadius: '0'
                                }}>
                                  {vehicle.type}
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
                      <p style={{ color: '#374151', lineHeight: '1.6', fontSize: '0.875rem' }}>
                        {availability}
                      </p>
                    </div>

                    {/* Deals & Offers */}
                    {deals.length > 0 && (
                      <div style={{
                        background: 'white',
                        border: '2px solid #10b981',
                        borderRadius: '0',
                        padding: '1.5rem'
                      }}>
                        <h2 style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '1.5rem'
                        }}>
                          Deals & Offers
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {deals.map((deal, i) => (
                            <div key={i} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                                {deal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Status Warning */}
                    {profile.adminDisabled && (
                      <div style={{
                        background: 'white',
                        border: '2px solid #ef4444',
                        borderRadius: '0',
                        padding: '1.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '0',
                            background: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                          </div>
                          <div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                              Profile Disabled
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                              {profile.adminDisabledReason || 'Your profile has been disabled by an administrator.'}
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
              <InstructorCreateForm 
                onCreated={handleProfileCreated}
                initialProfile={profile}
                skipFetch={true}
                initialMode="edit"
              />
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

