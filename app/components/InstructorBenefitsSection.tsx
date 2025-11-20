import { Slideshow } from './Slideshow';

const slides = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop', 
    title: 'Stand Out with DVLA Verification', 
    description: 'Build instant trust — prove your vehicle credentials are genuine and verified'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop', 
    title: 'Students Find You Locally', 
    description: 'No more driving miles away — students search by postcode to find instructors in their area'
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 
    title: 'Receive Direct Enquiries', 
    description: 'Students contact you directly — simple, straightforward communication'
  },
  { 
    id: 4, 
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop', 
    title: 'Set Your Own Terms', 
    description: 'List your availability, prices, and preferences — you stay in control'
  }
];

export function InstructorBenefitsSection() {
  return (
    <section style={{ 
      background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
      padding: '4rem 0'
    }}>
      <div className="container mx-auto px-4">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Slideshow */}
          <div className="relative scale-in" style={{ animationDelay: '0.3s', marginBottom: '3rem' }}>
            <Slideshow slides={slides} height="24rem" />
          </div>

          {/* Content */}
          <div className="fade-in flex flex-col text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight brand-name">
              Built for Driving Instructors
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Get found by local students searching for instructors in their area. Build trust with DVLA verification and receive enquiries directly.
            </p>
            
            {/* Stats - Horizontal */}
            <div className="flex flex-row gap-4 justify-center items-stretch">
              <div className="flex items-center gap-3 bg-white" style={{ padding: '1.5rem 2rem', borderRadius: '0', flex: 1, maxWidth: '360px', border: '2px solid #e5e7eb' }}>
                <p className="text-3xl font-bold text-blue-600">✓ DVLA</p>
                <div style={{ textAlign: 'left' }}>
                  <p className="text-sm font-semibold text-gray-900">Vehicle Verification</p>
                  <p className="text-xs text-gray-500">Instant credibility</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white" style={{ padding: '1.5rem 2rem', borderRadius: '0', flex: 1, maxWidth: '360px', border: '2px solid #e5e7eb' }}>
                <p className="text-3xl font-bold text-purple-600">📍</p>
                <div style={{ textAlign: 'left' }}>
                  <p className="text-sm font-semibold text-gray-900">Area-Based Search</p>
                  <p className="text-xs text-gray-500">Students find you locally</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white" style={{ padding: '1.5rem 2rem', borderRadius: '0', flex: 1, maxWidth: '360px', border: '2px solid #e5e7eb' }}>
                <p className="text-3xl font-bold text-green-600">📧</p>
                <div style={{ textAlign: 'left' }}>
                  <p className="text-sm font-semibold text-gray-900">Direct Enquiries</p>
                  <p className="text-xs text-gray-500">Connect with learners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

