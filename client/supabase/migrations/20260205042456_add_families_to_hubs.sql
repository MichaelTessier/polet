-- ========================================
-- MIGRATION: FAMILLES DANS LES HUBS
-- ========================================

-- Table des familles (appartiennent à un hub)
CREATE TABLE public.families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES public.hubs(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
  number_of_children INTEGER DEFAULT 0 CHECK (number_of_children >= 0),
  -- address TEXT,
  -- phone TEXT,
  -- email TEXT CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  -- notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEX POUR LES PERFORMANCES
-- ========================================

CREATE INDEX idx_families_hub_id ON public.families(hub_id);
CREATE INDEX idx_families_created_by ON public.families(created_by);
CREATE INDEX idx_families_name ON public.families(hub_id, name);

-- ========================================
-- TRIGGERS POUR UPDATED_AT
-- ========================================

-- Trigger pour families.updated_at
CREATE TRIGGER update_families_updated_at 
  BEFORE UPDATE ON public.families 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activer RLS sur families
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

-- Voir les familles de son hub actif
CREATE POLICY "Users can view families in their active hub" ON public.families
  FOR SELECT USING (hub_id = get_user_active_hub());

-- Créer des familles dans son hub actif
CREATE POLICY "Hub members can create families" ON public.families
  FOR INSERT WITH CHECK (
    created_by = auth.uid()
    AND hub_id = get_user_active_hub()
  );

-- Modifier les familles (créateur ou admins du hub)
CREATE POLICY "Family creators and hub admins can update families" ON public.families
  FOR UPDATE USING (
    created_by = auth.uid()
    OR
    hub_id IN (
      SELECT w.id FROM public.hubs w
      WHERE w.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.hub_members wm
        WHERE wm.hub_id = w.id 
        AND wm.user_id = auth.uid() 
        AND wm.role = 'admin'
      )
    )
  );

-- Supprimer les familles (créateur ou admins du hub)
CREATE POLICY "Family creators and hub admins can delete families" ON public.families
  FOR DELETE USING (
    created_by = auth.uid()
    OR
    hub_id IN (
      SELECT w.id FROM public.hubs w
      WHERE w.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.hub_members wm
        WHERE wm.hub_id = w.id 
        AND wm.user_id = auth.uid() 
        AND wm.role = 'admin'
      )
    )
  );

-- ========================================
-- VUES UTILES
-- ========================================

-- Vue des familles avec informations créateur
CREATE VIEW hub_families_with_stats 
WITH (security_invoker = true) AS
SELECT 
  f.*,
  creator.username as created_by_username,
  creator.full_name as created_by_name,
  creator.avatar_url as created_by_avatar,
  CASE 
    WHEN f.created_by = auth.uid() THEN true 
    ELSE false 
  END as i_created_this_family
FROM public.families f
JOIN public.profiles creator ON f.created_by = creator.id
WHERE f.hub_id = get_user_active_hub()
ORDER BY f.name ASC;

-- ========================================
-- FONCTIONS UTILES
-- ========================================

-- Fonction pour créer une famille
CREATE OR REPLACE FUNCTION create_family(
  family_name TEXT,
  -- family_address TEXT DEFAULT NULL,
  -- family_phone TEXT DEFAULT NULL,
  -- family_email TEXT DEFAULT NULL,
  -- family_notes TEXT DEFAULT NULL,
  family_number_of_children INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
  new_family_id UUID;
  current_hub_id UUID;
BEGIN
  -- Vérifier qu'on a un hub actif
  SELECT get_user_active_hub() INTO current_hub_id;
  
  IF current_hub_id IS NULL THEN
    RAISE EXCEPTION 'User must have an active hub to create families';
  END IF;
  
  -- Créer la famille
  INSERT INTO public.families (
    hub_id, 
    name, 
    -- address, 
    -- phone, 
    -- email, 
    -- notes, 
    number_of_children, created_by
  )
  VALUES (
    current_hub_id, family_name, 
    -- family_address, 
    -- family_phone, 
    -- family_email, 
    -- family_notes, 
    family_number_of_children, auth.uid()
  )
  RETURNING id INTO new_family_id;
  
  RETURN new_family_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- MISE À JOUR DES VUES HUBS
-- ========================================

-- Mettre à jour la vue user_current_hub pour inclure les stats familles
DROP VIEW IF EXISTS user_current_hub;

CREATE VIEW user_current_hub 
WITH (security_invoker = true) AS
SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    w.id as hub_id,
    w.name as hub_name,
    w.created_at as hub_created_at,
    w.updated_at as hub_updated_at,
    w.created_by = p.id as is_hub_owner,
    CASE 
        WHEN w.created_by = p.id THEN 'owner'
        ELSE COALESCE(wm.role, 'member')
    END as my_role,
    CASE 
        WHEN w.created_by = p.id THEN w.created_at
        ELSE wm.joined_at
    END as joined_at,
    wm.invited_by as invited_by_user_id,
    inviter.username as invited_by_username,
    inviter.full_name as invited_by_name,
    (
        SELECT COUNT(*) 
        FROM public.hub_members 
        WHERE hub_id = w.id
    ) + CASE WHEN w.created_by = p.id THEN 1 ELSE 0 END as total_members,
    -- Stats familles
    (
        SELECT COUNT(*) 
        FROM public.families 
        WHERE hub_id = w.id
    ) as total_families,
    (
        SELECT COALESCE(SUM(number_of_children), 0)
        FROM public.families 
        WHERE hub_id = w.id
    ) as total_children
FROM public.profiles p
LEFT JOIN public.hubs w ON p.active_hub_id = w.id
LEFT JOIN public.hub_members wm ON w.id = wm.hub_id AND wm.user_id = p.id
LEFT JOIN public.profiles inviter ON wm.invited_by = inviter.id
WHERE p.id = auth.uid();

-- ========================================
-- COMMENTAIRES ET DOCUMENTATION
-- ========================================

COMMENT ON TABLE public.families IS 'Familles appartenant aux hubs - gestion des informations familiales';

COMMENT ON FUNCTION create_family(TEXT, 
  -- TEXT, TEXT, TEXT, TEXT, 
INTEGER) 
IS 'Crée une famille dans le hub actif de l''utilisateur';

COMMENT ON VIEW hub_families_with_stats IS 'Familles du hub actif avec informations du créateur';