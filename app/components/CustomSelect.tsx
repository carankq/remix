import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  searchable?: boolean;
}

export function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  label, 
  icon,
  searchable = false 
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchable
    ? options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const displayValue = value || placeholder;
  const hasValue = Boolean(value);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '0.625rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {icon}
        {label}
      </label>
      
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            padding: '1rem 2.5rem 1rem 1rem',
            fontSize: '1rem',
            color: hasValue ? '#111827' : '#94a3b8',
            border: '2px solid #e5e7eb',
            borderRadius: '0',
            outline: 'none',
            transition: 'all 0.2s ease',
            background: '#ffffff',
            cursor: 'pointer',
            fontWeight: '500',
            textAlign: 'left',
            borderColor: isOpen ? '#3b82f6' : '#e5e7eb',
            boxShadow: isOpen ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none'
          }}
        >
          {displayValue}
        </button>
        
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#64748b" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
            pointerEvents: 'none',
            transition: 'transform 0.2s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.25rem',
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          maxHeight: '280px',
          overflowY: 'auto',
          zIndex: 50
        }}>
          {searchable && (
            <div style={{ padding: '0.75rem', borderBottom: '2px solid #e5e7eb' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  fontSize: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          )}
          
          <div>
            {filteredOptions.length === 0 ? (
              <div style={{
                padding: '1rem',
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    background: value === option ? '#eff6ff' : 'transparent',
                    color: value === option ? '#1e40af' : '#111827',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: value === option ? '600' : '500',
                    transition: 'all 0.15s ease',
                    borderLeft: value === option ? '3px solid #1e40af' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option) {
                      e.currentTarget.style.background = '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== option) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

