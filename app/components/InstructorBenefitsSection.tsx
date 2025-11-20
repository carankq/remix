import { Slideshow } from './Slideshow';

const slides = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop', 
    title: 'Grow Your Student Base', 
    description: 'Connect with motivated learners actively searching for quality instruction'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop', 
    title: 'Secure Payments, Every Time', 
    description: 'Escrow-style protection ensures you get paid for every lesson you teach'
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', 
    title: 'Manage Your Schedule Easily', 
    description: 'Set your availability, prices, and preferences — we handle the bookings'
  },
  { 
    id: 4, 
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop', 
    title: 'Build Your Reputation', 
    description: 'Stand out with verified credentials and genuine student reviews'
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
              Join a platform that puts you first. Get more students, keep 100% of your earnings, and focus on what you do best — teaching.
            </p>
            
            {/* Stats */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
              <div className="bg-white shadow-md flex-1 max-w-xs" style={{ padding: '2rem', borderRadius: '0' }}>
                <p className="text-3xl font-bold text-blue-600">0%</p>
                <p className="text-sm text-gray-600 mt-1">Commission Fee</p>
              </div>
              <div className="bg-white shadow-md flex-1 max-w-xs" style={{ padding: '2rem', borderRadius: '0' }}>
                <p className="text-3xl font-bold text-purple-600">100%</p>
                <p className="text-sm text-gray-600 mt-1">Payment Protection</p>
              </div>
              <div className="bg-white shadow-md flex-1 max-w-xs" style={{ padding: '2rem', borderRadius: '0' }}>
                <p className="text-3xl font-bold text-green-600">24/7</p>
                <p className="text-sm text-gray-600 mt-1">Booking Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

