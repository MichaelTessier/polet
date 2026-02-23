# Polet

Application mobile multi-plateforme de gestion familiale collaborative. Les utilisateurs créent ou rejoignent un **hub** (espace partagé) dans lequel ils organisent des **familles**, gèrent des membres et envoient des invitations.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework mobile | Expo 54 + React Native 0.81 |
| Langage | TypeScript (strict) |
| UI | Gluestack UI + NativeWind (Tailwind CSS) |
| Routage | Expo Router (file-based) |
| Formulaires | React Hook Form + Zod 4 |
| State | Context API + Hooks custom |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| i18n | i18next + expo-localization |

## Démarrage

### Prérequis

- Node.js
- Yarn
- Supabase CLI
- Expo CLI

### Installation

```bash
# Depuis le répertoire client/
yarn install
```

### Lancer l'app

```bash
yarn start         # Serveur de développement
yarn ios           # Simulateur iOS
yarn android       # Émulateur Android
yarn web           # Navigateur web
```

### Base de données locale

```bash
# Démarrer Supabase en local
supabase start

# Appliquer les migrations et seeds
yarn db:reset

# Générer les types TypeScript depuis le schéma
yarn types:local
```

## Architecture

Le projet suit une architecture **Domain-Driven Design** : le code est organisé par domaine métier, pas par couche technique.

```
client/
├── app/                    # Routes Expo Router (file-based)
│   ├── _layout.tsx         # Layout racine avec providers
│   ├── index.tsx           # Page d'accueil
│   ├── auth/               # Routes d'authentification
│   └── hub/                # Routes hub
│
├── components/
│   ├── ui/                 # Wrappers Gluestack UI + NativeWind
│   └── ds/                 # Composants Design System custom
│       ├── DsButton/
│       ├── DsFormControl/
│       ├── DsFormInput/
│       ├── DsFormSelect/
│       └── DsSelect/
│
├── domains/                # Logique métier par domaine
│   ├── auth/               # Auth : composants, hooks, schemas, provider
│   └── hub/                # Hub : composants, hooks, schemas
│
├── supabase/
│   ├── migrations/         # Migrations SQL
│   ├── seeds/              # Données de test
│   └── types/              # Types générés + exports custom
│
├── i18n/                   # Configuration i18next
└── zod/                    # Error map i18n pour Zod
```

### Patterns clés

- **Routes protégées** via `Stack.Protected guard={boolean}` (Expo Router)
- **Formulaires type-safe** : Zod schema → RHF resolver → composants DS
- **Erreurs Zod traduites** via i18next
- **Types DB auto-générés** depuis Supabase (`yarn types:generate`)

## Modèle de données

```
auth.users
  └── profiles (1:1, auto-créé par trigger)
        └── hubs (1 hub max par utilisateur)
              ├── hub_members  (rôles : admin, member, viewer)
              └── families
                    ├── family_members      (rôles : parent, child, guardian)
                    └── family_invitations  (token UUID, expiration 7 jours)
```

La sécurité est gérée par **Row Level Security (RLS)** PostgreSQL sur toutes les tables. Les opérations complexes passent par des fonctions RPC Supabase.

## Features

| Feature | État |
|---------|------|
| Auth (register, login, reset password) | ✅ |
| Gestion de profil | ✅ |
| Création / gestion de Hub | ✅ |
| Membres Hub avec rôles | ✅ |
| Gestion de familles | ✅ |
| Invitations famille par email | ✅ |
| Multi-langue (FR/EN) | ✅ |
| Todo lists | Schéma défini, non implémenté |
| CI/CD GitHub Actions | Non démarré |

## Scripts utiles

```bash
yarn lint           # ESLint
yarn lint:fix       # ESLint avec auto-fix
yarn format         # Prettier
yarn types:generate # Générer types depuis Supabase lié
yarn types:local    # Générer types depuis Supabase local
yarn types:check    # Vérification TypeScript
yarn db:reset       # Reset base de données locale
```
