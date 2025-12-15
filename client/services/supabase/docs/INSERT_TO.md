# Guide complet INSERT INTO avec Supabase

## Syntaxe de base

```sql
INSERT INTO nom_de_table (colonne1, colonne2, ...)
VALUES (valeur1, valeur2, ...);
```

## Exemples avec la table employees

### ❌ Incorrect (erreur de syntaxe)
```sql
insert into public.employees
  (id, name)
values
  ('Erlich Bachman'),      -- Pas de valeur pour id
  ('Richard Hendricks'),
  ('Monica Hall');
```

### ✅ Correct - Solution 1 : IDs manuels
```sql
insert into public.employees (id, name)
values
  (1, 'Erlich Bachman'),
  (2, 'Richard Hendricks'),
  (3, 'Monica Hall');
```

### ✅ Correct - Solution 2 : Auto-increment
```sql
insert into public.employees (name)
values
  ('Erlich Bachman'),
  ('Richard Hendricks'),
  ('Monica Hall');
```

## Variantes d'INSERT dans Supabase

### 1. Insert simple
```sql
INSERT INTO cities (name, population)
VALUES ('Paris', 2150000);
```

### 2. Insert multiple
```sql
INSERT INTO cities (name, population)
VALUES 
  ('Paris', 2150000),
  ('Lyon', 520000),
  ('Marseille', 870000);
```

### 3. Insert avec RETURNING (spécifique PostgreSQL/Supabase)
```sql
INSERT INTO cities (name, population)
VALUES ('Bordeaux', 250000)
RETURNING id, name, created_at;
```

### 4. Insert conditionnel (éviter les doublons)
```sql
INSERT INTO cities (name, population)
VALUES ('Toulouse', 480000)
ON CONFLICT (name) DO NOTHING;
```

### 5. Insert ou update (UPSERT)
```sql
INSERT INTO cities (name, population)
VALUES ('Nice', 340000)
ON CONFLICT (name) 
DO UPDATE SET population = EXCLUDED.population;
```

### 6. Insert depuis une autre table
```sql
INSERT INTO cities_backup (name, population)
SELECT name, population FROM cities
WHERE population > 500000;
```

## Colonnes spéciales dans Supabase

### Auto-increment (IDENTITY)
```sql
-- La colonne id se remplit automatiquement
INSERT INTO cities (name) VALUES ('Nantes');
```

### Timestamps automatiques
```sql
-- created_at se remplit automatiquement avec NOW()
INSERT INTO cities (name) VALUES ('Strasbourg');
```

### Valeurs par défaut
```sql
-- Si une colonne a une valeur par défaut
INSERT INTO cities (name) VALUES ('Lille'); -- population sera NULL
```

## Équivalent avec l'API Supabase JavaScript

```javascript
// Dans votre app React Native
const { data, error } = await supabase
  .from('cities')
  .insert([
    { name: 'Paris', population: 2150000 },
    { name: 'Lyon', population: 520000 }
  ])
  .select(); // Pour récupérer les données insérées

// Insert simple
const { data, error } = await supabase
  .from('employees')
  .insert({ name: 'John Doe' });

// Insert avec UPSERT
const { data, error } = await supabase
  .from('cities')
  .upsert([
    { name: 'Paris', population: 2150000 }
  ], { 
    onConflict: 'name',
    ignoreDuplicates: false 
  });
```

## Bonnes pratiques pour les seeds

```sql
-- Nettoyer avant d'insérer (pour les tests)
TRUNCATE public.cities RESTART IDENTITY CASCADE;

-- Insérer avec gestion des conflits
INSERT INTO public.cities (name, population)
VALUES 
  ('Paris', 2150000),
  ('Lyon', 520000),
  ('Marseille', 870000)
ON CONFLICT (name) DO NOTHING;

-- Vérifier les résultats
SELECT COUNT(*) as total_cities FROM public.cities;
```

## Gestion des erreurs courantes

### Erreur : relation does not exist
```sql
-- ❌ Table inexistante
INSERT INTO public.nonexistent_table (name) VALUES ('test');

-- ✅ Vérifier que la table existe d'abord
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'cities'
);
```

### Erreur : column does not exist
```sql
-- ❌ Colonne inexistante
INSERT INTO cities (nonexistent_column) VALUES ('test');

-- ✅ Lister les colonnes disponibles
\d cities
-- ou
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cities';
```

### Erreur : violates foreign key constraint
```sql
-- ❌ ID référencé n'existe pas
INSERT INTO orders (user_id, product) VALUES (999, 'laptop');

-- ✅ Vérifier que la référence existe
INSERT INTO orders (user_id, product) 
SELECT 1, 'laptop' 
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1);
```

## Exemples avancés

### Insert avec sous-requête
```sql
INSERT INTO user_stats (user_id, total_orders)
SELECT u.id, COUNT(o.id)
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;
```

### Insert conditionnel complexe
```sql
INSERT INTO cities (name, population, country_id)
VALUES ('Barcelona', 1620000, 
  (SELECT id FROM countries WHERE name = 'Spain')
)
ON CONFLICT (name, country_id) 
DO UPDATE SET 
  population = EXCLUDED.population,
  updated_at = NOW();
```

### Insert avec JSON
```sql
INSERT INTO products (name, metadata)
VALUES (
  'iPhone 15', 
  '{"color": "blue", "storage": "128GB", "features": ["5G", "Face ID"]}'::jsonb
);
```

## Commandes utiles pour le développement

### Voir la structure d'une table
```sql
\d table_name
```

### Voir toutes les tables
```sql
\dt
```

### Voir les contraintes
```sql
\d+ table_name
```

### Tester une requête INSERT
```sql
-- Utiliser une transaction pour tester
BEGIN;
INSERT INTO cities (name) VALUES ('Test City');
SELECT * FROM cities WHERE name = 'Test City';
ROLLBACK; -- Annule l'insert
```