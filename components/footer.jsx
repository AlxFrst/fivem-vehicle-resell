import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CarVentory</h3>
            <p className="text-sm text-gray-600">La meilleure plateforme de gestion de catalogues pour concessionnaires FiveM</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Accueil</Link></li>
              <li><Link href="/manage-catalogs" className="text-sm text-gray-600 hover:text-gray-900">Gérer mes catalogues</Link></li>
              <li><Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Fonctionnalités</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Nous contacter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Rejoignez-nous</h3>
            <Button className="w-full">S'inscrire gratuitement</Button>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">&copy; 2023 CarVentory. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}