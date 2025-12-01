import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, Form } from "@remix-run/react";
import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Alert } from "../components/Alert";

type LoaderData = {
  instructorId: string;
  instructorName: string;
  postcode: string;
  returnUrl: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const instructorId = url.searchParams.get('instructorId');
  const instructorName = url.searchParams.get('instructorName');
  const postcode = url.searchParams.get('postcode') || '';
  
  // Get returnUrl from query params (passed from InstructorCard)
  let returnUrl = url.searchParams.get('returnUrl') || '/results';
  
  // Fallback: Try to extract search params from referer if returnUrl not provided
  if (returnUrl === '/results') {
    const referer = request.headers.get('referer');
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (refererUrl.pathname === '/results') {
          returnUrl = `/results${refererUrl.search}`;
        }
      } catch (e) {
        // Invalid referer, use default
      }
    }
  }
  
  // Final fallback: build from postcode if we have it
  if (postcode && returnUrl === '/results') {
    returnUrl = `/results?outcode=${encodeURIComponent(postcode)}`;
  }

  if (!instructorId || !instructorName) {
    return redirect(returnUrl);
  }

  return json<LoaderData>({
    instructorId,
    instructorName,
    postcode: postcode.toUpperCase(),
    returnUrl
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const instructorId = formData.get('instructorId')?.toString();
  const studentName = formData.get('studentName')?.toString();
  const studentEmailAddress = formData.get('studentEmailAddress')?.toString();
  const studentPhoneNumber = formData.get('studentPhoneNumber')?.toString();
  const postcode = formData.get('postcode')?.toString();
  const message = formData.get('message')?.toString();
  const gender = formData.get('gender')?.toString();
  const enquiryAsParent = formData.get('enquiryAsParent') === 'true';

  // Validation
  if (!instructorId || !studentName || !postcode) {
    return json({ 
      error: 'Please fill in all required fields',
      success: false 
    }, { status: 400 });
  }
  
  // Require at least email or phone
  if (!studentEmailAddress && !studentPhoneNumber) {
    return json({ 
      error: 'Please provide either an email address or phone number',
      success: false 
    }, { status: 400 });
  }

  try {
    const apiHost = process.env.API_HOST || 'http://localhost:3001';
    
    const payload = {
      instructorId,
      studentName: studentName.trim(),
      studentPhoneNumber: studentPhoneNumber?.trim() || undefined,
      studentEmailAddress: studentEmailAddress?.trim().toLowerCase() || undefined,
      postcode: postcode.toUpperCase(),
      message: message?.trim() || undefined,
      gender: gender || undefined,
      enquiryAsParent
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
      return json({ 
        error: errorData.message || 'Failed to submit enquiry',
        success: false 
      }, { status: response.status });
    }

    return json({ success: true, error: null });
    
  } catch (err: any) {
    return json({ 
      error: err.message || 'Failed to submit enquiry. Please try again.',
      success: false 
    }, { status: 500 });
  }
}

export default function EnquiryPage() {
  const { instructorId, instructorName, postcode, returnUrl } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentPhoneNumber: '',
    studentEmailAddress: '',
    postcode: postcode,
    message: '',
    gender: '',
    enquiryAsParent: false
  });

  const validateUKPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
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
    setShowErrorAlert(false);
    
    // Validation
    if (!formData.studentName.trim()) {
      setError('Please enter your name');
      setShowErrorAlert(true);
      return;
    }

    if (!formData.postcode.trim()) {
      setError('Please enter your postcode or outcode, the outcode is the first part of the postcode (e.g. SW1A for SW1A 1AA)');
      setShowErrorAlert(true);
      return;
    }    

    if (!formData.studentEmailAddress.trim().length && !formData.studentPhoneNumber.trim().length) {
      setError('Please enter either an email address or a phone number so the instructor can get back to you');
      setShowErrorAlert(true);
      return;      
    }else {

      if (formData.studentEmailAddress.trim() && !formData.studentEmailAddress.includes('@')) {
        setError('Please enter a valid email address');
        setShowErrorAlert(true);
        return;
      }

      if (formData.studentPhoneNumber.trim() && !validateUKPhone(formData.studentPhoneNumber)) {
        setError('Please enter your phone number');
        setShowErrorAlert(true);
        return;
      }
  
    }

    if (formData.gender != "Male" && formData.gender != "Female") {
      setError('Please provide the gender of the student');
      setShowErrorAlert(true);
      return;
    }

    if (!formData.message.trim()) {
      setError('Please provide a message');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    
    try {
      const apiHost = typeof window !== 'undefined' 
        ? (window as any).__ENV__?.API_HOST || 'http://localhost:9000'
        : 'http://localhost:9000';

      const payload = {
        instructorId,
        studentName: formData.studentName.trim(),
        studentPhoneNumber: formatPhoneForSubmit(formData.studentPhoneNumber),
        studentEmailAddress: formData.studentEmailAddress.trim().toLowerCase(),
        postcode: formData.postcode.toUpperCase(),
        message: formData.message.trim() || undefined,
        gender: formData.gender || undefined,
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
      
    } catch (err: any) {
      setError(err.error || 'Failed to submit enquiry. Please try again.');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <div style={{
          minHeight: 'calc(100vh - 400px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          padding: '4rem 1rem'
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: '600px',
            width: '100%',
            borderRadius: '0',
            border: '3px solid #10b981',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              background: '#10b981',
              color: '#ffffff',
              borderRadius: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '3rem',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              Enquiry Sent Successfully!
            </h1>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.125rem' }}>
              Your enquiry has been sent to <strong style={{ color: '#111827' }}>{instructorName}</strong>. They'll get back to you soon!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(returnUrl)}
                className="btn btn-primary"
                style={{
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '0'
                }}
              >
                Back to Results
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn btn-secondary"
                style={{
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '0'
                }}
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{
        minHeight: 'calc(100vh - 400px)',
        background: '#f8fafc',
        padding: '2rem 1rem'
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto'
        }}>
        {/* Header */}
        <div style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '0',
          border: '2px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              padding: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Make an Enquiry
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
            Send an enquiry to <strong style={{ color: '#111827' }}>{instructorName}</strong>
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '0',
          border: '2px solid #e5e7eb'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Your Name */}
            <div style={{ marginBottom: '1.5rem' }}>
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
                  padding: '0.875rem',
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
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.studentEmailAddress}
                onChange={(e) => setFormData({ ...formData, studentEmailAddress: e.target.value })}
                placeholder="your.email@example.com"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Phone Number (UK)
              </label>
              <input
                type="tel"
                value={formData.studentPhoneNumber}
                onChange={(e) => setFormData({ ...formData, studentPhoneNumber: e.target.value })}
                placeholder="07XXX XXXXXX or +44 XXXX XXXXXX"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              />
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '0.5rem',
                fontStyle: 'italic'
              }}>
                * At least one contact method (email or phone) is required
              </p>
            </div>

            {/* Postcode/Outcode */}
            <div style={{ marginBottom: '1.5rem' }}>
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
                  padding: '0.875rem',
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

            {/* Gender (For Safeguarding)* */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Gender (For Safeguarding Purposes) *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#1e40af'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Any additional information or questions..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.875rem',
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
            <div style={{ marginBottom: '2rem' }}>
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
                  padding: '1rem 1.5rem',
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
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '1rem 1.5rem',
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
      </div>
      <Footer />
      
      {/* Error Alert */}
      <Alert
        isOpen={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        title="Validation Error"
        message={error}
        type="error"
      />
    </>
  );
}

