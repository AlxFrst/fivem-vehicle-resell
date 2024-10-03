'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { reserveVehicle } from './actions';

export default function CatalogClient({ catalog }) {
    const [isReserving, setIsReserving] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showSoldVehicles, setShowSoldVehicles] = useState(false);
    const vehiclesPerPage = 9;
    const [enlargedVehicle, setEnlargedVehicle] = useState(null);

    const handleReserve = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsReserving(true);
    };

    const handleImageClick = (vehicle) => {
        setEnlargedVehicle(vehicle);
    };
    
    const handleSubmitReservation = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('vehicleId', selectedVehicle.id);
        formData.append('catalogId', catalog.id);

        const result = await reserveVehicle(formData);

        if (result.success) {
            console.log('Réservation créée avec succès:', result.reservation);
            // Vous pouvez ajouter ici une notification pour l'utilisateur
            setIsReserving(false);
        } else {
            console.error('Erreur lors de la réservation:', result.error);
            // Vous pouvez ajouter ici une gestion d'erreur pour l'utilisateur
        }
    };

    const allVehicles = useMemo(() => catalog.categories.flatMap(category =>
        category.vehicles.map(vehicle => ({ ...vehicle, category: category.name }))
    ), [catalog]);

    const filteredVehicles = useMemo(() => {
        return allVehicles.filter(vehicle =>
            (selectedCategory === 'all' || vehicle.category === selectedCategory) &&
            (vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (showSoldVehicles || vehicle.status !== 'sold')
        );
    }, [allVehicles, selectedCategory, searchTerm, showSoldVehicles]);

    const pageCount = Math.ceil(filteredVehicles.length / vehiclesPerPage);
    const currentVehicles = filteredVehicles.slice(
        (currentPage - 1) * vehiclesPerPage,
        currentPage * vehiclesPerPage
    );

    return (
        <div className="container mx-auto px-4 py-8 bg-white text-black">
            <h1 className="text-4xl font-bold mb-4">{catalog.name}</h1>
            <p className="mb-8 text-gray-600">{catalog.description}</p>

            <div className="flex flex-wrap justify-between items-center mb-8">
                <div className="relative mb-4 md:mb-0">
                    <Input
                        type="text"
                        placeholder="Rechercher un véhicule..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-64"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge
                        className={`cursor-pointer ${selectedCategory === 'all' ? 'bg-black text-white' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Toutes
                    </Badge>
                    {catalog.categories.map(category => (
                        <Badge
                            key={category.id}
                            className={`cursor-pointer ${selectedCategory === category.name ? 'bg-black text-white' : ''}`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            {category.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                    id="showSold"
                    checked={showSoldVehicles}
                    onCheckedChange={setShowSoldVehicles}
                />
                <label htmlFor="showSold" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Afficher les véhicules vendus
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentVehicles.map(vehicle => (
                    <Card key={vehicle.id} className={`overflow-hidden ${vehicle.status === 'sold' ? 'opacity-70' : ''}`}>
                        <div className="relative aspect-[16/9] overflow-hidden" onClick={() => handleImageClick(vehicle)}>
                            <Image
                                src={`data:image/jpeg;base64,${Buffer.from(vehicle.image).toString('base64')}`}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-all duration-300 hover:scale-105"
                            />
                            {vehicle.status === 'sold' && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">VENDU</span>
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                            <CardDescription>{vehicle.price}€ | {vehicle.mileage} km</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{vehicle.description}</p>
                            <div className="flex justify-between items-center">
                                <Badge>{vehicle.category}</Badge>
                                <Badge variant={vehicle.status === 'sold' ? "secondary" : "default"}>
                                    {vehicle.status === 'sold' ? "Vendu" : "Disponible"}
                                </Badge>
                            </div>
                            {/* {vehicle.status !== 'sold' && (
                                <Button disabled className="w-full mt-4" onClick={() => handleReserve(vehicle)}>Réserver</Button>
                            )} */}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center items-center space-x-4 mt-8">
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" /> Précédent
                </Button>
                <span>{currentPage} / {pageCount}</span>
                <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                    disabled={currentPage === pageCount}
                >
                    Suivant <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            <Separator className="my-8" />

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <p>{catalog.contactInfo}</p>
            </div>

            <Dialog open={enlargedVehicle !== null} onOpenChange={() => setEnlargedVehicle(null)}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>{enlargedVehicle?.brand} {enlargedVehicle?.model}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative aspect-video">
                            {enlargedVehicle && (
                                <Image
                                    src={`data:image/jpeg;base64,${Buffer.from(enlargedVehicle.image).toString('base64')}`}
                                    alt={`${enlargedVehicle?.brand} ${enlargedVehicle?.model}`}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            )}
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Détails du véhicule</h3>
                                <p><strong>Prix:</strong> {enlargedVehicle?.price}€</p>
                                <p><strong>Kilométrage:</strong> {enlargedVehicle?.mileage} km</p>
                                <p><strong>Catégorie:</strong> {enlargedVehicle?.category}</p>
                                <p><strong>Statut:</strong> {enlargedVehicle?.status === 'sold' ? 'Vendu' : 'Disponible'}</p>
                                <p className="mt-4"><strong>Description:</strong></p>
                                <p>{enlargedVehicle?.description}</p>
                            </div>
                            <div className="mt-4">
                                <Badge variant={enlargedVehicle?.status === 'sold' ? "secondary" : "default"}>
                                    {enlargedVehicle?.status === 'sold' ? "Vendu" : "Disponible"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setEnlargedVehicle(null)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReserving} onOpenChange={setIsReserving}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Réserver {selectedVehicle?.brand} {selectedVehicle?.model}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitReservation}>
                        <Input name="firstName" placeholder="Prénom" className="mb-2" required />
                        <Input name="lastName" placeholder="Nom" className="mb-2" required />
                        <DialogFooter>
                            <Button type="submit">Envoyer la demande</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}