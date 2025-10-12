import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function HelpCenter() {
  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '4rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="brand-name" style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Help Center
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '3rem',
              lineHeight: '1.7'
            }}>
              Find answers to common questions and get support
            </p>
            
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                How can we help you?
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  For Students
                </h3>
                <ul style={{ color: '#4b5563', lineHeight: '2' }}>
                  <li>How do I search for driving instructors?</li>
                  <li>How do I contact an instructor?</li>
                  <li>Can I book lessons online?</li>
                  <li>What payment methods are accepted?</li>
                  <li>How do I leave a review?</li>
                </ul>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  For Instructors
                </h3>
                <ul style={{ color: '#4b5563', lineHeight: '2' }}>
                  <li>How do I create an instructor profile?</li>
                  <li>How do I manage my availability?</li>
                  <li>How do I receive student enquiries?</li>
                  <li>What are the pricing options?</li>
                  <li>How do I update my profile information?</li>
                </ul>
              </div>
              
              <div style={{
                background: '#eff6ff',
                borderRadius: '0.75rem',
                padding: '2rem',
                marginTop: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e40af',
                  marginBottom: '0.75rem'
                }}>
                  Still need help?
                </h3>
                <p style={{ color: '#3730a3', marginBottom: '1rem' }}>
                  Contact our support team and we'll get back to you within 24 hours.
                </p>
                <a 
                  href="mailto:support@carank.com"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.75rem 1.5rem',
                    background: '#2563eb',
                    color: 'white',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

