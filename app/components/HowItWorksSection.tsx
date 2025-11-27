export function HowItWorksSection() {
  return (
    <section style={{ 
      background: '#f8fafc',
      padding: '2rem 0 4rem 0'
    }}>
      <div className="container mx-auto px-4">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 brand-name">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ lineHeight: '1.6' }}>
              Simple, straightforward, and transparent for everyone
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
          }}
          className="how-it-works-grid">
            
            {/* For Students */}
            <div className="how-it-works-card" style={{ 
              background: '#ffffff',
              borderRadius: '0',
              padding: '2.5rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="how-it-works-title" style={{ 
                marginBottom: '2rem'
              }}>
                <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
                  For Students
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Step 1 */}
                <div style={{ 
                  background: '#eff6ff',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#1e40af' }}>Search by Location</h4>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>
                    Enter your outcode to find DVLA-verified instructors in your area
                  </p>
                </div>
                
                {/* Step 2 */}
                <div style={{ 
                  background: '#eff6ff',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#1e40af' }}>Compare & Choose</h4>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>
                    Review profiles, prices, experience, and vehicle types to find your perfect match
                  </p>
                </div>
                
                {/* Step 3 */}
                <div style={{ 
                  background: '#eff6ff',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#1e40af' }}>Make Enquiries</h4>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>
                    Contact instructors directly to discuss availability and start your driving journey
                  </p>
                </div>
              </div>
            </div>

            {/* For Instructors */}
            <div className="how-it-works-card" style={{ 
              background: '#ffffff',
              borderRadius: '0',
              padding: '2.5rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div className="how-it-works-title" style={{ 
                marginBottom: '2rem'
              }}>
                <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>
                  For Instructors
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Step 1 */}
                <div style={{ 
                  background: '#f0fdf4',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#15803d' }}>Create Your Profile</h4>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>
                    Sign up and add your details, availability, pricing, and areas you cover
                  </p>
                </div>
                
                {/* Step 2 */}
                <div style={{ 
                  background: '#f0fdf4',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#15803d' }}>Get DVLA Verified</h4>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>
                    Verify your credentials to build instant trust with potential students
                  </p>
                </div>

                {/* Step 3 */}
                <div style={{ 
                  background: '#f0fdf4',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#15803d' }}>Receive Enquiries</h4>
                  <p style={{ lineHeight: '1.6', color: '#475569' }}>
                    Local students find you by outcode and contact you directly to arrange lessons
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

