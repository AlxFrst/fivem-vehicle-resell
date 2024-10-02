import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from 'lucide-react';

export default function Navbar({ session }) {
  const isLoggedIn = !!session;
  const userImage = session?.user?.image;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-2xl text-black">
              CarVentory
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link href="/manage-catalogs">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Gérer
                  </Button>
                </Link>
                {userImage && (
                  <Image
                    src={userImage}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <Link href="/api/auth/signout">
                  <Button variant="ghost" size="icon">
                    <LogOut className="h-5 w-5 text-gray-600 hover:text-black" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/api/auth/signin">
                <Button className="bg-black text-white hover:bg-gray-800">
                  <LogIn className="h-5 w-5 mr-2" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}