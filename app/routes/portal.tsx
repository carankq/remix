import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { InstructorStripeAccountSection } from '../components/InstructorStripeAccountSection';
import { PaymentMethodSection } from '../components/PaymentMethodSection';
import InstructorCreateForm from '../components/InstructorCreateForm';
import { getUserFromSession } from '../session.server';

type Tab = 'overview' | 'bookings' | 'payments' | 'account' | 'instructor';

interface BookingItem {
  id?: string;
  bookingId?: string;
  _id?: string;
  instructorId: string;
  studentId?: string;
  start: number;
  end: number;
  notes?: string;
  agreedByInstructorAt?: string | number | null;
  agreedByStudentAt?: string | number | null;
  archived?: boolean;
  isArchived?: boolean;
  archivedAt?: string | number | null;
  archivedReason?: string;
  reason?: string;
}

function getApiHost(): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__?.API_HOST) {
    const host = String((window as any).__ENV__.API_HOST).trim();
    return host.replace(/\/$/, '') || window.location.origin;
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
}

interface InstructorInfo {
  name: string;
  image?: string;
  company?: string;
}

// Server-side loader to fetch ALL portal data with pagination
export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await getUserFromSession(request);
  
  // Parse pagination params from URL
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '5', 10), 5);
  
  // If no session, use client-side auth (fallback)
  if (!userSession) {
    return json({ 
      serverBookings: [] as BookingItem[],
      serverInstructors: {} as Record<string, InstructorInfo>,
      bookingsError: null as string | null,
      useClientAuth: true,
      pagination: { page: 1, limit: 5, hasResults: false, hasMore: false }
    });
  }
  
  // Get API host from environment
  const apiHost = (process.env.API_HOST || request.url.split('/')[0] + '//' + request.url.split('/')[2]).replace(/\/$/, '');
  
  try {
    // Fetch bookings based on account type with pagination
    const bookingsUrl = userSession.accountType === 'instructor'
      ? `${apiHost}/instructor/${encodeURIComponent(userSession.id)}/bookings?page=${page}&limit=${limit}`
      : `${apiHost}/students/${encodeURIComponent(userSession.id)}/bookings?page=${page}&limit=${limit}`;
    
    const bookingsRes = await fetch(bookingsUrl, {
      headers: {
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    
    let bookings: BookingItem[] = [];
    
    if (bookingsRes.ok) {
      const data = await bookingsRes.json();
      // Handle both array response and paginated response
      if (Array.isArray(data)) {
        bookings = data;
      } else if (data?.bookings && Array.isArray(data.bookings)) {
        bookings = data.bookings;
      } else if (Array.isArray(data?.data)) {
        bookings = data.data;
      }
    }
    
    // Determine if there are more results
    const hasResults = bookings.length > 0;
    const hasMore = bookings.length === limit; // If we got a full page, there might be more
    
    // For students, fetch instructor details
    const instructors: Record<string, InstructorInfo> = {};
    if (userSession.accountType === 'student' && bookings.length > 0) {
      const uniqueInstructorIds = Array.from(new Set(bookings.map(b => b.instructorId).filter(Boolean)));
      
      // Fetch all instructor details in parallel
      await Promise.all(
        uniqueInstructorIds.map(async (id) => {
          try {
            const res = await fetch(`${apiHost}/instructors/${encodeURIComponent(id)}`);
            if (res.ok) {
              const data = await res.json();
              const item = data?.instructor || data;
              instructors[id] = { 
                name: item?.name || 'Instructor', 
                image: item?.image, 
                company: item?.company 
              };
            }
          } catch {}
        })
      );
    }
    
    return json({ 
      serverBookings: bookings,
      serverInstructors: instructors,
      bookingsError: null,
      useClientAuth: false,
      pagination: { page, limit, hasResults, hasMore }
    });
    
  } catch (error) {
    return json({ 
      serverBookings: [] as BookingItem[],
      serverInstructors: {} as Record<string, InstructorInfo>,
      bookingsError: 'Failed to load bookings data',
      useClientAuth: false,
      pagination: { page: 1, limit: 5, hasResults: false, hasMore: false }
    });
  }
}

export default function PortalRoute() {
  const { isAuthenticated, user, logout, token } = useAuth();
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  
  // If there's a page param in URL, default to bookings tab
  const [searchParams] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });
  const hasPageParam = searchParams.has('page');
  
  const [activeTab, setActiveTab] = useState<Tab>(hasPageParam ? 'bookings' : 'overview');
  const [bookings, setBookings] = useState<BookingItem[]>(loaderData.serverBookings || []);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(loaderData.bookingsError);
  const [bookingsLoaded, setBookingsLoaded] = useState(!loaderData.useClientAuth); // Mark as loaded if server provided data
  const [updatingById, setUpdatingById] = useState<Record<string, boolean>>({});
  const [instructorsById, setInstructorsById] = useState<Record<string, InstructorInfo>>(loaderData.serverInstructors || {});
  const [pagination, setPagination] = useState({
    page: loaderData.pagination?.page || 1,
    limit: loaderData.pagination?.limit || 5,
    hasResults: loaderData.pagination?.hasResults || false,
    hasMore: loaderData.pagination?.hasMore || false
  });
  
  // Use ref to track if fetch has been initiated (prevents React strict mode double-fetch)
  const fetchInitiatedRef = useState({ current: false })[0];

  // Instructor profile state
  const [ownerInst, setOwnerInst] = useState<any | null>(null);
  const [ownerInstLoading, setOwnerInstLoading] = useState(false);
  const [ownerInstError, setOwnerInstError] = useState<string | null>(null);
  const [stripeOnboarded, setStripeOnboarded] = useState<boolean | null>(null);
  const [stripeOnboardLoading, setStripeOnboardLoading] = useState(false);

  // Load more bookings function
  const loadMoreBookings = async () => {
    if (!isAuthenticated || !user?.id || isLoadingMore || !pagination.hasMore) return;
    
    setIsLoadingMore(true);
    setBookingsError(null);
    
    try {
      const nextPage = pagination.page + 1;
      const response = await fetch(`${window.__ENV__?.API_HOST || 'http://localhost:3001'}/bookings?page=${nextPage}&limit=${pagination.limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const newBookings = data.bookings || [];
      
      // Append new bookings to existing list
      setBookings(prev => [...prev, ...newBookings]);
      
      // Update pagination state
      setPagination(prev => ({
        ...prev,
        page: nextPage,
        hasMore: newBookings.length === pagination.limit
      }));
      
      // Fetch instructor details for new bookings
      if (newBookings.length > 0) {
        const instructorIds = [...new Set(newBookings.map((booking: BookingItem) => booking.instructorId))] as string[];
        const missingInstructorIds = instructorIds.filter((id: string) => !instructorsById[id]);
        
        if (missingInstructorIds.length > 0) {
          const instructorPromises = missingInstructorIds.map(async (id: string) => {
            try {
              const instructorResponse = await fetch(`${window.__ENV__?.API_HOST || 'http://localhost:3001'}/instructors/${id}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                  'Accept-Encoding': 'gzip, deflate, br'
                }
              });
              
              if (instructorResponse.ok) {
                const instructorData = await instructorResponse.json();
                return { id, data: instructorData };
              }
            } catch (error) {
              console.error(`Failed to fetch instructor ${id}:`, error);
            }
            return null;
          });
          
          const instructorResults = await Promise.all(instructorPromises);
          const newInstructors = instructorResults
            .filter(result => result !== null)
            .reduce((acc, result) => {
              if (result) acc[result.id] = result.data;
              return acc;
            }, {} as Record<string, InstructorInfo>);
          
          setInstructorsById(prev => ({ ...prev, ...newInstructors }));
        }
      }
      
    } catch (error) {
      console.error('Failed to load more bookings:', error);
      setBookingsError('Failed to load more bookings');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Sync loader data with state when page changes
  useEffect(() => {
    if (!loaderData.useClientAuth) {
      setBookings(loaderData.serverBookings || []);
      setInstructorsById(loaderData.serverInstructors || {});
      setPagination(loaderData.pagination || { page: 1, limit: 5, hasResults: false, hasMore: false });
      setBookingsError(loaderData.bookingsError);
    }
  }, [loaderData]);
  
  // Archive modal
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveLessonId, setArchiveLessonId] = useState<string | null>(null);
  const [archiveReason, setArchiveReason] = useState('');
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [archiveSubmitting, setArchiveSubmitting] = useState(false);

  // Instructor code modal
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeLessonId, setCodeLessonId] = useState<string | null>(null);
  const [codeValue, setCodeValue] = useState('');
  const [codeSubmitError, setCodeSubmitError] = useState<string | null>(null);
  const [codeSubmitting, setCodeSubmitting] = useState(false);

  // Student code display
  const [codeByLessonId, setCodeByLessonId] = useState<Record<string, string>>({});
  const [codeLoadingById, setCodeLoadingById] = useState<Record<string, boolean>>({});
  const [codeErrorById, setCodeErrorById] = useState<Record<string, string>>({});

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Load bookings from client ONLY if server didn't provide data (useClientAuth fallback)
  useEffect(() => {
    // Skip if server already loaded data OR if we've already initiated a fetch
    if (!loaderData.useClientAuth || fetchInitiatedRef.current) return;
    if (!isAuthenticated || !user?.id || bookingsLoaded) return;
    
    // Mark as initiated to prevent duplicate fetches
    fetchInitiatedRef.current = true;
    
    const host = getApiHost();
    if (!host) return;
    
    const fetchBookings = async () => {
      setIsLoadingMore(true);
      setBookingsError(null);
      
      try {
        const url = user?.accountType === 'instructor'
          ? `${host}/instructor/${encodeURIComponent(user.id)}/bookings?page=${pagination.page}&limit=${pagination.limit}`
          : `${host}/students/${encodeURIComponent(user.id)}/bookings?page=${pagination.page}&limit=${pagination.limit}`;
        
        const res = await fetch(url);
        let data: any = null;
        try { data = await res.json(); } catch {}
        
        if (res.ok) {
          let bookingsData: BookingItem[] = [];
          // Handle both array response and paginated response
          if (Array.isArray(data)) {
            bookingsData = data;
          } else if (data?.bookings && Array.isArray(data.bookings)) {
            bookingsData = data.bookings;
          } else if (Array.isArray(data?.data)) {
            bookingsData = data.data;
          }
          
          setBookings(bookingsData);
          setPagination({ 
            page: pagination.page, 
            limit: pagination.limit, 
            hasResults: bookingsData.length > 0,
            hasMore: bookingsData.length === pagination.limit
          });
        } else {
          setBookingsError(data?.error || 'Could not load your bookings.');
        }
      } catch {
        setBookingsError('Network error while loading your bookings.');
      } finally {
        setIsLoadingMore(false);
        setBookingsLoaded(true);
      }
    };
    
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderData.useClientAuth, isAuthenticated, user?.id, user?.accountType]);

  // Load instructor details ONLY if using client auth (server already loaded them)
  useEffect(() => {
    if (!loaderData.useClientAuth) return; // Skip if server already loaded instructors
    if (user?.accountType === 'instructor') return;
    if (!bookingsLoaded || bookings.length === 0) return;
    const host = getApiHost();
    if (!host) return;
    
    const ids = Array.from(new Set(bookings.map(b => b.instructorId))).filter(
      id => id && !instructorsById[id]
    );
    
    if (ids.length === 0) return;
    
    let cancelled = false;
    const load = async () => {
      const newEntries: Record<string, InstructorInfo> = {};
      for (const id of ids) {
        try {
          const res = await fetch(`${host}/instructors/${encodeURIComponent(id)}`);
          if (!res.ok) continue;
          const data = await res.json();
          const item = data?.instructor || data;
          if (item) {
            newEntries[id] = { name: item.name || 'Instructor', image: item.image, company: item.company };
          }
        } catch {}
      }
      if (!cancelled && Object.keys(newEntries).length > 0) {
        setInstructorsById(prev => ({ ...prev, ...newEntries }));
      }
    };
    load();
    return () => { cancelled = true; };
  }, [loaderData.useClientAuth, bookingsLoaded, bookings, user?.accountType, instructorsById]);

  // Load instructor profile for instructors
  const loadOwnerInstructor = async () => {
    if (!isAuthenticated || user?.accountType !== 'instructor' || !user?.id) return;
    
    setOwnerInstLoading(true);
    setOwnerInstError(null);
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
        return;
      }
      
      const data = await response.json();
      if (response.ok && data) {
        const item = data?.instructor || data;
        setOwnerInst(item);
      } else {
        setOwnerInstError(data?.error || 'Unable to load your instructor listing.');
        setOwnerInst(null);
      }
    } catch {
      setOwnerInstError('Network error while loading your instructor listing.');
      setOwnerInst(null);
    } finally {
      setOwnerInstLoading(false);
    }
  };

  // Load Stripe onboarding status
  const loadStripeOnboarding = async () => {
    if (!isAuthenticated || user?.accountType !== 'instructor' || !user?.id) return;
    
    setStripeOnboardLoading(true);
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
        setStripeOnboarded(Boolean(data.onboarded));
      } else if (response.status === 404) {
        setStripeOnboarded(false);
      }
    } catch {
      // ignore; keep null -> do not block
    } finally {
      setStripeOnboardLoading(false);
    }
  };

  // Load instructor profile and Stripe status when user changes
  useEffect(() => {
    if (user?.accountType === 'instructor') {
      loadOwnerInstructor();
      loadStripeOnboarding();
    }
  }, [user?.accountType, user?.id, isAuthenticated]);

  const formatDateTime = (ts: number) =>
    new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  const timeAgo = (ts?: string | number | null) => {
    if (!ts) return null;
    const date = new Date(ts);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const updateAgreement = async (lessonId: string, agree: boolean) => {
    const host = getApiHost();
    if (!host) return;
    
    const path = user?.accountType === 'instructor'
      ? `/lessons/${encodeURIComponent(lessonId)}/agree/instructor`
      : `/lessons/${encodeURIComponent(lessonId)}/agree/student`;
    
    try {
      setUpdatingById(prev => ({ ...prev, [lessonId]: true }));
      const res = await fetch(`${host}${path}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agreed: agree })
      });
      
      if (res.ok) {
        let data: any = null;
        try { data = await res.json(); } catch {}
        const updated = (data && (data.lesson || data)) || {};
        setBookings(prev => prev.map(b => {
          const id = String(b._id || b.id || b.bookingId || '');
          if (id !== lessonId) return b;
          return { ...b, ...updated } as BookingItem;
        }));
      }
    } catch {
    } finally {
      setUpdatingById(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const archiveLesson = async (lessonId: string, reason: string) => {
    const host = getApiHost();
    if (!host) return;
    
    try {
      setUpdatingById(prev => ({ ...prev, [lessonId]: true }));
      const res = await fetch(`${host}/lessons/${encodeURIComponent(lessonId)}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      if (res.ok) {
        let data: any = null;
        try { data = await res.json(); } catch {}
        const updated = (data && (data.lesson || data)) || {};
        setBookings(prev => prev.map(b => {
          const id = String(b._id || b.id || b.bookingId || '');
          if (id !== lessonId) return b;
          return { ...b, ...updated } as BookingItem;
        }));
      } else {
        let msg = 'Unable to cancel this lesson. Please try again.';
        try { const data = await res.json(); if (data?.error) msg = data.error; } catch {}
        alert(msg);
      }
    } catch {
      alert('Network error while cancelling the lesson.');
    } finally {
      setUpdatingById(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const submitArchive = async () => {
    if (!archiveLessonId) return;
    const reason = archiveReason.trim();
    if (!reason) { setArchiveError('Reason is required.'); return; }
    if (reason.length > 500) { setArchiveError('Reason must be 500 characters or fewer.'); return; }
    
    setArchiveSubmitting(true);
    setArchiveError(null);
    await archiveLesson(archiveLessonId, reason);
    setArchiveSubmitting(false);
    setShowArchiveModal(false);
  };

  const getLessonCode = async (lessonId: string) => {
    const host = getApiHost();
    if (!host) return;
    if (!token) { setCodeErrorById(prev => ({ ...prev, [lessonId]: 'You must be signed in.' })); return; }
    
    try {
      setCodeErrorById(prev => ({ ...prev, [lessonId]: '' }));
      setCodeLoadingById(prev => ({ ...prev, [lessonId]: true }));
      const res = await fetch(`${host}/lessons/${encodeURIComponent(lessonId)}/code`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        let code = '';
        try {
          const data = await res.json();
          const val = data?.completedLessonCode ?? data?.code ?? data?.lesson?.code;
          code = (val !== undefined && val !== null) ? String(val) : '';
        } catch {
          try { code = await res.text(); } catch {}
        }
        if (!code) code = 'No code available.';
        setCodeByLessonId(prev => ({ ...prev, [lessonId]: code }));
      } else {
        let msg = 'Unable to retrieve lesson code.';
        try { const data = await res.json(); if (data?.error) msg = data.error; } catch {}
        setCodeErrorById(prev => ({ ...prev, [lessonId]: msg }));
      }
    } catch {
      setCodeErrorById(prev => ({ ...prev, [lessonId]: 'Network error while retrieving code.' }));
    } finally {
      setCodeLoadingById(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const submitLessonCode = async () => {
    if (!codeLessonId) return;
    const v = codeValue.trim();
    if (!/^[0-9]{6}$/.test(v)) { setCodeSubmitError('Enter a 6-digit numeric code.'); return; }
    
    const host = getApiHost();
    if (!host || !token) { setCodeSubmitError('Not authorized.'); return; }
    
    setCodeSubmitting(true);
    setCodeSubmitError(null);
    
    try {
      const res = await fetch(`${host}/lessons/${encodeURIComponent(codeLessonId)}/code`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: Number(v) })
      });
      
      if (res.ok) {
        let data: any = null;
        try { data = await res.json(); } catch {}
        const updated = (data && (data.lesson || data)) || {};
        setBookings(prev => prev.map(b => {
          const id = String(b._id || b.id || b.bookingId || '');
          if (id !== codeLessonId) return b;
          return { ...b, ...updated } as BookingItem;
        }));
        setShowCodeModal(false);
      } else {
        let msg = 'Invalid or rejected code.';
        try { const data = await res.json(); if (data?.error) msg = data.error; } catch {}
        setCodeSubmitError(msg);
      }
    } catch {
      setCodeSubmitError('Network error while submitting code.');
    } finally {
      setCodeSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'bookings' as Tab, label: user?.accountType === 'instructor' ? 'Booking Requests' : 'My Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'payments' as Tab, label: 'Payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'account' as Tab, label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  if (user.accountType === 'instructor') {
    tabs.push({ id: 'instructor' as Tab, label: 'Instructor Profile', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' });
  }

  return (
    <div>
      <Header />
      <main style={{ 
        minHeight: '70vh',
        background: '#f9fafb',
        padding: '2rem 0'
      }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 className="brand-name" style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Portal
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Manage your account, bookings, and preferences
              </p>
            </div>

            {/* Tabs */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {/* Tab Headers */}
              <div style={{
                display: 'flex',
                borderBottom: '1px solid #e5e7eb',
                background: '#f9fafb',
                overflowX: 'auto'
              }}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: '1',
                      minWidth: 'max-content',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '1rem 1.5rem',
                      border: 'none',
                      background: activeTab === tab.id ? 'white' : 'transparent',
                      color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.color = '#374151';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                      }
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={tab.icon}/>
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ padding: '2rem' }}>
                
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1rem',
                        fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
                      }}>
                        Welcome back, {user.fullName || user.email.split('@')[0]}!
                      </h2>
                      <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                        Here's an overview of your account
                      </p>
                    </div>

                    {/* Account Type Card */}
                    <div style={{
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      borderRadius: '0.75rem',
                      border: '1px solid #bfdbfe',
                      maxWidth: '400px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '0.75rem',
                          background: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.25rem' }}>Account Type</p>
                          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', textTransform: 'capitalize' }}>
                            {user.accountType}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '1rem'
                      }}>
                        Quick Actions
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="btn btn-primary"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          View Bookings
                        </button>
                        <button
                          onClick={() => setActiveTab('payments')}
                          className="btn btn-secondary"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                          </svg>
                          {user.accountType === 'instructor' ? 'Stripe Account' : 'Payment Methods'}
                        </button>
                        <button
                          onClick={() => setActiveTab('account')}
                          className="btn btn-secondary"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Account Settings
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#111827',
                        margin: 0,
                        fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
                      }}>
                        {user?.accountType === 'instructor' ? 'Booking Requests' : 'My Bookings'}
                      </h2>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {pagination.hasResults ? `${bookings.length} booking${bookings.length !== 1 ? 's' : ''}` : 'No bookings'}
                      </div>
                    </div>

                    {bookingsError && (
                      <div style={{
                        padding: '1rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '0.75rem',
                        color: '#dc2626',
                        marginBottom: '1.5rem'
                      }}>
                        {bookingsError}
                      </div>
                    )}

                    {isLoadingMore && (
                      <p style={{ color: '#6b7280' }}>Loading bookings...</p>
                    )}

                    {!isLoadingMore && bookings.length === 0 && !bookingsError && (
                      <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '0.75rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                          No bookings yet
                        </h3>
                        <p style={{ color: '#6b7280' }}>
                          {user?.accountType === 'instructor' ? 'You have no booking requests yet.' : 'You have no bookings yet.'}
                        </p>
                      </div>
                    )}

                    {!isLoadingMore && bookings.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {bookings.map((booking, idx) => {
                          const lessonId = booking._id ? String(booking._id) : (booking.id ? String(booking.id) : null);
                          const bothAgreed = Boolean(booking.agreedByInstructorAt) && Boolean(booking.agreedByStudentAt);
                          const youAgreed = user?.accountType === 'instructor' ? Boolean(booking.agreedByInstructorAt) : Boolean(booking.agreedByStudentAt);
                          const updating = lessonId ? Boolean(updatingById[lessonId]) : false;
                          const isArchived = Boolean(booking.archived || booking.isArchived || booking.archivedAt);
                          const disableActions = isArchived || bothAgreed || !lessonId || updating;
                          
                          return (
                            <div
                              key={booking.id || booking.bookingId || idx}
                              style={{
                                padding: '1.5rem',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.75rem',
                                opacity: isArchived ? 0.6 : 1
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                                    Lesson Details
                                  </h4>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.95rem', color: '#6b7280' }}>
                                    <div>
                                      <strong style={{ color: '#374151' }}>Start:</strong> {formatDateTime(booking.start)}
                                    </div>
                                    <div>
                                      <strong style={{ color: '#374151' }}>End:</strong> {formatDateTime(booking.end)}
                                    </div>
                                    {booking.notes && (
                                      <div>
                                        <strong style={{ color: '#374151' }}>Notes:</strong> {booking.notes}
                                      </div>
                                    )}
                                    {isArchived && (
                                      <div style={{
                                        marginTop: '0.5rem',
                                        padding: '0.75rem',
                                        background: '#fef2f2',
                                        borderRadius: '0.5rem',
                                        color: '#991b1b',
                                        fontSize: '0.875rem'
                                      }}>
                                        <strong>Cancelled:</strong> {booking.archivedReason || booking.reason || 'No reason provided'}
                                      </div>
                                    )}
                                  </div>

                                  {/* Agreement Status */}
                                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {user?.accountType === 'instructor' ? (
                                      <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                          <span style={{ color: booking.agreedByInstructorAt ? '#16a34a' : '#dc2626' }}>
                                            {booking.agreedByInstructorAt ? '✓' : '✕'}
                                          </span>
                                          <span style={{ color: '#6b7280' }}>
                                            You {booking.agreedByInstructorAt ? `agreed ${timeAgo(booking.agreedByInstructorAt)}` : 'have not agreed yet'}
                                          </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                          <span style={{ color: booking.agreedByStudentAt ? '#16a34a' : '#dc2626' }}>
                                            {booking.agreedByStudentAt ? '✓' : '✕'}
                                          </span>
                                          <span style={{ color: '#6b7280' }}>
                                            Student {booking.agreedByStudentAt ? `agreed ${timeAgo(booking.agreedByStudentAt)}` : 'has not agreed yet'}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                          <span style={{ color: booking.agreedByStudentAt ? '#16a34a' : '#dc2626' }}>
                                            {booking.agreedByStudentAt ? '✓' : '✕'}
                                          </span>
                                          <span style={{ color: '#6b7280' }}>
                                            You {booking.agreedByStudentAt ? `agreed ${timeAgo(booking.agreedByStudentAt)}` : 'have not agreed yet'}
                                          </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                          <span style={{ color: booking.agreedByInstructorAt ? '#16a34a' : '#dc2626' }}>
                                            {booking.agreedByInstructorAt ? '✓' : '✕'}
                                          </span>
                                          <span style={{ color: '#6b7280' }}>
                                            Instructor {booking.agreedByInstructorAt ? `agreed ${timeAgo(booking.agreedByInstructorAt)}` : 'has not agreed yet'}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <button
                                      onClick={() => lessonId && updateAgreement(lessonId, true)}
                                      disabled={disableActions || youAgreed}
                                      className="btn btn-primary"
                                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                    >
                                      {updating ? 'Saving...' : 'I agree'}
                                    </button>
                                    <button
                                      onClick={() => lessonId && updateAgreement(lessonId, false)}
                                      disabled={disableActions || !youAgreed}
                                      className="btn btn-secondary"
                                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                    >
                                      {updating ? 'Saving...' : 'I disagree'}
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (lessonId) {
                                          setArchiveLessonId(lessonId);
                                          setArchiveReason('');
                                          setArchiveError(null);
                                          setShowArchiveModal(true);
                                        }
                                      }}
                                      disabled={!lessonId || updating || isArchived}
                                      className="btn"
                                      style={{ 
                                        fontSize: '0.875rem', 
                                        padding: '0.5rem 1rem',
                                        background: '#fef2f2',
                                        color: '#dc2626',
                                        border: '1px solid #fecaca'
                                      }}
                                    >
                                      {updating ? 'Cancelling...' : 'Cancel lesson'}
                                    </button>
                                    
                                    {/* Student: Get code */}
                                    {user?.accountType !== 'instructor' && (
                                      <>
                                        <button
                                          onClick={() => lessonId && getLessonCode(lessonId)}
                                          disabled={!lessonId || Boolean(codeLoadingById[lessonId || '']) || !bothAgreed || isArchived}
                                          className="btn btn-secondary"
                                          style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                        >
                                          {lessonId && codeLoadingById[lessonId] ? 'Getting code...' : 'Get lesson code'}
                                        </button>
                                        {!bothAgreed && !isArchived && (
                                          <span style={{ fontSize: '0.875rem', color: '#6b7280', alignSelf: 'center' }}>
                                            Waiting for both to agree
                                          </span>
                                        )}
                                        {lessonId && codeByLessonId[lessonId] && (
                                          <div style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: '#f9fafb',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem'
                                          }}>
                                            <strong>Completed lesson code:</strong> <span style={{ fontFamily: 'monospace', fontSize: '1rem' }}>{codeByLessonId[lessonId]}</span>
                                          </div>
                                        )}
                                        {lessonId && codeErrorById[lessonId] && (
                                          <div style={{ width: '100%', fontSize: '0.875rem', color: '#dc2626' }}>
                                            {codeErrorById[lessonId]}
                                          </div>
                                        )}
                                      </>
                                    )}
                                    
                                    {/* Instructor: Enter code */}
                                    {user?.accountType === 'instructor' && bothAgreed && !isArchived && (
                                      <button
                                        onClick={() => {
                                          if (lessonId) {
                                            setCodeLessonId(lessonId);
                                            setCodeValue('');
                                            setCodeSubmitError(null);
                                            setShowCodeModal(true);
                                          }
                                        }}
                                        disabled={!lessonId}
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                      >
                                        Enter lesson code
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Instructor/Student Info */}
                                {user?.accountType !== 'instructor' && instructorsById[booking.instructorId] && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                      width: '64px',
                                      height: '64px',
                                      borderRadius: '50%',
                                      overflow: 'hidden',
                                      background: '#f3f4f6',
                                      flexShrink: 0
                                    }}>
                                      {instructorsById[booking.instructorId].image ? (
                                        <img
                                          src={instructorsById[booking.instructorId].image}
                                          alt={instructorsById[booking.instructorId].name}
                                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                            <circle cx="12" cy="7" r="4"/>
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>
                                        {instructorsById[booking.instructorId].name}
                                      </p>
                                      {instructorsById[booking.instructorId].company && (
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                          {instructorsById[booking.instructorId].company}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Load More Button */}
                    {pagination.hasResults && pagination.hasMore && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '2rem'
                      }}>
                        <button
                          onClick={loadMoreBookings}
                          disabled={isLoadingMore}
                          className="btn"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 2rem',
                            fontSize: '1rem',
                            opacity: isLoadingMore ? 0.7 : 1,
                            cursor: isLoadingMore ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {isLoadingMore ? (
                            <>
                              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 11-6.219-8.56"/>
                              </svg>
                              Loading...
                            </>
                          ) : (
                            <>
                              Load More
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"/>
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    {/* Results Summary */}
                    {pagination.hasResults && (
                      <div style={{
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
                        {!pagination.hasMore && bookings.length > 0 && ' (all loaded)'}
                      </div>
                    )}
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '0.5rem',
                      fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
                    }}>
                      {user.accountType === 'instructor' ? 'Stripe Account' : 'Payment Methods'}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '2rem' }}>
                      {user.accountType === 'instructor' 
                        ? 'Manage your Stripe Express account to receive payments from students.' 
                        : 'Manage your payment methods for booking driving lessons.'}
                    </p>

                    {/* Student Payment Methods */}
                    {user.accountType !== 'instructor' && (
                      <div style={{
                        padding: '2rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem'
                      }}>
                        <PaymentMethodSection title="" allowDelete={true} />
                      </div>
                    )}

                    {/* Instructor Stripe Account */}
                    {user.accountType === 'instructor' && user.id && (
                      <div style={{
                        padding: '2rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.75rem'
                      }}>
                        <InstructorStripeAccountSection instructorId={user.id} />
                      </div>
                    )}
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '1.5rem',
                      fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
                    }}>
                      Account Details
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { label: 'Email', value: user.email, icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
                        { label: 'Full Name', value: user.fullName, icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                        { label: 'Account Type', value: user.accountType, icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
                        { label: 'Phone', value: user.phoneNumber, icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
                        { label: 'Age Range', value: user.ageRange, icon: 'M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z M12 6v6l4 2' },
                      ].map((field, idx) => {
                        if (!field.value) return null;
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              padding: '1.25rem',
                              background: '#f9fafb',
                              borderRadius: '0.75rem',
                              alignItems: 'center',
                              gap: '1rem',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={field.icon}/>
                            </svg>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{field.label}</p>
                              <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500', textTransform: field.label === 'Account Type' ? 'capitalize' : 'none' }}>
                                {field.value}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{
                      marginTop: '2rem',
                      padding: '1.5rem',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '0.75rem'
                    }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                        Danger Zone
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#7f1d1d', marginBottom: '1rem' }}>
                        Account deletion and other destructive actions coming soon
                      </p>
                    </div>
                  </div>
                )}

                {/* Instructor Profile Tab */}
                {activeTab === 'instructor' && user.accountType === 'instructor' && (
                  <div>
                    {/* Admin-disabled notice for instructors */}
                    {ownerInst?.adminDisabled && (
                      <div
                        style={{
                          width: '100%',
                          backgroundColor: '#FFF7ED', /* orange-50 */
                          color: '#9A3412', /* orange-800 */
                          border: '1px solid #FDBA74', /* orange-300 */
                          borderLeft: '6px solid #F97316', /* orange-500 accent */
                        }}
                        className="max-w-4xl mx-auto rounded-2xl p-4 mb-6"
                      >
                        <div className="flex items-start gap-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div>
                            <p className="font-semibold">Your instructor listing has been disabled by an administrator.</p>
                            {ownerInst?.adminDisabledReason && (
                              <p className="text-sm mt-1">Reason: {ownerInst.adminDisabledReason}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <InstructorCreateForm onCreated={() => { 
                      try { 
                        loadOwnerInstructor(); 
                      } catch {} 
                    }} />
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Archive Modal */}
      {showArchiveModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}
        onClick={() => !archiveSubmitting && setShowArchiveModal(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '32rem',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Cancel Lesson
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Please provide a brief reason for cancelling this lesson. This will be visible to the other party.
            </p>
            <textarea
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              maxLength={500}
              placeholder="Reason (required, max 500 characters)"
              style={{
                width: '100%',
                minHeight: '6rem',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            {archiveError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#dc2626',
                fontSize: '0.875rem'
              }}>
                {archiveError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowArchiveModal(false)}
                disabled={archiveSubmitting}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={submitArchive}
                disabled={archiveSubmitting || !archiveReason.trim()}
                className="btn"
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none'
                }}
              >
                {archiveSubmitting ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Code Modal */}
      {showCodeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}
        onClick={() => !codeSubmitting && setShowCodeModal(false)}
        >
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '28rem',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Enter Lesson Code
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Enter the 6-digit completion code provided by the student to complete the lesson and trigger payout.
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 123456"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1.125rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                fontFamily: 'monospace'
              }}
            />
            {codeSubmitError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#dc2626',
                fontSize: '0.875rem'
              }}>
                {codeSubmitError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowCodeModal(false)}
                disabled={codeSubmitting}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={submitLessonCode}
                disabled={codeSubmitting || codeValue.trim().length !== 6}
                className="btn btn-primary"
              >
                {codeSubmitting ? 'Submitting...' : 'Submit Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
