'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CatalogDashboardClient({
    catalog,
    updateCatalog,
    addCategory,
    deleteCategory,
    addVehicle,
    updateVehicleStatus,
    deleteVehicle,
    acceptReservation,
    rejectReservation,
}) {
    const [isEditingCatalog, setIsEditingCatalog] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [isSellingVehicle, setIsSellingVehicle] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isDeletingCategory, setIsDeletingCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [catalogUrl, setCatalogUrl] = useState('');
    const [catalogState, setCatalog] = useState(catalog);

    const allVehicles = catalog.categories.flatMap(category => category.vehicles);
    const availableVehicles = allVehicles.filter(v => v.status === 'available');
    const soldVehicles = allVehicles.filter(v => v.status === 'sold');

    const totalVehicles = allVehicles.length;
    const totalStockValue = availableVehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);
    const totalSalesValue = soldVehicles.reduce((sum, vehicle) => sum + vehicle.price, 0);
    const mostExpensiveVehicle = availableVehicles.reduce((max, vehicle) => vehicle.price > max.price ? vehicle : max, availableVehicles[0]);
    const leastExpensiveVehicle = availableVehicles.reduce((min, vehicle) => vehicle.price < min.price ? vehicle : min, availableVehicles[0]);
    const averageSoldPrice = soldVehicles.length > 0 ? totalSalesValue / soldVehicles.length : 0;

    useEffect(() => {
        setCatalogUrl(`${window.location.origin}/catalog/${catalog.id}`);
    }, [catalog.id]);

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

    const handleAcceptReservation = async (reservation) => {
        const result = await acceptReservation(reservation.id);
        if (result.success) {
            // Mise à jour locale de l'état
            setCatalog(prevCatalog => ({
                ...prevCatalog,
                reservations: prevCatalog.reservations
                    .filter(r => r.vehicle.id !== reservation.vehicle.id)
                    .map(r => r.id === reservation.id ? { ...r, status: 'accepted' } : r)
            }));
        } else {
            console.error('Erreur lors de l\'acceptation de la réservation:', result.error);
            // Afficher un message d'erreur à l'utilisateur
        }
    };

    const handleRejectReservation = async (reservation) => {
        const result = await rejectReservation(reservation.id);
        if (result.success) {
            // Mise à jour locale de l'état
            setCatalog(prevCatalog => ({
                ...prevCatalog,
                reservations: prevCatalog.reservations.map(r =>
                    r.id === reservation.id ? { ...r, status: 'rejected' } : r
                )
            }));
        } else {
            console.error('Erreur lors du refus de la réservation:', result.error);
            // Afficher un message d'erreur à l'utilisateur
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-white text-black">
            <h1 className="text-4xl font-bold mb-8 text-center">{catalog.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistiques générales */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Statistiques générales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{totalVehicles}</p>
                                <p className="text-sm text-gray-500">Total véhicules</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{availableVehicles.length}</p>
                                <p className="text-sm text-gray-500">Disponibles</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{soldVehicles.length}</p>
                                <p className="text-sm text-gray-500">Vendus</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{totalStockValue.toLocaleString()}€</p>
                                <p className="text-sm text-gray-500">Valeur du stock</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{totalSalesValue.toLocaleString()}€</p>
                                <p className="text-sm text-gray-500">Valeur des ventes</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{averageSoldPrice.toLocaleString()}€</p>
                                <p className="text-sm text-gray-500">Prix moyen de vente</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Informations du catalogue */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Informations du catalogue</CardTitle>
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

                {/* Lien du catalogue */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lien du catalogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">
                            <Input
                                type="text"
                                value={catalogUrl}
                                readOnly
                            />
                            <div className="flex space-x-2">
                                <Button onClick={() => navigator.clipboard.writeText(catalogUrl)} className="flex-1">
                                    Copier
                                </Button>
                                <Button onClick={() => window.open(catalogUrl, '_blank')} className="flex-1">
                                    Accéder
                                </Button>
                            </div>
                        </div>
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
                                <TooltipProvider key={category.id}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                className="text-center py-2 cursor-pointer hover:bg-secondary"
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsDeletingCategory(true);
                                                }}
                                            >
                                                {category.name}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Cliquez pour supprimer</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                        <Button onClick={() => setIsAddingCategory(true)} className="mt-4 w-full">Ajouter une catégorie</Button>
                    </CardContent>
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

                {/* <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Réservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Véhicule</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {catalog.reservations.map(reservation => (
                                    <TableRow key={reservation.id}>
                                        <TableCell>{reservation.vehicle?.brand} {reservation.vehicle?.model}</TableCell>
                                        <TableCell>{reservation.firstName} {reservation.lastName}</TableCell>
                                        <TableCell>{new Date(reservation.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{reservation.status || 'En attente'}</TableCell>
                                        <TableCell>
                                            {(!reservation.status || reservation.status === 'pending') && (
                                                <>
                                                    <Button onClick={() => handleAcceptReservation(reservation)} size="sm" className="mr-2">
                                                        Accepter
                                                    </Button>
                                                    <Button onClick={() => handleRejectReservation(reservation)} size="sm" variant="destructive">
                                                        Refuser
                                                    </Button>
                                                </>
                                            )}
                                            {reservation.status === 'accepted' && (
                                                <Button onClick={() => handleRejectReservation(reservation)} size="sm" variant="outline">
                                                    Annuler l'acceptation
                                                </Button>
                                            )}
                                            {reservation.status === 'rejected' && (
                                                <Button onClick={() => handleAcceptReservation(reservation)} size="sm" variant="outline">
                                                    Réactiver
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card> */}

                {/* Liste des véhicules */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Liste des véhicules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="available">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="available">Disponibles</TabsTrigger>
                                <TabsTrigger value="sold">Vendus</TabsTrigger>
                            </TabsList>
                            <TabsContent value="available">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Marque</TableHead>
                                            <TableHead>Modèle</TableHead>
                                            <TableHead>Prix</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {availableVehicles.map(vehicle => (
                                            <TableRow key={vehicle.id}>
                                                <TableCell>{vehicle.brand}</TableCell>
                                                <TableCell>{vehicle.model}</TableCell>
                                                <TableCell>{vehicle.price}€</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleSellVehicle(vehicle)} size="sm">
                                                        Vendre
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="sold">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Marque</TableHead>
                                            <TableHead>Modèle</TableHead>
                                            <TableHead>Prix</TableHead>
                                            <TableHead>Acheteur</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {soldVehicles.map(vehicle => (
                                            <TableRow key={vehicle.id}>
                                                <TableCell>{vehicle.brand}</TableCell>
                                                <TableCell>{vehicle.model}</TableCell>
                                                <TableCell>{vehicle.price}€</TableCell>
                                                <TableCell>{vehicle.buyerName}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => updateVehicleStatus(vehicle.id, 'available')} size="sm" variant="outline">
                                                        Rendre disponible
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        addVehicle(new FormData(e.target));
                        setIsAddingVehicle(false);
                    }}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="brand" className="text-right">
                                    Marque
                                </Label>
                                <Input id="brand" name="brand" placeholder="Ex: Toyota" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="model" className="text-right">
                                    Modèle
                                </Label>
                                <Input id="model" name="model" placeholder="Ex: Corolla" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Prix (€)
                                </Label>
                                <Input id="price" name="price" type="number" placeholder="Ex: 15000" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="mileage" className="text-right">
                                    Kilométrage
                                </Label>
                                <Input id="mileage" name="mileage" type="number" placeholder="Ex: 50000" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea id="description" name="description" placeholder="Description du véhicule" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="categoryId" className="text-right">
                                    Catégorie
                                </Label>
                                <Select name="categoryId" required>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {catalog.categories.map(category => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="image" className="text-right">
                                    Image
                                </Label>
                                <Input id="image" name="image" type="file" accept="image/*" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Ajouter le véhicule</Button>
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

            {/* Modal pour supprimer une catégorie */}
            <Dialog open={isDeletingCategory} onOpenChange={setIsDeletingCategory}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Supprimer la catégorie</DialogTitle>
                    </DialogHeader>
                    <p className="text-red-500 font-bold">
                        Attention ! En supprimant cette catégorie, tous les véhicules associés seront également supprimés.
                    </p>
                    <p>
                        Êtes-vous sûr de vouloir supprimer la catégorie "{selectedCategory?.name}" ?
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeletingCategory(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                deleteCategory(selectedCategory.id);
                                setIsDeletingCategory(false);
                            }}
                        >
                            Confirmer la suppression
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}