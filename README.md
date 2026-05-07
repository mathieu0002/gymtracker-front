# GymTracker

Interface frontend pour une application de suivi de musculation, avec un design inspiré de l'esthétique "cyberpunk".

## Fonctionnalités

*   **Sélection de profil** : Choisissez un utilisateur.
*   **Tableau de bord** : Visualisez vos records (PRs) et votre progression via des graphiques.
*   **Nouvelle séance** : Enregistrez vos entraînements en 3 étapes simples.
*   **Historique** : Consultez vos séances passées.
*   **Admin** : Gérez les utilisateurs, exercices et groupes musculaires.

## Stack

*   React & TypeScript
*   Vite
*   React Router
*   Recharts
*   CSS pur

## Lancement

Ce projet est uniquement le **frontend**. Il nécessite une API backend pour fonctionner.

1.  **Installer les dépendances**
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement**
    L'application sera disponible sur `http://localhost:5173`.
    ```bash
    npm run dev
    ```

## Scripts disponibles

*   `npm run dev`: Lance le serveur de développement.
*   `npm run build`: Compile l'application pour la production.
*   `npm run preview`: Lance un serveur local pour prévisualiser le build de production.
