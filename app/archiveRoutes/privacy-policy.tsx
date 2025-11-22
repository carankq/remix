import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function PrivacyPolicy() {
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
              Privacy Policy
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
                  Introduction
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  At Carank, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                  disclose, and safeguard your information when you use our platform to connect students with 
                  driving instructors.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Information We Collect
                </h2>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  marginTop: '1.5rem'
                }}>
                  Personal Information
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  We collect information that you provide directly to us, including:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Name, email address, and phone number</li>
                  <li>Location and postal code</li>
                  <li>Profile information for instructors (qualifications, experience, etc.)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  marginTop: '1.5rem'
                }}>
                  Automatically Collected Information
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  We automatically collect certain information when you use our platform, including IP address, 
                  browser type, device information, and usage data.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  How We Use Your Information
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  We use the information we collect to:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li>Connect students with suitable driving instructors</li>
                  <li>Process bookings and payments</li>
                  <li>Communicate with you about our services</li>
                  <li>Improve and personalize your experience</li>
                  <li>Ensure the security and integrity of our platform</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Data Sharing and Disclosure
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li>Driving instructors (when you make an enquiry or booking)</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Law enforcement when required by law</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Your Rights
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  You have the right to:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Data Security
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  We implement appropriate technical and organizational measures to protect your personal information. 
                  However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
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
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@carank.com" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
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

