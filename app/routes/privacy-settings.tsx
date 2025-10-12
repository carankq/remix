import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function PrivacySettings() {
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
              Privacy Settings
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '3rem',
              lineHeight: '1.7'
            }}>
              Manage your privacy preferences and data settings
            </p>
            
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Cookie Preferences
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.7', marginBottom: '1rem' }}>
                  We use cookies to improve your experience on our site. You can manage your cookie preferences below.
                </p>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" defaultChecked disabled style={{ width: '1.25rem', height: '1.25rem' }} />
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>Essential Cookies</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Required for the website to function</div>
                  </div>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem' }} />
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>Analytics Cookies</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Help us understand how you use our site</div>
                  </div>
                </label>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem' }} />
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>Marketing Cookies</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Used to show relevant advertisements</div>
                  </div>
                </label>
              </div>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Data Management
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.7', marginBottom: '1rem' }}>
                  You have the right to access, correct, or delete your personal data.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Download My Data
                  </button>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Delete My Account
                  </button>
                </div>
              </div>
              
              <button style={{
                padding: '0.875rem 2rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer'
              }}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

