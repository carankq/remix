import { useState } from 'react';
import { Link } from '@remix-run/react';

type FAQItem = { question: string; answer: string };

const studentFAQs: FAQItem[] = [
  { question: 'How do I find the right instructor?', answer: 'Use filters for location, transmission type, language, price range and see ratings to choose an instructor who fits your needs.' },
  { question: 'Can I learn in an automatic car?', answer: 'Yes. Filter by automatic and you will only see instructors who teach in automatic cars.' },
  { question: 'What does the hourly price include?', answer: 'Prices are set by instructors and typically include the car, fuel and insurance for the lesson duration.' },
  { question: 'How do I contact an instructor?', answer: 'Open an instructor profile and click Contact to call or email directly. You can also send a quick enquiry message.' },
];

const instructorFAQs: FAQItem[] = [
  { question: 'How do I receive new student leads?', answer: 'Students can contact you directly from your profile. You will also receive notifications for enquiries in your area.' },
  { question: 'What does a profile include?', answer: 'Add bio, services, coverage area, car type, hourly rates, availability and badges so students can evaluate you quickly.' },
  { question: 'Can I set my own prices and availability?', answer: 'Absolutely. You control your hourly rates, special offers and lesson availability.' },
  { question: 'Is there a fee to join?', answer: 'We offer a free basic listing. Premium options are available for increased visibility.' },
];

function AccordionItem({ item, index, active, onToggle }: { item: FAQItem; index: number; active: number | null; onToggle: (i: number) => void }) {
  const opened = active === index;
  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '0.75rem',
      marginBottom: '1rem',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      boxShadow: opened ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <button 
        onClick={() => onToggle(index)} 
        aria-expanded={opened}
        style={{
          width: '100%',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#111827'}
      >
        <span>{item.question}</span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          background: opened ? '#2563eb' : '#f3f4f6',
          color: opened ? 'white' : '#6b7280',
          transition: 'all 0.2s ease',
          transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div style={{
        maxHeight: opened ? '500px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease-in-out'
      }}>
        <div style={{ 
          padding: '0 1.75rem 1.5rem 1.75rem',
          fontSize: '1rem',
          lineHeight: '1.7',
          color: '#4b5563'
        }}>
          {item.answer}
        </div>
      </div>
    </div>
  );
}

function FAQGroup({ title, items }: { title: string; items: FAQItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggle = (i: number) => setActiveIndex(prev => prev === i ? null : i);
  return (
    <div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '1.5rem',
        fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
      }}>
        {title}
      </h3>
      <div>
        {items.map((item, index) => (
          <AccordionItem key={index} item={item} index={index} active={activeIndex} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}

export function FAQSection({ blogs }: { blogs: any[] }) {
  const [audience, setAudience] = useState<'students' | 'instructors'>('students');

  const isStudents = audience === 'students';

  return (
    <section style={{ background: '#f9fafb', padding: '5rem 0' }}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Blogs Section */}
          <div style={{ marginBottom: '5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
              <h2 className="brand-name" style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Latest Insights
              </h2>
              <Link 
                to="/blogs" 
                className="no-underline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2563eb',
                  transition: 'color 0.2s ease'
                }}
              >
                View all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {blogs.map((b: any) => {
                const title = b.title || b.name || 'Untitled';
                const slug = b.slug || b.id || String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const summary = b.summary || b.excerpt || b.description || '';
                return (
                  <div 
                    key={slug} 
                    style={{
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '1rem',
                      padding: '2rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '2rem' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '0.75rem',
                          lineHeight: '1.4'
                        }}>
                          {title}
                        </h3>
                        {summary && (
                          <p style={{
                            fontSize: '1rem',
                            color: '#6b7280',
                            lineHeight: '1.7',
                            margin: 0
                          }}>
                            {summary}
                          </p>
                        )}
                      </div>
                      <Link 
                        to={`/blogs/${slug}`}
                        className="no-underline"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          background: '#2563eb',
                          color: 'white',
                          borderRadius: '0.5rem',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          flexShrink: 0,
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#1d4ed8';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#2563eb';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        Read more
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="brand-name" style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Frequently Asked Questions
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '3rem',
              maxWidth: '42rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.7'
            }}>
              Find answers to common questions from students and instructors
            </p>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '3rem'
            }}>
              <div className="segmented">
                <button 
                  role="tab" 
                  aria-selected={isStudents} 
                  className={isStudents ? 'seg-item active' : 'seg-item'} 
                  onClick={() => setAudience('students')}
                >
                  For Students
                </button>
                <button 
                  role="tab" 
                  aria-selected={!isStudents} 
                  className={!isStudents ? 'seg-item active' : 'seg-item'} 
                  onClick={() => setAudience('instructors')}
                >
                  For Instructors
                </button>
              </div>
            </div>
            
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
              {isStudents ? (
                <FAQGroup title="For Students" items={studentFAQs} />
              ) : (
                <FAQGroup title="For Instructors" items={instructorFAQs} />
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}


