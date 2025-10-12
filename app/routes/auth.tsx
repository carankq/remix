import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function AuthRoute() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const isLogin = mode === 'login';

  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '80vh',
        background: '#f9fafb',
        padding: '4rem 0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
            
            {/* Auth Card */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              overflow: 'hidden'
            }}>
              
              {/* Tab Switcher */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#f9fafb',
                padding: '0.5rem',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setMode('login')}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: isLogin ? 'white' : 'transparent',
                    color: isLogin ? '#111827' : '#6b7280',
                    fontWeight: isLogin ? '600' : '500',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('signup')}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: !isLogin ? 'white' : 'transparent',
                    color: !isLogin ? '#111827' : '#6b7280',
                    fontWeight: !isLogin ? '600' : '500',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: !isLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Content */}
              <div style={{ padding: '3rem', minHeight: '550px' }}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h1 className="brand-name" style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h1>
                  <p style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {isLogin 
                      ? 'Sign in to access your account' 
                      : 'Join Carank and start your driving journey'}
                  </p>
                </div>

                {/* Role Selection for Signup - Moved to top */}
                {!isLogin && (
                  <div style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: '#eff6ff',
                    borderRadius: '0.75rem'
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '1rem'
                    }}>
                      I want to join as:
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <label style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'white',
                        border: '2px solid #2563eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#2563eb'
                      }}>
                        <input type="radio" name="role" value="student" defaultChecked style={{ display: 'none' }} />
                        🎓 Student
                      </label>
                      <label style={{
                        flex: 1,
                        padding: '1rem',
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#6b7280'
                      }}>
                        <input type="radio" name="role" value="instructor" style={{ display: 'none' }} />
                        🚗 Instructor
                      </label>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  {!isLogin && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563eb';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#667eea';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {!isLogin && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '0.5rem'
                      }}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        style={{
                          width: '100%',
                          padding: '0.875rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2563eb';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  )}

                  {isLogin && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginTop: '-0.5rem'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        cursor: 'pointer'
                      }}>
                        <input type="checkbox" style={{ width: '1rem', height: '1rem' }} />
                        Remember me
                      </label>
                      <a 
                        href="#"
                        style={{
                          fontSize: '0.875rem',
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {!isLogin && (
                    <label style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '0.75rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      cursor: 'pointer',
                      lineHeight: '1.5'
                    }}>
                      <input type="checkbox" style={{ width: '1rem', height: '1rem', marginTop: '0.125rem' }} />
                      <span>
                        I agree to the{' '}
                        <a href="/terms" style={{ color: '#2563eb', textDecoration: 'none' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy-policy" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy Policy</a>
                      </span>
                    </label>
                  )}

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginTop: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1d4ed8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


