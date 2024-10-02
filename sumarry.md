# Plateforme de Gestion de Catalogues pour Concessionnaires FiveM !!!

## Contexte et Objectif
Le projet vise à développer une plateforme web destinée aux concessionnaires de serveurs FiveM, permettant la gestion de catalogues de véhicules à vendre, accessible au public. Ce projet utilise Next.js (App Router), Prisma, Auth.js, et Shadcn pour fournir une solution complète de gestion d'inventaire, de catégories de véhicules, de pré-réservations, et de gestion des ventes.

## Fonctionnalités détaillées

### 1. Connexion via Google
Les utilisateurs devront se connecter via Google pour accéder à leur tableau de bord et gérer leurs catalogues. Cette fonctionnalité est gérée via Auth.js pour une connexion sécurisée et fluide. Chaque utilisateur connecté pourra gérer ses catalogues indépendamment.

### 2. Création et gestion de catalogues
Une fois connectés, les utilisateurs pourront :
- Créer plusieurs catalogues, chacun associé à un serveur FiveM spécifique.
- Modifier les informations de chaque catalogue : nom du catalogue, nom du serveur, description, coordonnées de contact.

### 3. Gestion des catégories de voitures
Les utilisateurs pourront organiser leurs véhicules en catégories personnalisées, telles que Luxe, Haut de gamme, Milieu de gamme, etc. Ces catégories sont modifiables à tout moment.

### 4. Informations détaillées des véhicules
Chaque véhicule dans un catalogue inclura :
- Catégorie
- Prix
- Kilométrage
- Description
- Marque et modèle
- Une ou plusieurs images

### 5. Consultation publique des catalogues
Chaque catalogue a un lien public accessible sans connexion. Les visiteurs pourront consulter les véhicules disponibles et filtrer par catégorie.

### 6. Système de pré-réservation pour visiteurs non connectés
Les visiteurs pourront pré-réserver un véhicule en fournissant leur nom et prénom. La demande de pré-réservation apparaîtra sur le tableau de bord du concessionnaire.

### 7. Gestion des demandes de pré-réservation
Le concessionnaire pourra :
- Accepter la pré-réservation : marquant la voiture comme vendue et la retirant du catalogue.
- Rejeter la pré-réservation.

### 8. Historique des ventes
Toutes les voitures vendues seront archivées avec les informations du véhicule et, si disponible, celles de l'acheteur. Cet historique permet de garder une trace des transactions passées.

## Technologie et Architecture

### Next.js (App Router)
Next.js gère les pages et interactions, avec des server actions pour éviter l'implémentation d'une API distincte, simplifiant ainsi la structure.

### Prisma
Prisma sera utilisé pour gérer les interactions avec la base de données, stockant les informations sur les utilisateurs, catalogues, véhicules, pré-réservations, et l'historique des ventes.

### Auth.js
Auth.js s'occupera de l'authentification via Google.

### Shadcn
Shadcn assurera un design moderne et responsive pour offrir une interface intuitive, tant pour les concessionnaires que pour les visiteurs.

## Expérience Utilisateur

- **Concessionnaires** : Gestion simple des catalogues, véhicules, pré-réservations et ventes.
- **Visiteurs** : Consultation des catalogues et possibilité de pré-réserver des véhicules sans se connecter.

## Conclusion
Cette plateforme vise à simplifier la gestion d'inventaire et de vente pour les concessionnaires de serveurs FiveM, tout en offrant une expérience utilisateur fluide et intuitive aux acheteurs. L'architecture moderne permet une évolutivité à long terme pour l'ajout de nouvelles fonctionnalités.