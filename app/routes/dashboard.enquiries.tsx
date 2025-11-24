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
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '3px solid #3b82f6',
                borderRadius: '0',
                padding: '4rem 2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  📬
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#111827',
                  marginBottom: '0.75rem'
                }}>
                  No Enquiries Yet
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                  When students make enquiries, they'll appear here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {enquiries.map((enquiry, index) => (
                  <div 
                    key={enquiry._id}
                    style={{
                      background: enquiry.archived 
                        ? 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      border: 'none',
                      borderRadius: '0',
                      padding: '2rem',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!enquiry.archived) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    {/* Accent bar */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '6px',
                      background: enquiry.archived 
                        ? 'linear-gradient(180deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)'
                    }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: '250px' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '700', 
                            color: '#111827',
                            margin: 0
                          }}>
                            {enquiry.studentName}
                            {enquiry.enquiryAsParent && (
                              <span style={{ 
                                color: '#78350f',
                                fontSize: '1rem',
                                marginLeft: '0.5rem'
                              }}>
                                (Parent)
                              </span>
                            )}
                          </h3>
                        </div>
                        
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '0.75rem',
                          fontSize: '0.875rem'
                        }}>
                          <div style={{
                            background: 'rgba(59, 130, 246, 0.05)',
                            border: '2px solid #dbeafe',
                            borderRadius: '0',
                            padding: '0.625rem 0.875rem'
                          }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Email
                            </div>
                            <a href={`mailto:${enquiry.studentEmailAddress}`} style={{ 
                              color: '#2563eb', 
                              textDecoration: 'none',
                              fontWeight: '600',
                              wordBreak: 'break-word'
                            }}>
                              {enquiry.studentEmailAddress}
                            </a>
                          </div>
                          
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.05)',
                            border: '2px solid #d1fae5',
                            borderRadius: '0',
                            padding: '0.625rem 0.875rem'
                          }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Phone
                            </div>
                            <a href={`tel:${enquiry.studentPhoneNumber}`} style={{ 
                              color: '#059669', 
                              textDecoration: 'none',
                              fontWeight: '600'
                            }}>
                              {enquiry.studentPhoneNumber}
                            </a>
                          </div>
                          
                          <div style={{
                            background: 'rgba(139, 92, 246, 0.05)',
                            border: '2px solid #ede9fe',
                            borderRadius: '0',
                            padding: '0.625rem 0.875rem'
                          }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Location
                            </div>
                            <div style={{ color: '#7c3aed', fontWeight: '600' }}>
                              {enquiry.postcode}
                            </div>
                          </div>
                          
                          <div style={{
                            background: 'rgba(236, 72, 153, 0.05)',
                            border: '2px solid #fce7f3',
                            borderRadius: '0',
                            padding: '0.625rem 0.875rem'
                          }}>
                            <div style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Gender
                            </div>
                            <div style={{ color: '#db2777', fontWeight: '600' }}>
                              {enquiry.gender}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {enquiry.message && (
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        border: '3px solid #cbd5e1',
                        borderRadius: '0',
                        padding: '1.25rem',
                        marginBottom: '1.5rem',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '1rem',
                          background: '#64748b',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderRadius: '0'
                        }}>
                          Message
                        </div>
                        <p style={{ 
                          color: '#1e293b',
                          lineHeight: '1.7',
                          margin: 0,
                          fontSize: '0.9375rem'
                        }}>
                          "{enquiry.message}"
                        </p>
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      gap: '1rem',
                      paddingTop: '1rem',
                      borderTop: '2px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: enquiry.archived ? '#9ca3af' : '#10b981'
                        }} />
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                          {new Date(enquiry.createdAt).toLocaleDateString('en-GB', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <a 
                          href={`mailto:${enquiry.studentEmailAddress}`}
                          className="btn btn-primary" 
                          style={{ 
                            padding: '0.625rem 1.5rem', 
                            fontSize: '0.875rem',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '600',
                            borderRadius: '0'
                          }}
                        >
                          💌 Respond via Email
                        </a>
                        {!enquiry.archived && (
                          <button style={{
                            padding: '0.625rem 1.5rem',
                            fontSize: '0.875rem',
                            border: '2px solid #cbd5e1',
                            background: 'white',
                            color: '#475569',
                            borderRadius: '0',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f1f5f9';
                            e.currentTarget.style.borderColor = '#94a3b8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.borderColor = '#cbd5e1';
                          }}>
                            📦 Archive
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

