import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function Features() {
    const features = [
        {
            title: "Gestion de catalogues",
            description: "Créez et gérez facilement plusieurs catalogues pour différents serveurs FiveM.",
            icon: "📊",
        },
        {
            title: "Catégories personnalisées",
            description: "Organisez vos véhicules en catégories adaptées à votre inventaire.",
            icon: "🏷️",
        },
        {
            title: "Informations détaillées",
            description: "Ajoutez des détails complets pour chaque véhicule, y compris des images.",
            icon: "ℹ️",
        },
        {
            title: "Consultation publique",
            description: "Partagez vos catalogues avec un lien public pour une visibilité maximale.",
            icon: "👁️",
        },
        {
            title: "Pré-réservations",
            description: "Permettez aux visiteurs de pré-réserver des véhicules sans inscription.",
            icon: "🔖",
        },
        {
            title: "Gestion des ventes",
            description: "Suivez et gérez facilement les pré-réservations et les ventes.",
            icon: "💼",
        },
    ];

    return (
        <div className="bg-white text-black min-h-screen">
            {/* Hero Banner */}
            <section className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-5xl font-bold mb-6">Fonctionnalités Puissantes</h1>
                <p className="text-xl mb-10 max-w-2xl mx-auto">
                    Découvrez comment notre plateforme révolutionne la gestion des concessions FiveM
                </p>
            </section>

            {/* Features Grid */}
            <section className="bg-gray-50 py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-none shadow-lg">
                                <CardHeader>
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <CardTitle className="text-2xl mb-2">{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="mt-4">
                                        {[1, 2, 3].map((item) => (
                                            <li key={item} className="flex items-center mb-2">
                                                <CheckCircle className="text-green-500 mr-2" size={16} />
                                                <span>Fonctionnalité {item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-4xl font-bold mb-6">Prêt à booster votre concession ?</h2>
                <p className="text-xl mb-10 max-w-2xl mx-auto">
                    Rejoignez notre plateforme et profitez de toutes ces fonctionnalités dès aujourd'hui !
                </p>
                <Button className="bg-black text-white hover:bg-gray-800 text-lg py-3 px-8 rounded-full">
                    Commencer gratuitement
                </Button>
            </section>
        </div>
    );
}