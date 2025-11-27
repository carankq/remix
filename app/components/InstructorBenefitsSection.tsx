import { Slideshow } from './Slideshow';

const slides = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop', 
    title: 'Stand Out with DVLA Verification', 
    description: 'Build instant trust — prove your vehicle credentials are genuine and verified'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop', 
    title: 'Students Find You Locally', 
    description: 'No more driving miles away — students search by postcode to find instructors in their area'
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 
    title: 'Receive Direct Enquiries', 
    description: 'Students contact you directly — simple, straightforward communication'
  },
  { 
    id: 4, 
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop', 
    title: 'Set Your Own Terms', 
    description: 'List your availability, prices, and preferences — you stay in control'
  }
];

export function InstructorBenefitsSection() {
  return (
    <section style={{ 
      background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
      padding: '3rem 0 3rem 0'
    }}>
      <div className="container mx-auto px-4">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
        <div className="fade-in flex flex-col text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight brand-name">
              Built for Driving Instructors
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Get found by local students searching for instructors in their area. Build trust with DVLA verification and receive enquiries directly.
            </p>
        </div>

          {/* Slideshow */}
          <div className="relative scale-in" style={{ animationDelay: '0.3s', marginBottom: '3rem' }}>
            <Slideshow slides={slides} height="24rem" />
          </div>

          {/* Content */}
          <div className="fade-in flex flex-col text-center">

            {/* Stats - Horizontal */}
            <div className="instructor-stats-grid">
              <div style={{ 
                background: '#f1f5f9',
                padding: '1.5rem',
                borderRadius: '0',
                flex: 1,
                maxWidth: '360px'
              }}>
                <p className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#111827' }}>DVLA Verification</p>
                <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
                  Build instant trust with verified credentials
                </p>
              </div>
              
              <div style={{ 
                background: '#f1f5f9',
                padding: '1.5rem',
                borderRadius: '0',
                flex: 1,
                maxWidth: '360px'
              }}>
                <p className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#111827' }}>Local Matching</p>
                <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
                  Students find you by area — no more long drives
                </p>
              </div>
              
              <div style={{ 
                background: '#f1f5f9',
                padding: '1.5rem',
                borderRadius: '0',
                flex: 1,
                maxWidth: '360px'
              }}>
                <p className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#111827' }}>Direct Enquiries</p>
                <p style={{ lineHeight: '1.6', color: '#4b5563' }}>
                  Connect directly with interested learners
                </p>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="instructor-cta" style={{ 
              marginTop: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <a 
                href="/auth" 
                style={{ 
                  display: 'inline-block',
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  background: '#1e40af',
                  color: 'white',
                  borderRadius: '0',
                  border: '2px solid #1e40af',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1e3a8a';
                  e.currentTarget.style.borderColor = '#1e3a8a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1e40af';
                  e.currentTarget.style.borderColor = '#1e40af';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Join as an Instructor
              </a>
              <p style={{ 
                fontSize: '0.9375rem', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Already registered? {' '}
                <a 
                  href="/auth" 
                  style={{ 
                    color: '#15803d', 
                    fontWeight: '600', 
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderBottomColor = '#15803d';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderBottomColor = 'transparent';
                  }}
                >
                  Sign in to your dashboard
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

