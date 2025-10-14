import { useEffect, useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function PortalRoute() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '3rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Welcome Section */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="brand-name" style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Welcome to Your Portal
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                    Manage your account and bookings
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem',
                fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
              }}>
                My Details
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  display: 'flex',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Email</p>
                    <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{user.email}</p>
                  </div>
                </div>

                {user.fullName && (
                  <div style={{
                    display: 'flex',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Full Name</p>
                      <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{user.fullName}</p>
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Account Type</p>
                    <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500', textTransform: 'capitalize' }}>{user.accountType}</p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div style={{
                    display: 'flex',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Phone</p>
                      <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {user.ageRange && (
                  <div style={{
                    display: 'flex',
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '0.5rem',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Age Range</p>
                      <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{user.ageRange}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coming Soon Section */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '3rem 2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1.5rem' }}>
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                More Features Coming Soon
              </h3>
              <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2rem' }}>
                We're working on adding booking management, payment methods, and more!
              </p>
            </div>

            {/* Logout Section */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem',
                fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
              }}>
                Account Actions
              </h2>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Log out
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}
        onClick={() => setShowLogoutConfirm(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Confirm Logout
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Are you sure you want to log out?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-primary"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

