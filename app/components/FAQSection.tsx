import { useEffect, useState } from 'react';
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
    <div className="faq-item">
      <button className="faq-question" onClick={() => onToggle(index)} aria-expanded={opened}>
        <span>{item.question}</span>
        <span className={opened ? 'faq-icon rotated' : 'faq-icon'} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
      <div className={opened ? 'faq-answer open' : 'faq-answer'}>
        <p>{item.answer}</p>
      </div>
    </div>
  );
}

function FAQGroup({ title, items }: { title: string; items: FAQItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggle = (i: number) => setActiveIndex(prev => prev === i ? null : i);
  return (
    <div className="faq-group">
      <h3 className="faq-title">{title}</h3>
      <div className="faq-list">
        {items.map((item, index) => (
          <AccordionItem key={index} item={item} index={index} active={activeIndex} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}

export function FAQSection() {
  const [audience, setAudience] = useState<'students' | 'instructors'>('students');
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setBlogsLoading(true); setBlogsError(null);
      try {
        const res = await fetch(`/blogs/index.json`);
        const data = await res.json().catch(() => []);
        if (!cancelled) { setBlogs(Array.isArray(data) ? data.slice(0, 3) : []); }
      } catch { if (!cancelled) setBlogsError('Unable to load blogs.'); }
      finally { if (!cancelled) setBlogsLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const isStudents = audience === 'students';

  return (
    <section className="faq-section bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900">Blogs</h2>
            <Link to="/blogs" className="text-sm text-blue-600 no-underline hover:text-blue-700">View all</Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {blogsLoading && (<div className="px-4 py-3 text-sm text-gray-600">Loading blogs…</div>)}
            {blogsError && (<div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-t border-red-200">{blogsError}</div>)}
            {!blogsLoading && !blogsError && (
              <nav className="divide-y divide-gray-100">
                {blogs.map((b: any) => {
                  const title = b.title || b.name || 'Untitled';
                  const slug = b.slug || b.id || String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  const summary = b.summary || b.excerpt || b.description || '';
                  return (
                    <div key={slug} className="pr-4 py-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="capitalize text-gray-900">{title}</div>
                          {summary && (<div className="text-sm text-gray-600 mt-1">{summary}</div>)}
                        </div>
                        <Link to={`/blogs/${slug}`} className="no-underline inline-flex items-center text-sm text-blue-600 hover:underline flex-shrink-0">Read blog <span aria-hidden className="ml-1">→</span></Link>
                      </div>
                    </div>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        <h2 className="faq-heading text-gray-900">Helpful info for students and instructors</h2>
        <div className="segmented mb-6" role="tablist" aria-label="Audience selector">
          <button role="tab" aria-selected={isStudents} className={isStudents ? 'seg-item active' : 'seg-item'} onClick={() => setAudience('students')}>Students</button>
          <button role="tab" aria-selected={!isStudents} className={!isStudents ? 'seg-item active' : 'seg-item'} onClick={() => setAudience('instructors')}>Instructors</button>
        </div>
        <div className="grid gap-12">
          {isStudents ? (<FAQGroup title="For students" items={studentFAQs} />) : (<FAQGroup title="For instructors" items={instructorFAQs} />)}
        </div>
      </div>
    </section>
  );
}


