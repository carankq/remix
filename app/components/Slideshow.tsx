import { useEffect, useState } from 'react';

type Slide = {
  id: number;
  image: string;
  title: string;
  description: string;
};

type SlideshowProps = {
  slides: Slide[];
  autoPlayInterval?: number;
  height?: string;
};

export function Slideshow({ slides, autoPlayInterval = 5000, height = '24rem' }: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  
  // Auto-advance slideshow
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(p => (p + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [paused, slides.length, autoPlayInterval]);

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="relative overflow-hidden shadow-2xl" 
      style={{ height, borderRadius: '0' }}
      tabIndex={0} 
      onMouseEnter={() => setPaused(true)} 
      onMouseLeave={() => setPaused(false)} 
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setCurrentSlide(p => (p - 1 + slides.length) % slides.length);
        if (e.key === 'ArrowRight') setCurrentSlide(p => (p + 1) % slides.length);
      }}
    >
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover block" 
            style={{ display: 'block' }} 
          />
          <div 
            className="absolute inset-0" 
            style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent, transparent)' }} 
          />
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
            <p className="text-lg opacity-90">{slide.description}</p>
          </div>
        </div>
      ))}
      
      {slides.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} 
            aria-label="Previous slide" 
            className="carousel-btn absolute left-4 z-20"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} 
            aria-label="Next slide" 
            className="carousel-btn absolute right-4 z-20"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div 
            className="absolute bottom-6 right-6 flex items-center gap-2 z-20"
            style={{ 
              background: 'rgba(0, 0, 0, 0.5)', 
              padding: '0.5rem 0.75rem',
              borderRadius: '0'
            }}
          >
            {slides.map((_, index) => (
              <button 
                key={index} 
                aria-label={`Go to slide ${index + 1}`} 
                onClick={() => setCurrentSlide(index)} 
                className={index === currentSlide ? 'indicator-dot active' : 'indicator-dot'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

