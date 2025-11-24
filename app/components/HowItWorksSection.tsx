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
              padding: '2.5rem',
              borderRadius: '0',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                marginBottom: '2rem'
              }}>
                <h3 className="text-2xl font-bold text-gray-900">
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
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>Search by Location</h4>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                    Enter your outcode to find DVLA-verified instructors in your area
                  </p>
                </div>
                
                {/* Step 2 */}
                <div style={{ 
                  background: '#eff6ff',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>Compare & Choose</h4>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                    Review profiles, prices, experience, and vehicle types to find your perfect match
                  </p>
                </div>
                
                {/* Step 3 */}
                <div style={{ 
                  background: '#eff6ff',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>Make Enquiries</h4>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                    Contact instructors directly to discuss availability and start your driving journey
                  </p>
                </div>
              </div>
            </div>

            {/* For Instructors */}
            <div className="how-it-works-card" style={{ 
              background: '#ffffff',
              padding: '2.5rem',
              borderRadius: '0',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                marginBottom: '2rem'
              }}>
                <h3 className="text-2xl font-bold text-gray-900">
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
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>Create Your Profile</h4>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                    Sign up and add your details, availability, pricing, and areas you cover
                  </p>
                </div>
                
                {/* Step 2 */}
                <div style={{ 
                  background: '#f0fdf4',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>Get DVLA Verified</h4>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
                    Verify your credentials to build instant trust with potential students
                  </p>
                </div>
                
                {/* Step 3 */}
                <div style={{ 
                  background: '#f0fdf4',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontSize: '1.125rem' }}>Receive Enquiries</h4>
                  <p className="text-gray-600" style={{ lineHeight: '1.6' }}>
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

