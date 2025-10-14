import { Link } from "@remix-run/react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
      borderTop: '1px solid #e5e7eb',
      padding: '4rem 0 2rem 0'
    }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Footer Content */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            
            {/* Brand & Tagline */}
            <div>
              <Link to="/" className="no-underline">
                <h3 className="brand-name" style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Carank
                </h3>
              </Link>
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.7',
                marginBottom: '1.5rem',
                maxWidth: '280px'
              }}>
                Helping students connect with brilliant driving instructors.
              </p>
              
              {/* Location & Language Selector */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: '#f3f4f6',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#4b5563',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span style={{ fontWeight: '500' }}>United Kingdom · English (UK)</span>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.25rem',
                fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
              }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Find Instructors', to: '/results' },
                  { label: 'How it Works', to: '/#how-it-works' },
                  { label: 'Blogs & Insights', to: '/blogs' },
                  { label: 'Contact Us', to: '/contact' }
                ].map((link) => (
                  <li key={link.to} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      to={link.to}
                      className="no-underline"
                      style={{
                        color: '#6b7280',
                        fontSize: '0.95rem',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal & Support */}
            <div>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.25rem',
                fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
              }}>
                Support & Legal
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Help Center', to: '/help' },
                  { label: 'Privacy Settings', to: '/privacy-settings' },
                  { label: 'Cookie Policy', to: '/cookie-policy' },
                  { label: 'Privacy Policy', to: '/privacy-policy' },
                  { label: 'Terms of Service', to: '/terms' }
                ].map((link) => (
                  <li key={link.to} style={{ marginBottom: '0.75rem' }}>
                    <Link 
                      to={link.to}
                      className="no-underline"
                      style={{
                        color: '#6b7280',
                        fontSize: '0.95rem',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
          
          {/* Bottom Bar */}
          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              {[
                { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={`#${social.name.toLowerCase()}`}
                  aria-label={social.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={social.icon}/>
                  </svg>
                </a>
              ))}
            </div>
            
            {/* Copyright */}
            <p style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              textAlign: 'center',
              margin: 0
            }}>
              © Carank {currentYear}. All rights reserved. Built with care for driving instructors and students.
            </p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}


