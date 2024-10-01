import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Navbar({ session }) {
  const isLoggedIn = !!session; // Convert session to a boolean

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">ArloCars</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <Link href="/manage-catalogs">
                <Button>Gérer mes catalogues</Button>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <Button>Se connecter</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}