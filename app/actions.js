'use server'

import { auth } from "@/lib/auth";

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1290770618488197261/9N9OqTWHoSrlO0XADpGyvZ9Wvb4VmUf0A4mFqpasiqDgeoMZHCxh-3WiM2Au4L3y2BW-'

export async function sendBugReport({ title, description, bugType }) {
    const session = await auth();

    if (!session || !session.user) {
        throw new Error('User must be logged in to submit a bug report');
    }

    const embed = {
        title: 'Nouveau rapport de bug - CarVentory',
        color: 0x000000, // Couleur noire
        fields: [
            { name: 'Titre', value: title },
            { name: 'Description', value: description },
            { name: 'Type de bug', value: bugType },
            { name: 'Soumis par', value: session.user.name || 'Non spécifié' },
            { name: 'Email', value: session.user.email || 'Non spécifié' }
        ],
        footer: {
            text: 'CarVentory Bug Report'
        },
        timestamp: new Date().toISOString()
    }

    const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
    })

    if (!response.ok) {
        throw new Error('Failed to send bug report')
    }
}