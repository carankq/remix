import "../tailwind.css";
import { useEffect, useState } from 'react';
import { Search, RotateCcw } from './Icons';

type FilterCriteria = {
  priceRange: [number, number];
  postcode: string;
  gender: string;
  vehicleType: string;
  minExperience: number;
  language?: string;
};

type InitialFilters = {
  postcode?: string;
  gender?: string;
  vehicleType?: string;
  language?: string;
};

export function SearchSection({ 
  onSearch, 
  autoSearch = false, 
  initialFilters 
}: { 
  onSearch: (query: string, filters: FilterCriteria) => void; 
  autoSearch?: boolean;
  initialFilters?: InitialFilters;
}) {
  // Initialize filters with provided values or defaults
  const [filters, setFilters] = useState<FilterCriteria>({
    priceRange: [20, 60],
    postcode: initialFilters?.postcode || '',
    gender: initialFilters?.gender || '',
    vehicleType: initialFilters?.vehicleType || '',
    minExperience: 0,
    language: initialFilters?.language || ''
  });
  
  // Initialize postcodes from initialFilters
  const [postcodes, setPostcodes] = useState<string[]>(
    initialFilters?.postcode ? initialFilters.postcode.split(',').map(p => p.trim()).filter(Boolean) : []
  );
  const [pendingPostcode, setPendingPostcode] = useState('');
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    const normalizedValue = key === 'postcode' && typeof value === 'string' ? value.toUpperCase() : value;
    setFilters({ ...filters, [key]: normalizedValue });
  };

  const startNewPostcode = () => { setPendingPostcode(''); setEditingIndex(-1); };
  const removePostcode = (pc: string, idx?: number) => {
    const next = postcodes.filter((p, i) => !(p === pc && (idx === undefined || idx === i)));
    setPostcodes(next);
    if (idx !== undefined && idx === editingIndex) { setPendingPostcode(''); setEditingIndex(-1); }
  };

  const handleSearch = () => { onSearch('', { ...filters, postcode: postcodes.join(',') }); };
  const clearFilters = () => { const d: FilterCriteria = { priceRange: [20, 60], postcode: '', gender: '', vehicleType: '', minExperience: 0, language: '' }; setFilters(d); setPostcodes([]); setPendingPostcode(''); if (autoSearch) onSearch('', d); };

  useEffect(() => { if (autoSearch) { onSearch('', { ...filters, postcode: postcodes.join(',') }); } }, []);

  const handlePostcodeInputChange = (raw: string) => {
    const value = raw.toUpperCase();
    setPendingPostcode(value);
    const trimmed = value.trim();
    if (editingIndex === -1) {
      if (trimmed.length > 0) { const next = [...postcodes, trimmed]; setPostcodes(next); setEditingIndex(next.length - 1); }
    } else {
      const next = [...postcodes];
      if (trimmed.length === 0) { next.splice(editingIndex, 1); setPostcodes(next); setEditingIndex(-1); }
      else { next[editingIndex] = trimmed; setPostcodes(next); }
    }
  };

  return (
    <section style={{
      padding: '3.5rem 0 4.5rem',
      position: 'relative',
      background: '#1e40af'
    }}>

      <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '1rem',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.02em',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              Find Your Perfect Driving Instructor
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '400'
            }}>
              Search from verified instructors in your area
            </p>
          </div>

          {/* Main Search Card */}
          <div style={{
            background: 'rgb(255, 255, 255)',
            borderRadius: '0',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.5)',
            marginBottom: '2rem'
          }}>
            {/* Filter Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Postcode */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  📍 Location
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    value={pendingPostcode} 
                    onChange={(e) => handlePostcodeInputChange(e.target.value)} 
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); startNewPostcode(); } }} 
                    placeholder="Enter postcode" 
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      fontSize: '1rem',
                      color: '#111827',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      fontWeight: '500'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  👤 Instructor Gender
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={filters.gender} 
                    onChange={(e) => handleFilterChange('gender', e.target.value)} 
                    style={{
                      width: '100%',
                      padding: '1rem 3rem 1rem 3rem',
                      fontSize: '1rem',
                      color: filters.gender ? '#111827' : '#94a3b8',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      cursor: 'pointer',
                      appearance: 'none',
                      fontWeight: '500'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Any Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  🚗 Vehicle Type
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={filters.vehicleType} 
                    onChange={(e) => handleFilterChange('vehicleType', e.target.value)} 
                    style={{
                      width: '100%',
                      padding: '1rem 3rem 1rem 3rem',
                      fontSize: '1rem',
                      color: filters.vehicleType ? '#111827' : '#94a3b8',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      cursor: 'pointer',
                      appearance: 'none',
                      fontWeight: '500'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Any Type</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Both">Both</option>
                  </select>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <path d="M3 13l2-5a3 3 0 0 1 3-2h6a3 3 0 0 1 3 2l2 5"/>
                    <rect x="3" y="13" width="18" height="6" rx="2"/>
                    <circle cx="7.5" cy="17" r="1.5"/>
                    <circle cx="16.5" cy="17" r="1.5"/>
                  </svg>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {/* Language */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  marginBottom: '0.625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  🌍 Language
                </label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={filters.language} 
                    onChange={(e) => handleFilterChange('language', e.target.value)} 
                    style={{
                      width: '100%',
                      padding: '1rem 3rem 1rem 3rem',
                      fontSize: '1rem',
                      color: filters.language ? '#111827' : '#94a3b8',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      background: '#ffffff',
                      cursor: 'pointer',
                      appearance: 'none',
                      fontWeight: '500'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Any Language</option>
                    <option value="British Sign Language">British Sign Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Polish">Polish</option>
                  </select>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(postcodes.length > 0 || filters.gender || filters.vehicleType || filters.language) && (
              <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '0',
                marginBottom: '1.5rem',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"/>
                    <line x1="4" y1="10" x2="4" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12" y2="3"/>
                    <line x1="20" y1="21" x2="20" y2="16"/>
                    <line x1="20" y1="12" x2="20" y2="3"/>
                    <line x1="1" y1="14" x2="7" y2="14"/>
                    <line x1="9" y1="8" x2="15" y2="8"/>
                    <line x1="17" y1="16" x2="23" y2="16"/>
                  </svg>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>
                    Active Filters
                  </span>
          </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {postcodes.map((pc, idx) => {
                  const isLast = idx === postcodes.length - 1;
                  return (
                    <span key={`pc-${idx}`} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                        padding: '0.5rem 0.875rem',
                      background: 'white',
                      color: '#1e40af',
                        borderRadius: '0',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{pc}</span>
                        <button type="button" aria-label="Remove postcode" onClick={() => removePostcode(pc, idx)} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                          padding: 0
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                      {isLast && (
                          <button type="button" aria-label="Add new postcode" onClick={startNewPostcode} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            padding: 0
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      )}
                    </span>
                  );
                })}
                {filters.gender && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                      padding: '0.5rem 0.875rem',
                    background: 'white',
                    color: '#1e40af',
                        borderRadius: '0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                      {filters.gender}
                  </span>
                )}
                {filters.vehicleType && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                      padding: '0.5rem 0.875rem',
                    background: 'white',
                    color: '#1e40af',
                        borderRadius: '0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17h2l.5-1.5h9L17 17h2"/>
                      <path d="M12 17v-6"/>
                      <path d="M9 5h6l3 6H6l3-6z"/>
                      <circle cx="8" cy="17" r="2"/>
                      <circle cx="16" cy="17" r="2"/>
                    </svg>
                      {filters.vehicleType}
                  </span>
                )}
                {filters.language && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                      padding: '0.5rem 0.875rem',
                    background: 'white',
                    color: '#1e40af',
                        borderRadius: '0',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                      {filters.language}
                  </span>
                )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={clearFilters} 
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#64748b',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = 'white';
                }}
              >
                <RotateCcw size={20} />
                Clear Filters
              </button>
              <button 
                onClick={handleSearch} 
                style={{
                  flex: '2',
                  minWidth: '250px',
                  padding: '1rem 2rem',
                  fontSize: '1.0625rem',
                  fontWeight: '700',
                  color: 'white',
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                  border: 'none',
                  borderRadius: '0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.625rem',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.3)';
                }}
              >
                <Search size={22} />
                Search Instructors
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

