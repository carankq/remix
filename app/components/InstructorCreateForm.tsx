import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { InstructorCard } from './InstructorCard';

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
  // Working availability (day + HH:MM inputs rendered as strings)
  const [availability, setAvailability] = useState<{ day: string; start: string; end: string }[]>([]);
  // Exceptions (date ranges for holidays, etc.)
  const [excStartDate, setExcStartDate] = useState(''); // YYYY-MM-DD
  const [excStartTime, setExcStartTime] = useState(''); // HH:MM
  const [excEndDate, setExcEndDate] = useState(''); // YYYY-MM-DD
  const [excEndTime, setExcEndTime] = useState(''); // HH:MM
  const [exceptions, setExceptions] = useState<{ startDate: string; startTime: string; endDate: string; endTime: string }[]>([]);
  const [langSelect, setLangSelect] = useState('');
  const [specSelect, setSpecSelect] = useState('');
  const [postcodes, setPostcodes] = useState<string[]>([]);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [availSelect, setAvailSelect] = useState('');
  const [availStart, setAvailStart] = useState('');
  const [availEnd, setAvailEnd] = useState('');
  
  // Permissions state
  const [publicAvailability, setPublicAvailability] = useState<string>('off');
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [numberVisibility, setNumberVisibility] = useState<string>('off');
  const [numberWhitelist, setNumberWhitelist] = useState<string[]>([]);
  const [numberBlacklist, setNumberBlacklist] = useState<string[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Array<{ _id: string; fullName: string }>>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

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
      const response = await fetch(`${window.__ENV__?.API_HOST || 'http://localhost:3001'}/instructors/find/owner`, {
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
    const ampmToHHMM = (s: string): string => {
      if (!s) return '';
      const m = s.trim().match(/^([0-9]{1,2}):([0-9]{2})\s*([ap]m)$/i);
      if (!m) return s; // fallback
      let h = parseInt(m[1], 10);
      const mm = m[2];
      const ampm = m[3].toLowerCase();
      if (ampm === 'pm' && h !== 12) h += 12;
      if (ampm === 'am' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${mm}`;
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
    // Prefill availability (support both legacy array and new object with .working/.exceptions)
    if (Array.isArray(ownerInst.availability)) {
      setAvailability(ownerInst.availability.map((a: any) => ({ day: a.day, start: toHHMM(a.startTime), end: toHHMM(a.endTime) })));
      setExceptions([]);
    } else if (ownerInst.availability && typeof ownerInst.availability === 'object') {
      const w = Array.isArray(ownerInst.availability.working) ? ownerInst.availability.working : [];
      // working.startTime/endTime are strings like 10:30am per new schema
      setAvailability(w.map((a: any) => ({ day: a.day, start: ampmToHHMM(String(a.startTime || '')), end: ampmToHHMM(String(a.endTime || '')) })));
      const ex = Array.isArray(ownerInst.availability.exceptions) ? ownerInst.availability.exceptions : [];
      setExceptions(ex.map((e: any) => {
        const startMs = typeof e.startTime === 'number' ? e.startTime : new Date(e.startTime).getTime();
        const endMs = typeof e.endTime === 'number' ? e.endTime : new Date(e.endTime).getTime();
        const startDate = new Date(startMs);
        const endDate = new Date(endMs);
        return {
          startDate: startDate.toISOString().slice(0, 10),
          startTime: toHHMM(startMs),
          endDate: endDate.toISOString().slice(0, 10),
          endTime: toHHMM(endMs)
        };
      }));
    } else {
      setAvailability([]);
      setExceptions([]);
    }
    
    // Prefill permissions
    if (ownerInst.permissions && typeof ownerInst.permissions === 'object') {
      setPublicAvailability(ownerInst.permissions.publicAvailability || 'off');
      setWhitelist(Array.isArray(ownerInst.permissions.publicAvailabilityWhitelist) ? ownerInst.permissions.publicAvailabilityWhitelist : []);
      setBlacklist(Array.isArray(ownerInst.permissions.publicAvailabilityBlacklist) ? ownerInst.permissions.publicAvailabilityBlacklist : []);
      setNumberVisibility(ownerInst.permissions.numberVisibility || 'off');
      setNumberWhitelist(Array.isArray(ownerInst.permissions.numberVisibilityWhitelist) ? ownerInst.permissions.numberVisibilityWhitelist : []);
      setNumberBlacklist(Array.isArray(ownerInst.permissions.numberVisibilityBlacklist) ? ownerInst.permissions.numberVisibilityBlacklist : []);
    } else {
      setPublicAvailability('off');
      setWhitelist([]);
      setBlacklist([]);
      setNumberVisibility('off');
      setNumberWhitelist([]);
      setNumberBlacklist([]);
    }
  }, [mode, ownerInst]);

  // Fetch available students when whitelist/blacklist options are selected
  useEffect(() => {
    const needsStudentListForAvailability = publicAvailability === 'white+black-list';
    const needsStudentListForNumber = numberVisibility === 'white+black-list';
    const needsStudentList = needsStudentListForAvailability || needsStudentListForNumber;
    
    if (!needsStudentList || !token || availableStudents.length > 0) return;
    
    const fetchStudents = async () => {
      setLoadingStudents(true);
      setStudentsError(null);
      
      try {
        const apiHost = (window as any).__ENV__?.API_HOST || 'http://localhost:3001';
        const res = await fetch(`${apiHost}/instructors/find/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setAvailableStudents(Array.isArray(data) ? data : []);
        } else {
          const errorData = await res.json().catch(() => ({}));
          setStudentsError(errorData?.error || 'Unable to load students');
        }
      } catch {
        setStudentsError('Network error while loading students');
      } finally {
        setLoadingStudents(false);
      }
    };
    
    fetchStudents();
  }, [publicAvailability, numberVisibility, token, availableStudents.length]);

  const onInstChange = (field: keyof typeof instForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInstForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value = raw.trim();
    // Allow: empty, digits, digits with optional . and up to 2 decimals, or leading . with up to 2 decimals
    const isAllowed = /^$|^\d+$|^\d+\.\d{0,2}$|^\.\d{0,2}$/.test(value);
    if (!isAllowed) return;
    const normalized = value.startsWith('.') ? `0${value}` : value;
    if (normalized !== '' && normalized !== '.') {
      const num = parseFloat(normalized);
      if (!Number.isNaN(num) && num > 60) {
        setInstForm(prev => ({ ...prev, pricePerHour: '60' }));
        return;
      }
    }
    setInstForm(prev => ({ ...prev, pricePerHour: value }));
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

  const submitInstructor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user?.id) return;
    setInstError(null);
    setInstSuccess(null);
    setInstSubmitting(true);
    try {
      const toAmPm = (hhmm: string): string => {
        if (!hhmm) return '';
        const [hStr, m] = hhmm.split(':');
        let h = Number(hStr);
        const ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12; if (h === 0) h = 12;
        return `${h}:${m}${ampm}`;
      };
      const toDateTimeMs = (dateStr: string, timeHHMM: string): number => {
        // Combine YYYY-MM-DD and HH:MM to create a full timestamp
        const d = new Date(`${dateStr}T${timeHHMM}:00`);
        return d.getTime();
      };

      console.log('sending jumber vis:', numberVisibility)

      const payload: any = {
        ownerId: user.id,
        name: instForm.name.trim(),
        brandName: instForm.brandName.trim(),
        description: instForm.description.trim() || undefined,
        pricePerHour: instForm.pricePerHour.trim() !== '' ? Math.min(60, parseFloat(instForm.pricePerHour)) : undefined,
        postcode: postcodes, // array of strings as required
        gender: instForm.gender || undefined,
        vehicleType: instForm.vehicleType,
        yearsOfExperience: instForm.yearsOfExperience ? Number(instForm.yearsOfExperience) : undefined,
        company: instForm.company.trim() || undefined,
        phone: instForm.phone.trim() || undefined,
        email: instForm.email.trim() || undefined,
        image: instForm.image.trim() || undefined,
        specializations: specializations,
        availability: {
          working: availability.map(a => ({
            day: a.day,
            // working times are plain strings like 10:30am per new schema
            startTime: toAmPm(a.start),
            endTime: toAmPm(a.end)
          })),
          exceptions: exceptions.map(ex => ({
            // exceptions are now Unix ms timestamps spanning a date range
            startTime: toDateTimeMs(ex.startDate, ex.startTime),
            endTime: toDateTimeMs(ex.endDate, ex.endTime)
          }))
        },
        languages: languages,
        permissions: {
          publicAvailability: publicAvailability || 'off',
          publicAvailabilityWhitelist: whitelist,
          publicAvailabilityBlacklist: blacklist,
          numberVisibility: numberVisibility || 'off',
          numberVisibilityWhitelist: numberWhitelist,
          numberVisibilityBlacklist: numberBlacklist
        }
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
        setExceptions([]);
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

  // Section styling constants for consistency
  const sectionStyle = {
    padding: '1.5rem',
    background: '#ffffff',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  };

  const sectionHeaderStyle = {
    fontSize: '0.8125rem',
    fontWeight: '600' as const,
    color: '#0f172a',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    fontFamily: "'Space Grotesk', sans-serif",
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  };

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
      <div>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#111827',
          marginBottom: '1.5rem',
          fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
        }}>
          Instructor Profile
        </h2>
        
        <div style={{
          width: '100%',
          background: '#ffffff',
          border: '1px solid #fdba74',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
            <div style={{
              flexShrink: 0,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#fff7ed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                marginBottom: '0.5rem',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Stripe Account Setup Required
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
                Complete your Stripe onboarding to enable your instructor listing and start receiving payments from students.
              </p>
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
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Go to Payments
                </button>
                <button 
                  className="btn" 
                  disabled 
                  title="Complete onboarding to edit your listing"
                  style={{ fontSize: '0.875rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Edit Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Summary view - show listing card like results page
  if (mode === 'summary' && ownerInst) {
    const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23e5e7eb"/><circle cx="50" cy="38" r="18" fill="%239ca3af"/><path d="M20 86c4-18 18-28 30-28s26 10 30 28" fill="%239ca3af"/></svg>';
    const imgSrc = ownerInst.image && ownerInst.image.trim().length > 0 ? ownerInst.image : placeholder;
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              color: '#0f172a',
              marginBottom: '0.5rem',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.025em'
            }}>
              Your Instructor Listing
            </h2>
            <p style={{
              fontSize: '0.9375rem',
              color: '#64748b',
              margin: 0,
              fontWeight: '400'
            }}>
              Preview how your profile appears to potential students
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => refreshOwner()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refresh
            </button>
            <button className="btn" onClick={() => setMode('edit')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Listing
            </button>
          </div>
        </div>
        <InstructorCard instructor={ownerInst} showActions={false} />
      </div>
    );
  }

  // Edit/Create form view
  return (
    <div>
      <h2 style={{ 
        fontSize: '1.75rem', 
        fontWeight: '700', 
        color: '#0f172a',
        marginBottom: '0.5rem',
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: '-0.025em'
      }}>
        {ownerInst ? 'Edit Your Listing' : 'Create Instructor Listing'}
      </h2>
      <p style={{
        fontSize: '0.9375rem',
        color: '#64748b',
        marginBottom: '2rem',
        fontWeight: '400'
      }}>
        {ownerInst ? 'Update your instructor profile information below' : 'Set up your instructor profile to start connecting with students'}
      </p>
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
      <form onSubmit={submitInstructor} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Personal Information Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
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
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.4' }}>
                How learners will identify you
              </p>
              <div style={{ 
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b', flexShrink: 0 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ 
                  fontSize: '0.75rem',
                  color: '#64748b',
                  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                  fontWeight: '500'
                }}>
                  /instructors/{toBrandSlug(instForm.brandName) || 'your-brand'}
                </span>
              </div>
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
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Service Area
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
              Coverage Areas <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Add postcodes (e.g., "NW1 2AB") or areas (e.g., "NW") you cover
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input 
                className="input w-full" 
                placeholder="Enter postcode or area code" 
                value={postcodeInput} 
                onChange={(e)=>setPostcodeInput(e.target.value)} 
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addPostcode(); } }} 
              />
              <button type="button" className="btn" onClick={addPostcode} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {postcodes.length > 0 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                {postcodes.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '0.5rem',
                    background: '#eff6ff',
                    color: '#1e40af',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {item}
                    <button 
                      type="button" 
                      onClick={()=>removeItem('pc', item)}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginLeft: '0.25rem',
                        padding: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1e40af' }}>
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle & Pricing Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f97316' }}>
              <rect x="1" y="6" width="22" height="11" rx="2" ry="2"/>
              <line x1="7" y1="11" x2="7" y2="11.01"/>
              <line x1="11" y1="11" x2="17" y2="11"/>
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
              <label htmlFor="instructor-price-per-hour" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Price per Hour (£)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ 
                  position: 'absolute', 
                  left: '1rem', 
                  top: '0.75rem',
                  color: '#6b7280', 
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  pointerEvents: 'none'
                }}>£</span>
                <input 
                  id="instructor-price-per-hour"
                  name="pricePerHour"
                  className="input w-full" 
                  type="text"
                  inputMode="decimal"
                  placeholder="25"
                  value={instForm.pricePerHour}
                  onChange={onPriceChange}
                  style={{ paddingLeft: '2.25rem' }} 
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.375rem' }}>
                  Maximum £60 per hour
                </p>
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
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#06b6d4' }}>
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
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#3b82f6' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Specializations
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
              Teaching Specializations
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Select areas where you have expertise
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <select className="select w-full" value={specSelect} onChange={(e)=>setSpecSelect(e.target.value)}>
                <option value="">Choose a specialization</option>
                {PRESET_SPECIALIZATIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button type="button" className="btn" onClick={addSpec} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {specializations.length > 0 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                {specializations.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '0.5rem',
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {item}
                    <button 
                      type="button" 
                      onClick={()=>removeItem('spec', item)}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginLeft: '0.25rem',
                        padding: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#bfdbfe'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1e40af' }}>
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Languages Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Languages
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
              Languages Spoken
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Add languages you can teach in
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <select className="select w-full" value={langSelect} onChange={(e)=>setLangSelect(e.target.value)}>
                <option value="">Choose a language</option>
                {PRESET_LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button type="button" className="btn" onClick={addLanguage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add
              </button>
            </div>
            {languages.length > 0 && (
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0'
              }}>
                {languages.map(item => (
                  <span key={item} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '0.5rem',
                    background: '#f3e8ff',
                    color: '#7c3aed',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    {item}
                    <button 
                      type="button" 
                      onClick={()=>removeItem('lang', item)}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginLeft: '0.25rem',
                        padding: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#e9d5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#7c3aed' }}>
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Permissions Section */}
        <div style={sectionStyle}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Public Availability Settings
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
              Control who can view your real-time availability calendar
            </p>
            
            <select 
              className="select w-full" 
              value={publicAvailability} 
              onChange={(e) => setPublicAvailability(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              <option value="off">Off - No one can see my availability</option>
              <option value="anyone">Anyone - No restrictions, everyone can see</option>
              <option value="verified-users">Verified Users - Any verified Carank user can see</option>
              <option value="booked-with-students">Booked Students Only - Only students I've completed a lesson with on carank</option>
              <option value="white+black-list">Custom List - Specific approved users, minus blocked ones</option>
            </select>
            
            {/* Whitelist Management */}
            {publicAvailability === 'white+black-list' && (
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Whitelist - Approved Students
                </label>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Select students who can see your availability
                </p>
                
                {loadingStudents ? (
                  <div style={{ padding: '1rem', textAlign: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Loading students...</p>
                  </div>
                ) : studentsError ? (
                  <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0', color: '#dc2626', fontSize: '0.875rem' }}>
                    {studentsError}
                  </div>
                ) : availableStudents.length === 0 ? (
                  <div style={{ padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0', color: '#92400e', fontSize: '0.875rem' }}>
                    No students with completed lessons found. Students will appear here after you complete your first lesson.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0', padding: '0.75rem', background: '#f9fafb' }}>
                    {availableStudents.map(student => (
                      <label key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                        <input
                          type="checkbox"
                          checked={whitelist.includes(student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWhitelist(prev => [...prev, student._id]);
                              // Remove from blacklist if present
                              setBlacklist(prev => prev.filter(id => id !== student._id));
                            } else {
                              setWhitelist(prev => prev.filter(id => id !== student._id));
                            }
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#10b981' }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>{student.fullName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Blacklist Management */}
            {publicAvailability === 'white+black-list' && (
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Blacklist - Blocked Students
                </label>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Select students who cannot see your availability
                </p>
                
                {loadingStudents ? (
                  <div style={{ padding: '1rem', textAlign: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Loading students...</p>
                  </div>
                ) : studentsError ? (
                  <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0', color: '#dc2626', fontSize: '0.875rem' }}>
                    {studentsError}
                  </div>
                ) : availableStudents.length === 0 ? (
                  <div style={{ padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0', color: '#92400e', fontSize: '0.875rem' }}>
                    No students with completed lessons found. Students will appear here after you complete your first lesson.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0', padding: '0.75rem', background: '#f9fafb' }}>
                    {availableStudents.map(student => (
                      <label key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                        <input
                          type="checkbox"
                          checked={blacklist.includes(student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBlacklist(prev => [...prev, student._id]);
                              // Remove from whitelist if present
                              setWhitelist(prev => prev.filter(id => id !== student._id));
                            } else {
                              setBlacklist(prev => prev.filter(id => id !== student._id));
                            }
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ef4444' }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>{student.fullName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div style={{
              padding: '1rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0',
              fontSize: '0.8125rem',
              color: '#1e40af',
              lineHeight: '1.6',
              marginTop: '1rem'
            }}>
              <strong>Note:</strong> This setting controls the visibility of your available time slots on the booking page. Students will always see your profile, but only those with permission will see when you're available to book. By default, someone who is not verified will NOT be able to see your availability, unless you choose the 'anyone' option in which case there are no restrctions.
            </div>
          </div>
        </div>

        {/* Phone Number Visibility Section */}
        <div style={sectionStyle}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Phone Number Visibility Settings
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
              Control who can see your phone number on your profile
            </p>
            
            <select 
              className="select w-full" 
              value={numberVisibility} 
              onChange={(e) => setNumberVisibility(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              <option value="off">Off - No one can see my phone number</option>
              <option value="anyone">Anyone - No restrictions, everyone can see</option>
              <option value="verified-users">Verified Users - Any verified Carank user can see</option>
              <option value="booked-with-students">Booked Students Only - Only students I've completed a lesson with on carank</option>
              <option value="white+black-list">Custom List - Specific approved users, minus blocked ones</option>
            </select>
            
            {/* Number Whitelist Management */}
            {numberVisibility === 'white+black-list' && (
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Whitelist - Approved Students
                </label>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Select students who can see your phone number
                </p>
                
                {loadingStudents ? (
                  <div style={{ padding: '1rem', textAlign: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Loading students...</p>
                  </div>
                ) : studentsError ? (
                  <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0', color: '#dc2626', fontSize: '0.875rem' }}>
                    {studentsError}
                  </div>
                ) : availableStudents.length === 0 ? (
                  <div style={{ padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0', color: '#92400e', fontSize: '0.875rem' }}>
                    No students with completed lessons found. Students will appear here after you complete your first lesson.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0', padding: '0.75rem', background: '#f9fafb' }}>
                    {availableStudents.map(student => (
                      <label key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                        <input
                          type="checkbox"
                          checked={numberWhitelist.includes(student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNumberWhitelist(prev => [...prev, student._id]);
                              // Remove from number blacklist if present
                              setNumberBlacklist(prev => prev.filter(id => id !== student._id));
                            } else {
                              setNumberWhitelist(prev => prev.filter(id => id !== student._id));
                            }
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#10b981' }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>{student.fullName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Number Blacklist Management */}
            {numberVisibility === 'white+black-list' && (
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Blacklist - Blocked Students
                </label>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  Select students who cannot see your phone number
                </p>
                
                {loadingStudents ? (
                  <div style={{ padding: '1rem', textAlign: 'center', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Loading students...</p>
                  </div>
                ) : studentsError ? (
                  <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0', color: '#dc2626', fontSize: '0.875rem' }}>
                    {studentsError}
                  </div>
                ) : availableStudents.length === 0 ? (
                  <div style={{ padding: '1rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '0', color: '#92400e', fontSize: '0.875rem' }}>
                    No students with completed lessons found. Students will appear here after you complete your first lesson.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0', padding: '0.75rem', background: '#f9fafb' }}>
                    {availableStudents.map(student => (
                      <label key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0' }}>
                        <input
                          type="checkbox"
                          checked={numberBlacklist.includes(student._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNumberBlacklist(prev => [...prev, student._id]);
                              // Remove from number whitelist if present
                              setNumberWhitelist(prev => prev.filter(id => id !== student._id));
                            } else {
                              setNumberBlacklist(prev => prev.filter(id => id !== student._id));
                            }
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#ef4444' }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>{student.fullName}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div style={{
              padding: '1rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0',
              fontSize: '0.8125rem',
              color: '#1e40af',
              lineHeight: '1.6',
              marginTop: '1rem'
            }}>
              <strong>Note:</strong> This setting controls who can see your phone number on your instructor profile. For privacy and safety, we recommend starting with 'Booked Students Only' so only students you've completed lessons with can contact you directly. By default, unverified users will NOT be able to see your phone number, unless you choose the 'anyone' option in which case there are no restrctions.
            </div>
          </div>
        </div>

        {/* Availability Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#f59e0b' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Availability
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
              Teaching Schedule
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
              Add your available teaching hours. You can add multiple time slots for each day.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Day</label>
                  <select className="select w-full" value={availSelect} onChange={(e)=>setAvailSelect(e.target.value)}>
                    <option value="">Choose day</option>
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Start</label>
                  <input type="time" className="input w-full" value={availStart} onChange={(e)=>setAvailStart(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>End</label>
                  <input type="time" className="input w-full" value={availEnd} onChange={(e)=>setAvailEnd(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" onClick={addAvailability} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Slot
                </button>
              </div>
            </div>
            {availability.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                {availability.map(a => {
                  const key = `${a.day}-${a.start}-${a.end}`;
                  return (
                    <span key={key} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.875rem',
                      borderRadius: '0.5rem',
                      background: '#fef3c7',
                      color: '#78350f',
                      fontSize: '0.8125rem',
                      fontWeight: '500',
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {a.day.slice(0, 3)} {a.start}–{a.end}
                      <button 
                        type="button" 
                        onClick={()=>removeItem('av', key)}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          marginLeft: '0.25rem',
                          padding: 0
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fde68a'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#78350f' }}>
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Exceptions Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Exceptions (optional)
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.5' }}>
            Add time ranges when you're unavailable (e.g., holidays). Can span multiple days.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Start Date</label>
                <input type="date" className="input w-full" value={excStartDate} onChange={(e)=>setExcStartDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Start Time</label>
                <input type="time" className="input w-full" value={excStartTime} onChange={(e)=>setExcStartTime(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>End Date</label>
                <input type="date" className="input w-full" value={excEndDate} onChange={(e)=>setExcEndDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>End Time</label>
                <input type="time" className="input w-full" value={excEndTime} onChange={(e)=>setExcEndTime(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn" onClick={()=>{
                if (!excStartDate || !excStartTime || !excEndDate || !excEndTime) return;
                const startMs = new Date(`${excStartDate}T${excStartTime}:00`).getTime();
                const endMs = new Date(`${excEndDate}T${excEndTime}:00`).getTime();
                if (startMs >= endMs) return;
                const key = `${excStartDate}-${excStartTime}-${excEndDate}-${excEndTime}`;
                if (exceptions.some(e => `${e.startDate}-${e.startTime}-${e.endDate}-${e.endTime}` === key)) return;
                setExceptions(prev => [...prev, { startDate: excStartDate, startTime: excStartTime, endDate: excEndDate, endTime: excEndTime }]);
                setExcStartDate(''); setExcStartTime(''); setExcEndDate(''); setExcEndTime('');
              }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Exception
              </button>
            </div>
          </div>
          {exceptions.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
              {exceptions.map(e => {
                const key = `${e.startDate}-${e.startTime}-${e.endDate}-${e.endTime}`;
                const isSameDay = e.startDate === e.endDate;
                const displayText = isSameDay 
                  ? `${e.startDate} ${e.startTime}–${e.endTime}`
                  : `${e.startDate} ${e.startTime} → ${e.endDate} ${e.endTime}`;
                return (
                  <span key={key} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                    background: '#fee2e2', color: '#991b1b', fontSize: '0.8125rem', fontWeight: '500'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    {displayText}
                    <button
                      type="button"
                      onClick={()=>setExceptions(prev => prev.filter(x => `${x.startDate}-${x.startTime}-${x.endDate}-${x.endTime}` !== key))}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.2s', marginLeft: '0.25rem', padding: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#991b1b' }}>
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Description Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#8b5cf6' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            About You
          </h3>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginBottom: '0.375rem' }}>
              Profile Description
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
              Share your teaching philosophy, experience, and what makes you a great instructor
            </p>
            <textarea 
              className="input w-full" 
              rows={6} 
              placeholder="Example: I'm a patient and enthusiastic driving instructor with 10+ years of experience. I specialize in helping nervous learners build confidence and have a 95% first-time pass rate. My calm teaching approach and flexible schedule make learning to drive stress-free and enjoyable." 
              value={instForm.description} 
              onChange={onInstChange('description')}
              style={{ 
                resize: 'vertical', 
                minHeight: '140px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9375rem',
                lineHeight: '1.6'
              }}
            />
          </div>
        </div>
        
        {/* Form Actions Footer */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '2px solid #e2e8f0',
        gap: '0.75rem'
      }}>
        {ownerInst && (
          <button
            className="btn btn-secondary"
            onClick={() => setMode('summary')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={instSubmitting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            minWidth: '150px',
            justifyContent: 'center',
            fontSize: '0.875rem',
            fontWeight: '600'
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
      </form>
    </div>
  );
};

export default InstructorCreateForm;
