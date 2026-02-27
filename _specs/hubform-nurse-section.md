# Spec for HubForm Nurse Section

branch: claude/feature/hubform-nurse-section

## Summary

Ajoute l'étape "Nurse" (infirmière / garde) au formulaire multi-étapes `HubForm`. Cette étape suit `ADD_FAMILIES` et permet à l'utilisateur de saisir les informations des nurses associées au hub. La validation côté client est gérée par un schéma Zod dédié. Les appels Supabase sont temporairement remplacés par des `console.log` pour permettre le développement de l'UI avant que la migration DB ne soit prête.

## Functional requirement

- Ajouter un nouvel état `ADD_NURSES` dans la machine d'état de `HubForm.tsx` (l'état existe déjà comme constante, il faut le brancher)
- Créer un nouveau composant `HubFormAddNurses.tsx` dans `domains/hub/components/HubForm/`
- Le formulaire permet d'ajouter une ou plusieurs nurses (nombre fixé lors de la création du hub, ou configurable — à préciser)
- Pour chaque nurse, les champs à saisir sont :
  - `name` (texte, obligatoire)
  - `email` (email, obligatoire)
- La validation utilise un schéma Zod `nurseSchema` à ajouter dans `domains/hub/schemas/hub.schema.ts`
- Les erreurs de validation sont automatiquement traduites via i18n (pattern existant)
- À la soumission, remplacer l'appel Supabase par un `console.log` des données du formulaire
- Ajouter les clés de traduction nécessaires dans `domains/hub/translations.json` (namespace `addNurses`)
- Le composant suit le même pattern que `HubFormAddFamilies.tsx` : `zodResolver` → `react-hook-form` → composants DS

## Figma design reference (only if referenced)

N/A

## Possible Edge Cases

- Le nombre de nurses peut être nul (0) — dans ce cas, l'étape est skippée ou affiche un message vide
- Validation email invalide par nurse
- Formulaire soumis avec des champs vides

## Acceptance Criteria

- `HubForm.tsx` transite vers l'état `ADD_NURSES` après la complétion de `ADD_FAMILIES`
- `HubFormAddNurses.tsx` s'affiche correctement à l'étape `ADD_NURSES`
- Le schéma Zod `nurseSchema` valide `name` (min 3, max 50) et `email` (format email)
- Les erreurs de validation s'affichent sous chaque champ via i18n
- La soumission du formulaire affiche les données dans la console (`console.log`) à la place d'un appel Supabase
- Les traductions françaises sont présentes pour tous les labels et placeholders de l'étape nurses
- Le composant utilise uniquement des composants DS existants (`DsFormInput`, `DsFormControl`, `DsButton`)

## Open Questions

- Le nombre de nurses est-il fixé (1 par défaut ?) ou saisi dans une étape précédente comme `familyNumber` pour les familles ? Pour le moment c'est 1, doit être configurable avec une constante
- Doit-on permettre l'ajout dynamique de nurses (bouton "Ajouter une nurse") ou le nombre est-il fixe ? pour le moment le nombre est fixe
- Quel est le comportement après la soumission de l'étape nurses (fin du flow, confirmation, redirection) ? redirection vers '/'

<!-- ## Testing Guidelines

Create a test file `domains/hub/components/HubForm/HubFormAddNurses.test.tsx` for the new component, covering:

- Affichage des champs `name` et `email` pour chaque nurse
- Validation : erreur affiché si `name` trop court ou `email` invalide
- Soumission valide déclenche le `console.log` avec les bonnes données
- Pas d'appel Supabase lors de la soumission -->
