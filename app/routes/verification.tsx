import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function VerificationPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, background: '#fafafa' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          padding: '4rem 0',
          color: '#ffffff'
        }}>
          <div className="container mx-auto px-4 md:px-8">
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '1rem',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '-0.02em'
              }}>
                Our Verification Process
              </h1>
              <p style={{
                fontSize: '1.25rem',
                opacity: 0.95,
                lineHeight: '1.7'
              }}>
                How we keep Carank safe, secure, and trustworthy for everyone
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container mx-auto px-4 md:px-8">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              
              {/* Easy Process Summary */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '2rem',
                marginBottom: '2rem',
                borderRadius: '0',
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontSize: '1.75rem',
                      fontWeight: '700',
                      marginBottom: '0.75rem',
                      fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                      Simple & Seamless for You
                    </h2>
                    <p style={{
                      fontSize: '1.0625rem',
                      lineHeight: '1.7',
                      opacity: 0.95,
                      marginBottom: '1.25rem'
                    }}>
                      While our verification process is comprehensive, <strong>most of it happens automatically in the background</strong>. You only need to take action when absolutely necessary — usually just uploading your ID or providing basic information.
                    </p>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '0',
                      padding: '0.875rem 1rem',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>🎉</span>
                      <p style={{ margin: 0, fontSize: '0.9375rem', opacity: 0.95, lineHeight: '1.6' }}>
                        <strong>First-time only:</strong> These verification steps are mainly for your first booking. Once trust is established, future bookings require far fewer checks — making your experience even smoother.
                      </p>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '0',
                      padding: '1rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '0.75rem'
                      }}>
                        What You'll Experience:
                      </h3>
                      <ul style={{ 
                        margin: 0,
                        paddingLeft: '1.25rem',
                        fontSize: '0.9375rem',
                        lineHeight: '1.8',
                        opacity: 0.95
                      }}>
                        <li><strong>Quick setup:</strong> Create your account in minutes</li>
                        <li><strong>Automated checks:</strong> DVLA, Stripe, and identity verification happen instantly</li>
                        <li><strong>Minimal effort:</strong> Upload your ID once, and we handle the rest</li>
                        <li><strong>Real-time updates:</strong> Get notified when verification is complete</li>
                        <li><strong>Book immediately:</strong> Start making bookings while checks run in the background</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div style={{
                background: '#ffffff',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0'
              }}>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '1rem',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  Three-Layered Verification System
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: '#4b5563',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem'
                }}>
                  Every user on Carank goes through a comprehensive verification process. We combine automated checks with human review to ensure the highest standards of safety and authenticity.
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '0.5rem' }}>
                      Layer 1
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '600' }}>
                      Automated Identity Verification (Stripe)
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '0'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#15803d', marginBottom: '0.5rem' }}>
                      Layer 2
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: '600' }}>
                      DVLA Licence & Vehicle Checks
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '0'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400e', marginBottom: '0.5rem' }}>
                      Layer 3
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>
                      Human Admin Review & Approval
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor Verification */}
              <div style={{
                background: '#ffffff',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#1e40af',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: 0,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    Instructor Verification
                  </h3>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '0.75rem'
                  }}>
                    Step 1: Identity Verification via Stripe
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Government-issued ID:</strong> Passport or driving licence uploaded and verified</li>
                    <li><strong>Facial recognition:</strong> Live selfie matched against ID photo</li>
                    <li><strong>Document authentication:</strong> Stripe checks for tampering, forgery, and validity</li>
                    <li><strong>Real-time verification:</strong> Results processed within minutes</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#15803d',
                    marginBottom: '0.75rem'
                  }}>
                    Step 2: Driving Licence & Vehicle Verification (DVLA)
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Full UK driving licence:</strong> Must be valid and not expired</li>
                    <li><strong>DVLA database check:</strong> Real-time verification against government records</li>
                    <li><strong>Vehicle registration:</strong> Registration number, make, model, and colour verified</li>
                    <li><strong>Instructor responsibility:</strong> Must keep vehicle details up to date</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#92400e',
                    marginBottom: '0.75rem'
                  }}>
                    Step 3: Manual Admin Review
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Profile review:</strong> Admin team checks all submitted information for accuracy</li>
                    <li><strong>Background verification:</strong> Cross-reference credentials and details</li>
                    <li><strong>Quality standards:</strong> Ensure instructor meets Carank's professional standards</li>
                    <li><strong>Final approval:</strong> Only approved instructors can accept bookings</li>
                  </ul>
                </div>
              </div>

              {/* Student Verification */}
              <div style={{
                background: '#ffffff',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#15803d',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <polyline points="17 11 19 13 23 9"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: 0,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    Student Verification
                  </h3>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1e40af',
                    marginBottom: '0.75rem'
                  }}>
                    Step 1: Account Creation
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Email verification:</strong> Confirm valid email address</li>
                    <li><strong>Profile setup:</strong> Provide name, age range, and contact details</li>
                    <li><strong>Payment method:</strong> Add a valid payment card (Stripe-secured)</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#15803d',
                    marginBottom: '0.75rem'
                  }}>
                    Step 2: Provisional Licence Validation
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>DVLA database check:</strong> Provisional driving licence verified against government records</li>
                    <li><strong>Legal requirement:</strong> In the UK, it is a legal requirement to hold a valid provisional driving licence before taking driving lessons on public roads. Carank ensures all students meet this legal standard</li>
                    <li><strong>Eligibility confirmation:</strong> Must have a valid provisional licence to book lessons</li>
                    <li><strong>Document verification:</strong> Licence number and details validated in real time</li>
                    <li><strong>Pre-confirmation requirement:</strong> You can create a booking request immediately, but the booking remains pending until your provisional licence is validated. Only after successful validation can both parties officially agree and confirm the lesson</li>
                  </ul>
                </div>
              </div>

              {/* Booking System Verification */}
              <div style={{
                background: '#ffffff',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#7c3aed',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: 0,
                    fontFamily: "'Space Grotesk', sans-serif"
                  }}>
                    Booking System Verification
                  </h3>
                </div>

                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '0',
                  padding: '1.25rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: '#1e40af', fontSize: '0.9375rem', margin: 0, lineHeight: '1.7' }}>
                    <strong>Important:</strong> You can make a booking at any time, but final agreement requires both parties to be verified to Carank standards.
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#7c3aed',
                    marginBottom: '0.75rem'
                  }}>
                    Step 1: Initial Booking
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Student selects time:</strong> Choose available time</li>
                    <li><strong>Payment method required:</strong> Valid payment card must be on file (not charged yet)</li>
                    <li><strong>Booking created:</strong> System creates pending booking awaiting verification</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#7c3aed',
                    marginBottom: '0.75rem'
                  }}>
                    Step 2: Automated Verification Checks
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Instructor verification status:</strong> Confirmed all verification steps complete and approved</li>
                    <li><strong>Student licence check:</strong> Provisional licence validated via DVLA</li>
                    <li><strong>Payment method validation:</strong> Card verified and authorized (not charged)</li>
                    <li><strong>Vehicle verification:</strong> Instructor's vehicle details confirmed with DVLA</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#7c3aed',
                    marginBottom: '0.75rem'
                  }}>
                    Step 3: Mutual Agreement
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Instructor confirms:</strong> Instructor reviews and agrees to the booking</li>
                    <li><strong>Student confirms:</strong> Student reviews and agrees to the booking</li>
                    <li><strong>Both parties verified:</strong> System ensures all verification requirements met</li>
                    <li><strong>Booking confirmed:</strong> Only when both parties agree and all checks pass</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#7c3aed',
                    marginBottom: '0.75rem'
                  }}>
                    Step 4: Payment Protection
                  </h4>
                  <ul style={{ marginLeft: '1.5rem', color: '#4b5563', lineHeight: '1.8' }}>
                    <li><strong>Escrow-style holding:</strong> Payment secured upon final confirmation</li>
                    <li><strong>Lesson completion:</strong> Both parties confirm lesson took place</li>
                    <li><strong>Automatic release:</strong> Payment released to instructor after confirmation</li>
                    <li><strong>Dispute resolution:</strong> Admin team can intervene if issues arise</li>
                  </ul>
                </div>
              </div>

              {/* Why This Matters */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '2rem',
                color: '#ffffff',
                borderRadius: '0'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  Why This Matters
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      🛡️ Safety First
                    </div>
                    <p style={{ fontSize: '0.9375rem', opacity: 0.95, margin: 0, lineHeight: '1.6' }}>
                      Multiple layers of verification ensure you're meeting genuine, qualified instructors and students
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      ✅ Peace of Mind
                    </div>
                    <p style={{ fontSize: '0.9375rem', opacity: 0.95, margin: 0, lineHeight: '1.6' }}>
                      Know that everyone on the platform has been thoroughly vetted and approved
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      🔒 Secure Transactions
                    </div>
                    <p style={{ fontSize: '0.9375rem', opacity: 0.95, margin: 0, lineHeight: '1.6' }}>
                      Escrow-style payment protection means no risk of fraud or missed payments
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{
                textAlign: 'center',
                padding: '3rem 0 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.5rem',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>
                  Ready to Get Started?
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  maxWidth: '600px'
                }}>
                  Join Carank and experience the safest, most transparent way to book driving lessons
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href="/auth" className="btn btn-primary">
                    Get Started
                  </a>
                  <a href="/safeguarding" className="btn btn-secondary">
                    View Safeguarding Guidelines
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

