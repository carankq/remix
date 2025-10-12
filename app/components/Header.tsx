import { Link } from "@remix-run/react";

export function Header() {
  return (
    <header className="bg-white border border-gray-100">
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="no-underline">
            <h1 className="text-2xl text-gray-900 brand-name">Carank</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="btn btn-primary">Login</Link>
          </div>
        </div>
      </div>
    </header>
  );
}


