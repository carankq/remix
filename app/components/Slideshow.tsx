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
      className="relative overflow-hidden" 
      style={{ 
        height, 
        borderRadius: '0',
        border: '2px solid #e5e7eb'
      }}
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
          className={`absolute inset-0 transition-all duration-700 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full block slideshow-image" 
            style={{ display: 'block', objectFit: 'cover' }} 
          />
          <div 
            className="absolute inset-0" 
            style={{ background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%)' }} 
          />
          <div className="absolute bottom-6 left-6 text-white z-10" style={{ maxWidth: '55%' }}>
            <h3 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              marginBottom: '0.75rem',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {slide.title}
            </h3>
            <p style={{ 
              fontSize: '1.125rem', 
              opacity: 0.95,
              lineHeight: '1.6',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              {slide.description}
            </p>
          </div>
        </div>
      ))}
      
      {slides.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} 
            aria-label="Previous slide" 
            className="absolute left-4 z-20"
            style={{ 
              top: '50%', 
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1e40af',
              border: '2px solid #e5e7eb',
              borderRadius: '0',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1e40af';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = '#1e40af';
              e.currentTarget.style.transform = 'translateY(-50%)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} 
            aria-label="Next slide" 
            className="absolute right-4 z-20"
            style={{ 
              top: '50%', 
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1e40af',
              border: '2px solid #e5e7eb',
              borderRadius: '0',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1e40af';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = '#1e40af';
              e.currentTarget.style.transform = 'translateY(-50%)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div 
            className="absolute bottom-6 right-6 flex items-center gap-2 z-20"
          >
            {slides.map((_, index) => (
              <button 
                key={index} 
                aria-label={`Go to slide ${index + 1}`} 
                onClick={() => setCurrentSlide(index)} 
                style={{
                  width: index === currentSlide ? '32px' : '12px',
                  height: '12px',
                  background: index === currentSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  borderRadius: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                  }
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

