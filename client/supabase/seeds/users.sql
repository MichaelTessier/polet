-- Supprimer les données existantes
DELETE FROM public.profiles WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
DELETE FROM auth.users WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Insérer seulement l'utilisateur - le trigger créera le profil automatiquement
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'john.doe@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "John Doe"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Mettre à jour le profil créé automatiquement avec les bonnes valeurs
UPDATE public.profiles 
SET 
  username = 'JohnD',
  full_name = 'John Doe'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

-- Insérer seulement l'utilisateur - le trigger créera le profil automatiquement
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'authenticated',
  'authenticated',
  'test@mail.com',
  crypt('123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

UPDATE public.profiles 
SET 
  username = 'TestUser',
  full_name = 'Test User'
WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';