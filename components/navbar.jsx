import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

export default function Navbar({ session }) {
  const isLoggedIn = !!session;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-2xl text-black">
              CarVentory
            </Link>
          </div>
          {isLoggedIn && (
            <div className="flex items-center space-x-4">
              <Link href="/manage-catalogs">
                <Button className="bg-black text-white hover:bg-gray-800">
                  Gérer
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5 text-gray-600 hover:text-black" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}