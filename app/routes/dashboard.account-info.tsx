import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getUserFromSession } from "../session.server";

interface LoaderData {
  serverUser: {
    id: string;
    email: string;
    accountType: string;
    fullName?: string;
    phoneNumber?: string;
    ageRange?: string;
    memberSince?: string;
  } | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  // Redirect to auth if not authenticated
  // The session cookie will be set by the AuthContext after login
  if (!userSession) {
    return redirect('/auth');
  }
  
  return json<LoaderData>({ 
    serverUser: userSession 
  });
}

export default function DashboardAccountInfoRoute() {
  const { serverUser } = useLoaderData<typeof loader>();
  
  // Use server data
  const user = serverUser || {
    id: '',
    email: '',
    accountType: 'Instructor',
    fullName: '',
    phoneNumber: '',
    ageRange: '',
    memberSince: ''
  };
  
  // Use memberSince from user data, or fall back to placeholder
  const joinDate = user.memberSince || "2024-01-01";

  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '3rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Account Information
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Manage your account details and preferences
              </p>
            </div>

            {/* Account Status */}
            <div style={{
              background: 'white',
              border: '2px solid #10b981',
              borderRadius: '0',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '0',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    Account Active
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Your account is active and ready to use
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '0',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                Personal Information
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    color: '#111827'
                  }}>
                    {user.fullName || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Email Address
                  </label>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    color: '#111827'
                  }}>
                    {user.email || 'Not provided'}
                  </div>
                </div>

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
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    color: '#111827'
                  }}>
                    {user.phoneNumber || 'Not provided'}
                  </div>
                </div>

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
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    color: '#111827'
                  }}>
                    {user.ageRange || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '0',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                Account Details
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    color: '#111827'
                  }}>
                    {user.accountType || 'Instructor'}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Member Since
                  </label>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0',
                    color: '#111827'
                  }}>
                    {new Date(joinDate).toLocaleDateString('en-GB', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary">
                Edit Information
              </button>
              <button style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e5e7eb',
                background: 'white',
                color: '#6b7280',
                borderRadius: '0',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}>
                Change Password
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

