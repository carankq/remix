import { useNavigate } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchSection } from "../components/SearchSection";
import { HeroSection } from "../components/HeroSection";
import { FAQSection } from "../components/FAQSection";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const q = String(formData.get("q") || "").trim();
  const postcode = String(formData.get("postcode") || "").trim();
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (postcode) params.append("postcode", postcode);
  return new Response(null, {
    status: 302,
    headers: { Location: "/results?" + params.toString() }
  });
}

export default function Index() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <SearchSection onSearch={(q, filters) => {
        const params = new URLSearchParams();
        if (filters.postcode) filters.postcode.split(',').map(p => p.trim()).filter(Boolean).forEach(pc => params.append('postcode', pc));
        if (filters.gender) params.set('gender', filters.gender);
        if (filters.vehicleType) params.set('vehicleType', filters.vehicleType);
        if (filters.language) params.set('language', filters.language);
        navigate(`/results?${params.toString()}`);
      }} />
      <HeroSection />
      <FAQSection />
      <Footer />
    </div>
  );
}


