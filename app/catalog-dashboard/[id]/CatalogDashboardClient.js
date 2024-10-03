'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
            setCatalog(prevCatalog => ({
                ...prevCatalog,
                reservations: prevCatalog.reservations
                    .filter(r => r.vehicle.id !== reservation.vehicle.id)
                    .map(r => r.id === reservation.id ? { ...r, status: 'accepted' } : r)
            }));
        } else {
            console.error('Erreur lors de l\'acceptation de la réservation:', result.error);
        }
    };

    const handleRejectReservation = async (reservation) => {
        const result = await rejectReservation(reservation.id);
        if (result.success) {
            setCatalog(prevCatalog => ({
                ...prevCatalog,
                reservations: prevCatalog.reservations.map(r =>
                    r.id === reservation.id ? { ...r, status: 'rejected' } : r
                )
            }));
        } else {
            console.error('Erreur lors du refus de la réservation:', result.error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-white text-black">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">{catalog.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistiques générales */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Statistiques générales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <StatItem label="Total véhicules" value={totalVehicles} />
                            <StatItem label="Disponibles" value={availableVehicles.length} />
                            <StatItem label="Vendus" value={soldVehicles.length} />
                            <StatItem label="Valeur du stock" value={`${totalStockValue.toLocaleString()}€`} />
                            <StatItem label="Valeur des ventes" value={`${totalSalesValue.toLocaleString()}€`} />
                            <StatItem label="Prix moyen de vente" value={`${averageSoldPrice.toLocaleString()}€`} />
                        </div>
                    </CardContent>
                </Card>

                {/* Informations du catalogue */}
                <Card className="col-span-full md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl">Informations du catalogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isEditingCatalog ? (
                            <CatalogEditForm catalog={catalog} updateCatalog={updateCatalog} setIsEditingCatalog={setIsEditingCatalog} />
                        ) : (
                            <CatalogInfo catalog={catalog} setIsEditingCatalog={setIsEditingCatalog} />
                        )}
                    </CardContent>
                </Card>

                {/* Lien du catalogue */}
                <Card className="col-span-full md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl">Lien du catalogue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CatalogLink catalogUrl={catalogUrl} />
                    </CardContent>
                </Card>

                {/* Catégories */}
                <Card className="col-span-full md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl">Catégories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Categories
                            categories={catalog.categories}
                            setSelectedCategory={setSelectedCategory}
                            setIsDeletingCategory={setIsDeletingCategory}
                            setIsAddingCategory={setIsAddingCategory}
                        />
                    </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card className="col-span-full md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-xl">Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2">
                        <Button onClick={() => setIsAddingVehicle(true)}>Ajouter un véhicule</Button>
                        <Button variant="outline">Exporter les données</Button>
                    </CardContent>
                </Card>

                {/* Liste des véhicules */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Liste des véhicules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <VehicleList
                            availableVehicles={availableVehicles}
                            soldVehicles={soldVehicles}
                            handleSellVehicle={handleSellVehicle}
                            updateVehicleStatus={updateVehicleStatus}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Modals */}
            <AddCategoryModal isOpen={isAddingCategory} setIsOpen={setIsAddingCategory} addCategory={addCategory} />
            <AddVehicleModal isOpen={isAddingVehicle} setIsOpen={setIsAddingVehicle} addVehicle={addVehicle} categories={catalog.categories} />
            <SellVehicleModal isOpen={isSellingVehicle} setIsOpen={setIsSellingVehicle} handleSubmitSale={handleSubmitSale} />
            <DeleteCategoryModal
                isOpen={isDeletingCategory}
                setIsOpen={setIsDeletingCategory}
                selectedCategory={selectedCategory}
                deleteCategory={deleteCategory}
            />
        </div>
    );
}

// Composants auxiliaires

const StatItem = ({ label, value }) => (
    <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
        <p className="text-xs md:text-sm text-gray-500">{label}</p>
    </div>
);

const CatalogEditForm = ({ catalog, updateCatalog, setIsEditingCatalog }) => {
    const [showWebhook, setShowWebhook] = useState(false);
    const [showWebhookHelp, setShowWebhookHelp] = useState(false);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            updateCatalog(new FormData(e.target));
            setIsEditingCatalog(false);
        }}>
            <Input name="name" defaultValue={catalog.name} className="mb-2" placeholder="Nom du catalogue" />
            <Input name="serverName" defaultValue={catalog.serverName} className="mb-2" placeholder="Nom du serveur" />
            <Textarea name="description" defaultValue={catalog.description} className="mb-2" placeholder="Description" />
            <Input name="contactInfo" defaultValue={catalog.contactInfo} className="mb-2" placeholder="Informations de contact" />
            <div className="relative mb-2">
                <Input
                    name="discordWebhook"
                    type={showWebhook ? "text" : "password"}
                    defaultValue={catalog.webhookUrl}
                    placeholder="Webhook Discord"
                />
                <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowWebhook(!showWebhook)}
                >
                    {showWebhook ? "Masquer" : "Afficher"}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowWebhookHelp(true)}
                >
                    ?
                </Button>
            </div>
            <Button type="submit">Sauvegarder</Button>

            <WebhookHelpModal isOpen={showWebhookHelp} setIsOpen={setShowWebhookHelp} />
        </form>
    );
};

const WebhookHelpModal = ({ isOpen, setIsOpen }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Comment ajouter un webhook Discord</DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Ouvrez votre serveur Discord</li>
                    <li>Allez dans les paramètres du canal</li>
                    <li>Cliquez sur "Intégrations"</li>
                    <li>Cliquez sur "Créer un webhook"</li>
                    <li>Copiez l'URL du webhook</li>
                    <li>Collez l'URL dans le champ "Webhook Discord"</li>
                </ol>
                {/* Vous pouvez ajouter des images ici */}
            </div>
            <DialogFooter>
                <Button onClick={() => setIsOpen(false)}>Fermer</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const CatalogInfo = ({ catalog, setIsEditingCatalog }) => {
    const [showWebhook, setShowWebhook] = useState(false);

    const maskedWebhook = catalog.discordWebhook
        ? catalog.discordWebhook.replace(/./g, '•').slice(0, 20) + '...'
        : '';

    return (
        <div className="space-y-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p><strong>Serveur:</strong> {catalog.serverName}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{catalog.serverName}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <p><strong>Description:</strong> {catalog.description.substring(0, 50)}...</p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{catalog.description}</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <p><strong>Contact:</strong> {catalog.contactInfo}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{catalog.contactInfo}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <p> Vous pouvez ajouter un webhook Discord pour recevoir des notifications lorsque des véhicules sont ajoutés ou vendus dans ce catalogue quand vous modifiez le catalogue.</p>

            {catalog.discordWebhook && (
                <p>
                    <strong>Webhook Discord:</strong>{' '}
                    {showWebhook ? catalog.discordWebhook : maskedWebhook}
                    <Button
                        variant="ghost"
                        className="ml-2"
                        onClick={() => setShowWebhook(!showWebhook)}
                    >
                        {showWebhook ? "Masquer" : "Afficher"}
                    </Button>
                </p>
            )}
            <Button onClick={() => setIsEditingCatalog(true)}>Modifier</Button>
        </div>
    );
};

const CatalogLink = ({ catalogUrl }) => (
    <div className="flex flex-col space-y-2">
        <Input type="text" value={catalogUrl} readOnly />
        <div className="flex space-x-2">
            <Button onClick={() => navigator.clipboard.writeText(catalogUrl)} className="flex-1">Copier</Button>
            <Button onClick={() => window.open(catalogUrl, '_blank')} className="flex-1">Accéder</Button>
        </div>
    </div>
);

const Categories = ({ categories, setSelectedCategory, setIsDeletingCategory, setIsAddingCategory }) => (
    <>
        <div className="grid grid-cols-2 gap-2 mb-4">
            {categories.map(category => (
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
        <Button onClick={() => setIsAddingCategory(true)} className="w-full">Ajouter une catégorie</Button>
    </>
);

const VehicleList = ({ availableVehicles, soldVehicles, handleSellVehicle, updateVehicleStatus }) => (
    <Tabs defaultValue="available">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="sold">Vendus</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
            <VehicleTable vehicles={availableVehicles} onAction={handleSellVehicle} actionLabel="Vendre" />
        </TabsContent>
        <TabsContent value="sold">
            <VehicleTable vehicles={soldVehicles} onAction={(vehicle) => updateVehicleStatus(vehicle.id, 'available')} actionLabel="Rendre disponible" showBuyer />
        </TabsContent>
    </Tabs>
);

const VehicleTable = ({ vehicles, onAction, actionLabel, showBuyer = false }) => (
    <div className="overflow-x-auto">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Marque</TableHead>
                    <TableHead>Modèle</TableHead>
                    <TableHead>Prix</TableHead>
                    {showBuyer && <TableHead>Acheteur</TableHead>}
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vehicles.map(vehicle => (
                    <TableRow key={vehicle.id}>
                        <TableCell>{vehicle.brand}</TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.price}€</TableCell>
                        {showBuyer && <TableCell>{vehicle.buyerName}</TableCell>}
                        <TableCell>
                            <Button onClick={() => onAction(vehicle)} size="sm">
                                {actionLabel}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);

// Modals
const AddCategoryModal = ({ isOpen, setIsOpen, addCategory }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ajouter une catégorie</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
                e.preventDefault();
                addCategory(new FormData(e.target));
                setIsOpen(false);
            }}>
                <Input name="name" placeholder="Nom de la catégorie" />
                <DialogFooter>
                    <Button type="submit">Ajouter</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);

const AddVehicleModal = ({ isOpen, setIsOpen, addVehicle, categories }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
                e.preventDefault();
                addVehicle(new FormData(e.target));
                setIsOpen(false);
            }}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">Marque</Label>
                        <Input id="brand" name="brand" placeholder="Ex: Toyota" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model" className="text-right">Modèle</Label>
                        <Input id="model" name="model" placeholder="Ex: Corolla" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Prix (€)</Label>
                        <Input id="price" name="price" type="number" placeholder="Ex: 15000" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mileage" className="text-right">Kilométrage</Label>
                        <Input id="mileage" name="mileage" type="number" placeholder="Ex: 50000" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" name="description" placeholder="Description du véhicule" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categoryId" className="text-right">Catégorie</Label>
                        <Select name="categoryId" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Image</Label>
                        <Input id="image" name="image" type="file" accept="image/*" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Ajouter le véhicule</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);

const SellVehicleModal = ({ isOpen, setIsOpen, handleSubmitSale }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
);

const DeleteCategoryModal = ({ isOpen, setIsOpen, selectedCategory, deleteCategory }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
                <Button
                    variant="destructive"
                    onClick={() => {
                        deleteCategory(selectedCategory.id);
                        setIsOpen(false);
                    }}
                >
                    Confirmer la suppression
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);