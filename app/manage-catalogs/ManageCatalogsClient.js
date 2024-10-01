'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { createCatalog, editCatalog, deleteCatalog } from './actions';

function EditCatalogDialog({ catalog, isOpen, onClose, onEdit }) {
    const [newName, setNewName] = useState(catalog?.name || "");

    useEffect(() => {
        if (catalog) {
            setNewName(catalog.name);
        }
    }, [catalog]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(catalog.id, newName);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Éditer le catalogue</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nouveau nom du catalogue"
                    />
                    <DialogFooter>
                        <Button type="submit">Sauvegarder</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function ManageCatalogsClient({ initialCatalogs }) {
    const [catalogs, setCatalogs] = useState([]);
    const [editingCatalog, setEditingCatalog] = useState(null);
    const router = useRouter();

    useEffect(() => {
        setCatalogs(initialCatalogs);
    }, [initialCatalogs]);

    const handleEdit = async (catalogId, newName) => {
        await editCatalog(catalogId, newName);
        const updatedCatalogs = catalogs.map(cat =>
            cat.id === catalogId ? { ...cat, name: newName } : cat
        );
        setCatalogs(updatedCatalogs);
        router.refresh();
    };

    const handleDelete = async (catalogId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce catalogue ?")) {
            await deleteCatalog(catalogId);
            const updatedCatalogs = catalogs.filter(cat => cat.id !== catalogId);
            setCatalogs(updatedCatalogs);
            router.refresh();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Gestion des Catalogues</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Créer un nouveau catalogue</h2>
                <Card>
                    <CardContent className="pt-6">
                        <form action={createCatalog}>
                            <div className="flex gap-4">
                                <Input name="name" placeholder="Nom du catalogue" className="flex-grow" />
                                <Button type="submit">Créer</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Vos catalogues</h2>
                <Card>
                    <CardContent>
                        {catalogs.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom du catalogue</TableHead>
                                        <TableHead>Nombre de véhicules</TableHead>
                                        <TableHead>Date de création</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {catalogs.map((catalog) => (
                                        <TableRow key={catalog.id}>
                                            <TableCell>{catalog.name}</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>{new Date(catalog.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mr-2"
                                                    onClick={() => router.push(`/catalog-dashboard/${catalog.id}`)}
                                                >
                                                    Voir le dashboard
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mr-2"
                                                    onClick={() => setEditingCatalog(catalog)}
                                                >
                                                    Éditer
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(catalog.id)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>Aucun catalogue trouvé.</p>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="mt-12">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader>
                        <CardTitle>Besoin d'aide pour gérer vos catalogues ?</CardTitle>
                        <CardDescription className="text-primary-foreground/80">
                            Consultez notre guide détaillé ou contactez notre support.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary">Voir le guide</Button>
                    </CardContent>
                </Card>
            </section>

            {editingCatalog && (
                <EditCatalogDialog
                    catalog={editingCatalog}
                    isOpen={!!editingCatalog}
                    onClose={() => setEditingCatalog(null)}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
}