import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur VotreSite</h1>
        <p className="text-xl mb-8">La meilleure plateforme de gestion de catalogues pour concessionnaires FiveM</p>
        <Button size="lg">Commencer maintenant</Button>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">Nos fonctionnalités</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de catalogues</CardTitle>
              <CardDescription>Créez et gérez facilement vos catalogues de véhicules</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pré-réservations</CardTitle>
              <CardDescription>Système intégré de pré-réservations pour vos clients</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historique des ventes</CardTitle>
              <CardDescription>Suivez toutes vos transactions passées</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-16 px-4 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à booster vos ventes ?</h2>
        <p className="mb-8">Rejoignez des centaines de concessionnaires qui font confiance à notre plateforme</p>
        <Button variant="secondary" size="lg">S'inscrire gratuitement</Button>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">Ce que disent nos clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <p className="italic">"Cette plateforme a révolutionné la gestion de mon inventaire. Je ne peux plus m'en passer !"</p>
              <p className="font-semibold mt-4">- Jean Dupont, Concessionnaire FiveM</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="italic">"Grâce à ce site, mes ventes ont augmenté de 30% en seulement 3 mois. Incroyable !"</p>
              <p className="font-semibold mt-4">- Marie Martin, Gérante de serveur FiveM</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}