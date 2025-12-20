# Polet - Expo React Native App

Application mobile développée avec Expo, React Native et Supabase.

## 🚀 Stack Technique

- **Frontend**: Expo React Native avec TypeScript
- **Backend**: Supabase (Auth, Database, Storage)
- **UI**: Gluestack UI + NativeWind/Tailwind CSS
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Context API + Hooks
- **Database**: PostgreSQL via Supabase

## 🛠️ Informations Techniques

### Structure du projet

```
client/
├── app/                    # Routes Expo Router
│   ├── auth/              # Pages d'authentification
│   └── _layout.tsx        # Layout principal avec providers
├── components/            # Composants réutilisables
│   ├── ui/               # Gluestack UI components
│   └── ds/               # Design system custom
├── domains/              # Logique métier par domaine
│   └── auth/             # Domain authentication
├── services/             # Services externes (Supabase, API)
├── hooks/                # Hooks personnalisés
└── supabase/            # Migrations, seeds, config
```

### Commandes utiles

```bash
# Développement local
cd client && supabase start
cd client && npx expo start

# Migrations Supabase
cd client && supabase db diff --file nouvelle_migration
cd client && supabase db push --linked

# Build et déploiement
cd client && npx eas build --platform all
cd client && npx eas submit --platform all
```

### Variables d'environnement requises

```env
# .env
EXPO_PUBLIC_SUPABASE_PROJECT_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_PROJECT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Pour le développement local
EXPO_PUBLIC_USE_LOCAL_SUPABASE=true
EXPO_PUBLIC_SUPABASE_LOCAL_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_LOCAL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Architecture de données

```sql
-- Tables principales
auth.users          -- Gérée par Supabase Auth
public.profiles      -- Informations utilisateur étendues
public.cities        -- Données géographiques

-- Relations
profiles.id -> auth.users.id (FK)
```

## 🔄 Workflow de développement

1. **Feature development**: Créer une branche depuis `develop`
2. **Local testing**: Tests avec Supabase local + Expo Go
3. **PR vers develop**: Auto-deploy vers staging via GitHub Actions
4. **PR vers main**: Auto-deploy vers production après validation

## 📱 Plateformes supportées

- **iOS**: iPhone/iPad (iOS 13+)
- **Android**: Smartphones/Tablettes (API 21+)
- **Web**: Navigateurs modernes (optionnel)

---

_Dernière mise à jour: 20 décembre 2025_
