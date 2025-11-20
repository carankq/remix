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
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-12">
          
          {/* Slideshow */}
          <div className="relative scale-in" style={{ animationDelay: '0.3s' }}>
            <Slideshow slides={slides} height="24rem" />
          </div>

          {/* Content */}
          <div className="fade-in flex flex-col text-center px-4 md:px-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight brand-name">
              Built for Driving Instructors
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Get found by local students searching for instructors in their area. Build trust with DVLA verification and receive enquiries directly.
            </p>
            
            {/* Stats */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-4 justify-center items-stretch max-w-4xl mx-auto">
              <div className="bg-white shadow-md" style={{ padding: '2rem', borderRadius: '0' }}>
                <p className="text-3xl font-bold text-blue-600">✓ DVLA</p>
                <p className="text-sm text-gray-600 mt-1">Vehicle Verification</p>
                <p className="text-xs text-gray-500 mt-2">Instant credibility with students</p>
              </div>
              <div className="bg-white shadow-md" style={{ padding: '2rem', borderRadius: '0' }}>
                <p className="text-3xl font-bold text-purple-600">📍 Local</p>
                <p className="text-sm text-gray-600 mt-1">Area-Based Search</p>
                <p className="text-xs text-gray-500 mt-2">Students find you by postcode</p>
              </div>
              <div className="bg-white shadow-md" style={{ padding: '2rem', borderRadius: '0' }}>
                <p className="text-3xl font-bold text-green-600">📧 Direct</p>
                <p className="text-sm text-gray-600 mt-1">Student Enquiries</p>
                <p className="text-xs text-gray-500 mt-2">Connect directly with learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

