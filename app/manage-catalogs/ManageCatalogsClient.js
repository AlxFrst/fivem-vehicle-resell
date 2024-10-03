'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';
import { createCatalog, editCatalog, deleteCatalog } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster"

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
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Éditer le catalogue</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Nouveau nom du catalogue"
                        className="mb-4"
                    />
                    <DialogFooter>
                        <Button type="submit" className="bg-black text-white hover:bg-gray-800">Sauvegarder</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CatalogTable({ catalogs, handleDelete, router, isOwner }) {
    return (
        <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
                {catalogs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-semibold">Nom du catalogue</TableHead>
                                    <TableHead className="font-semibold">Date de création</TableHead>
                                    {!isOwner && <TableHead className="font-semibold">Propriétaire</TableHead>}
                                    <TableHead className="font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {catalogs.map((catalog) => (
                                    <TableRow key={catalog.id}>
                                        <TableCell className="font-medium">{catalog.name}</TableCell>
                                        <TableCell>{new Date(catalog.createdAt).toLocaleDateString()}</TableCell>
                                        {!isOwner && <TableCell>{catalog.user.name || catalog.user.email}</TableCell>}
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mr-2 bg-gray-100 hover:bg-gray-200"
                                                onClick={() => router.push(`/catalog-dashboard/${catalog.id}`)}
                                            >
                                                Voir le dashboard
                                            </Button>
                                            {isOwner && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="bg-red-500 hover:bg-red-600 text-white"
                                                    onClick={() => handleDelete(catalog.id)}
                                                >
                                                    Supprimer
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="p-6 text-center text-gray-500">Aucun catalogue trouvé.</p>
                )}
            </CardContent>
        </Card>
    );
}

const isValidCatalogName = (name) => {
    return name.trim().length >= 8;
};

export default function ManageCatalogsClient({ initialCatalogs }) {
    const [ownedCatalogs, setOwnedCatalogs] = useState(initialCatalogs.ownedCatalogs);
    const [collaborativeCatalogs, setCollaborativeCatalogs] = useState(initialCatalogs.collaborativeCatalogs);
    const [editingCatalog, setEditingCatalog] = useState(null);
    const [newCatalogName, setNewCatalogName] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setOwnedCatalogs(initialCatalogs.ownedCatalogs);
        setCollaborativeCatalogs(initialCatalogs.collaborativeCatalogs);
    }, [initialCatalogs]);

    const handleCreateCatalog = async (e) => {
        e.preventDefault();
        if (!isValidCatalogName(newCatalogName)) {
            toast({
                title: "Erreur",
                description: "Le nom du catalogue doit contenir au moins 8 caractères.",
                duration: 3000,
                variant: "destructive",
            });
            return;
        }
        const formData = new FormData();
        formData.append("name", newCatalogName);
        await createCatalog(formData);

        const newCatalog = {
            id: Date.now().toString(),
            name: newCatalogName,
            createdAt: new Date().toISOString(),
        };

        setOwnedCatalogs(prevCatalogs => [newCatalog, ...prevCatalogs]);
        setNewCatalogName("");
        router.refresh();

        toast({
            title: "Catalogue créé",
            description: `Le catalogue "${newCatalogName}" a été créé avec succès.`,
            duration: 3000,
        });
    };

    const handleEdit = async (catalogId, newName) => {
        await editCatalog(catalogId, newName);
        const updatedCatalogs = ownedCatalogs.map(cat =>
            cat.id === catalogId ? { ...cat, name: newName } : cat
        );
        setOwnedCatalogs(updatedCatalogs);
        router.refresh();
    };

    const handleDelete = async (catalogId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce catalogue ?")) {
            await deleteCatalog(catalogId);
            const updatedCatalogs = ownedCatalogs.filter(cat => cat.id !== catalogId);
            setOwnedCatalogs(updatedCatalogs);
            router.refresh();
        }
    };

    return (
        <div className="bg-white text-black">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-12">Gestion des Catalogues</h1>

                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6">Créer un nouveau catalogue</h2>
                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <form onSubmit={handleCreateCatalog}>
                                <div className="flex gap-4">
                                    <Input
                                        name="name"
                                        placeholder="Nom du catalogue (8 caractères minimum)"
                                        className="flex-grow"
                                        value={newCatalogName}
                                        onChange={(e) => setNewCatalogName(e.target.value)}
                                    />
                                    <Button
                                        type="submit"
                                        className="bg-black text-white hover:bg-gray-800"
                                        disabled={!isValidCatalogName(newCatalogName)}
                                    >
                                        Créer
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </section>

                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6">Vos catalogues</h2>
                    <CatalogTable
                        catalogs={ownedCatalogs}
                        handleDelete={handleDelete}
                        router={router}
                        isOwner={true}
                    />
                </section>

                <section className="mb-16">
                    <h2 className="text-2xl font-semibold mb-6">Catalogues collaboratifs</h2>
                    <CatalogTable
                        catalogs={collaborativeCatalogs}
                        router={router}
                        isOwner={false}
                    />
                </section>

                <section>
                    <Card className="border-none shadow-lg bg-gray-50">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold">Besoin d'aide pour gérer vos catalogues ?</CardTitle>
                            <CardDescription className="text-gray-600">
                                Consultez notre guide détaillé ou contactez notre support.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="bg-black text-white hover:bg-gray-800">Voir le guide</Button>
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
            <Toaster />
        </div>
    );
}