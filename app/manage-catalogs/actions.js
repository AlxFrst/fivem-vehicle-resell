'use server'

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function createCatalog(formData) {
    const session = await auth();
    if (!session) {
        throw new Error("You must be logged in to create a catalog");
    }

    const name = formData.get("name");

    await prisma.catalog.create({
        data: {
            name,
            serverName: "Default Server",
            userId: session.user.id,
        },
    });
}

export async function editCatalog(catalogId, newName) {
    const session = await auth();
    if (!session) {
        throw new Error("You must be logged in to edit a catalog");
    }

    await prisma.catalog.update({
        where: { id: catalogId },
        data: { name: newName },
    });
}

export async function deleteCatalog(catalogId) {
    const session = await auth();
    if (!session) {
        throw new Error("You must be logged in to delete a catalog");
    }

    await prisma.catalog.delete({
        where: { id: catalogId },
    });
}