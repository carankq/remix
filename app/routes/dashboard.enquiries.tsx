import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getUserFromSession } from "../session.server";

type Enquiry = {
  _id: string;
  instructorId: string;
  studentName: string;
  message: string;
  studentPhoneNumber: string;
  studentEmailAddress: string;
  postcode: string;
  gender: string;
  enquiryAsParent: boolean;
  archived: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type LoaderData = {
  enquiries: Enquiry[];
  totalEnquiries: number;
  newEnquiries: number;
  archivedEnquiries: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  // Redirect to auth if not authenticated
  if (!userSession) {
    return redirect('/auth');
  }
  
  try {
    const apiHost = process.env.API_HOST || 'http://localhost:3001';
    const url = new URL(request.url);
    const includeArchived = url.searchParams.get('includeArchived') === 'true';
    
    const response = await fetch(
      `${apiHost}/enquiries/mine?includeArchived=${includeArchived}`,
      {
        headers: {
          'Authorization': `Bearer ${userSession.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return redirect('/auth');
      }
      throw new Error('Failed to fetch enquiries');
    }
    
    const enquiries: Enquiry[] = await response.json();
    
    // Calculate stats
    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter(e => !e.archived).length;
    const archivedEnquiries = enquiries.filter(e => e.archived).length;
    
    return json<LoaderData>({
      enquiries,
      totalEnquiries,
      newEnquiries,
      archivedEnquiries
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return json<LoaderData>({
      enquiries: [],
      totalEnquiries: 0,
      newEnquiries: 0,
      archivedEnquiries: 0
    });
  }
}

export default function DashboardEnquiriesRoute() {
  const { enquiries, totalEnquiries, newEnquiries, archivedEnquiries } = useLoaderData<typeof loader>();

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
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{totalEnquiries}</div>
              </div>
              <div style={{
                background: 'white',
                border: '2px solid #2563eb',
                borderRadius: '0',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Active</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>{newEnquiries}</div>
              </div>
              <div style={{
                background: 'white',
                border: '2px solid #9ca3af',
                borderRadius: '0',
                padding: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Archived</div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#6b7280' }}>{archivedEnquiries}</div>
              </div>
            </div>

            {/* Enquiries List */}
            {enquiries.length === 0 ? (
              <div style={{
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  No Enquiries Yet
                </h3>
                <p style={{ color: '#6b7280' }}>
                  When students make enquiries, they'll appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {enquiries.map((enquiry) => (
                  <div 
                    key={enquiry._id}
                    style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      padding: '1.5rem',
                      opacity: enquiry.archived ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '600', 
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }}>
                          {enquiry.studentName}
                          {enquiry.enquiryAsParent && (
                            <span style={{
                              marginLeft: '0.5rem',
                              padding: '0.25rem 0.5rem',
                              background: '#fef3c7',
                              color: '#78350f',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              borderRadius: '0'
                            }}>
                              Parent
                            </span>
                          )}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span>📧</span>
                            <a href={`mailto:${enquiry.studentEmailAddress}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                              {enquiry.studentEmailAddress}
                            </a>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span>📱</span>
                            <a href={`tel:${enquiry.studentPhoneNumber}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                              {enquiry.studentPhoneNumber}
                            </a>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span>📍</span>
                            <span>{enquiry.postcode}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span>👤</span>
                            <span>{enquiry.gender}</span>
                          </div>
                        </div>
                      </div>
                      <span style={{
                        padding: '0.375rem 0.75rem',
                        background: enquiry.archived ? '#f3f4f6' : '#dbeafe',
                        color: enquiry.archived ? '#6b7280' : '#1e40af',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        borderRadius: '0',
                        textTransform: 'uppercase',
                        alignSelf: 'flex-start'
                      }}>
                        {enquiry.archived ? 'Archived' : 'Active'}
                      </span>
                    </div>
                    
                    {enquiry.message && (
                      <div style={{
                        background: '#f9fafb',
                        border: '2px solid #e5e7eb',
                        borderRadius: '0',
                        padding: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                          Message
                        </div>
                        <p style={{ 
                          color: '#374151',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          {enquiry.message}
                        </p>
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                        {new Date(enquiry.createdAt).toLocaleDateString('en-GB', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a 
                          href={`mailto:${enquiry.studentEmailAddress}`}
                          className="btn btn-primary" 
                          style={{ 
                            padding: '0.5rem 1rem', 
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            display: 'inline-block'
                          }}
                        >
                          Respond
                        </a>
                        {!enquiry.archived && (
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
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

