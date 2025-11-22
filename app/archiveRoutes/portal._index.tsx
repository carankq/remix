import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function PortalRoute() {
  return (
    <div>
      <Header />
      <section>
        <div className="container px-4 py-8">
          <h2 className="text-2xl text-gray-900">Student Portal</h2>
          <div className="text-gray-600">Coming soon.</div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


