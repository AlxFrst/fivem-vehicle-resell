'use server'

import prisma from "@/lib/db"

export async function reserveVehicle(formData) {
    const firstName = formData.get('firstName')
    const lastName = formData.get('lastName')
    const vehicleId = formData.get('vehicleId')
    const catalogId = formData.get('catalogId')

    try {
        const reservation = await prisma.reservation.create({
            data: {
                firstName,
                lastName,
                vehicleId,
                catalogId,
            },
        })
        return { success: true, reservation }
    } catch (error) {
        console.error('Error creating reservation:', error)
        return { success: false, error: error.message }
    }
}