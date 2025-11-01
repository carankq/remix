export function TrustTechnologySection() {
  return (
    <section style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '4rem 0',
      color: '#ffffff'
    }}>
      <div className="container mx-auto px-4 md:px-8">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              Built on Trust & Technology
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              opacity: 0.95,
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}>
              We've partnered with industry leaders to create a safe and transparent platform for driving lessons
            </p>
          </div>

          {/* Main Features Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Escrow Payment Protection */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.375rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Escrow-Style Payment Protection
              </h3>
              <p style={{ 
                fontSize: '0.9375rem', 
                lineHeight: '1.6',
                opacity: 0.9
              }}>
                Your money is securely held until your lesson is complete. Instructors are paid automatically after each session, ensuring fairness and accountability for both parties.
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '1.25rem',
                fontSize: '0.875rem',
                opacity: 0.85
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  No upfront cash payments
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Automatic payment release
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Full transaction history
                </li>
              </ul>
            </div>

            {/* Dual Verification System */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <polyline points="17 11 19 13 23 9"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.375rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Dual Verification System
              </h3>
              <p style={{ 
                fontSize: '0.9375rem', 
                lineHeight: '1.6',
                opacity: 0.9,
                marginBottom: '0.75rem'
              }}>
                Every instructor passes through <strong>two layers of verification</strong>: automated Stripe identity checks and manual admin review.
              </p>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.8125rem',
                opacity: 0.95
              }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Automated (Stripe):</strong>
                Government ID, facial recognition, driving license verification
              </div>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '0',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.8125rem',
                opacity: 0.95
              }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Human Review:</strong>
                Admin team manually approves every instructor before they can accept bookings
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                fontSize: '0.875rem',
                opacity: 0.85
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Double-checked credentials
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Striving for authenticity
                </li>
              </ul>
            </div>

            {/* DVLA Vehicle Verification */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.375rem', 
                fontWeight: '600', 
                marginBottom: '0.75rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                DVLA Vehicle Verification
              </h3>
              <p style={{ 
                fontSize: '0.9375rem', 
                lineHeight: '1.6',
                opacity: 0.9
              }}>
                All instructor vehicles are verified directly with the DVLA. Registration, make, model, and colour are automatically checked, no room for fake information.
              </p>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                marginTop: '1.25rem',
                fontSize: '0.875rem',
                opacity: 0.85
              }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Real-time DVLA database checks
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Cannot be falsified
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Visible to students before booking
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom CTA */}
          <div style={{
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '0.75rem',
              fontFamily: "'Space Grotesk', sans-serif"
            }}>
              Your Safety is Our Priority
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              opacity: 0.9,
              marginBottom: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto 1.5rem'
            }}>
              We've built Carank from the ground up with security, transparency, and peace of mind at the core. 
              Learn more about how we protect you.
            </p>
            <a 
              href="/safeguarding" 
              className="btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#667eea',
                borderRadius: '0',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                border: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              View Our Safeguarding Commitment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

