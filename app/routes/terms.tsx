import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function TermsOfService() {
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
              Terms of Service
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
                  Agreement to Terms
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  By accessing or using the Carank platform, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of the terms, you may not access the service.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Use of Service
                </h2>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  marginTop: '1.5rem'
                }}>
                  For Students
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  Students may use the platform to search for, contact, and book lessons with driving instructors. 
                  You agree to:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Provide accurate and complete information</li>
                  <li>Treat instructors with respect and professionalism</li>
                  <li>Comply with payment terms agreed with instructors</li>
                  <li>Not use the platform for any unlawful purpose</li>
                </ul>
                
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.75rem',
                  marginTop: '1.5rem'
                }}>
                  For Instructors
                </h3>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  Instructors may create profiles and receive enquiries from students. You agree to:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li>Maintain valid driving instructor qualifications and insurance</li>
                  <li>Provide accurate information about your services</li>
                  <li>Respond to student enquiries in a timely manner</li>
                  <li>Maintain professional standards in all interactions</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Account Registration
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  To access certain features, you may need to register for an account. You are responsible for:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Payments and Fees
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8', marginBottom: '1rem' }}>
                  Payment arrangements are made directly between students and instructors. Carank may charge 
                  instructors a subscription fee or commission for premium features.
                </p>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  All fees are non-refundable unless otherwise stated. We reserve the right to modify our 
                  pricing structure with 30 days' notice.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Intellectual Property
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  The Carank platform, including all content, features, and functionality, is owned by Carank 
                  and protected by copyright, trademark, and other intellectual property laws.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Limitation of Liability
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  Carank acts as a platform connecting students with instructors. We are not responsible for:
                </p>
                <ul style={{ color: '#4b5563', lineHeight: '2', paddingLeft: '1.5rem' }}>
                  <li>The quality or safety of driving instruction</li>
                  <li>Disputes between students and instructors</li>
                  <li>Any injuries or damages arising from driving lessons</li>
                  <li>Instructor qualifications or insurance (though we encourage verification)</li>
                </ul>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Termination
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  We may terminate or suspend your account at any time for violations of these terms or for any 
                  other reason. You may cancel your account at any time by contacting us.
                </p>
              </section>
              
              <section style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  Changes to Terms
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.8' }}>
                  We reserve the right to modify these terms at any time. We will notify users of significant 
                  changes via email or through the platform. Continued use after changes constitutes acceptance.
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
                  For questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:legal@carank.com" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                    legal@carank.com
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

