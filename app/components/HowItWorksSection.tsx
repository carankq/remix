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
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0',
              backgroundImage: 'url("https://images.unsplash.com/photo-1514477917009-389c76a86b68?auto=format&fit=crop&w=1200&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)'
              }} />
              <div style={{ 
                position: 'relative',
                zIndex: 1,
                padding: '2.5rem'
              }}>
                <div style={{ 
                  marginBottom: '2rem'
                }}>
                  <h3 className="text-2xl font-bold" style={{ color: '#f8fafc' }}>
                    For Students
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Step 1 */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#f8fafc' }}>Search by Location</h4>
                  <p style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
                    Enter your outcode to find DVLA-verified instructors in your area
                  </p>
                </div>
                
                {/* Step 2 */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#f8fafc' }}>Compare & Choose</h4>
                  <p style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
                    Review profiles, prices, experience, and vehicle types to find your perfect match
                  </p>
                </div>
                
                {/* Step 3 */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#f8fafc' }}>Make Enquiries</h4>
                  <p style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
                    Contact instructors directly to discuss availability and start your driving journey
                  </p>
                </div>
              </div>
              </div>
            </div>

            {/* For Instructors */}
            <div className="how-it-works-card" style={{ 
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0',
              backgroundImage: 'url("https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.78)',
                backdropFilter: 'blur(4px)'
              }} />
              <div style={{
                position: 'relative',
                zIndex: 1,
                padding: '2.5rem'
              }}>
              <div style={{ 
                marginBottom: '2rem'
              }}>
                <h3 className="text-2xl font-bold" style={{ color: '#f8fafc' }}>
                  For Instructors
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Step 1 */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#f8fafc' }}>Create Your Profile</h4>
                  <p style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
                    Sign up and add your details, availability, pricing, and areas you cover
                  </p>
                </div>
                
                {/* Step 2 */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#f8fafc' }}>Get DVLA Verified</h4>
                  <p style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
                    Verify your credentials to build instant trust with potential students
                  </p>
                </div>
                
                {/* Step 3 */}
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  padding: '1.5rem',
                  borderRadius: '0'
                }}>
                  <h4 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#f8fafc' }}>Receive Enquiries</h4>
                  <p style={{ lineHeight: '1.6', color: '#e2e8f0' }}>
                    Local students find you by outcode and contact you directly to arrange lessons
                  </p>
                </div>
              </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

