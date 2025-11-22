import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getUserFromSession } from "../session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  // Redirect to auth if not authenticated
  // The session cookie will be set by the AuthContext after login
  if (!userSession) {
    return redirect('/auth');
  }
  
  return json({});
}

export default function DashboardEnquiriesRoute() {
  // Mock enquiries data
  const enquiries = [
    {
      id: 1,
      studentName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "07700 900123",
      message: "Hi, I'm interested in booking lessons in the Manchester area. I'm a complete beginner.",
      date: "2024-01-15",
      status: "new"
    },
    {
      id: 2,
      studentName: "James Williams",
      email: "j.williams@email.com",
      phone: "07700 900456",
      message: "Looking for intensive course lessons. I have my test booked for next month.",
      date: "2024-01-14",
      status: "responded"
    },
    {
      id: 3,
      studentName: "Emily Brown",
      email: "emily.brown@email.com",
      phone: "07700 900789",
      message: "Do you offer refresher lessons for experienced drivers?",
      date: "2024-01-13",
      status: "responded"
    }
  ];

  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '3rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Enquiries
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Manage your student enquiries and respond to messages
              </p>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Total Enquiries</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>3</div>
              </div>
              <div style={{
                background: 'white',
                border: '2px solid #2563eb',
                borderRadius: '0',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>New</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>1</div>
              </div>
              <div style={{
                background: 'white',
                border: '2px solid #10b981',
                borderRadius: '0',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Responded</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>2</div>
              </div>
            </div>

            {/* Enquiries List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {enquiries.map((enquiry) => (
                <div 
                  key={enquiry.id}
                  style={{
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        color: '#111827',
                        marginBottom: '0.25rem'
                      }}>
                        {enquiry.studentName}
                      </h3>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>{enquiry.email}</span>
                        <span>{enquiry.phone}</span>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      background: enquiry.status === 'new' ? '#dbeafe' : '#d1fae5',
                      color: enquiry.status === 'new' ? '#1e40af' : '#065f46',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '0',
                      textTransform: 'uppercase'
                    }}>
                      {enquiry.status}
                    </span>
                  </div>
                  
                  <p style={{ 
                    color: '#374151', 
                    marginBottom: '1rem',
                    lineHeight: '1.6'
                  }}>
                    {enquiry.message}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      {new Date(enquiry.date).toLocaleDateString('en-GB', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                        Respond
                      </button>
                      <button style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        border: '2px solid #e5e7eb',
                        background: 'white',
                        color: '#6b7280',
                        borderRadius: '0',
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}>
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

