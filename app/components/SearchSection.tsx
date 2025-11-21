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
  
  // Single postcode only
  const [postcode, setPostcode] = useState<string>(
    initialFilters?.postcode ? initialFilters.postcode.split(',')[0]?.trim() || '' : ''
  );
  
  const [showAlert, setShowAlert] = useState(false);

  const handleFilterChange = (key: keyof FilterCriteria, value: any) => {
    const normalizedValue = key === 'postcode' && typeof value === 'string' ? value.toUpperCase() : value;
    setFilters({ ...filters, [key]: normalizedValue });
  };

  const handleSearch = () => {
    // Check if postcode is empty or only whitespace
    if (!postcode || postcode.trim() === '') {
      setShowAlert(true);
      return;
    }
    onSearch('', { ...filters, postcode });
  };
  const clearFilters = () => { 
    const d: FilterCriteria = { priceRange: [20, 60], postcode: '', gender: '', vehicleType: '', minExperience: 0, language: '' }; 
    setFilters(d); 
    setPostcode(''); 
    if (autoSearch) onSearch('', d); 
  };

  useEffect(() => { if (autoSearch) { onSearch('', { ...filters, postcode }); } }, []);

  const handlePostcodeInputChange = (value: string) => {
    setPostcode(value.toUpperCase());
  };

  return (
    <section className="search-section-mobile" style={{
      padding: '3.5rem 0 4.5rem',
      position: 'relative',
      background: '#1e40af'
    }}>

      <div className="container mx-auto px-4" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Header */}
          <div className="search-header-mobile" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="search-hero-title" style={{
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '1rem',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.02em',
              textShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              Find Your Perfect Driving Instructor
            </h1>
            <p className="search-hero-subtitle" style={{
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '600px',
              margin: '0 auto',
              fontWeight: '400'
            }}>
              Search from verified instructors in your area
            </p>
          </div>

          {/* Main Search Card */}
          <div className="search-card" style={{
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
                    value={postcode} 
                    onChange={(e) => handlePostcodeInputChange(e.target.value)} 
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
            {(() => {
              const hasFilters = postcode || filters.gender || filters.vehicleType || filters.language;
              if (!hasFilters) return null;
              
              const filterElements = [];
              
              if (postcode) {
                filterElements.push(
                  <span key="postcode" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#1e40af',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {postcode}
                  </span>
                );
              }
              
              if (filters.gender) {
                if (filterElements.length > 0) filterElements.push(<span key="sep-gender" style={{ color: '#d1d5db' }}>|</span>);
                filterElements.push(
                  <span key="gender" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#1e40af',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    {filters.gender}
                  </span>
                );
              }
              
              if (filters.vehicleType) {
                if (filterElements.length > 0) filterElements.push(<span key="sep-vehicle" style={{ color: '#d1d5db' }}>|</span>);
                filterElements.push(
                  <span key="vehicle" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#1e40af',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17h2l.5-1.5h9L17 17h2"/>
                      <path d="M12 17v-6"/>
                      <path d="M9 5h6l3 6H6l3-6z"/>
                      <circle cx="8" cy="17" r="2"/>
                      <circle cx="16" cy="17" r="2"/>
                    </svg>
                    {filters.vehicleType}
                  </span>
                );
              }
              
              if (filters.language) {
                if (filterElements.length > 0) filterElements.push(<span key="sep-language" style={{ color: '#d1d5db' }}>|</span>);
                filterElements.push(
                  <span key="language" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#1e40af',
                    fontSize: '0.8125rem',
                    fontWeight: '500'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    {filters.language}
                  </span>
                );
              }
              
              return (
                <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {filterElements}
                  </div>
                </div>
              );
            })()}

            {/* Action Buttons */}
            <div className="search-buttons-container" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={clearFilters}
                className="clear-filters-btn"
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
                <span className="clear-filters-text">Clear Filters</span>
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

      {/* Custom Alert */}
      {showAlert && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
          onClick={() => setShowAlert(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '0',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '2px solid #1e40af'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '0',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#111827',
                margin: 0 
              }}>
                Postcode Required
              </h3>
            </div>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '1rem',
              lineHeight: '1.5',
              marginBottom: '1.5rem' 
            }}>
              Please enter a postcode to search for instructors in your area.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                background: '#1e40af',
                border: 'none',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1e3a8a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1e40af';
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

