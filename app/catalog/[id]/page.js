import { notFound } from 'next/navigation';
import prisma from "@/lib/db";
import CatalogClient from './CatalogClient';

export default async function CatalogPage({ params }) {
    const catalog = await getCatalog(params.id);

    if (!catalog) {
        notFound();
    }

    return <CatalogClient catalog={catalog} />;
}

async function getCatalog(id) {
    return prisma.catalog.findUnique({
        where: { id },
        include: {
            categories: {
                include: {
                    vehicles: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            }
        },
    });
}