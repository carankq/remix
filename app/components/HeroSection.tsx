import { useEffect, useState } from 'react';

const stories = [
  { id: 1, image: 'https://smallbusiness-production.s3.amazonaws.com/uploads/2021/09/Driving-instructor-pic.jpg?w=800&h=600&fit=crop', title: 'John passed first time!', description: 'After just 20 lessons with her instructor Michael' },
  { id: 2, image: 'https://wearegolding.com/wp-content/uploads/2023/04/How-can-driving-instructors-in-the-UK-manage-their-accounts-better.jpg?w=800&h=600&fit=crop', title: '500+ students passed this year', description: 'Our network of qualified instructors helping dreams come true' },
  { id: 3, image: 'https://img.freepik.com/premium-photo/female-driving-instructor-conducts-practical-lesson-with-female-student_533998-3418.jpg?w=800&h=600&fit=crop', title: 'John overcame his driving anxiety', description: 'With patient guidance from Emma, he now drives confidently' },
  { id: 4, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', title: 'Maria learned in her native language', description: 'Our multilingual instructors make learning accessible' }
];

const phrases = [
  { prefix: 'Expert', word: 'Guidance' },
  { prefix: 'Professional', word: 'Knowledge' },
  { prefix: 'Dedicated', word: 'Proficiency' },
  { prefix: 'Personalised', word: 'Support' },
  { prefix: 'Quality', word: 'Instruction' },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Slideshow effect
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % stories.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  
  // Typing animation effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const fullText = `${currentPhrase.prefix} ${currentPhrase.word}`;
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 500;
    
    if (!isDeleting && displayedText === fullText) {
      // Pause before starting to delete
      const timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      return () => clearTimeout(timeout);
    }
    
    if (isDeleting && displayedText === '') {
      // Move to next phrase and pause before typing
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      const timeout = setTimeout(() => {}, pauseBeforeType);
      return () => clearTimeout(timeout);
    }
    
    // Type or delete character
    const timeout = setTimeout(() => {
      setDisplayedText((prev) => {
        if (isDeleting) {
          return prev.slice(0, -1);
        } else {
          return fullText.slice(0, prev.length + 1);
        }
      });
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex]);

  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-200 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-12">
          {/* Slideshow */}
          <div className="relative scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative h-96 md:h-112 rounded-2xl overflow-hidden shadow-2xl" tabIndex={0} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setCurrentSlide(p => (p - 1 + stories.length) % stories.length);
              if (e.key === 'ArrowRight') setCurrentSlide(p => (p + 1) % stories.length);
            }}>
              {stories.map((story, index) => (
                <div 
                  key={story.id} 
                  className={`absolute inset-0 transition-opacity duration-500 z-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
                >
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover block" style={{ display: 'block' }} />
                  <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent, transparent)' }} />
                  <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                    <h3 className="text-2xl font-bold mb-2">{story.title}</h3>
                    <p className="text-lg opacity-90">{story.description}</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setCurrentSlide(p => (p - 1 + stories.length) % stories.length)} aria-label="Previous slide" className="carousel-btn absolute left-4 top-half -translate-y-half z-20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => setCurrentSlide(p => (p + 1) % stories.length)} aria-label="Next slide" className="carousel-btn absolute right-4 top-half -translate-y-half z-20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="carousel-dots absolute bottom-6 right-6 flex items-center gap-2 z-20">
                {stories.map((_, index) => (
                  <button key={index} aria-label={`Go to slide ${index + 1}`} onClick={() => setCurrentSlide(index)} className={index === currentSlide ? 'indicator-dot active' : 'indicator-dot'} />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="fade-in flex flex-col text-center px-4 md:px-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight brand-name">
              Conquer the Road with <span className="text-blue-600">{displayedText}<span className="typing-cursor">|</span></span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Connect with top-rated, experienced driving instructors who are passionate about helping you succeed. 
              Whether you're a first-timer or need a refresher, find your perfect match today.
            </p>
            
            {/* Stats */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
              <div className="bg-white rounded-lg shadow-md flex-1 max-w-xs" style={{ padding: '2rem' }}>
                <p className="text-3xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-gray-600 mt-1">Verified Instructors</p>
              </div>
              <div className="bg-white rounded-lg shadow-md flex-1 max-w-xs" style={{ padding: '2rem' }}>
                <p className="text-3xl font-bold text-purple-600">1000+</p>
                <p className="text-sm text-gray-600 mt-1">Years of Experience</p>
              </div>
              <div className="bg-white rounded-lg shadow-md flex-1 max-w-xs" style={{ padding: '2rem' }}>
                <p className="text-3xl font-bold text-green-600">98%</p>
                <p className="text-sm text-gray-600 mt-1">Pass Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


