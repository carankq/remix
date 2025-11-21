import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

type BlogListItem = { 
  slug?: string; 
  title?: string; 
  summary?: string; 
  date?: string;
  author?: string;
  readTime?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  const api = `${base}/blogs?limit=*`;
  try {
    const res = await fetch(api, { 
      headers: { 
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      } 
    });
    const data = await res.json().catch(() => []);
    const rawItems: any[] = Array.isArray(data) ? data : (Array.isArray(data?.blogs) ? data.blogs : []);
    
    // Optimize: Trim summaries to reduce payload
    const items: BlogListItem[] = rawItems.map(item => ({
      slug: item.slug,
      title: item.title,
      summary: item.summary?.substring(0, 250), // Limit summary length
      date: item.date,
      author: item.author,
      readTime: item.readTime
    }));
    
    return json({ items }, {
      headers: {
        'Cache-Control': 'public, max-age=600, s-maxage=1800',
      }
    });
  } catch {
    return json({ items: [] as BlogListItem[] });
  }
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') || 'public, max-age=600',
  };
}

export default function BlogsIndexRoute() {
  const { items } = useLoaderData<typeof loader>();
  
  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '4rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h1 className="brand-name blog-title" style={{
                fontSize: '3.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Driving Insights & Tips
              </h1>
              <p style={{
                fontSize: '1.25rem',
                color: '#6b7280',
                lineHeight: '1.7',
                maxWidth: '42rem',
                margin: '0 auto'
              }}>
                Expert advice, tips, and stories to help you on your journey to becoming a confident driver
              </p>
            </div>
            
            {/* Blog Grid */}
            {items.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '0',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
                  No blog posts available at the moment. Check back soon!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {items.map((blog, i) => {
                  const title = String(blog.title || '').trim() || 'Untitled';
                  const slug = (blog.slug && String(blog.slug)) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const summary = blog.summary || '';
                  const date = blog.date ? new Date(blog.date).toLocaleDateString('en-GB', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : '';
                  
                  return (
                    <Link
                      key={slug + '-' + i}
                      to={`/blogs/${slug}`}
                      className="no-underline"
                      style={{
                        display: 'block',
                        background: 'white',
                        borderRadius: '0',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ padding: '2rem' }}>
                        {date && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            color: '#6b7280'
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            <span>{date}</span>
                          </div>
                        )}
                        
                        <h2 style={{
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '1rem',
                          lineHeight: '1.4'
                        }}>
                          {title}
                        </h2>
                        
                        {summary && (
                          <p style={{
                            fontSize: '1rem',
                            color: '#4b5563',
                            lineHeight: '1.7',
                            marginBottom: '1.5rem'
                          }}>
                            {summary.length > 150 ? summary.substring(0, 150) + '...' : summary}
                          </p>
                        )}
                        
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#2563eb',
                          fontWeight: '500',
                          fontSize: '0.95rem'
                        }}>
                          Read article
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


