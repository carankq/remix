import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function CookiePolicy() {
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
              Cookie Policy
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '3rem',
              lineHeight: '1.7'
            }}>
              Last updated: January 2025
            </p>
            
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  What Are Cookies?
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  How We Use Cookies
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  We use cookies for several purposes:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
                  <li><strong>Performance Cookies:</strong> These help us understand how visitors interact with our website</li>
                  <li><strong>Functional Cookies:</strong> These enable enhanced functionality and personalization</li>
                  <li><strong>Targeting Cookies:</strong> These are used to deliver relevant advertisements</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Managing Cookies
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  You can control and manage cookies in various ways. Please note that removing or blocking cookies 
                  can impact your user experience and some functionality may no longer be available.
                </p>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  Most browsers automatically accept cookies, but you can modify your browser settings to decline 
                  cookies if you prefer. Visit your browser's help section for instructions.
                </p>
              </section>
              
              <section>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Contact Us
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  If you have any questions about our use of cookies, please contact us at{' '}
                  <a href="mailto:privacy@carank.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    privacy@carank.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

