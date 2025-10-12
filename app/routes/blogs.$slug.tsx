import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { markdownToHtml } from "../utils/markdown.server";

type BlogPost = {
  title: string;
  summary?: string;
  date?: string;
  author?: string;
  htmlContent: string;
  slug: string;
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = String(params.slug || "");
  const url = new URL(request.url);
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  
  try {
    const res = await fetch(`${base}/blogs/${encodeURIComponent(slug)}`, { 
      headers: { Accept: 'application/json' } 
    });
    
    if (!res.ok) {
      throw new Error('Blog not found');
    }
    
    const data = await res.json().catch(() => ({}));
    
    // Extract markdown content from API response
    const markdown: string = data?.markdown || data?.content || data?.md || '';
    const title: string = data?.title || slug.replace(/-/g, ' ');
    const summary: string = data?.summary || '';
    const date: string = data?.date || '';
    const author: string = data?.author || '';
    
    // Convert markdown to HTML server-side
    const htmlContent = markdownToHtml(markdown);
    
    const blog: BlogPost = {
      title,
      summary,
      date,
      author,
      htmlContent,
      slug
    };
    
    return json({ blog });
  } catch (error) {
    // Return a 404-style blog post
    const blog: BlogPost = {
      title: 'Blog Post Not Found',
      summary: '',
      date: '',
      author: '',
      htmlContent: '<p>The blog post you are looking for could not be found.</p>',
      slug
    };
    return json({ blog }, { status: 404 });
  }
}

export default function BlogSlugRoute() {
  const { blog } = useLoaderData<typeof loader>();
  
  const formattedDate = blog.date ? new Date(blog.date).toLocaleDateString('en-GB', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '';
  
  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '4rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Back Button */}
            <Link 
              to="/blogs"
              className="no-underline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6b7280',
                fontSize: '0.95rem',
                marginBottom: '2rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to all articles
            </Link>
            
            {/* Article Header */}
            <header style={{
              background: 'white',
              borderRadius: '1rem 1rem 0 0',
              padding: '3rem 3rem 2rem 3rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h1 className="brand-name" style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                {blog.title}
              </h1>
              
              {blog.summary && (
                <p style={{
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem'
                }}>
                  {blog.summary}
                </p>
              )}
              
              {/* Meta Information */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap',
                fontSize: '0.95rem',
                color: '#6b7280'
              }}>
                {formattedDate && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{formattedDate}</span>
                  </div>
                )}
                
                {blog.author && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{blog.author}</span>
                  </div>
                )}
              </div>
            </header>
            
            {/* Article Content */}
            <article
              style={{
                background: 'white',
                borderRadius: '0 0 1rem 1rem',
                padding: '3rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
            />
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


