# Supabase CLI - Guide des commandes essentielles

## 🚀 Installation et Setup

```bash
# Installer Supabase CLI
npm install -g supabase

# Login à Supabase
supabase login

# Initialiser un projet local
supabase init

# Lier projet local à la production
supabase link --project-ref YOUR_PROJECT_REF
```

## 🏠 Développement Local

### Démarrer l'environnement local

```bash
# Démarrer tous les services (DB, API, Studio, Auth...)
supabase start

# Arrêter tous les services
supabase stop

# Redémarrer (utile après changement de config)
supabase restart

# Voir le statut des services
supabase status
```

### Accès aux services locaux

- **Supabase Studio** : http://localhost:54323
- **API URL** : http://localhost:54321
- **Database URL** : postgresql://postgres:postgres@localhost:54322/postgres
- **Inbucket (emails)** : http://localhost:54324

## 📊 Base de données locale

### Shell et connexion

```bash
# Se connecter à la DB locale
supabase db shell

# Se connecter à la DB de production
supabase db shell --linked

# Exécuter un fichier SQL
psql -f migration.sql -h localhost -p 54322 -U postgres
```

### Reset et seed

```bash
# Reset complet de la DB locale (applique migrations + seeds)
supabase db reset

# Reset sans les seeds
supabase db reset --no-seed
```

## 🔄 Migrations

### Créer des migrations

```bash
# Créer une nouvelle migration vide
supabase migration new nom_de_la_migration

# Générer une migration depuis les changements
supabase db diff --file nom_de_la_migration

# Générer migration depuis changements en production
supabase db diff --linked --file sync_production
```

### Appliquer des migrations

```bash
# Appliquer migrations en local
supabase db reset

# Pousser migrations vers la production
supabase db push --linked

# Pousser avec référence de projet spécifique
supabase db push --project-ref YOUR_PROJECT_REF
```

### Voir les migrations

```bash
# Lister les migrations appliquées
supabase migration list

# Voir les différences avec la production
supabase db diff --linked
```

## 🌐 Synchronisation Production ↔ Local

### Récupérer le schéma de production

```bash
# Télécharger le schéma actuel de production
supabase db pull

# Télécharger schéma + données
supabase db dump --data-only > seed.sql
```

### Pousser vers production

```bash
# Pousser migrations
supabase db push --linked

# Pousser avec confirmation
supabase db push --linked --include-seed
```

## 📋 Types et génération de code

### Générer types TypeScript

```bash
# Générer types depuis le schéma local
supabase gen types typescript --local > database.types.ts

# Générer types depuis la production
supabase gen types typescript --linked > database.types.ts

# Avec un schema spécifique
supabase gen types typescript --schema public --linked
```

## 🔧 Utilitaires et debugging

### Informations projet

```bash
# Voir les infos du projet lié
supabase projects list

# Voir la configuration locale
cat supabase/config.toml

# Voir les logs des services
supabase logs api
supabase logs db
supabase logs auth
```

### Nettoyage

```bash
# Supprimer containers Docker
supabase stop --no-backup

# Nettoyer complètement (⚠️ perd toutes les données locales)
docker system prune -a
```

## 📁 Structure des fichiers

```
supabase/
├── config.toml          # Configuration locale
├── migrations/          # Fichiers de migration SQL
│   ├── 20231201_init.sql
│   └── 20231202_users.sql
├── seed.sql            # Données de test
└── .temp/              # Fichiers temporaires
```

## 🎯 Workflow recommandé

### 1. Setup initial

```bash
cd client
supabase init
supabase link --project-ref YOUR_PROJECT_REF
supabase db pull  # Récupère le schéma existant
```

### 2. Développement quotidien

```bash
# Démarrer l'environnement
supabase start

# Faire vos changements dans Studio (localhost:54323)
# ou directement en SQL

# Générer la migration
supabase db diff --file ma_nouvelle_feature

# Tester localement
supabase db reset

# Générer les types
supabase gen types typescript --local > types/database.ts
```

### 3. Déploiement

```bash
# Pousser vers production
supabase db push --linked

# Vérifier que tout est ok
supabase db diff --linked  # Doit être vide

# Générer types de production
supabase gen types typescript --linked > types/database.ts
```

## ⚠️ Erreurs courantes et solutions

### "Project not linked"

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### "Extension does not exist"

```bash
# Normal, ignorer le NOTICE
# Ou modifier la migration pour utiliser IF EXISTS
```

### "Permission denied"

```bash
# Vérifier que vous êtes connecté
supabase login

# Vérifier les permissions sur le projet
supabase projects list
```

### Reset complet si tout est cassé

```bash
supabase stop --no-backup
supabase start
supabase db reset
```

## 💡 Tips utiles

- **Toujours tester en local** avant de pousser en production
- **Utiliser des transactions** pour les changements complexes
- **Faire des migrations petites** et atomiques
- **Sauvegarder avant les gros changements** : `supabase db dump > backup.sql`
- **Les migrations sont irréversibles** en production
- **Utilisez `--linked`** pour toutes les opérations de production

## 🔗 Liens utiles

- [Documentation CLI](https://supabase.com/docs/guides/cli)
- [Guide des migrations](https://supabase.com/docs/guides/cli/local-development)
- [Dashboard Supabase](https://supabase.com/dashboard)
