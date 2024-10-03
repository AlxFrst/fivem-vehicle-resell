import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import CatalogDashboardClient from './CatalogDashboardClient';
import { revalidatePath } from 'next/cache';

async function sendDiscordWebhook(webhookUrl, vehicleData, action = 'added') {
    const isNewVehicle = action === 'added';
    const color = isNewVehicle ? 0x00ff00 : 0xff0000; // Green for new, Red for sold
    const title = isNewVehicle
        ? `🆕 Nouveau véhicule ajouté : ${vehicleData.brand} ${vehicleData.model}`
        : `💰 Véhicule vendu : ${vehicleData.brand} ${vehicleData.model}`;

    const embed = {
        title: title,
        color: color,
        fields: [
            { name: '🚗 Marque', value: vehicleData.brand, inline: true },
            { name: '🚙 Modèle', value: vehicleData.model, inline: true },
            { name: '💶 Prix', value: `${vehicleData.price.toLocaleString()}€`, inline: true },
            { name: '🛣️ Kilométrage', value: `${vehicleData.mileage.toLocaleString()} km`, inline: true },
            { name: '📝 Description', value: vehicleData.description || 'Aucune description' },
        ],
        footer: {
            text: `Véhicule ${isNewVehicle ? 'ajouté' : 'vendu'} le ${new Date().toLocaleDateString('fr-FR')}`,
        },
        timestamp: new Date().toISOString(),
    };

    if (!isNewVehicle && vehicleData.buyerName) {
        embed.fields.push({ name: '🧑 Acheteur', value: vehicleData.buyerName });
    }

    await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
    });
}

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
        const discordWebhook = formData.get('discordWebhook');

        await prisma.catalog.update({
            where: { id: params.id },
            data: {
                name,
                serverName,
                description,
                contactInfo,
                webhookUrl: discordWebhook,
            },
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
        if (imageFile && imageFile.size > 0) {
            const imageBuffer = await imageFile.arrayBuffer();
            image = Buffer.from(imageBuffer);
        }

        const newVehicle = await prisma.vehicle.create({
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

        // Fetch the catalog to get the webhook URL
        const catalog = await prisma.catalog.findUnique({
            where: { id: params.id },
            select: { webhookUrl: true }
        });

        if (catalog && catalog.webhookUrl) {
            try {
                await sendDiscordWebhook(catalog.webhookUrl, newVehicle, 'added');
            } catch (error) {
                console.error('Error sending Discord webhook:', error);
                // You might want to add some error handling here, 
                // such as showing a notification to the user
            }
        }

        revalidatePath(`/catalog-dashboard/${params.id}`);

        return { success: true, vehicle: newVehicle };
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

        const updatedVehicle = await prisma.vehicle.update({
            where: { id: vehicleId },
            data: updateData,
        });

        // Fetch the catalog to get the webhook URL
        const catalog = await prisma.catalog.findUnique({
            where: { id: params.id },
            select: { webhookUrl: true }
        });

        if (status === 'sold' && catalog && catalog.webhookUrl) {
            await sendDiscordWebhook(catalog.webhookUrl, updatedVehicle, 'sold');
        }

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
        acceptReservation={acceptReservation}
        rejectReservation={rejectReservation}
        addCollaborator={addCollaborator}
        removeCollaborator={removeCollaborator}
        searchUsers={searchUsers}
    />;
}

async function addCollaborator(catalogId, email, role) {
    'use server'
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("Utilisateur non trouvé");
    }

    await prisma.catalogCollaborator.create({
        data: {
            userId: user.id,
            catalogId,
            role
        }
    });

    revalidatePath(`/catalog-dashboard/${catalogId}`);
}

async function removeCollaborator(collaboratorId) {
    'use server'
    const collaborator = await prisma.catalogCollaborator.delete({
        where: { id: collaboratorId }
    });

    revalidatePath(`/catalog-dashboard/${collaborator.catalogId}`);
}

async function searchUsers(email) {
    'use server'
    const users = await prisma.user.findMany({
        where: {
            email: {
                contains: email,
                mode: 'insensitive', // Ceci rend la recherche insensible à la casse
            },
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
        take: 5, // Limite le nombre de résultats à 5
    });
    return users;
}

async function getCatalog(id, userId) {
    return prisma.catalog.findFirst({
        where: {
            id,
            OR: [
                { userId },
                { collaborators: { some: { userId } } }
            ]
        },
        select: {
            id: true,
            name: true,
            serverName: true,
            description: true,
            contactInfo: true,
            webhookUrl: true,
            userId: true,
            categories: {
                include: {
                    vehicles: true
                }
            },
            reservations: {
                include: {
                    vehicle: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            collaborators: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        },
    });
}

async function acceptReservation(reservationId) {
    'use server'
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { vehicle: true },
        });

        if (!reservation) {
            return { success: false, error: 'Réservation non trouvée' };
        }

        // Mettre à jour le statut du véhicule
        await prisma.vehicle.update({
            where: { id: reservation.vehicle.id },
            data: {
                status: 'sold',
                buyerName: `${reservation.firstName} ${reservation.lastName}`
            },
        });

        // Mettre à jour le statut de la réservation
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: 'accepted' },
        });

        // Supprimer les autres réservations pour ce véhicule
        await prisma.reservation.deleteMany({
            where: {
                vehicleId: reservation.vehicle.id,
                id: { not: reservationId },
            },
        });

        revalidatePath(`/catalog-dashboard/${reservation.catalogId}`);
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la réservation:', error);
        return { success: false, error: error.message };
    }
}

async function rejectReservation(reservationId) {
    'use server'
    try {
        const updatedReservation = await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: 'rejected' },
            include: { vehicle: true },
        });

        revalidatePath(`/catalog-dashboard/${updatedReservation.catalogId}`);
        return { success: true, reservation: updatedReservation };
    } catch (error) {
        console.error('Erreur lors du rejet de la réservation:', error);
        return { success: false, error: error.message };
    }
}
