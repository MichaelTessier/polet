# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project structure

All application code lives in `client/`. Run all commands from there.

```
client/
├── app/              # Expo Router file-based routes
├── components/
│   ├── ui/           # Gluestack UI wrappers with NativeWind styles
│   └── ds/           # Custom Design System components
├── domains/          # Domain-Driven Design — business logic by domain
│   ├── auth/
│   └── hub/
├── supabase/
│   ├── migrations/   # SQL migrations (apply with db:reset)
│   ├── seeds/
│   └── types/        # generated.ts is auto-generated, never edit manually
├── i18n/             # i18next initialization
└── zod/              # Custom Zod resolver + i18n error map
```

## Commands (run from `client/`)

```bash
yarn start              # Dev server
yarn ios / android / web # Platform-specific dev
yarn lint               # ESLint
yarn lint:fix           # ESLint with auto-fix
yarn format             # Prettier
yarn types:check        # TypeScript check (tsc --noEmit)
yarn types:local        # Regenerate supabase/types/generated.ts from local DB
yarn types:generate     # Regenerate types from linked Supabase project
yarn db:reset           # Reset local DB + regenerate types
```

## Environment variables

The Supabase client reads from `.env`:

- `EXPO_PUBLIC_SUPABASE_PROJECT_URL`
- `EXPO_PUBLIC_SUPABASE_PROJECT_API_KEY`

## Architecture

### Domain structure

Each domain (`domains/<name>/`) is self-contained:

- `components/` — UI specific to this domain
- `hooks/` — business logic hooks
- `schemas/` — Zod validation schemas
- `providers/` — React context providers (auth domain only)
- `init.ts` — imports domain translations into i18next
- `translations.json` — domain-scoped i18n keys

To add a new domain: create the folder, add an `init.ts` that registers translations, import it in `app/_layout.tsx`.

### Route protection

Routes use Expo Router's `Stack.Protected` with a boolean guard:

```tsx
<Stack.Protected guard={isLoggedIn}>
```

Auth routes guard on `!isLoggedIn`, protected app routes guard on `isLoggedIn`.

### Auth flow

`AuthProvider` (wraps the whole app) maintains `session` (from Supabase auth) and `profile` (fetched separately from `profiles` table). `useAuthContext()` exposes `{ session, profile, isLoggedIn, isLoading, updateProfile }`. Session state triggers profile fetch reactively.

### Forms pattern

Every form follows: Zod schema → custom `zodResolver` → `react-hook-form` → DS components.

```tsx
const { control, handleSubmit } = useForm<Schema>({
  resolver: zodResolver(mySchema),
});
// Zod errors are automatically translated via i18n
```

The `zodResolver` in `zod/resolver.ts` is a custom implementation (not `@hookform/resolvers`) that integrates with the i18n error map.

### Component hierarchy

1. `components/ui/` — thin @gluestack-ui component wrappers, rarely modified
2. `components/ds/` — reusable Design System components that extend UI components (`DsFormInput`, `DsFormSelect`, `DsFormControl`, `DsButton`)
3. `domains/*/components/` — feature components using DS components
4. `app/` — route-level screens

Always compose downward: screens → domain components → DS components → UI components.

### Database (Supabase)

Operations happen via two mechanisms:

- Direct table queries for reads
- RPC functions for writes with business logic (e.g., `create_user_hub`, `invite_to_family`)

Types are fully generated. After any migration, run `yarn db:reset` (local) or `yarn types:generate` (linked project) to keep types in sync.

RLS policies enforce access at the DB level — no need for client-side permission checks.

### i18n

Translations are split by domain. Each domain's `init.ts` registers its `translations.json` namespace. Zod validation errors are automatically translated — error keys in schemas must match keys in `zod/translations.json`.

### Additional Coding Preferences

#### Design System Components (DRY Principle)

- **Always create DS components** when you identify reusable UI patterns to avoid code duplication
- Before writing repetitive code, check if a DS component exists in `components/ds/`
- If no suitable DS component exists, create one following the pattern of `DsButton`, `DsFormInput`, etc.
- DS components should be generic, reusable, and compose existing UI components
- Name DS components with the `Ds` prefix (e.g., `DsModal`, `DsCard`, `DsTable`)

#### Component Creation Guidelines

- **Prioritize composition over repetition**: Extract common patterns into DS components
- **Follow the component hierarchy**: UI → DS → Domain → Screen components
- **Use TypeScript strictly**: All components must have proper type definitions
- **Implement theme support**: Use `useThemeColor` for light/dark mode compatibility
- **Support style props**: Accept `style` prop typed as `StyleProp<ViewStyle>` or `StyleProp<TextStyle>`

#### File Organization Rules

- **Domain-specific logic** belongs in `domains/<name>/` folders only
- **Reusable components** go in `components/ds/` with proper folder structure
- **UI wrappers** stay in `components/ui/` and should rarely be modified
- **Always create index files** for component folders to enable clean imports

#### Development Standards

- **Form handling**: Always use Zod schema → `zodResolver` → `react-hook-form` pattern
- **Database operations**: Use RPC functions for writes, direct queries for reads
- **Type safety**: Run `yarn types:check` after any significant changes
- **i18n**: Add translations to appropriate domain namespace, never hardcode strings
- **Error handling**: Leverage automatic Zod error translation via i18n error map

#### Code Quality Practices

- **No inline styles**: Use NativeWind classes or styled components
- **Consistent naming**: Use camelCase for variables/functions, PascalCase for components
- **Import organization**: Group imports (external → internal → relative) with empty lines
- **Performance**: Use React.memo() for components that receive stable props
- **Accessibility**: Always include proper accessibility props (`accessibilityLabel`, `accessibilityRole`)
