import { useNavigate, useLoaderData, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchSection } from "../components/SearchSection";
import { InstructorBenefitsSection } from "../components/InstructorBenefitsSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { TrustTechnologySection } from "../components/TrustTechnologySection";
import { FAQSection } from "../components/FAQSection";
// @ts-ignore - Video asset
import movingCarsVideo from "../assets/moving_cars.mp4";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const envBase = process.env.API_HOST ? String(process.env.API_HOST).replace(/\/$/, "") : "";
  const base = envBase || url.origin;
  
  // Extract search params to pass back to client
  const searchParams = {
    outcode: url.searchParams.getAll('outcode'),
    gender: url.searchParams.get('gender') || '',
    vehicleType: url.searchParams.get('vehicleType') || '',
    language: url.searchParams.get('language') || '',
  };
  
  try {
    const res = await fetch(`${base}/blogs?limit=3`, { 
      headers: { 
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br'
      } 
    });
    const data = await res.json().catch(() => []);
    const blogs = Array.isArray(data) ? data.slice(0, 3) : [];
    
    // Optimize: Only include necessary fields for preview
    const blogsTop3 = blogs.map((blog: any) => ({
      slug: blog.slug || blog.id,
      title: blog.title || blog.name,
      summary: blog.summary?.substring(0, 200) || blog.excerpt?.substring(0, 200), // Limit preview length
    }));
    
    return json({ blogsTop3, searchParams }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      }
    });
  } catch {
    return json({ blogsTop3: [], searchParams });
  }
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control') || 'public, max-age=300',
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const q = String(formData.get("q") || "").trim();
  const outcode = String(formData.get("outcode") || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (outcode) params.append("outcode", outcode);
  return new Response(null, {
    status: 302,
    headers: { Location: "/results?" + params.toString() }
  });
}

export default function Index() {
  const navigate = useNavigate();
  const { blogsTop3, searchParams } = useLoaderData<typeof loader>();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.playbackRate = 1;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);
  
  return (
    <div>
      {/* Hero Section with Video Background */}
      <div style={{
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.9)',
            transform: 'scale(1.1)'
          }}
        >
          <source src={movingCarsVideo} type="video/mp4" />
        </video>

        {/* Overlay Filter */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.92) 0%, rgba(15, 23, 42, 0.88) 100%)',
          backdropFilter: 'blur(2px)',
          zIndex: 1
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Header />
          <SearchSection 
            initialFilters={{
              outcode: searchParams.outcode?.join(',') || '',
              gender: searchParams.gender,
              vehicleType: searchParams.vehicleType,
              language: searchParams.language,
            }}
            onSearch={(q, filters) => {
              const params = new URLSearchParams();
              if (filters.outcode) filters.outcode.split(',').map(p => p.trim()).filter(Boolean).forEach(oc => params.append('outcode', oc));
              if (filters.gender) params.set('gender', filters.gender);
              if (filters.vehicleType) params.set('vehicleType', filters.vehicleType);
              if (filters.language) params.set('language', filters.language);
              navigate(`/results?${params.toString()}`);
            }} 
          />
        </div>
      </div>
      
      <HowItWorksSection />
      <InstructorBenefitsSection />
      {/* <TrustTechnologySection /> */}
      <FAQSection blogs={blogsTop3} />
      <Footer />
    </div>
  );
}


