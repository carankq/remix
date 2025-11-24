import { useState } from 'react';

type EnquiryFormProps = {
  instructorId: string;
  instructorName: string;
  onClose: () => void;
  defaultPostcode?: string;
};

export function EnquiryForm({ instructorId, instructorName, onClose, defaultPostcode = '' }: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentPhoneNumber: '',
    studentEmailAddress: '',
    postcode: defaultPostcode.toUpperCase(),
    description: '',
    enquiryAsParent: false
  });

  const validateUKPhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // UK numbers should be 10-11 digits (without country code) or 12-13 with +44
    if (cleaned.startsWith('44')) {
      return cleaned.length >= 12 && cleaned.length <= 13;
    }
    if (cleaned.startsWith('0')) {
      return cleaned.length === 11;
    }
    return cleaned.length === 10 || cleaned.length === 11;
  };

  const formatPhoneForSubmit = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('44')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return cleaned;
    return `0${cleaned}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.studentName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.studentEmailAddress.trim() || !formData.studentEmailAddress.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!formData.studentPhoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    if (!validateUKPhone(formData.studentPhoneNumber)) {
      setError('Please enter a valid UK phone number');
      return;
    }
    
    if (!formData.postcode.trim()) {
      setError('Please enter your postcode or outcode');
      return;
    }

    setLoading(true);
    
    try {
      const apiHost = typeof window !== 'undefined' 
        ? (window as any).ENV?.API_HOST || 'http://localhost:3001'
        : 'http://localhost:3001';
      
      const payload = {
        instructorId,
        studentName: formData.studentName.trim(),
        studentPhoneNumber: formatPhoneForSubmit(formData.studentPhoneNumber),
        studentEmailAddress: formData.studentEmailAddress.trim().toLowerCase(),
        postcode: formData.postcode.toUpperCase(),
        description: formData.description.trim() || undefined,
        enquiryAsParent: formData.enquiryAsParent
      };

      const response = await fetch(`${apiHost}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit enquiry' }));
        throw new Error(errorData.message || 'Failed to submit enquiry');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}>
        <div style={{
          background: '#ffffff',
          maxWidth: '500px',
          width: '100%',
          borderRadius: '0',
          border: '3px solid #10b981',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            background: '#10b981',
            color: '#ffffff',
            borderRadius: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            ✓
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
            Enquiry Sent!
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            Your enquiry has been sent to {instructorName}. They'll get back to you soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{
        background: '#ffffff',
        maxWidth: '600px',
        width: '100%',
        borderRadius: '0',
        border: '2px solid #e5e7eb',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        margin: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Make an Enquiry
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.25rem',
              lineHeight: 1
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Send an enquiry to <strong style={{ color: '#111827' }}>{instructorName}</strong>. They'll receive your details and contact you directly.
          </p>

          {error && (
            <div style={{
              padding: '1rem',
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '0',
              marginBottom: '1.5rem',
              color: '#991b1b',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Your Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Your Name *
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={formData.studentEmailAddress}
              onChange={(e) => setFormData({ ...formData, studentEmailAddress: e.target.value })}
              placeholder="your.email@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          {/* Phone Number */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Phone Number (UK) *
            </label>
            <input
              type="tel"
              value={formData.studentPhoneNumber}
              onChange={(e) => setFormData({ ...formData, studentPhoneNumber: e.target.value })}
              placeholder="07XXX XXXXXX or +44 XXXX XXXXXX"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          {/* Postcode/Outcode */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Postcode / Outcode *
            </label>
            <input
              type="text"
              value={formData.postcode}
              onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
              placeholder="E.g., SW1A or SW1A 1AA"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                textTransform: 'uppercase'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          {/* Description (Optional) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Message (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Any additional information or questions..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Enquiring as Parent */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={formData.enquiryAsParent}
                onChange={(e) => setFormData({ ...formData, enquiryAsParent: e.target.checked })}
                style={{
                  width: '1.125rem',
                  height: '1.125rem',
                  cursor: 'pointer'
                }}
              />
              I'm enquiring on behalf of my child
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                borderRadius: '0'
              }}
            >
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '0'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

