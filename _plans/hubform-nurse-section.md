# Plan: HubForm Nurse Section

## Context

`HubForm.tsx` gère déjà un state machine à 3 étapes — la 3ème (`ADD_NURSES`) est définie comme constante et câblée dans `handleAddFamilies()`, mais elle affiche seulement `<Text>Nurses</Text>` (placeholder). Ce plan complète cette étape en créant le formulaire nurse avec Zod, en le branchant dans l'orchestrateur, et en remplaçant les appels Supabase par des `console.log`. À la fin du flow, l'utilisateur est redirigé vers `/`.

## Fichiers à modifier / créer

| Fichier | Action |
|---|---|
| `domains/hub/schemas/hub.schema.ts` | Ajouter `nurseSchema` et `NurseSchema` |
| `domains/hub/components/HubForm/HubFormAddNurses.tsx` | Créer le composant |
| `domains/hub/components/HubForm/HubForm.tsx` | Brancher `HubFormAddNurses`, ajouter constante `NURSE_COUNT`, gérer redirection |
| `domains/hub/translations.json` | Ajouter namespace `addNurses` (FR) |

---

## Étapes d'implémentation

### 1. `hub.schema.ts` — Ajouter `nurseSchema`

```
nurseSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
})
export type NurseSchema = z.infer<typeof nurseSchema>
```

### 2. `translations.json` — Ajouter namespace `addNurses`

Sous la clé `fr`, ajouter :
```json
"addNurses": {
  "title": "Ajouter des nurses",
  "name": "Nom de la nurse {{count}}",
  "namePlaceholder": "Marie Dupont",
  "email": "Email de la nurse {{count}}",
  "emailPlaceholder": "marie@exemple.fr",
  "submit": "Terminer",
  "cancel": "Annuler"
}
```

### 3. `HubFormAddNurses.tsx` — Créer le composant

Pattern identique à `HubFormAddFamilies.tsx` :
- Props : `{ hubId: string; nurseCount: number; onAddNurses: () => void }`
- `useForm` avec `zodResolver(nurseSchema)` et `defaultValues: { name: '', email: '' }`
- Une boucle sur `nurseCount` (step local `1..nurseCount`) pour saisir nurse par nurse
- `handleFormSubmit` : `console.log(data)` à la place d'un appel Supabase, puis incrémenter step ou appeler `onAddNurses()` si toutes les nurses sont saisies
- 2 champs : `name` (DsFormInput) et `email` (DsFormInput avec `inputMode="email"`)
- Boutons Cancel / Terminer via `DsButton` dans `HStack`

### 4. `HubForm.tsx` — Brancher le composant

- Ajouter `const NURSE_COUNT = 1` (constante configurable)
- Importer `useRouter` de `expo-router`
- Ajouter `function handleAddNurses() { router.replace('/') }`
- Remplacer le placeholder `{state === STATES.ADD_NURSES && <Text>Nurses</Text>}` par :
  ```tsx
  {state === STATES.ADD_NURSES && (
    <HubFormAddNurses
      hubId={hubId}
      nurseCount={NURSE_COUNT}
      onAddNurses={handleAddNurses}
    />
  )}
  ```
- Supprimer la ligne commentée `{/* { state === STATES.ADD_NURSES && <HubFormAddNurses hubId={hubId} /> } */}`

---

## Vérification

1. Lancer `yarn start` et tester le flow complet : Create Hub → Add Families → Add Nurses → redirection `/`
2. Vérifier que les erreurs Zod s'affichent sous les champs (nom trop court, email invalide)
3. Vérifier que la console affiche les données à la soumission de chaque nurse
4. Vérifier `yarn types:check` — pas d'erreurs TypeScript
