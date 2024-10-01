import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import CatalogDashboardClient from './CatalogDashboardClient';
import { revalidatePath } from 'next/cache';

export default async function CatalogDashboardPage({ params }) {
    const session = await auth();
    if (!session) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Accès non autorisé</h1>
                <p>Veuillez vous connecter pour accéder au dashboard du catalogue.</p>
            </div>
        );
    }

    const catalog = await getCatalog(params.id, session.user.id);

    if (!catalog) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Catalogue non trouvé</h1>
                <p>Le catalogue demandé n'existe pas ou vous n'avez pas les permissions pour y accéder.</p>
            </div>
        );
    }

    async function updateCatalog(formData) {
        'use server'
        const name = formData.get('name');
        const serverName = formData.get('serverName');
        const description = formData.get('description');
        const contactInfo = formData.get('contactInfo');

        await prisma.catalog.update({
            where: { id: params.id },
            data: { name, serverName, description, contactInfo },
        });

        revalidatePath(`/catalog-dashboard/${params.id}`);
    }

    async function addCategory(formData) {
        'use server'
        const name = formData.get('name');

        await prisma.category.create({
            data: {
                name,
                catalogId: params.id,
            },
        });

        revalidatePath(`/catalog-dashboard/${params.id}`);
    }

    async function deleteCategory(categoryId) {
        'use server'
        await prisma.category.delete({
            where: { id: categoryId },
        });

        revalidatePath(`/catalog-dashboard/${params.id}`);
    }

    async function addVehicle(formData) {
        'use server'
        const brand = formData.get('brand');
        const model = formData.get('model');
        const price = parseFloat(formData.get('price'));
        const mileage = parseInt(formData.get('mileage'));
        const description = formData.get('description');
        const categoryId = formData.get('categoryId');
        const imageFile = formData.get('image');

        let image = null;
        if (imageFile) {
            const imageBuffer = await imageFile.arrayBuffer();
            image = Buffer.from(imageBuffer);
        }

        await prisma.vehicle.create({
            data: {
                brand,
                model,
                price,
                mileage,
                description,
                categoryId,
                image,
                status: 'available',
            },
        });

        revalidatePath(`/catalog-dashboard/${params.id}`);
    }

    async function updateVehicleStatus(vehicleId, status, buyerName = null) {
        'use server'
        const updateData = {
            status,
        };

        if (status === 'sold') {
            updateData.buyerName = buyerName;
        } else {
            updateData.buyerName = null;
        }

        await prisma.vehicle.update({
            where: { id: vehicleId },
            data: updateData,
        });

        revalidatePath(`/catalog-dashboard/${params.id}`);
    }

    async function deleteVehicle(vehicleId) {
        'use server'
        await prisma.vehicle.delete({
            where: { id: vehicleId },
        });

        revalidatePath(`/catalog-dashboard/${params.id}`);
    }

    return <CatalogDashboardClient
        catalog={catalog}
        updateCatalog={updateCatalog}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        addVehicle={addVehicle}
        updateVehicleStatus={updateVehicleStatus}
        deleteVehicle={deleteVehicle}
    />;
}

async function getCatalog(id, userId) {
    return prisma.catalog.findFirst({
        where: { id, userId },
        include: {
            categories: {
                include: {
                    vehicles: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            },
            reservations: true
        },
    });
}