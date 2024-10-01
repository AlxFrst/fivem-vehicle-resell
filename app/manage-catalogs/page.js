import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import dynamic from 'next/dynamic'

const ManageCatalogsClient = dynamic(() => import('./ManageCatalogsClient'), { ssr: false })


export default async function ManageCatalogsPage() {
    const session = await auth();

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Accès non autorisé</h1>
                <p>Veuillez vous connecter pour accéder à la gestion des catalogues.</p>
            </div>
        );
    }

    const catalogs = await getCatalogs(session.user.id);

    return <ManageCatalogsClient initialCatalogs={catalogs} />;
}

async function getCatalogs(userId) {
    return prisma.catalog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
}