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

export function SearchSection({ onSearch, autoSearch = false }: { onSearch: (query: string, filters: FilterCriteria) => void; autoSearch?: boolean; }) {
  const [filters, setFilters] = useState<FilterCriteria>({ priceRange: [20, 60], postcode: '', gender: '', vehicleType: '', minExperience: 0, language: '' });
  const [postcodes, setPostcodes] = useState<string[]>([]);
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
    <section className="bg-deep-navy py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="display-title text-white mb-6">Find your perfect driving instructor.</h1>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 slide-in">
            <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-4 filters-row">
              <div className="p-4 md:flex-1 filters-item">
                <div className="text-xs font-semibold text-gray-600 mb-1">From</div>
                <div className="relative">
                  <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  <input type="text" value={pendingPostcode} onChange={(e) => handlePostcodeInputChange(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); startNewPostcode(); } }} placeholder="Enter postcode area" className="input-bare w-full" style={{ paddingLeft: '1.75rem' }} />
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-200 filters-divider" />
              <div className="p-4 md:flex-1 filters-item">
                <div className="text-xs font-semibold text-gray-600 mb-1">Instructor gender</div>
                <div className="relative">
                  <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <select value={filters.gender} onChange={(e) => handleFilterChange('gender', e.target.value)} className="select-bare w-full" style={{ paddingLeft: '1.75rem' }}>
                    <option value="">Any Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-200 filters-divider" />
              <div className="p-4 md:flex-1 filters-item">
                <div className="text-xs font-semibold text-gray-600 mb-1">Vehicle type</div>
                <div className="relative">
                  <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13l2-5a3 3 0 0 1 3-2h6a3 3 0 0 1 3 2l2 5"/><rect x="3" y="13" width="18" height="6" rx="2"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>
                  </span>
                  <select value={filters.vehicleType} onChange={(e) => handleFilterChange('vehicleType', e.target.value)} className="select-bare w-full" style={{ paddingLeft: '1.75rem' }}>
                    <option value="">Any Vehicle Type</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-200 filters-divider" />
              <div className="p-4 md:flex-1 filters-item">
                <div className="text-xs font-semibold text-gray-600 mb-1">Language</div>
                <div className="relative">
                  <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18M8 5s1.5 9 7 9M4 19h16"/></svg>
                  </span>
                  <select value={filters.language} onChange={(e) => handleFilterChange('language', e.target.value)} className="select-bare w-full" style={{ paddingLeft: '1.75rem' }}>
                    <option value="">Any Language</option>
                    <option value="British Sign Language">British Sign Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Polish">Polish</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="summary-card fade-in summary-actions">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-primary">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {postcodes.map((pc, idx) => {
                  const isLast = idx === postcodes.length - 1;
                  return (
                    <span key={`pc-${idx}`} className="bg-blue-100 text-blue-700 pl-4 pr-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1">
                      <span>📍 {pc}</span>
                      {isLast ? (
                        <button type="button" aria-label="Add new postcode" onClick={startNewPostcode} className="inline-flex items-center justify-center w-5 h-5 ml-1 rounded-full bg-transparent text-blue-700 hover:text-blue-900 leading-none active:scale-95 transition" style={{ border: 'none', outline: 'none' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      ) : (
                        <button type="button" aria-label="Remove postcode" onClick={() => removePostcode(pc, idx)} className="inline-flex items-center justify-center w-5 h-5 ml-1.5 rounded-full bg-transparent text-blue-700 hover:text-blue-900 leading-none active:scale-95 transition" style={{ border: 'none', outline: 'none' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      )}
                    </span>
                  );
                })}
                {filters.gender && (<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">👤 {filters.gender}</span>)}
                {filters.vehicleType && (<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">🚗 {filters.vehicleType}</span>)}
                {filters.language && (<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">🌐 {filters.language}</span>)}
                {postcodes.length === 0 && Object.values(filters).every(val => val === '' || val === 0 || (Array.isArray(val) && val[0] === 20 && val[1] === 60)) && (<span className="text-gray-500 text-sm">No filters applied</span>)}
              </div>
            </div>
            <div className="flex items-center gap-3 buttons-row">
              <button onClick={clearFilters} className="btn btn-secondary flex items-center gap-2"><RotateCcw size={16} />Clear All Filters</button>
              <button onClick={handleSearch} className="btn btn-primary flex items-center gap-2"><Search size={16} />Search Instructors</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


