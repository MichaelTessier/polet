# Polet - TODO List

### 🔐 Profile Management

- [x] **Créer la table `profiles` dans Supabase** ✅
- [x] **Migration de la table profiles** ✅
- [ ] **Hook `useProfile` pour gérer les données utilisateur**

  ```tsx
  // hooks/useProfile.ts
  export function useProfile(session: Session | null) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
      /* ... */
    };
    const updateProfile = async (updates: Partial<Profile>) => {
      /* ... */
    };

    return { profile, loading, updateProfile, refetch: fetchProfile };
  }
  ```

- [ ] **Interface TypeScript pour Profile**
  ```tsx
  // types/profile.ts
  export interface Profile {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    created_at: string;
    updated_at: string;
  }
  ```
- [ ] **Écran de profil principal (`app/auth/profile.tsx`)**
  - Affichage des informations utilisateur
  - Photo de profil avec placeholder
  - Boutons d'action (Modifier, Déconnexion)
  - Navigation vers l'édition
- [ ] **Formulaire d'édition du profil**
  ```tsx
  // components/ProfileEditForm.tsx
  - Input pour le nom complet
  - Input pour le username (validation unicité)
  - TextArea pour la bio
  - Sélecteur de photo (camera/galerie)
  - Boutons Sauvegarder/Annuler
  ```
- [ ] **Composant de photo de profil**
  ```tsx
  // components/ProfileAvatar.tsx
  - Affichage de l'avatar ou initiales
  - Mode édition avec icône caméra
  - Support des images locales et URLs
  - Cercle avec bordure
  ```
- [ ] **Upload d'avatar avec Supabase Storage**
  ```tsx
  // hooks/useAvatarUpload.ts
  - Upload vers bucket 'avatars'
  - Redimensionnement de l'image
  - Mise à jour de l'URL dans profiles
  - Suppression de l'ancienne image
  ```
- [ ] **Validation des données du profil**
  ```tsx
  // utils/profileValidation.ts
  - Username: 3-20 caractères, alphanumérique + _
  - Full name: 2-50 caractères
  - Bio: max 500 caractères
  - Messages d'erreur en français
  ```
- [ ] **États de chargement et erreurs**
  - Skeleton loader pendant le fetch
  - Messages d'erreur pour les échecs de sauvegarde
  - Indicateurs de sauvegarde en cours
  - Toast notifications pour succès/erreur
- [ ] **Navigation et protection des routes**
  ```tsx
  // app/auth/profile.tsx - Route protégée (isLoggedIn = true)
  // app/auth/edit-profile.tsx - Sous-route d'édition
  ```
- [ ] **Intégration avec AuthContext**
  ```tsx
  // domains/auth/providers/AuthProvider.tsx
  - Ajouter profile dans le context
  - Charger automatiquement le profile après login
  - Mettre à jour le profile dans le state global
  ```

### 🤖 GitHub Actions - CI/CD

- [ ] **Action pour Staging Environment**
  ```yaml
  # .github/workflows/deploy-staging.yml
  name: Deploy to Staging
  on:
    push:
      branches: [develop]
  jobs:
    deploy-staging:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - name: Setup Supabase CLI
        - name: Run migrations on staging
          run: |
            supabase link --project-ref ${{ secrets.SUPABASE_STAGING_REF }}
            supabase db push --linked
  ```
- [ ] **Action pour Production Environment**
  ```yaml
  # .github/workflows/deploy-production.yml
  name: Deploy to Production
  on:
    push:
      branches: [main]
  jobs:
    deploy-production:
      runs-on: ubuntu-latest
      steps:
        - name: Deploy migrations to production
        - name: Generate TypeScript types
        - name: Build EAS (optionnel)
  ```
- [ ] **Secrets GitHub à configurer**
  - `SUPABASE_ACCESS_TOKEN`: Token d'accès Supabase CLI
  - `SUPABASE_STAGING_REF`: Référence projet staging
  - `SUPABASE_PRODUCTION_REF`: Référence projet production
  - `SUPABASE_DB_PASSWORD`: Mot de passe base de données
- [ ] **Tests automatisés avant déploiement**
  - Tests unitaires (Jest)
  - Tests d'intégration Supabase
  - Validation TypeScript
- [ ] **Notifications de déploiement**
  - Slack/Discord webhook pour succès/échec
  - Rollback automatique en cas d'erreur

### 🎨 Splash Screen

- [ ] **Design du splash screen**
  - Logo Polet centré
  - Animation de fade-in/fade-out
  - Couleurs cohérentes avec le thème
- [ ] **Configuration Expo**
  ```json
  // app.json
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#ffffff"
  }
  ```
- [ ] **Écrans adaptifs (iOS/Android)**
  - `splash.png`: 1242x2436px (iOS)
  - `adaptive-icon.png`: 1024x1024px (Android)
  - Variants dark/light mode
- [ ] **Contrôleur de splash screen personnalisé**
  ```tsx
  // SplashScreenController.tsx
  - Vérification de l'état d'authentification
  - Chargement des données initiales
  - Redirection automatique vers la bonne route
  - Animation de transition fluide
  ```
- [ ] **Tests multi-plateformes**
  - iOS Simulator (différentes tailles d'écran)
  - Android Emulator (différents DPI)
  - Expo Go pour tests rapides
