import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getUserFromSession } from "../session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  return json({});
}

export default function DashboardInstructorProfileRoute() {
  // Mock instructor profile data
  const profile = {
    profileComplete: 85,
    hourlyRate: "£35",
    experience: "8 years",
    areas: ["Manchester", "Salford", "Trafford"],
    languages: ["English", "Spanish"],
    availability: "Weekdays: 9am-5pm, Weekends: 10am-2pm",
    bio: "Experienced driving instructor with a passion for teaching. Patient and friendly approach to help nervous learners build confidence.",
    verified: true
  };

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
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb' }}>{profile.profileComplete}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '0',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${profile.profileComplete}%`,
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
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Hourly Rate</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{profile.hourlyRate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Experience</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{profile.experience}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Teaching Areas</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {profile.areas.map((area, i) => (
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
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Languages</div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {profile.languages.map((lang, i) => (
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
                    {profile.bio}
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
                    {profile.availability}
                  </p>
                </div>

                {/* Verification Status */}
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
              </div>
            </div>

            {/* Actions */}
            <div className="instructor-profile-actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary">
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

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

