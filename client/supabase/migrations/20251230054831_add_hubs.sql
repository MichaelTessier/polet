-- ========================================
-- MIGRATION COMPLÈTE: HUBS AVEC CONTRAINTE UN SEUL PAR UTILISATEUR
-- ========================================

-- Table des hubs collaboratifs
CREATE TABLE public.hubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 100),
--   description TEXT,
--   color TEXT DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte : un utilisateur ne peut créer qu'un seul hub
  UNIQUE(created_by)
);

-- Table des membres des hubs
CREATE TABLE public.hub_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id UUID REFERENCES public.hubs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member', 'viewer')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES public.profiles(id),
  
  -- Contraintes d'unicité strictes
  UNIQUE(hub_id, user_id), -- Un user par hub
  UNIQUE(user_id) -- Un hub par user (contrainte principale)
);

-- Ajouter le hub actif dans profiles
ALTER TABLE public.profiles 
ADD COLUMN active_hub_id UUID REFERENCES public.hubs(id) ON DELETE SET NULL;

-- ========================================
-- INDEX POUR LES PERFORMANCES
-- ========================================

CREATE INDEX idx_hubs_created_by ON public.hubs(created_by);
CREATE INDEX idx_hubs_created_at ON public.hubs(created_at DESC);

CREATE INDEX idx_hub_members_hub_id ON public.hub_members(hub_id);
CREATE INDEX idx_hub_members_user_id ON public.hub_members(user_id);
CREATE INDEX idx_hub_members_role ON public.hub_members(hub_id, role);

CREATE INDEX idx_profiles_active_hub ON public.profiles(active_hub_id);

-- ========================================
-- FONCTIONS UTILITAIRES
-- ========================================

-- Function pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
CREATE TRIGGER update_hubs_updated_at 
  BEFORE UPDATE ON public.hubs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour récupérer le hub actif de l'utilisateur connecté
CREATE OR REPLACE FUNCTION get_user_active_hub()
RETURNS UUID AS $$
DECLARE
    hub_id UUID;
BEGIN
    -- D'abord, chercher dans active_hub_id
    SELECT active_hub_id INTO hub_id
    FROM public.profiles 
    WHERE id = auth.uid();
    
    IF hub_id IS NOT NULL THEN
        RETURN hub_id;
    END IF;
    
    -- Sinon, chercher s'il est membre d'un hub
    SELECT wm.hub_id INTO hub_id
    FROM public.hub_members wm 
    WHERE wm.user_id = auth.uid()
    LIMIT 1;
    
    IF hub_id IS NOT NULL THEN
        -- Mettre à jour le profil avec le hub trouvé
        UPDATE public.profiles 
        SET active_hub_id = hub_id 
        WHERE id = auth.uid();
        RETURN hub_id;
    END IF;
    
    -- Sinon, chercher s'il a créé un hub
    SELECT w.id INTO hub_id
    FROM public.hubs w 
    WHERE w.created_by = auth.uid()
    LIMIT 1;
    
    IF hub_id IS NOT NULL THEN
        -- Mettre à jour le profil
        UPDATE public.profiles 
        SET active_hub_id = hub_id 
        WHERE id = auth.uid();
        RETURN hub_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer un hub (avec vérification d'unicité)
CREATE OR REPLACE FUNCTION create_user_hub(
    hub_name TEXT
    -- hub_description TEXT DEFAULT NULL,
    -- hub_color TEXT DEFAULT '#3B82F6'
)
RETURNS UUID AS $$
DECLARE
    new_hub_id UUID;
    existing_hub UUID;
BEGIN
    -- Vérifier que l'utilisateur n'a pas déjà un hub
    SELECT get_user_active_hub() INTO existing_hub;
    
    IF existing_hub IS NOT NULL THEN
        RAISE EXCEPTION 'User already has an active hub: %', existing_hub;
    END IF;
    
    -- Créer le hub
    INSERT INTO public.hubs (
        name, 
        -- description, 
        -- color, 
        created_by
    )
    VALUES (
        hub_name, 
        -- hub_description, 
        -- hub_color, 
        auth.uid()
    )
    RETURNING id INTO new_hub_id;
    
    -- Mettre à jour le profil
    UPDATE public.profiles 
    SET active_hub_id = new_hub_id 
    WHERE id = auth.uid();
    
    RETURN new_hub_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour rejoindre un hub (quitte automatiquement l'ancien)
CREATE OR REPLACE FUNCTION join_hub(
    target_hub_id UUID,
    invited_by_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    existing_hub UUID;
BEGIN
    -- Vérifier que l'utilisateur n'est pas déjà dans un hub
    SELECT get_user_active_hub() INTO existing_hub;
    
    IF existing_hub IS NOT NULL THEN
        RAISE EXCEPTION 'User already has an active hub: %. Must leave current hub first.', existing_hub;
    END IF;
    
    -- Vérifier que le hub cible existe
    IF NOT EXISTS (SELECT 1 FROM public.hubs WHERE id = target_hub_id) THEN
        RAISE EXCEPTION 'Target hub does not exist: %', target_hub_id;
    END IF;
    
    -- Rejoindre le hub
    INSERT INTO public.hub_members (hub_id, user_id, role, invited_by)
    VALUES (target_hub_id, auth.uid(), 'member', invited_by_user_id);
    
    -- Mettre à jour le profil
    UPDATE public.profiles 
    SET active_hub_id = target_hub_id 
    WHERE id = auth.uid();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour quitter un hub
CREATE OR REPLACE FUNCTION leave_hub()
RETURNS BOOLEAN AS $$
DECLARE
    current_hub UUID;
    is_owner BOOLEAN;
BEGIN
    -- Récupérer le hub actuel
    SELECT get_user_active_hub() INTO current_hub;
    
    IF current_hub IS NULL THEN
        RAISE EXCEPTION 'User is not in any hub';
    END IF;
    
    -- Vérifier si l'utilisateur est le propriétaire
    SELECT (created_by = auth.uid()) INTO is_owner
    FROM public.hubs 
    WHERE id = current_hub;
    
    IF is_owner THEN
        -- Si propriétaire, supprimer complètement le hub
        DELETE FROM public.hubs WHERE id = current_hub;
    ELSE
        -- Si membre, se retirer
        DELETE FROM public.hub_members 
        WHERE hub_id = current_hub AND user_id = auth.uid();
    END IF;
    
    -- Réinitialiser le hub actif dans le profil
    UPDATE public.profiles 
    SET active_hub_id = NULL 
    WHERE id = auth.uid();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- TRIGGERS POUR MAINTENIR LA COHÉRENCE
-- ========================================

-- Trigger pour maintenir la cohérence active_hub_id
CREATE OR REPLACE FUNCTION sync_active_hub()
RETURNS TRIGGER AS $$
BEGIN
    -- Si l'utilisateur rejoint un nouveau hub
    IF TG_OP = 'INSERT' THEN
        -- Mettre à jour le hub actif dans le profil
        UPDATE public.profiles 
        SET active_hub_id = NEW.hub_id 
        WHERE id = NEW.user_id;
        
        RETURN NEW;
    END IF;
    
    -- Si l'utilisateur quitte un hub
    IF TG_OP = 'DELETE' THEN
        -- Réinitialiser le hub actif si c'était le sien
        UPDATE public.profiles 
        SET active_hub_id = NULL 
        WHERE id = OLD.user_id AND active_hub_id = OLD.hub_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_active_hub_trigger
    AFTER INSERT OR DELETE ON public.hub_members
    FOR EACH ROW EXECUTE FUNCTION sync_active_hub();

-- Trigger pour mettre à jour active_hub_id lors de la création de hub
CREATE OR REPLACE FUNCTION set_active_hub_on_creation()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le profil du créateur
    UPDATE public.profiles 
    SET active_hub_id = NEW.id 
    WHERE id = NEW.created_by;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_active_hub_on_creation_trigger
    AFTER INSERT ON public.hubs
    FOR EACH ROW EXECUTE FUNCTION set_active_hub_on_creation();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activer RLS sur hubs
ALTER TABLE public.hubs ENABLE ROW LEVEL SECURITY;

-- Voir son hub actif uniquement
CREATE POLICY "Users can view their active hub" ON public.hubs
  FOR SELECT USING (id = get_user_active_hub());

-- Créer un hub si on n'en a pas
CREATE POLICY "Users can create one hub" ON public.hubs
  FOR INSERT WITH CHECK (
    created_by = auth.uid() 
    AND get_user_active_hub() IS NULL
  );

-- Modifier son hub (propriétaire ou admin)
CREATE POLICY "Hub owners and admins can update hub" ON public.hubs
  FOR UPDATE USING (
    created_by = auth.uid()
    OR
    id IN (
      SELECT hub_id FROM public.hub_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Supprimer son hub (propriétaire uniquement)
CREATE POLICY "Hub owners can delete their hub" ON public.hubs
  FOR DELETE USING (created_by = auth.uid());

-- Activer RLS sur hub_members
ALTER TABLE public.hub_members ENABLE ROW LEVEL SECURITY;

-- Voir les membres de son hub actif
CREATE POLICY "Users can view members of their active hub" ON public.hub_members
  FOR SELECT USING (hub_id = get_user_active_hub());

-- Ajouter des membres (propriétaires et admins)
CREATE POLICY "Hub owners and admins can add members" ON public.hub_members
  FOR INSERT WITH CHECK (
    hub_id = get_user_active_hub()
    AND
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

-- Modifier les rôles (propriétaires et admins)
CREATE POLICY "Hub owners and admins can update member roles" ON public.hub_members
  FOR UPDATE USING (
    hub_id = get_user_active_hub()
    AND
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

-- Retirer des membres (propriétaires, admins, ou se retirer soi-même)
CREATE POLICY "Members can leave or be removed by admins" ON public.hub_members
  FOR DELETE USING (
    user_id = auth.uid() -- Se retirer soi-même
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
-- VUES SIMPLIFIÉES
-- ========================================

-- Vue du hub actuel de l'utilisateur
CREATE VIEW user_current_hub 
WITH (security_invoker = true) AS
SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.avatar_url,
    w.id as hub_id,
    w.name as hub_name,
    -- w.description as hub_description,
    -- w.color as hub_color,
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
    ) + CASE WHEN w.created_by = p.id THEN 1 ELSE 0 END as total_members
FROM public.profiles p
LEFT JOIN public.hubs w ON p.active_hub_id = w.id
LEFT JOIN public.hub_members wm ON w.id = wm.hub_id AND wm.user_id = p.id
LEFT JOIN public.profiles inviter ON wm.invited_by = inviter.id
WHERE p.id = auth.uid();

-- Vue des membres du hub actuel
CREATE VIEW current_hub_members 
WITH (security_invoker = true) AS
SELECT 
    -- Créateur du hub
    w.created_by as user_id,
    creator.username,
    creator.full_name,
    creator.avatar_url,
    'owner' as role,
    w.created_at as joined_at,
    NULL::UUID as invited_by,
    NULL as invited_by_username,
    w.id as hub_id,
    w.name as hub_name
FROM public.hubs w
JOIN public.profiles creator ON w.created_by = creator.id
WHERE w.id = get_user_active_hub()

UNION ALL

SELECT 
    -- Membres du hub
    wm.user_id,
    member.username,
    member.full_name,
    member.avatar_url,
    wm.role,
    wm.joined_at,
    wm.invited_by,
    inviter.username as invited_by_username,
    w.id as hub_id,
    w.name as hub_name
FROM public.hub_members wm
JOIN public.hubs w ON wm.hub_id = w.id
JOIN public.profiles member ON wm.user_id = member.id
LEFT JOIN public.profiles inviter ON wm.invited_by = inviter.id
WHERE wm.hub_id = get_user_active_hub()

ORDER BY role DESC, joined_at ASC;

-- ========================================
-- FONCTIONS DE COMMODITÉ POUR L'API
-- ========================================

-- Fonction pour vérifier si un utilisateur a un hub
CREATE OR REPLACE FUNCTION user_has_hub()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_active_hub() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les informations du hub actuel
CREATE OR REPLACE FUNCTION get_current_hub_info()
RETURNS TABLE (
    hub_id UUID,
    hub_name TEXT,
    -- hub_description TEXT,
    -- hub_color TEXT,
    is_owner BOOLEAN,
    my_role TEXT,
    member_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ucw.hub_id,
        ucw.hub_name,
        -- ucw.hub_description,
        -- ucw.hub_color,
        ucw.is_hub_owner,
        ucw.my_role,
        ucw.total_members
    FROM user_current_hub ucw;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- COMMENTAIRES ET DOCUMENTATION
-- ========================================

COMMENT ON TABLE public.hubs IS 'Hubs collaboratifs - un seul par utilisateur (propriétaire)';
COMMENT ON TABLE public.hub_members IS 'Membres des hubs - un seul hub par utilisateur';
COMMENT ON COLUMN public.profiles.active_hub_id IS 'Hub actif de l''utilisateur - NULL si aucun';

COMMENT ON FUNCTION create_user_hub(
    -- TEXT, 
    -- TEXT, 
    TEXT
) IS 'Crée un hub pour l''utilisateur - échoue s''il en a déjà un';
COMMENT ON FUNCTION join_hub(UUID, UUID) IS 'Rejoint un hub - échoue si déjà dans un autre';
COMMENT ON FUNCTION leave_hub() IS 'Quitte le hub actuel - supprime si propriétaire';
COMMENT ON FUNCTION get_user_active_hub() IS 'Retourne l''UUID du hub actif de l''utilisateur';
COMMENT ON FUNCTION user_has_hub() IS 'Vérifie si l''utilisateur a un hub actif';

COMMENT ON VIEW user_current_hub IS 'Vue complète du hub actuel de l''utilisateur connecté';
COMMENT ON VIEW current_hub_members IS 'Liste des membres du hub actuel';