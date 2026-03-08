# Portfolio Mouniratou Guira

Ce projet est un portfolio moderne et élégant pour Mouniratou Guira, étudiante en communication.

## Structure du projet

- `/public/content/` : Contient les fichiers Markdown (.md) pour chaque section du site.
- `/src/` : Contient le code source (React + Tailwind CSS).
- `/src/App.tsx` : Composant principal gérant l'affichage et le chargement du contenu.

## Comment modifier le contenu ?

Pour modifier le texte du site, il suffit d'éditer les fichiers dans le dossier `/public/content/`. Le site se mettra à jour automatiquement.

## Publication sur GitHub

1. Créez un nouveau dépôt sur GitHub.
2. Dans votre terminal, à la racine du projet :
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/VOTRE_NOM/VOTRE_DEPOT.git
   git push -u origin main
   ```

## Déploiement sur Vercel

1. Rendez-vous sur [Vercel](https://vercel.com).
2. Connectez votre compte GitHub.
3. Cliquez sur **"Add New"** > **"Project"**.
4. Importez votre dépôt GitHub.
5. Vercel détectera automatiquement les paramètres Vite.
6. Cliquez sur **"Deploy"**.

Votre site sera en ligne en quelques secondes !
