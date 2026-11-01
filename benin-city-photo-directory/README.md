# Clichés du Bénin

Galerie de photos participative du Bénin — Next.js 16 + PostgreSQL (Drizzle ORM).

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **PostgreSQL** via Drizzle ORM + `pg`
- Les photos sont stockées en base (base64) — pas de stockage d'objets nécessaire

## Prérequis

- Node.js 20+
- Une base PostgreSQL (cloud ou locale)

## Variables d'environnement

Le projet nécessite **`DATABASE_URL`** :

```bash
# Exemple
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

Copier `.env.example` → `.env.local` et y remplir la valeur.

## Installation locale

```bash
npm install
cp .env.example .env.local   # puis éditer
npm run db:push              # applique le schéma à la base
npm run seed                 # (optionnel) insère 10 clichés de démo
npm run dev
```

Site disponible sur http://localhost:3000

## Commandes utiles

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Lancer la version de production |
| `npm run db:push` | Appliquer le schéma à la base (sans historique) |
| `npm run db:migrate` | Appliquer les migrations SQL (`drizzle/`) |
| `npm run db:generate` | Générer un fichier de migration après changer le schema |
| `npm run seed` | Insérer les clichés de démo (une seule fois) |

---

## Déploiement — Option 1 : Vercel + base cloud (recommandé)

1. **Créer une base PostgreSQL gratuite** :
   - [Neon](https://neon.com) (recommandé : gratuite, sans échéance) ou
   - [Supabase](https://supabase.com) (gratuite)

2. **Appliquer le schéma** (une fois, localement) :
   ```bash
   export DATABASE_URL="postgresql://..."   # ton URL Neon/Supabase
   npm run db:push
   ```

3. **Importer le projet sur Vercel** :
   - Importer `https://github.com/leger202/clichetduBenin.git`
   - **Root Directory** : `benin-city-photo-directory` (le projet est dans un sous-dossier du repo)
   - Framework prédétecté : Next.js

4. **Environnement** dans Vercel :
   - `DATABASE_URL` = ton URL de base (dans Settings → Environment Variables)

5. **Déployer** : `npm run build` tourne automatiquement → site en ligne.

6. **(Optionnel)** Lancer le seed de démo sur la base de production :
   ```bash
   DATABASE_URL="..." node scripts/seed.mjs
   ```
   Les clichés de démo sont ensuite visibles sur le site.

---

## Déploiement — Option 2 : VPS / Docker (hébergement autonome)

1. **Sur le VPS** : installer Docker et Docker Compose.
2. **Copier le projet** sur le VPS et lancer :
   ```bash
   docker compose up -d --build
   ```
3. Le compose lance PostgreSQL + l'app (`http://IP_VPS:3000`).
4. **Ajouter ses propres clichés** via la page **/contribuer** du site.

Pour relancer les migrations manuellement :
```bash
docker compose exec app npx drizzle-kit migrate
```

---

## Structure du projet

```
benin-city-photo-directory/
├── src/
│   ├── app/            # Pages (App Router) + API routes
│   ├── components/     # Composants React
│   ├── db/             # Schéma Drizzle + connexion
│   └── lib/            # Requêtes, utilitaires
├── public/images/seed/ # Clichés de démo pour le seed
├── drizzle/            # Migrations SQL
├── scripts/seed.mjs    # Seeder de démo
├── Dockerfile          # Image Docker (production)
└── docker-compose.yml  # PostgreSQL + app
```

## Notes techniques

- Les images sont encodées base64 en base → pour une grosse galerie, migrer vers
  un stockage d'objets (S3/Supabase Storage) est préférable.
- `drizzle/` contient les migrations SQL — ne pas effacer.
