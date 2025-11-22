export type DrivingInstructor = {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  postcode: string[];
  gender: 'Male' | 'Female';
  vehicleType: 'Manual' | 'Automatic' | 'Electric';
  yearsOfExperience: number;
  rating: number;
  totalReviews: number;
  phone: string;
  email: string;
};

export const INSTRUCTORS: DrivingInstructor[] = [
  {
    id: 'a1',
    name: 'Alex Johnson',
    description: 'Patient, DVSA-approved instructor with 8 years of experience in East London.',
    pricePerHour: 35,
    postcode: ['E1', 'E2', 'E3'],
    gender: 'Male',
    vehicleType: 'Automatic',
    yearsOfExperience: 8,
    rating: 4.8,
    totalReviews: 132,
    phone: '07123 456789',
    email: 'alex@example.com'
  },
  {
    id: 'b2',
    name: 'Maya Patel',
    description: 'Friendly manual instructor focusing on confidence-building and test-readiness.',
    pricePerHour: 32,
    postcode: ['E14', 'E15', 'E16'],
    gender: 'Female',
    vehicleType: 'Manual',
    yearsOfExperience: 5,
    rating: 4.7,
    totalReviews: 98,
    phone: '07900 111222',
    email: 'maya@example.com'
  }
];

export function filterInstructors(params: URLSearchParams): DrivingInstructor[] {
  const q = (params.get('q') || '').toLowerCase();
  const postcodes = params.getAll('postcode').map(p => p.toUpperCase());
  return INSTRUCTORS.filter((i) => {
    const matchesQ = !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    const matchesPc = postcodes.length === 0 || i.postcode.some(p => postcodes.includes(p));
    return matchesQ && matchesPc;
  });
}


