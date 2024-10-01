'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from 'next/image';

export default function CatalogClient({ catalog }) {
    const [isReserving, setIsReserving] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleReserve = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsReserving(true);
    };

    const handleSubmitReservation = async (e) => {
        e.preventDefault();
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;

        // Ici, vous devriez implémenter la logique pour envoyer la demande de réservation au serveur
        // Par exemple, en utilisant une route API ou une server action

        console.log(`Réservation pour ${firstName} ${lastName} sur le véhicule ${selectedVehicle.brand} ${selectedVehicle.model}`);

        setIsReserving(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">{catalog.name}</h1>
            <p className="mb-4">{catalog.description}</p>
            <p className="mb-8"><strong>Serveur :</strong> {catalog.serverName}</p>

            {catalog.categories.map(category => (
                <div key={category.id} className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.vehicles.map(vehicle => (
                            <Card key={vehicle.id}>
                                <CardHeader>
                                    <CardTitle>{vehicle.brand} {vehicle.model}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {vehicle.image && (
                                        <div className="relative h-48 mb-4">
                                            <Image
                                                src={`data:image/jpeg;base64,${Buffer.from(vehicle.image).toString('base64')}`}
                                                alt={`${vehicle.brand} ${vehicle.model}`}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    )}
                                    <p><strong>Prix :</strong> {vehicle.price}€</p>
                                    <p><strong>Kilométrage :</strong> {vehicle.mileage} km</p>
                                    <p><strong>Description :</strong> {vehicle.description}</p>
                                    <Badge className="mt-2" variant={vehicle.status === 'sold' ? "secondary" : "default"}>
                                        {vehicle.status === 'sold' ? "Vendu" : "Disponible"}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ))}

            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <p>{catalog.contactInfo}</p>
            </div>

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