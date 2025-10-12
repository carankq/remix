import { useEffect, useState } from 'react';

const stories = [
  { id: 1, image: 'https://smallbusiness-production.s3.amazonaws.com/uploads/2021/09/Driving-instructor-pic.jpg?w=800&h=600&fit=crop', title: 'John passed first time!', description: 'After just 20 lessons with her instructor Michael' },
  { id: 2, image: 'https://wearegolding.com/wp-content/uploads/2023/04/How-can-driving-instructors-in-the-UK-manage-their-accounts-better.jpg?w=800&h=600&fit=crop', title: '500+ students passed this year', description: 'Our network of qualified instructors helping dreams come true' },
  { id: 3, image: 'https://img.freepik.com/premium-photo/female-driving-instructor-conducts-practical-lesson-with-female-student_533998-3418.jpg?w=800&h=600&fit=crop', title: 'John overcame his driving anxiety', description: 'With patient guidance from Emma, he now drives confidently' },
  { id: 4, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', title: 'Maria learned in her native language', description: 'Our multilingual instructors make learning accessible' }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % stories.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-start md:items-center">
          <div className="relative scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative h-96 md:h-112 rounded-2xl overflow-hidden shadow-2xl" tabIndex={0} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setCurrentSlide(p => (p - 1 + stories.length) % stories.length);
              if (e.key === 'ArrowRight') setCurrentSlide(p => (p + 1) % stories.length);
            }}>
              {stories.map((story, index) => (
                <div key={story.id} className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent, transparent)' }} />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                    <p className="text-lg opacity-90">{story.description}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setCurrentSlide(p => (p - 1 + stories.length) % stories.length)} aria-label="Previous slide" className="carousel-btn absolute left-4 top-half -translate-y-half">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => setCurrentSlide(p => (p + 1) % stories.length)} aria-label="Next slide" className="carousel-btn absolute right-4 top-half -translate-y-half">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="carousel-dots absolute bottom-6 right-6 flex items-center gap-2">
                {stories.map((_, index) => (
                  <button key={index} aria-label={`Go to slide ${index + 1}`} onClick={() => setCurrentSlide(index)} className={index === currentSlide ? 'indicator-dot active' : 'indicator-dot'} />
                ))}
              </div>
            </div>
          </div>
          <div className="fade-in flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Find Your Perfect <span className="text-blue-600">Driving Instructor</span></h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Connect with qualified, experienced driving instructors in your area. Use natural language or our smart filters to find the perfect match for your learning style.</p>
            <div className="flex flex-row gap-3">
              <div className="bg-white rounded-lg p-3 shadow-md flex-1"><p className="text-xl font-bold text-blue-600">500+</p><p className="text-sm text-gray-600">Students Passed</p></div>
              <div className="bg-white rounded-lg p-3 shadow-md flex-1"><p className="text-xl font-bold text-green-600">4.8★</p><p className="text-sm text-gray-600">Average Rating</p></div>
              <div className="bg-white rounded-lg p-3 shadow-md flex-1"><p className="text-xl font-bold text-purple-600">50+</p><p className="text-sm text-gray-600">Expert Instructors</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


