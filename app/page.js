import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hero Banner */}
      <section className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-bold mb-6">Révolutionnez votre concession FiveM 🚗</h1>
        <p className="text-xl mb-10 max-w-2xl mx-auto">Simplifiez la gestion de vos catalogues et boostez vos ventes avec notre plateforme intuitive</p>
        <Button className="bg-black text-white hover:bg-gray-800 text-lg py-3 px-8 rounded-full">Découvrir</Button>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-semibold text-center mb-16">Nos fonctionnalités clés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <CardTitle className="text-2xl mb-2">Gestion de catalogues</CardTitle>
                <CardDescription>Créez et gérez vos inventaires en toute simplicité</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">🔖</div>
                <CardTitle className="text-2xl mb-2">Pré-réservations</CardTitle>
                <CardDescription>Offrez une expérience d'achat fluide à vos clients</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <CardTitle className="text-2xl mb-2">Suivi des ventes</CardTitle>
                <CardDescription>Analysez vos performances en temps réel</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Prêt à transformer votre business ? 🚀</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">Rejoignez l'élite des concessionnaires FiveM et propulsez vos ventes vers de nouveaux sommets</p>
        <Button className="bg-black text-white hover:bg-gray-800 text-lg py-3 px-8 rounded-full">Commencer gratuitement</Button>
      </section>
    </div>
  );
}