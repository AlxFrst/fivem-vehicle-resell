'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CatalogDashboardClient({
    catalog,
    updateCatalog,
    addCategory,
    deleteCategory,
    addVehicle,
    updateVehicleStatus,
    deleteVehicle,
}) {
    const [isEditingCatalog, setIsEditingCatalog] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [isSellingVehicle, setIsSellingVehicle] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const totalVehicles = catalog.categories.reduce((acc, category) => acc + category.vehicles.length, 0);
    const soldVehicles = catalog.categories.reduce((acc, category) => acc + category.vehicles.filter(v => v.status === 'sold').length, 0);

    const handleSellVehicle = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsSellingVehicle(true);
    };

    const handleSubmitSale = (e) => {
        e.preventDefault();
        const buyerName = e.target.buyerName.value;
        updateVehicleStatus(selectedVehicle.id, 'sold', buyerName);
        setIsSellingVehicle(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-white text-black">
            <h1 className="text-4xl font-bold mb-8 text-center">{catalog.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistiques */}
                <Card>
                    <CardHeader>
                        <CardTitle>Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{totalVehicles}</p>
                                <p className="text-sm text-gray-500">Total</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{soldVehicles}</p>
                                <p className="text-sm text-gray-500">Vendus</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{totalVehicles > 0 ? Math.round((soldVehicles / totalVehicles) * 100) : 0}%</p>
                                <p className="text-sm text-gray-500">Taux</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lien du catalogue */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lien du catalogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"
                                value={`${window.location.origin}/catalog/${catalog.id}`}
                                readOnly
                                className="flex-grow"
                            />
                            <Button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/catalog/${catalog.id}`)}>
                                Copier
                            </Button>
                            {/* button Go to catalog */}
                            <Button onClick={() => window.location.href = `/catalog/${catalog.id}`}>
                                Accéder au catalogue
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations du catalogue */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditingCatalog ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                updateCatalog(new FormData(e.target));
                                setIsEditingCatalog(false);
                            }}>
                                <Input name="name" defaultValue={catalog.name} className="mb-2" placeholder="Nom du catalogue" />
                                <Input name="serverName" defaultValue={catalog.serverName} className="mb-2" placeholder="Nom du serveur" />
                                <Textarea name="description" defaultValue={catalog.description} className="mb-2" placeholder="Description" />
                                <Input name="contactInfo" defaultValue={catalog.contactInfo} className="mb-2" placeholder="Informations de contact" />
                                <Button type="submit">Sauvegarder</Button>
                            </form>
                        ) : (
                            <div className="space-y-2">
                                <p><strong>Serveur:</strong> {catalog.serverName}</p>
                                <p><strong>Description:</strong> {catalog.description}</p>
                                <p><strong>Contact:</strong> {catalog.contactInfo}</p>
                                <Button onClick={() => setIsEditingCatalog(true)}>Modifier</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Catégories */}
                <Card>
                    <CardHeader>
                        <CardTitle>Catégories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            {catalog.categories.map(category => (
                                <Badge key={category.id} className="text-center py-2">{category.name}</Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => setIsAddingCategory(true)}>Ajouter une catégorie</Button>
                    </CardFooter>
                </Card>

                {/* Actions rapides */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2">
                        <Button onClick={() => setIsAddingVehicle(true)}>Ajouter un véhicule</Button>
                        <Button variant="outline">Exporter les données</Button>
                    </CardContent>
                </Card>

                {/* Liste des véhicules */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Véhicules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Marque</TableHead>
                                    <TableHead>Modèle</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {catalog.categories.flatMap(category =>
                                    category.vehicles.map(vehicle => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell>{vehicle.brand}</TableCell>
                                            <TableCell>{vehicle.model}</TableCell>
                                            <TableCell>{vehicle.price}€</TableCell>
                                            <TableCell>
                                                <Badge variant={vehicle.status === 'sold' ? "secondary" : "default"}>
                                                    {vehicle.status === 'sold' ? "Vendu" : "Disponible"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.status === 'available' ? (
                                                    <Button onClick={() => handleSellVehicle(vehicle)} size="sm">
                                                        Vendre
                                                    </Button>
                                                ) : (
                                                    <Button onClick={() => updateVehicleStatus(vehicle.id, 'available')} size="sm" variant="outline">
                                                        Rendre disponible
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Modal pour ajouter une catégorie */}
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter une catégorie</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addCategory(new FormData(e.target));
                        setIsAddingCategory(false);
                    }}>
                        <Input name="name" placeholder="Nom de la catégorie" />
                        <DialogFooter>
                            <Button type="submit">Ajouter</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal pour ajouter un véhicule */}
            <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter un véhicule</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addVehicle(new FormData(e.target));
                        setIsAddingVehicle(false);
                    }}>
                        <Input name="brand" placeholder="Marque" className="mb-2" required />
                        <Input name="model" placeholder="Modèle" className="mb-2" required />
                        <Input name="price" type="number" placeholder="Prix" className="mb-2" required />
                        <Input name="mileage" type="number" placeholder="Kilométrage" className="mb-2" required />
                        <Textarea name="description" placeholder="Description" className="mb-2" />
                        <Select name="categoryId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {catalog.categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input type="file" name="image" accept="image/*" className="mb-2" />
                        <DialogFooter>
                            <Button type="submit">Ajouter</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal pour vendre un véhicule */}
            <Dialog open={isSellingVehicle} onOpenChange={setIsSellingVehicle}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Vendre le véhicule</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitSale}>
                        <Input name="buyerName" placeholder="Nom de l'acheteur" className="mb-2" required />
                        <DialogFooter>
                            <Button type="submit">Confirmer la vente</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}