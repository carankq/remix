export function HowItWorksSection() {
  return (
    <section style={{ 
      background: '#ffffff',
      padding: '2rem 0 4rem 0'
    }}>
      <div className="container mx-auto px-4">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 brand-name">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, straightforward, and transparent for everyone
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem'
          }}
          className="how-it-works-grid">
            
            {/* For Students */}
            <div className="how-it-works-card" style={{ 
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              padding: '2.5rem',
              borderRadius: '0',
              border: '2px solid #93c5fd'
            }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>🎓</span>
                For Students
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    background: '#3b82f6',
                    color: '#ffffff',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Search by Location</h4>
                    <p className="text-sm text-gray-600">
                      Enter your postcode to find DVLA-verified instructors in your area
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    background: '#3b82f6',
                    color: '#ffffff',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compare & Choose</h4>
                    <p className="text-sm text-gray-600">
                      Review profiles, prices, experience, and vehicle types to find your perfect match
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    background: '#3b82f6',
                    color: '#ffffff',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Make Enquiries</h4>
                    <p className="text-sm text-gray-600">
                      Contact instructors directly to discuss availability and start your driving journey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Instructors */}
            <div className="how-it-works-card" style={{ 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              padding: '2.5rem',
              borderRadius: '0',
              border: '2px solid #86efac'
            }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>🚗</span>
                For Instructors
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    background: '#10b981',
                    color: '#ffffff',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Create Your Profile</h4>
                    <p className="text-sm text-gray-600">
                      Sign up and add your details, availability, pricing, and areas you cover
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    background: '#10b981',
                    color: '#ffffff',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Get DVLA Verified</h4>
                    <p className="text-sm text-gray-600">
                      Verify your vehicle credentials to build instant trust with potential students
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ 
                    background: '#10b981',
                    color: '#ffffff',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.125rem',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Receive Enquiries</h4>
                    <p className="text-sm text-gray-600">
                      Local students find you by postcode and contact you directly to arrange lessons
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

