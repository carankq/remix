import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface InstructorCreateFormProps {
  onCreated?: (instructor: any) => void;
}

const PRESET_LANGUAGES = [
  'British Sign Language',
  'English',
  'Spanish',
  'French',
  'Urdu',
  'Polish'
];

const PRESET_SPECIALIZATIONS = [
  'Beginner lessons',
  'Refresher lessons',
  'Test preparation',
  'Intensive courses',
  'Pass Plus',
  'Motorway driving',
  'Nervous drivers'
];

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const InstructorCreateForm: React.FC<InstructorCreateFormProps> = ({ onCreated }) => {
  const { user, token } = useAuth();
  const [instSubmitting, setInstSubmitting] = useState(false);
  const [instError, setInstError] = useState<string | null>(null);
  const [instSuccess, setInstSuccess] = useState<string | null>(null);
  const [instForm, setInstForm] = useState({
    name: '',
    brandName: '',
    description: '',
    pricePerHour: '',
    gender: '',
    vehicleType: '',
    yearsOfExperience: '',
    company: '',
    phone: '',
    email: '',
    image: '',
  });
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [availability, setAvailability] = useState<{ day: string; start: string; end: string }[]>([]);
  const [langSelect, setLangSelect] = useState('');
  const [specSelect, setSpecSelect] = useState('');
  const [postcodes, setPostcodes] = useState<string[]>([]);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [availSelect, setAvailSelect] = useState('');
  const [availStart, setAvailStart] = useState('');
  const [availEnd, setAvailEnd] = useState('');

  // Generate a URL-safe slug from a brand name
  const toBrandSlug = (value: string): string => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Owner listing summary state
  const [ownerInst, setOwnerInst] = useState<any | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [mode, setMode] = useState<'summary' | 'edit' | 'loading'>('loading');

  // Stripe onboarding status
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const [onboardLoading, setOnboardLoading] = useState(false);

  // Prefill from user profile when fields are empty
  useEffect(() => {
    setInstForm(prev => ({
      ...prev,
      name: prev.name || (user?.fullName as string) || prev.name,
      brandName: prev.brandName || (prev.brandName || ''),
      email: prev.email || user?.email || prev.email,
      phone: prev.phone || user?.phoneNumber || prev.phone,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.fullName, user?.email, user?.phoneNumber]);

  // Load existing listing by owner
  const refreshOwner = async () => {
    if (!user?.id) {
      setMode('edit');
      return;
    }
    setOwnerLoading(true);
    setOwnerError(null);
    try {
      const response = await fetch(`${window.__ENV__?.API_HOST || 'http://localhost:3001'}/instructors/owner/${encodeURIComponent(user.id)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      });
      
      if (response.status === 404) {
        setOwnerInst(null);
        setMode('edit');
        return;
      }
      
      const data = await response.json();
      if (response.ok && data) {
        const item = data?.instructor || data;
        setOwnerInst(item);
        setMode('summary');
      } else {
        setOwnerError(data?.error || 'Unable to load your instructor listing.');
        setOwnerInst(null);
        setMode('edit');
      }
    } catch {
      setOwnerError('Network error while loading your instructor listing.');
      setOwnerInst(null);
      setMode('edit');
    } finally {
      setOwnerLoading(false);
    }
  };

  useEffect(() => { if (user?.accountType === 'instructor') refreshOwner(); }, [user?.accountType, user?.id]);

  // Load Stripe onboarding status (disable listing when not complete)
  useEffect(() => {
    const loadOnboard = async () => {
      if (!user?.id || user?.accountType !== 'instructor') return;
      setOnboardLoading(true);
      try {
        const response = await fetch(`${window.__ENV__?.API_HOST || 'http://localhost:3001'}/instructors/${encodeURIComponent(user.id)}/account/onboarded`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br'
          }
        });
        
        const data = await response.json().catch(() => ({}));
        if (response.ok && typeof data?.onboarded === 'boolean') {
          setOnboarded(Boolean(data.onboarded));
        } else if (response.status === 404) {
          setOnboarded(false);
        }
      } catch {
        // ignore; keep null -> do not block
      } finally {
        setOnboardLoading(false);
      }
    };
    loadOnboard();
  }, [user?.accountType, user?.id, token]);

  // When entering edit mode with an existing ownerInst, prefill the form
  useEffect(() => {
    if (mode !== 'edit' || !ownerInst) return;
    const toHHMM = (dt: any) => {
      const d = new Date(dt);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };
    setInstForm(prev => ({
      ...prev,
      name: ownerInst.name || prev.name,
      brandName: ownerInst.brandName || prev.brandName || ownerInst.company || ownerInst.name || prev.brandName,
      description: ownerInst.description || '',
      pricePerHour: ownerInst.pricePerHour != null ? String(ownerInst.pricePerHour) : '',
      gender: ownerInst.gender || '',
      vehicleType: ownerInst.vehicleType || '',
      yearsOfExperience: ownerInst.yearsOfExperience != null ? String(ownerInst.yearsOfExperience) : '',
      company: ownerInst.company || '',
      phone: ownerInst.phone || prev.phone,
      email: ownerInst.email || prev.email,
      image: ownerInst.image || ''
    }));
    setPostcodes(Array.isArray(ownerInst.postcode) ? ownerInst.postcode : (ownerInst.postcode ? [ownerInst.postcode] : []));
    setSpecializations(Array.isArray(ownerInst.specializations) ? ownerInst.specializations : []);
    setLanguages(Array.isArray(ownerInst.languages) ? ownerInst.languages : []);
    setAvailability(Array.isArray(ownerInst.availability) ? ownerInst.availability.map((a: any) => ({ day: a.day, start: toHHMM(a.startTime), end: toHHMM(a.endTime) })) : []);
  }, [mode, ownerInst]);

  const onInstChange = (field: keyof typeof instForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInstForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addSpec = () => {
    const v = specSelect.trim();
    if (!v) return;
    if (!specializations.includes(v)) setSpecializations(prev => [...prev, v]);
    setSpecSelect('');
  };

  const removeItem = (type: 'spec' | 'lang' | 'pc' | 'av', value: string) => {
    if (type === 'spec') setSpecializations(prev => prev.filter(x => x !== value));
    else if (type === 'lang') setLanguages(prev => prev.filter(x => x !== value));
    else if (type === 'pc') setPostcodes(prev => prev.filter(x => x !== value));
    else setAvailability(prev => prev.filter(x => `${x.day}-${x.start}-${x.end}` !== value));
  };

  const addLanguage = () => {
    const v = langSelect.trim();
    if (!v) return;
    if (!languages.includes(v)) setLanguages(prev => [...prev, v]);
    setLangSelect('');
  };

  const addPostcode = () => {
    const v = postcodeInput.trim().toUpperCase();
    if (!v) return;
    if (!postcodes.includes(v)) setPostcodes(prev => [...prev, v]);
    setPostcodeInput('');
  };

  const addAvailability = () => {
    const day = availSelect.trim();
    const start = availStart.trim();
    const end = availEnd.trim();
    if (!day || !start || !end) return;
    if (start >= end) return; // basic guard
    const key = `${day}-${start}-${end}`;
    if (availability.some(a => `${a.day}-${a.start}-${a.end}` === key)) return;
    setAvailability(prev => [...prev, { day, start, end }]);
    setAvailSelect('');
    setAvailStart('');
    setAvailEnd('');
  };

  const submitInstructor = async () => {
    if (!user?.id) return;
    setInstError(null);
    setInstSuccess(null);
    setInstSubmitting(true);
    try {
      const payload: any = {
        ownerId: user.id,
        name: instForm.name.trim(),
        brandName: instForm.brandName.trim(),
        description: instForm.description.trim() || undefined,
        pricePerHour: instForm.pricePerHour ? Number(instForm.pricePerHour) : undefined,
        postcode: postcodes, // array of strings as required
        gender: instForm.gender || undefined,
        vehicleType: instForm.vehicleType,
        yearsOfExperience: instForm.yearsOfExperience ? Number(instForm.yearsOfExperience) : undefined,
        company: instForm.company.trim() || undefined,
        phone: instForm.phone.trim() || undefined,
        email: instForm.email.trim() || undefined,
        image: instForm.image.trim() || undefined,
        specializations: specializations,
        availability: availability.map(a => ({
          day: a.day,
          // Unix ms timestamps as required by PUT schema
          startTime: new Date(`1970-01-01T${a.start}:00Z`).getTime(),
          endTime: new Date(`1970-01-01T${a.end}:00Z`).getTime()
        })),
        languages: languages,
      };
      if (!payload.name || !payload.brandName || postcodes.length === 0 || !payload.vehicleType) {
        setInstError('Please complete the required fields: name, brand name, coverage postcode(s), vehicle type.');
        setInstSubmitting(false);
        return;
      }

      const isUpdate = Boolean(ownerInst && (ownerInst._id || ownerInst.id));
      const targetId = ownerInst?._id || ownerInst?.id;
      const url = isUpdate ? `${window.__ENV__?.API_HOST || 'http://localhost:3001'}/instructors/${encodeURIComponent(targetId)}` : `${window.__ENV__?.API_HOST || 'http://localhost:3001'}/instructors`;
      const method = isUpdate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json().catch(() => ({}));

      if (!isUpdate && response.status === 201) {
        setInstSuccess('Instructor listing created successfully.');
        setInstForm({
          name: '', brandName: '', description: '', pricePerHour: '', gender: '', vehicleType: '', yearsOfExperience: '', company: '', phone: '', email: '', image: ''
        });
        setSpecializations([]);
        setLanguages([]);
        setAvailability([]);
        setLangSelect('');
        setPostcodes([]);
        setPostcodeInput('');
        setAvailSelect('');
        setAvailStart('');
        setAvailEnd('');
        setSpecSelect('');
        onCreated && onCreated(data);
        await refreshOwner();
        setMode('summary');
      } else if (isUpdate && response.status === 200) {
        setInstSuccess('Instructor listing updated successfully.');
        await refreshOwner();
        setMode('summary');
      } else if (response.status === 400) {
        setInstError(data?.error || 'Validation error. Please check your details.');
      } else if (response.status === 404) {
        setInstError(data?.error || 'Instructor not found.');
      } else {
        setInstError(data?.error || (isUpdate ? 'Something went wrong while updating the listing.' : 'Something went wrong while creating the listing.'));
      }
    } catch {
      setInstError('Network error while saving the listing.');
    } finally {
      setInstSubmitting(false);
    }
  };

  if (user?.accountType !== 'instructor') return null;

  // Initial loading view to avoid jerky UI
  if (mode === 'loading' || ownerLoading) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 11-6.219-8.56"/>
          </svg>
          <div>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#111827',
              marginBottom: '0.25rem',
              fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
            }}>
              Loading your instructor profile
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Please wait a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not fully onboarded, disable listing UI and prompt to complete onboarding
  if (user?.accountType === 'instructor' && onboarded === false) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '1.5rem',
          fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
        }}>
          Complete Stripe Onboarding
        </h2>
        <div style={{
          backgroundColor: '#FFF7ED',
          color: '#9A3412',
          border: '1px solid #FDBA74',
          borderLeft: '6px solid #F97316',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, marginTop: '0.125rem' }}>
              <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Stripe account setup required</p>
              <p style={{ fontSize: '0.875rem' }}>Complete your Stripe onboarding to enable your instructor listing and start receiving payments from students.</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              const tabButtons = document.querySelectorAll('[data-tab]');
              tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === 'payments') {
                  (btn as HTMLButtonElement).click();
                }
              });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Go to Payments
          </button>
          <button className="btn" disabled title="Complete onboarding to edit your listing">
            Edit listing
          </button>
        </div>
      </div>
    );
  }

  // Summary view - show listing card like results page
  if (mode === 'summary' && ownerInst) {
    const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23e5e7eb"/><circle cx="50" cy="38" r="18" fill="%239ca3af"/><path d="M20 86c4-18 18-28 30-28s26 10 30 28" fill="%239ca3af"/></svg>';
    const imgSrc = ownerInst.image && ownerInst.image.trim().length > 0 ? ownerInst.image : placeholder;
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#111827',
            margin: 0,
            fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
          }}>
            Your Instructor Listing
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => refreshOwner()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refresh
            </button>
            <button className="btn" onClick={() => setMode('edit')}>
              Edit listing
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="p-6 pb-5">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={imgSrc}
                    onError={(e) => { const img = e.currentTarget as HTMLImageElement; if (img.src !== placeholder) { img.src = placeholder; } }}
                    alt={ownerInst.name}
                    style={{ width: '100px', height: '100px' }}
                    className="rounded-full object-cover border-3 border-gray-100 shadow-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 truncate">{ownerInst.name}</h4>
                  {ownerInst.company && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <span className="truncate">{ownerInst.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900">{ownerInst.rating || 'N/A'}</span>
                    </div>
                    <span className="text-gray-500">({ownerInst.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">£{ownerInst.pricePerHour}</p>
                  <p className="text-xs text-gray-600">per hour</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-700 mb-1">
                    <span className="text-sm font-semibold">{ownerInst.yearsOfExperience}y</span>
                  </div>
                  <p className="text-xs text-gray-600">experience</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{Array.isArray(ownerInst.postcode) ? ownerInst.postcode.join(', ') : ownerInst.postcode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{ownerInst.vehicleType}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{ownerInst.description}</p>
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-700 mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-2">
                  {(ownerInst.specializations || []).slice(0, 2).map((spec: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">{spec}</span>
                  ))}
                  {ownerInst.specializations && ownerInst.specializations.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">+{ownerInst.specializations.length - 2} more</span>
                  )}
                </div>
              </div>
              {ownerInst.languages && ownerInst.languages.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-700 mb-2">Languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {ownerInst.languages.map((lang: string, i: number) => (
                      <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">{lang}</span>
                    ))}
                  </div>
                </div>
              )}
              {ownerInst.availability && ownerInst.availability.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-medium text-gray-700 mb-2">Available:</p>
                  <div className="flex flex-wrap gap-2">
                    {ownerInst.availability.slice(0, 4).map((a: any, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                        {a.day.slice(0, 3)} {new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–{new Date(a.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ))}
                    {ownerInst.availability.length > 4 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">+{ownerInst.availability.length - 4}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit/Create form view
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '600', 
        color: '#111827',
        marginBottom: '1.5rem',
        fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
      }}>
        {ownerInst ? 'Edit Your Listing' : 'Create Instructor Listing'}
      </h2>
      {ownerError && (
        <div style={{
          fontSize: '0.875rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem'
        }}>
          {ownerError}
          <div style={{ marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={refreshOwner}>Retry</button>
          </div>
        </div>
      )}
      {instSuccess && (
        <div style={{
          fontSize: '0.875rem',
          color: '#059669',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem'
        }}>
          {instSuccess}
        </div>
      )}
      {instError && (
        <div style={{
          fontSize: '0.875rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          marginBottom: '1rem'
        }}>
          {instError}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Personal Information Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Full Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input className="input w-full" placeholder="e.g., John Smith" value={instForm.name} onChange={onInstChange('name')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Brand Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input className="input w-full" placeholder="e.g., Smith Driving School" value={instForm.brandName} onChange={onInstChange('brandName')} />
              <p className="text-xs text-gray-600 mt-1">How learners will identify you</p>
              <p className="text-xs text-gray-500">URL: /instructors/{toBrandSlug(instForm.brandName) || 'your-brand'}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Company Name
              </label>
              <input className="input w-full" placeholder="e.g., ABC Driving Academy" value={instForm.company} onChange={onInstChange('company')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Profile Image URL
              </label>
              <input className="input w-full" placeholder="https://example.com/image.jpg" value={instForm.image} onChange={onInstChange('image')} />
            </div>
          </div>
        </div>

        {/* Service Area Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Service Area
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Coverage Areas <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <p className="text-xs text-gray-600 mb-2">Add postcodes (e.g., "NW1 2AB") or areas (e.g., "NW") you cover</p>
            <div className="flex items-center gap-2 mb-2">
              <input 
                className="input w-full" 
                placeholder="Enter postcode or area code" 
                value={postcodeInput} 
                onChange={(e)=>setPostcodeInput(e.target.value)} 
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addPostcode(); } }} 
              />
              <button type="button" className="btn" onClick={addPostcode} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {postcodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {postcodes.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: '#eff6ff',
                    color: '#1e40af',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {item}
                    <button type="button" style={{ color: '#1e40af', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={()=>removeItem('pc', item)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle & Pricing Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17h14v-2H5v2zm4.5-4.5h5l-1.08-3H10.58l-1.08 3zM4.5 6.5v8h15v-8h-15zM5 19h14v-1H5v1z"/>
              <rect x="1" y="6" width="22" height="11" rx="2" ry="2"/>
            </svg>
            Vehicle & Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Vehicle Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select className="select w-full" value={instForm.vehicleType} onChange={onInstChange('vehicleType')}>
                <option value="">Select vehicle type</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="Both">Both Manual & Automatic</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Gender Preference
              </label>
              <select className="select w-full" value={instForm.gender} onChange={onInstChange('gender')}>
                <option value="">Not specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Price per Hour (£)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontWeight: '500' }}>£</span>
                <input className="input w-full" type="number" placeholder="25" value={instForm.pricePerHour} onChange={onInstChange('pricePerHour')} style={{ paddingLeft: '2rem' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Years of Experience
              </label>
              <input className="input w-full" type="number" placeholder="5" value={instForm.yearsOfExperience} onChange={onInstChange('yearsOfExperience')} />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Phone Number
              </label>
              <input className="input w-full" placeholder="+44 7123 456789" value={instForm.phone} onChange={onInstChange('phone')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input className="input w-full" placeholder="instructor@example.com" value={instForm.email} onChange={onInstChange('email')} />
            </div>
          </div>
        </div>

        {/* Specializations Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Specializations
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Teaching Specializations
            </label>
            <p className="text-xs text-gray-600 mb-2">Select areas where you have expertise</p>
            <div className="flex items-center gap-2 mb-2">
              <select className="select w-full" value={specSelect} onChange={(e)=>setSpecSelect(e.target.value)}>
                <option value="">Choose a specialization</option>
                {PRESET_SPECIALIZATIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button type="button" className="btn" onClick={addSpec} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {specializations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specializations.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                    <button type="button" style={{ color: '#1e40af', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={()=>removeItem('spec', item)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Languages Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Languages
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Languages Spoken
            </label>
            <p className="text-xs text-gray-600 mb-2">Add languages you can teach in</p>
            <div className="flex items-center gap-2 mb-2">
              <select className="select w-full" value={langSelect} onChange={(e)=>setLangSelect(e.target.value)}>
                <option value="">Choose a language</option>
                {PRESET_LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button type="button" className="btn" onClick={addLanguage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {languages.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: '#f3e8ff',
                    color: '#7c3aed',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    {item}
                    <button type="button" style={{ color: '#7c3aed', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={()=>removeItem('lang', item)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Availability Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Availability
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Teaching Schedule
            </label>
            <p className="text-xs text-gray-600 mb-2">Add time slots when you're available to teach (e.g., Monday 09:00–17:00)</p>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2 items-end">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                <select className="select w-full" value={availSelect} onChange={(e)=>setAvailSelect(e.target.value)}>
                  <option value="">Select day</option>
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Start time</label>
                <input type="time" className="input w-full" value={availStart} onChange={(e)=>setAvailStart(e.target.value)} placeholder="Start" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">End time</label>
                <input type="time" className="input w-full" value={availEnd} onChange={(e)=>setAvailEnd(e.target.value)} placeholder="End" />
              </div>
            </div>
            <div className="flex items-center justify-end mb-2">
              <button type="button" className="btn" onClick={addAvailability} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Time Slot
              </button>
            </div>
            {availability.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availability.map(a => {
                  const key = `${a.day}-${a.start}-${a.end}`;
                  return (
                    <span key={key} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {a.day} {a.start}–{a.end}
                      <button type="button" style={{ color: '#92400e', fontWeight: '700', fontSize: '1.25rem', cursor: 'pointer' }} onClick={()=>removeItem('av', key)}>×</button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: '#111827', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            About You
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Profile Description
            </label>
            <p className="text-xs text-gray-600 mb-2">Tell potential students about your teaching style, experience, and what makes you a great instructor</p>
            <textarea 
              className="input w-full" 
              rows={5} 
              placeholder="I'm a patient and experienced driving instructor with over 10 years of teaching. I specialize in helping nervous drivers build confidence and have an excellent first-time pass rate..." 
              value={instForm.description} 
              onChange={onInstChange('description')}
              style={{ resize: 'vertical', minHeight: '120px' }}
            />
          </div>
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {ownerInst && (
          <button 
            className="btn btn-secondary" 
            onClick={() => setMode('summary')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Cancel
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button 
          className="btn btn-primary" 
          disabled={instSubmitting} 
          onClick={submitInstructor}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            minWidth: '150px',
            justifyContent: 'center'
          }}
        >
          {instSubmitting ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              Saving...
            </>
          ) : (
            <>
              {ownerInst ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save Changes
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create Listing
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InstructorCreateForm;
