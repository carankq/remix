import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { InstructorCard } from './InstructorCard';
import { Alert } from './Alert';

interface InstructorCreateFormProps {
  onCreated?: (instructor: any) => void;
  onCancel?: () => void; // Callback when user cancels editing
  initialProfile?: any | null; // Profile data from server
  skipFetch?: boolean; // Skip client-side fetching
  initialMode?: 'summary' | 'edit'; // Control initial mode (default: auto-detect)
}

const PRESET_LANGUAGES = [
  'British Sign Language',
  'English',
  'Spanish',
  'French',
  'Urdu',
  'Polish'
];

const VEHICLE_TYPES = ['Manual', 'Automatic', 'Electric'] as const;

const DEAL_OPTIONS = [
  '1st hour free',
  '1st hour 50% off',
  '1st 2 hours 5% off',
  '1st 2 hours 10% off',
  '1st 2 hours 15% off',
  '1st 2 hours 20% off',
  '1st 4 hours 5% off',
  '1st 4 hours 10% off',
  '1st 4 hours 15% off',
  '1st 4 hours 20% off'
] as const;

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const InstructorCreateForm: React.FC<InstructorCreateFormProps> = ({ 
  onCreated,
  onCancel,
  initialProfile = null,
  skipFetch = false,
  initialMode = undefined
}) => {
  const { user, token } = useAuth();
  const [instSubmitting, setInstSubmitting] = useState(false);
  const [instError, setInstError] = useState<string | null>(null);
  const [instSuccess, setInstSuccess] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{ title: string; message: string; type: 'error' | 'success' | 'warning' | 'info' }>({
    title: '',
    message: '',
    type: 'error'
  });
  const [instForm, setInstForm] = useState({
    name: '',
    brandName: '',
    description: '',
    pricePerHour: '',
    gender: '',
    yearsOfExperience: '',
    company: '',
    phone: '',
    email: '',
    image: '',
  });
  const [vehicles, setVehicles] = useState<Array<{ type: string; licensePlateNumber: string }>>([]);
  const [vehiclesModified, setVehiclesModified] = useState(false); // Track if vehicles were changed
  const [deals, setDeals] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  
  // Credential References state
  const [credentialType, setCredentialType] = useState<'ADI' | 'PDI' | ''>('');
  const [credentialExpiry, setCredentialExpiry] = useState(''); // YYYY-MM-DD format
  const [credentialReferenceCode, setCredentialReferenceCode] = useState('');
  const [credentialsModified, setCredentialsModified] = useState(false); // Track if credentials were changed
  
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

  // Helper to show alert popup
  const showAlertPopup = (title: string, message: string, type: 'error' | 'success' | 'warning' | 'info' = 'error') => {
    setAlertConfig({ title, message, type });
    setShowAlert(true);
  };

  // Owner listing summary state
  const [ownerInst, setOwnerInst] = useState<any | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [mode, setMode] = useState<'summary' | 'edit' | 'loading'>('loading');

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

  useEffect(() => {
    // If skipFetch is true, use initialProfile instead of fetching
    if (skipFetch) {
      if (initialProfile) {
        setOwnerInst(initialProfile);
        // Use initialMode prop if provided, otherwise default to 'summary' for existing profile
        setMode(initialMode !== undefined ? initialMode : 'summary');
      } else {
        setOwnerInst(null);
        // Use initialMode prop if provided, otherwise default to 'edit' for new profile
        setMode(initialMode !== undefined ? initialMode : 'edit');
      }
      return;
    }
    
    // Otherwise, fetch from API (legacy behavior)
    if (user?.accountType === 'instructor') refreshOwner(); 
  }, [user?.accountType, user?.id, skipFetch, initialProfile, initialMode]);

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
      yearsOfExperience: ownerInst.yearsOfExperience != null ? String(ownerInst.yearsOfExperience) : '',
      company: ownerInst.company || '',
      phone: ownerInst.phone || prev.phone,
      email: ownerInst.email || prev.email,
      image: ownerInst.image || ''
    }));
    setPostcodes(Array.isArray(ownerInst.outcodes) ? ownerInst.outcodes : (ownerInst.outcodes ? [ownerInst.outcodes] : []));
    setVehicles(Array.isArray(ownerInst.vehicles) ? ownerInst.vehicles.map((v: any) => ({ 
      type: v.type || 'Manual', 
      licensePlateNumber: v.licensePlateNumber || ''
    })) : []);
    setDeals(Array.isArray(ownerInst.deals) ? ownerInst.deals : []);
    setLanguages(Array.isArray(ownerInst.languages) ? ownerInst.languages : []);
    
    // Prefill credential references
    if (ownerInst.credentialReferences && typeof ownerInst.credentialReferences === 'object') {
      setCredentialType(ownerInst.credentialReferences.type || '');
      setCredentialReferenceCode(ownerInst.credentialReferences.referenceCode || '');
      
      // Handle expiry - can be date-time string or Unix timestamp
      if (ownerInst.credentialReferences.expiry) {
        const expiry = ownerInst.credentialReferences.expiry;
        let expiryDate: Date;
        
        if (typeof expiry === 'number') {
          // Unix timestamp (handle both ms and seconds)
          expiryDate = new Date(expiry > 10000000000 ? expiry : expiry * 1000);
        } else {
          // ISO date-time string
          expiryDate = new Date(expiry);
        }
        
        setCredentialExpiry(expiryDate.toISOString().slice(0, 10)); // YYYY-MM-DD
      } else {
        setCredentialExpiry('');
      }
    } else {
      setCredentialType('');
      setCredentialExpiry('');
      setCredentialReferenceCode('');
    }
    
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

  const removeItem = (type: 'lang' | 'pc' | 'av', value: string) => {
    if (type === 'lang') setLanguages(prev => prev.filter(x => x !== value));
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

      const payload: any = {
        ownerId: user.id,
        name: instForm.name.trim(),
        brandName: instForm.brandName.trim(),
        description: instForm.description.trim() || undefined,
        pricePerHour: instForm.pricePerHour.trim() !== '' ? Math.min(60, parseFloat(instForm.pricePerHour)) : undefined,
        outcodes: postcodes, // array of outcodes (first part of postcodes)
        gender: (instForm.gender === 'Male' || instForm.gender === 'Female') ? instForm.gender : undefined,
        deals: deals,
        yearsOfExperience: instForm.yearsOfExperience ? Number(instForm.yearsOfExperience) : undefined,
        company: instForm.company.trim() || undefined,
        phone: instForm.phone.trim() || undefined,
        email: instForm.email.trim() || undefined,
        image: instForm.image.trim() || undefined,
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
      
      // Determine if this is an update
      const isUpdate = Boolean(ownerInst && (ownerInst._id || ownerInst.id));
      
      // Add credential references if:
      // 1. Creating new profile (no ownerInst), OR
      // 2. Updating existing profile AND credentialsModified is true
      if (!isUpdate || credentialsModified) {
        if (credentialType && credentialReferenceCode) {
          payload.credentialReferences = {
            type: credentialType,
            referenceCode: credentialReferenceCode.trim()
          };
          
          // Add expiry if provided (convert to Unix timestamp in ms)
          if (credentialExpiry) {
            const expiryDate = new Date(credentialExpiry);
            payload.credentialReferences.expiry = expiryDate.getTime();
          }
        }
      }
      
      // Only include vehicles if: 
      // 1. Creating new profile (no ownerInst), OR
      // 2. Updating existing profile AND vehiclesModified is true
      if (!isUpdate || vehiclesModified) {
        payload.vehicles = vehicles.filter(v => v.type && v.licensePlateNumber); // Only include complete vehicles
      }
      
      // Validation: credentials required for new profiles OR when updating credentials
      const credentialsRequired = !isUpdate || credentialsModified;
      // Validation: vehicles required only if creating new profile OR updating vehicles
      const vehiclesRequired = !isUpdate || vehiclesModified;
      
      if (!payload.name || !payload.brandName || postcodes.length === 0) {
        showAlertPopup(
          'Missing Required Fields',
          'Please complete the required fields: name, brand name, and coverage outcode(s).',
          'warning'
        );
        setInstSubmitting(false);
        return;
      }

      if (credentialsRequired && (!credentialType || !credentialReferenceCode)) {
        showAlertPopup(
          'Missing Credentials',
          'Driving instructor credentials (type and reference code) are required. Your profile will not appear in search results without valid credentials.',
          'warning'
        );
        setInstSubmitting(false);
        return;
      }
      
      if (vehiclesRequired && vehicles.length === 0) {
        showAlertPopup(
          'Missing Vehicles',
          'Please add at least one vehicle.',
          'warning'
        );
        setInstSubmitting(false);
        return;
      }
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
          name: '', brandName: '', description: '', pricePerHour: '', gender: '', yearsOfExperience: '', company: '', phone: '', email: '', image: ''
        });
        setVehicles([]);
        setDeals([]);
        setLanguages([]);
        setAvailability([]);
        setExceptions([]);
        setLangSelect('');
        setPostcodes([]);
        setPostcodeInput('');
        setAvailSelect('');
        setAvailStart('');
        setAvailEnd('');
        showAlertPopup(
          'Success!',
          'Instructor listing created successfully.',
          'success'
        );
        if (onCreated) {
          onCreated(data);
        } else {
        await refreshOwner();
        setMode('summary');
        }
      } else if (isUpdate && response.status === 200) {
        showAlertPopup(
          'Success!',
          'Instructor listing updated successfully.',
          'success'
        );
        if (onCreated) {
          onCreated(data);
        } else {
        await refreshOwner();
        setMode('summary');
        }
      } else if (response.status === 400) {
        showAlertPopup(
          'Validation Error',
          data?.error || 'Please check your details and try again.',
          'error'
        );
      } else if (response.status === 404) {
        showAlertPopup(
          'Not Found',
          data?.error || 'Instructor not found.',
          'error'
        );
      } else {
        showAlertPopup(
          'Error',
          data?.error || (isUpdate ? 'Something went wrong while updating the listing.' : 'Something went wrong while creating the listing.'),
          'error'
        );
      }
    } catch {
      showAlertPopup(
        'Network Error',
        'Unable to save the listing. Please check your connection and try again.',
        'error'
      );
    } finally {
      setInstSubmitting(false);
    }
  };

  if (user?.accountType !== 'instructor') return null;

  // Section styling constants for consistency
  const sectionStyle = {
    padding: '1.5rem',
    background: '#ffffff',
    borderRadius: '0',
    border: '2px solid #e5e7eb',
    marginBottom: '1.5rem'
  };

  const sectionHeaderStyle = {
    fontSize: '0.875rem',
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "'Space Grotesk', sans-serif",
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #e5e7eb'
  };

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
      {/* Form Header */}
      <div style={{
        background: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '0',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
      <h2 style={{ 
          fontSize: '1.5rem', 
        fontWeight: '700', 
          color: '#111827',
        marginBottom: '0.5rem',
          fontFamily: "'Space Grotesk', sans-serif"
      }}>
          {ownerInst ? 'Edit Your Instructor Profile' : 'Create Your Instructor Profile'}
      </h2>
      <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          {ownerInst ? 'Update your profile information to keep students informed' : 'Fill out the form below to create your instructor listing and start connecting with students'}
        </p>
      </div>
      
      {ownerError && (
        <div style={{
          fontSize: '0.875rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '0',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Error</strong>
          {ownerError}
          <div style={{ marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={refreshOwner}>Retry</button>
          </div>
        </div>
      )}
      {instSuccess && (
        <div style={{
          fontSize: '0.875rem',
          color: '#059669',
          background: '#f0fdf4',
          border: '2px solid #10b981',
          borderRadius: '0',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          {instSuccess}
        </div>
      )}
      {instError && (
        <div style={{
          fontSize: '0.875rem',
          color: '#dc2626',
          background: '#fef2f2',
          border: '2px solid #ef4444',
          borderRadius: '0',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          {instError}
        </div>
      )}
      <form onSubmit={submitInstructor} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Credential References Section */}
        <div style={sectionStyle}>
          <h3 style={sectionHeaderStyle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            Driving Instructor Credentials
          </h3>
          {ownerInst && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={credentialsModified}
                onChange={(e) => setCredentialsModified(e.target.checked)}
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  cursor: 'pointer',
                  accentColor: '#2563eb'
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: '500' }}>
                Update credentials
              </span>
            </label>
          )}
          
          <div style={{
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '0',
            padding: '0.875rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div>
              <p style={{ fontSize: '0.8125rem', color: '#1e40af', fontWeight: '600', marginBottom: '0.25rem' }}>
                Keep Your Credentials Up to Date
              </p>
              <p style={{ fontSize: '0.75rem', color: '#1e3a8a', lineHeight: '1.5', margin: 0 }}>
                🔒 <strong>Security:</strong> This information is never shared publicly and is used only for verification.<br/>
                ⚠️ <strong>Important:</strong> Your profile will not appear in search results if your credentials are missing or expired. Please ensure they are current.<br/>
                🔄 <strong>Note:</strong> When credentials are updated, your profile will be temporarily removed from search results while verification checks take place. This ensures all instructors meet safety standards.
              </p>
            </div>
          </div>
          
          {/* Warning when credentials update is enabled */}
          {ownerInst && credentialsModified && (
            <div style={{
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '0',
              padding: '0.875rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <p style={{ fontSize: '0.8125rem', color: '#92400e', fontWeight: '600', marginBottom: '0.25rem' }}>
                  Important: This will update your credential information
                </p>
                <p style={{ fontSize: '0.75rem', color: '#78350f', lineHeight: '1.5', margin: 0 }}>
                  Ensure all credential details are accurate. Your profile visibility depends on having valid, up-to-date credentials.<br/>
                  Your profile will be temporarily hidden from search results during the verification process.
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{
            opacity: (ownerInst && !credentialsModified) ? 0.5 : 1,
            pointerEvents: (ownerInst && !credentialsModified) ? 'none' : 'auto'
          }}>
            <div>
              <label className="instructor-form-label">
                Credential Type
              </label>
              <select 
                className="instructor-form-select"
                value={credentialType}
                disabled={ownerInst && !credentialsModified}
                onChange={(e) => setCredentialType(e.target.value as 'ADI' | 'PDI' | '')}
              >
                <option value="">Select type</option>
                <option value="ADI">ADI (Approved Driving Instructor)</option>
                <option value="PDI">PDI (Potential Driving Instructor)</option>
              </select>
              <p className="instructor-form-helper">
                Your instructor qualification
              </p>
            </div>
            
            <div>
              <label className="instructor-form-label">
                Reference Code
              </label>
              <input 
                className="instructor-form-input"
                type="text"
                placeholder="6 digits (e.g., 123456)"
                maxLength={6}
                value={credentialReferenceCode}
                disabled={ownerInst && !credentialsModified}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setCredentialReferenceCode(value);
                }}
              />
              <p className="instructor-form-helper">
                Unique 6-digit reference code
              </p>
            </div>
            
            <div>
              <label className="instructor-form-label">
                Expiry Date
              </label>
              <input 
                className="instructor-form-input"
                type="date"
                value={credentialExpiry}
                disabled={ownerInst && !credentialsModified}
                onChange={(e) => setCredentialExpiry(e.target.value)}
              />
              <p className="instructor-form-helper">
                When your credential expires
              </p>
            </div>
          </div>
          
          {credentialType && credentialReferenceCode && (
            <div style={{
              marginTop: '1rem',
              padding: '0.875rem',
              background: credentialType === 'ADI' ? '#ecfdf5' : '#fdf2f8',
              border: `2px solid ${credentialType === 'ADI' ? '#10b981' : '#ec4899'}`,
              borderRadius: '0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={credentialType === 'ADI' ? '#10b981' : '#ec4899'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <div>
                <p style={{ fontSize: '0.8125rem', color: credentialType === 'ADI' ? '#065f46' : '#831843', fontWeight: '600', marginBottom: '0.25rem' }}>
                  Credentials Added
                </p>
                <p style={{ fontSize: '0.75rem', color: credentialType === 'ADI' ? '#047857' : '#9f1239', lineHeight: '1.4' }}>
                  {credentialType} credential #{credentialReferenceCode}
                  {credentialExpiry && ` expires on ${new Date(credentialExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                </p>
              </div>
            </div>
          )}
        </div>
        
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
              <label className="instructor-form-label">
                Full Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input className="instructor-form-input" placeholder="e.g., John Smith" value={instForm.name} onChange={onInstChange('name')} />
            </div>
            <div>
              <label className="instructor-form-label">
                Brand Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input className="instructor-form-input" placeholder="e.g., Smith Driving School" value={instForm.brandName} onChange={onInstChange('brandName')} />
              <p className="instructor-form-helper">
                How learners will identify you
              </p>
              <div style={{ 
                marginTop: '0.5rem',
                padding: '0.5rem 0.75rem',
                background: '#f8fafc',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
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
              <label className="instructor-form-label">
                Company Name
              </label>
              <input className="instructor-form-input" placeholder="e.g., ABC Driving Academy" value={instForm.company} onChange={onInstChange('company')} />
            </div>
            {
              mode !== 'edit' ?
            <div>
              <label className="instructor-form-label">
                Gender
              </label>
              <select 
                className="instructor-form-select"
                value={instForm.gender}
                onChange={onInstChange('gender')}
              >
                <option value="">Choose below</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>              
              
              : null
            }

            <div>
              <label className="instructor-form-label">
                Profile Image URL
              </label>
              <input className="instructor-form-input" placeholder="https://example.com/image.jpg" value={instForm.image} onChange={onInstChange('image')} />
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
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
              Coverage Areas (Outcodes) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem', lineHeight: '1.5' }}>
              Add outcodes (the first part of a postcode before the space) to define your teaching area
            </p>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#1e40af', 
              background: '#eff6ff', 
              border: '2px solid #bfdbfe',
              borderRadius: '0',
              padding: '0.75rem',
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              <strong>Examples:</strong> SW1, NW3, M1, B15<br/>
              <strong>What's an outcode?</strong> The first part of a UK postcode (e.g., "SW1" from "SW1A 1AA")<br/>
              <strong>How it works:</strong> Students search using outcodes to find instructors in their area. The more outcodes you add, the larger your coverage area.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <input 
                className="instructor-form-input" 
                placeholder="Enter postcode (e.g., SW1, NW3, M1)" 
                value={postcodeInput} 
                onChange={(e)=>setPostcodeInput(e.target.value.toUpperCase())} 
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
                    borderRadius: '0',
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
            Vehicles & Pricing
          </h3>
          
          {/* Vehicles */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                Vehicles <span style={{ color: '#dc2626' }}>*</span>
              </label>
              {ownerInst && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={vehiclesModified}
                    onChange={(e) => setVehiclesModified(e.target.checked)}
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      cursor: 'pointer',
                      accentColor: '#2563eb'
                    }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: '500' }}>
                    Update vehicles
                  </span>
                </label>
              )}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Add the vehicles you use for instruction
            </p>
            <p style={{ fontSize: '0.75rem', color: '#059669', marginBottom: '1rem', fontStyle: 'italic' }}>
              🔒 License plate numbers are kept private and not shown publicly
            </p>
            
            {/* Warning when vehicles update is enabled */}
            {ownerInst && vehiclesModified && (
              <div style={{
                background: '#fef3c7',
                border: '2px solid #f59e0b',
                borderRadius: '0',
                padding: '0.875rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                  <p style={{ fontSize: '0.8125rem', color: '#92400e', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Important: This will override all existing vehicle information
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#78350f', lineHeight: '1.4' }}>
                    Make sure to add all vehicles you want to keep. Any vehicles not listed below will be removed when you save.
                  </p>
                </div>
              </div>
            )}
            
            {vehicles.map((vehicle, idx) => (
              <div key={idx} style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 2fr auto', 
                gap: '0.5rem', 
                marginBottom: '0.75rem',
                alignItems: 'start',
                opacity: (ownerInst && !vehiclesModified) ? 0.5 : 1,
                pointerEvents: (ownerInst && !vehiclesModified) ? 'none' : 'auto'
              }}>
                <select 
                  className="instructor-form-select"
                  value={vehicle.type}
                  disabled={ownerInst && !vehiclesModified}
                  onChange={(e) => {
                    const updated = [...vehicles];
                    updated[idx].type = e.target.value;
                    setVehicles(updated);
                  }}
                >
                  <option value="">Type</option>
                  {VEHICLE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
              </select>
                <input
                  className="instructor-form-input"
                  placeholder="License Plate (e.g., ABC 123)"
                  value={vehicle.licensePlateNumber}
                  disabled={ownerInst && !vehiclesModified}
                  onChange={(e) => {
                    const updated = [...vehicles];
                    updated[idx].licensePlateNumber = e.target.value;
                    setVehicles(updated);
                  }}
                />
                <button
                  type="button"
                  disabled={ownerInst && !vehiclesModified}
                  onClick={() => setVehicles(vehicles.filter((_, i) => i !== idx))}
                  style={{
                    padding: '0.75rem',
                    background: '#fef2f2',
                    border: '2px solid #ef4444',
                    borderRadius: '0',
                    color: '#dc2626',
                    cursor: (ownerInst && !vehiclesModified) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
            </div>
            ))}
            
            <button
              type="button"
              disabled={ownerInst && !vehiclesModified}
              onClick={() => setVehicles([...vehicles, { type: '', licensePlateNumber: '' }])}
              className="btn btn-secondary"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '0.875rem', 
                marginTop: '0.5rem',
                opacity: (ownerInst && !vehiclesModified) ? 0.5 : 1,
                cursor: (ownerInst && !vehiclesModified) ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Vehicle
            </button>
          </div>

          {/* Pricing & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="instructor-form-input" 
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
              <input className="instructor-form-input" type="number" placeholder="5" value={instForm.yearsOfExperience} onChange={onInstChange('yearsOfExperience')} />
            </div>
          </div>
          
          {/* Deals */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
              Deals & Offers
            </label>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Select any deals you want to offer to new students
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {DEAL_OPTIONS.map(deal => (
                <label key={deal} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border: `2px solid ${deals.includes(deal) ? '#1e40af' : '#e5e7eb'}`,
                  background: deals.includes(deal) ? '#eff6ff' : '#ffffff',
                  borderRadius: '0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={deals.includes(deal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDeals([...deals, deal]);
                      } else {
                        setDeals(deals.filter(d => d !== deal));
                      }
                    }}
                    style={{ marginRight: '0.5rem' }}
                  />
                  <span style={{ 
                    fontSize: '0.8125rem', 
                    fontWeight: deals.includes(deal) ? '600' : '500',
                    color: deals.includes(deal) ? '#1e40af' : '#374151'
                  }}>
                    {deal}
                  </span>
                </label>
              ))}
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
              <input className="instructor-form-input" placeholder="+44 7123 456789" value={instForm.phone} onChange={onInstChange('phone')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input className="instructor-form-input" placeholder="instructor@example.com" value={instForm.email} onChange={onInstChange('email')} />
            </div>
          </div>
        </div>

        {/* Specializations Section */}

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
              <select className="instructor-form-select" value={langSelect} onChange={(e)=>setLangSelect(e.target.value)}>
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
                    borderRadius: '0',
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
              className="instructor-form-select" 
              value={publicAvailability} 
              onChange={(e) => setPublicAvailability(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              <option value="off">Off - No one can see my availability</option>
              <option value="anyone">Anyone - No restrictions, everyone can see</option>
              {/* <option value="verified-users">Verified Users - Any verified Carank user can see</option>
              <option value="booked-with-students">Booked Students Only - Only students I've completed a lesson with on carank</option>
              <option value="white+black-list">Custom List - Specific approved users, minus blocked ones</option> */}
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
              <strong>Note:</strong> This setting controls the visibility of your available time slots on the enquiry section. Students will always see your profile if its active.
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
              className="instructor-form-select" 
              value={numberVisibility} 
              onChange={(e) => setNumberVisibility(e.target.value)}
              style={{ marginBottom: '1rem' }}
            >
              <option value="off">Off - No one can see my phone number</option>
              <option value="anyone">Anyone - No restrictions, everyone can see</option>
              {/* <option value="verified-users">Verified Users - Any verified Carank user can see</option>
              <option value="booked-with-students">Booked Students Only - Only students I've completed a lesson with on carank</option>
              <option value="white+black-list">Custom List - Specific approved users, minus blocked ones</option> */}
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
              <strong>Note:</strong> This setting controls who can see your phone number on your instructor profile. Students can still make enquires to you via the website, and you can view their messages in your dashboard without the need of making your number public.
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
                  <select className="instructor-form-select" value={availSelect} onChange={(e)=>setAvailSelect(e.target.value)}>
                    <option value="">Choose day</option>
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Start</label>
                  <input type="time" className="instructor-form-input" value={availStart} onChange={(e)=>setAvailStart(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>End</label>
                  <input type="time" className="instructor-form-input" value={availEnd} onChange={(e)=>setAvailEnd(e.target.value)} />
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
                      borderRadius: '0',
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
                <input type="date" className="instructor-form-input" value={excStartDate} onChange={(e)=>setExcStartDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Start Time</label>
                <input type="time" className="instructor-form-input" value={excStartTime} onChange={(e)=>setExcStartTime(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>End Date</label>
                <input type="date" className="instructor-form-input" value={excEndDate} onChange={(e)=>setExcEndDate(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: '#64748b', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>End Time</label>
                <input type="time" className="instructor-form-input" value={excEndTime} onChange={(e)=>setExcEndTime(e.target.value)} />
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
                    padding: '0.5rem 0.875rem', borderRadius: '0',
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
              className="instructor-form-input" 
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
      <div className="instructor-form-actions" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '2px solid #e5e7eb',
        gap: '0.75rem'
      }}>
        {ownerInst && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              // If onCancel callback is provided, use it; otherwise fall back to summary mode
              if (onCancel) {
                onCancel();
              } else {
                setMode('summary');
              }
            }}
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
      
      {/* Alert Popup */}
      <Alert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default InstructorCreateForm;
