import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function AuthRoute() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'student' | 'instructor' | 'account_type'>('instructor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  // Handle mode switching with animation
  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    if (newMode === mode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setError(null); // Clear any errors when switching
      setIsTransitioning(false);
    }, 150); // Half of the transition duration
  };

  useEffect(() => {
    // if (isAuthenticated) {
    //   navigate('/');
    // }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!phoneNumber.trim() || !ageRange.trim()) {
        setError('Please provide your phone number and age range.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup({
          email,
          password,
          accountType: role as 'student' | 'instructor',
          phoneNumber,
          ageRange,
          fullName
        });
      }
      // Use window.location for full page reload to ensure cookie is sent
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="auth-main" style={{ 
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '1.5rem 0',
        display: 'flex',
        alignItems: 'center'
      }}>
        {/* */}
        <div className="mx-auto px-4 md:px-8 container auth-container" style={{ width: '100%', }}>
          <div className="auth-wrapper">
            
            {/* Auth Card */}
            <div style={{
              background: 'white',
              borderRadius: '0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}
            className="auth-card">
              
              {/* Tab Switcher */}
              <div className="auth-tab-switcher" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#f9fafb',
                padding: '0.5rem',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => handleModeSwitch('login')}
                  disabled={isSubmitting || isTransitioning}
                  style={{
                    padding: '1rem',
                    borderRadius: '0',
                    border: 'none',
                    background: isLogin ? 'white' : 'transparent',
                    color: isLogin ? '#111827' : '#6b7280',
                    fontWeight: isLogin ? '600' : '500',
                    fontSize: '1rem',
                    cursor: (isSubmitting || isTransitioning) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isLogin ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Log in
                </button>
                <button
                  onClick={() => handleModeSwitch('signup')}
                  disabled={isSubmitting || isTransitioning}
                  style={{
                    padding: '1rem',
                    borderRadius: '0',
                    border: 'none',
                    background: !isLogin ? 'white' : 'transparent',
                    color: !isLogin ? '#111827' : '#6b7280',
                    fontWeight: !isLogin ? '600' : '500',
                    fontSize: '1rem',
                    cursor: (isSubmitting || isTransitioning) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: !isLogin ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  Sign up
                </button>
              </div>

              {/* Form Content */}
              <div className="auth-form-content" style={{ 
                padding: '2.5rem',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#111827',
                  marginBottom: '0.5rem',
                  fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
                }}>
                  {isLogin ? 'Welcome back' : 'Sign up'}
                </h2>
                <p style={{
                  color: '#6b7280',
                  marginBottom: '2rem',
                  fontSize: '0.95rem'
                }}>
                  {isLogin ? 'Sign in to your account to continue' : 'Sign up to get started with Carank'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className={`auth-form ${isLogin ? 'login-form' : 'signup-form'}`}>
                  
                  {/* Account Type (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Account Type
                      </label>
                      <div className="relative">
                        <span style={{ 
                          position: 'absolute', 
                          left: '1rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          zIndex: 1
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </span>
                        <input
                          type="text"
                          value="Instructor"
                          disabled
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            fontSize: '1rem',
                            color: '#111827',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            background: '#f9fafb',
                            cursor: 'not-allowed'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Full Name (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Full Name
                      </label>
                      <div className="relative">
                        <span style={{ 
                          position: 'absolute', 
                          left: '1rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          zIndex: 1
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </span>
                        <input 
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Enter your full name"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            fontSize: '1rem',
                            color: '#111827',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            background: '#f9fafb'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#93c5fd';
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Email
                    </label>
                    <div className="relative">
                      <span style={{ 
                        position: 'absolute', 
                        left: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </span>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Enter your email"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3rem',
                          fontSize: '1rem',
                          color: '#111827',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          background: '#f9fafb'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#93c5fd';
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.background = '#f9fafb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Password
                    </label>
                    <div className="relative">
                      <span style={{ 
                        position: 'absolute', 
                        left: '1rem', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        zIndex: 1
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </span>
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Enter your password"
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3rem',
                          fontSize: '1rem',
                          color: '#111827',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          background: '#f9fafb'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#93c5fd';
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.background = '#f9fafb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <span style={{ 
                          position: 'absolute', 
                          left: '1rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          zIndex: 1
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                        </span>
                        <input 
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isSubmitting}
                          placeholder="Enter your number"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            fontSize: '1rem',
                            color: '#111827',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            background: '#f9fafb'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#93c5fd';
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Age Range (Signup only) */}
                  {!isLogin && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Age Range
                      </label>
                      <div className="relative">
                        <span style={{ 
                          position: 'absolute', 
                          left: '1rem', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          zIndex: 1
                        }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                        </span>
                        <select
                          value={ageRange}
                          onChange={(e) => setAgeRange(e.target.value)}
                          disabled={isSubmitting}
                          style={{
                            width: '100%',
                            padding: '0.75rem 3rem 0.75rem 3rem',
                            fontSize: '1rem',
                            color: ageRange ? '#111827' : '#9ca3af',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            appearance: 'none'
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = '#93c5fd';
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.background = '#f9fafb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <option value="">Select age range</option>
                          <option value="17-20">17-20</option>
                          <option value="21-25">21-25</option>
                          <option value="26-30">26-30</option>
                          <option value="31-40">31-40</option>
                          <option value=">40">40+</option>
                        </select>
                        <svg 
                          width="18" 
                          height="18" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="#9ca3af" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none'
                          }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div style={{
                      padding: '0.75rem 1rem',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '0',
                      color: '#dc2626',
                      fontSize: '0.875rem'
                    }}>
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner" style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '0',
                          animation: 'spin 0.6s linear infinite'
                        }} />
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </>
                    ) : (
                      isLogin ? 'Log in' : 'Sign up'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
