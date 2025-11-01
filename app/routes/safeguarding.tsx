import { Link } from '@remix-run/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Safeguarding() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v4"/>
              <path d="M12 16h.01"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '1rem' }}>
            Safeguarding & Safety
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
            Your safety is our priority. Please read this important information before your first lesson.
          </p>
        </div>

        {/* General Safety Section */}
        <section style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>
              Meeting a Stranger for the First Time
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Share your plans:</strong> Always inform a trusted friend or family member about your lesson, including the time, location, and instructor/student details.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Meet in a public place:</strong> Arrange to meet in a well-lit, public area with other people around.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Keep your phone charged:</strong> Ensure your mobile phone is fully charged and accessible at all times.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Trust your instincts:</strong> If something feels wrong or uncomfortable, you have every right to politely decline and leave.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Don't share personal details:</strong> Avoid sharing sensitive personal information beyond what's necessary for the lesson.
              </p>
            </div>
          </div>
        </section>

        {/* Student Safety Section */}
        <section style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>
              For Students
            </h2>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #fecaca',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b', margin: '0 0 0.5rem 0' }}>
                  Critical: You MUST have your Provisional Driving Licence
                </h3>
                <p style={{ margin: 0, color: '#7f1d1d', lineHeight: '1.6' }}>
                  It is a legal requirement to hold a valid provisional driving licence before taking driving lessons on public roads. Have it with you at all times during lessons.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Verify instructor's licence:</strong> The instructor MUST show you their full and complete driving licence with their name clearly visible. If they cannot or will not show you this, politely decline the lesson and report it to Carank immediately.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Check the vehicle:</strong> Verify that the vehicle matches the one shown in the instructor's portal profile (make, model, colour, registration). If it doesn't match, <strong style={{ color: '#dc2626' }}>DO NOT enter the vehicle</strong>, regardless of any excuse. Report this to Carank via the admin portal.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Vehicle safety check:</strong> Before entering the vehicle, ensure it appears roadworthy, clean, and has dual controls fitted.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Check instructor details:</strong> Confirm the instructor's name matches the one in your booking confirmation and their driving licence.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Set boundaries:</strong> You have the right to refuse any request that makes you uncomfortable during a lesson.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Know the lesson plan:</strong> Discuss the lesson route and objectives before starting. If the instructor deviates significantly without explanation, ask questions.
              </p>
            </div>
          </div>
        </section>

        {/* Instructor Safety Section */}
        <section style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '600', color: '#1a202c', margin: 0 }}>
              For Instructors
            </h2>
          </div>

          <div style={{
            background: '#fef2f2',
            border: '2px solid #fecaca',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b', margin: '0 0 0.5rem 0' }}>
                  Critical: You MUST have a Full UK Driving Licence
                </h3>
                <p style={{ margin: 0, color: '#7f1d1d', lineHeight: '1.6' }}>
                  It is a legal requirement to hold a full and complete UK driving licence to provide driving instruction. You must be able to show this to students at the start of each lesson.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Verify student's provisional licence:</strong> Check that the student has a valid provisional driving licence with their name clearly visible. If they don't have it, you cannot legally proceed with the lesson. Politely explain this and reschedule.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Show your credentials:</strong> Be prepared to show your full driving licence and explain your qualifications at the start of the first lesson.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Use the correct vehicle:</strong> Always use the vehicle registered on your Carank instructor profile. If you need to use a different vehicle, update your profile first and notify the student in advance.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Maintain professionalism:</strong> Keep all interactions professional and appropriate. Avoid personal topics that could make the student uncomfortable.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Keep records:</strong> Document any safety concerns or incidents during lessons and report them to Carank if necessary.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
              <div style={{ minWidth: '24px', marginTop: '0.125rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.7' }}>
                <strong>Vehicle maintenance:</strong> Ensure your vehicle is roadworthy, clean, properly insured, and has functioning dual controls.
              </p>
            </div>
          </div>
        </section>

        {/* Reporting Section */}
        <section style={{
          background: '#fffbeb',
          border: '2px solid #fbbf24',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
            <div style={{
              minWidth: '48px',
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#92400e', margin: '0 0 1rem 0' }}>
                When to Report to Carank
              </h3>
              <p style={{ color: '#78350f', lineHeight: '1.7', marginBottom: '1rem' }}>
                You have a <strong>responsibility to report</strong> any of the following situations via the admin portal (or contact us directly if urgent):
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold', minWidth: '20px' }}>•</span>
                  <span style={{ color: '#78350f' }}>Missing or incorrect identification documents (licence not matching the name, expired licence, or refusal to show documentation)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold', minWidth: '20px' }}>•</span>
                  <span style={{ color: '#78350f' }}>Vehicle does not match the one registered on the instructor's profile</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold', minWidth: '20px' }}>•</span>
                  <span style={{ color: '#78350f' }}>Inappropriate behavior or comments from either party</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold', minWidth: '20px' }}>•</span>
                  <span style={{ color: '#78350f' }}>Safety concerns about the vehicle's condition</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold', minWidth: '20px' }}>•</span>
                  <span style={{ color: '#78350f' }}>Feeling uncomfortable, threatened, or unsafe at any point</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
                  <span style={{ color: '#d97706', fontWeight: 'bold', minWidth: '20px' }}>•</span>
                  <span style={{ color: '#78350f' }}>Any other safeguarding concerns</span>
                </li>
              </ul>
              <p style={{ color: '#78350f', lineHeight: '1.7', marginTop: '1rem', fontWeight: '500' }}>
                <strong>Remember:</strong> It is always better to report something and be cautious than to ignore a potential safety issue. Your wellbeing and safety come first.
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section style={{
          background: '#fef2f2',
          border: '2px solid #fca5a5',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
            <div style={{
              minWidth: '48px',
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#991b1b', margin: '0 0 1rem 0' }}>
                In an Emergency
              </h3>
              <p style={{ color: '#7f1d1d', lineHeight: '1.7', marginBottom: '0.75rem' }}>
                If you feel you are in immediate danger or witness dangerous behavior:
              </p>
              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fca5a5' }}>
                <p style={{ color: '#991b1b', fontWeight: '600', fontSize: '1.125rem', margin: '0 0 0.5rem 0' }}>
                  📞 Call 999 (Emergency Services)
                </p>
                <p style={{ color: '#7f1d1d', margin: 0, fontSize: '0.9375rem' }}>
                  For non-urgent police matters, call 101. Always prioritize your safety first.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1rem',
          padding: '2.5rem',
          textAlign: 'center',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
            Questions or Concerns?
          </h3>
          <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', opacity: 0.95 }}>
            If you have any questions about these safeguarding guidelines, please don't hesitate to contact us.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2rem',
                background: 'white',
                color: '#667eea',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'transform 0.2s'
              }}
            >
              Contact Us
            </Link>
            <Link
              to="/portal"
              style={{
                display: 'inline-block',
                padding: '0.875rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'transform 0.2s'
              }}
            >
              Go to Portal
            </Link>
          </div>
        </div>

        {/* Final Note */}
        <div style={{ textAlign: 'center', color: '#718096', fontSize: '0.9375rem', lineHeight: '1.6' }}>
          <p style={{ margin: 0 }}>
            By using Carank's services, you acknowledge that you have read and understood these safeguarding guidelines.
          </p>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            Last updated: November 2024
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

