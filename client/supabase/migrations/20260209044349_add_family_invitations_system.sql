-- ========================================
-- MIGRATION: SYSTÈME D'INVITATIONS FAMILIALES
-- ========================================

-- Table des invitations familiales
CREATE TABLE public.family_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  first_name TEXT CHECK (length(first_name) >= 1 AND length(first_name) <= 50),
  last_name TEXT CHECK (length(last_name) <= 50),
  role TEXT CHECK (role IN ('parent', 'child', 'guardian')),
  invited_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  invitation_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired', 'declined')) DEFAULT 'pending',
  message TEXT, -- Message personnalisé de l'inviteur
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  
  -- Contraintes d'unicité
  UNIQUE(family_id, email), -- Un email par famille
  CONSTRAINT valid_expiration CHECK (expires_at > created_at)
);

-- Table des membres des familles (après acceptation d'invitation)
CREATE TABLE public.family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('parent', 'child', 'guardian')) DEFAULT 'parent',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  invited_by UUID REFERENCES public.profiles(id), -- Qui l'a invité
  invitation_id UUID REFERENCES public.family_invitations(id), -- Lien vers l'invitation origine
  
  UNIQUE(family_id, user_id) -- Un utilisateur par famille
);

-- ========================================
-- INDEX POUR LES PERFORMANCES
-- ========================================

CREATE INDEX idx_family_invitations_family_id ON public.family_invitations(family_id);
CREATE INDEX idx_family_invitations_email ON public.family_invitations(email);
CREATE INDEX idx_family_invitations_token ON public.family_invitations(invitation_token);
CREATE INDEX idx_family_invitations_status ON public.family_invitations(status);
CREATE INDEX idx_family_invitations_expires_at ON public.family_invitations(expires_at);

CREATE INDEX idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX idx_family_members_role ON public.family_members(family_id, role);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger pour marquer automatiquement les invitations expirées
CREATE OR REPLACE FUNCTION mark_expired_invitations()
RETURNS void AS $$
BEGIN
  UPDATE public.family_invitations 
  SET status = 'expired'
  WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Créer une tâche cron pour nettoyer les invitations expirées (optionnel)
-- SELECT cron.schedule('cleanup-expired-invitations', '0 2 * * *', 'SELECT mark_expired_invitations();');

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activer RLS sur family_invitations
ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;

-- Voir les invitations des familles de son hub (admin et créateurs)
CREATE POLICY "Hub members can view invitations of their families" ON public.family_invitations
  FOR SELECT USING (
    family_id IN (
      SELECT f.id FROM public.families f
      WHERE f.hub_id = get_user_active_hub()
    )
  );

-- Créer des invitations (membres du hub pour leurs familles)
CREATE POLICY "Family creators can invite members" ON public.family_invitations
  FOR INSERT WITH CHECK (
    invited_by = auth.uid()
    AND family_id IN (
      SELECT f.id FROM public.families f
      WHERE f.hub_id = get_user_active_hub()
      AND (
        f.created_by = auth.uid() -- Créateur de la famille
        OR f.hub_id IN ( -- Ou admin du hub
          SELECT h.id FROM public.hubs h
          WHERE h.created_by = auth.uid()
        )
      )
    )
  );

-- Modifier ses propres invitations
CREATE POLICY "Inviters can update their invitations" ON public.family_invitations
  FOR UPDATE USING (invited_by = auth.uid());

-- Supprimer ses propres invitations
CREATE POLICY "Inviters can delete their invitations" ON public.family_invitations
  FOR DELETE USING (invited_by = auth.uid());

-- Activer RLS sur family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Voir les membres des familles de son hub
CREATE POLICY "Users can view family members in their hub" ON public.family_members
  FOR SELECT USING (
    family_id IN (
      SELECT f.id FROM public.families f
      WHERE f.hub_id = get_user_active_hub()
    )
    OR user_id = auth.uid() -- Ou voir ses propres appartenances
  );

-- Créer des liens (via acceptation d'invitation)
CREATE POLICY "Users can join families via invitations" ON public.family_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Quitter une famille (se retirer soi-même)
CREATE POLICY "Users can leave families" ON public.family_members
  FOR DELETE USING (
    user_id = auth.uid() -- Se retirer soi-même
    OR family_id IN ( -- Ou admin du hub peut retirer
      SELECT f.id FROM public.families f
      JOIN public.hubs h ON f.hub_id = h.id
      WHERE h.created_by = auth.uid()
    )
  );

-- ========================================
-- FONCTIONS PRINCIPALES
-- ========================================

-- Fonction pour inviter quelqu'un dans une famille
CREATE OR REPLACE FUNCTION invite_to_family(
  target_family_id UUID,
  invitee_email TEXT,
  invitee_first_name TEXT DEFAULT NULL,
  invitee_last_name TEXT DEFAULT NULL,
  invitee_role TEXT DEFAULT NULL,
  invitation_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  invitation_id UUID;
  family_hub_id UUID;
  existing_user UUID;
  existing_invitation UUID;
BEGIN
  -- Vérifier que la famille appartient au hub actif
  SELECT hub_id INTO family_hub_id 
  FROM public.families 
  WHERE id = target_family_id;
  
  IF family_hub_id != get_user_active_hub() THEN
    RAISE EXCEPTION 'Family does not belong to your active hub';
  END IF;
  
  -- Vérifier si l'email correspond déjà à un utilisateur inscrit
  SELECT id INTO existing_user 
  FROM public.profiles 
  WHERE email = invitee_email;
  
  IF existing_user IS NOT NULL THEN
    -- Vérifier si déjà membre de cette famille
    IF EXISTS (
      SELECT 1 FROM public.family_members 
      WHERE family_id = target_family_id AND user_id = existing_user
    ) THEN
      RAISE EXCEPTION 'User is already a member of this family';
    END IF;
  END IF;
  
  -- Vérifier si invitation en cours existe
  SELECT id INTO existing_invitation
  FROM public.family_invitations
  WHERE family_id = target_family_id 
  AND email = invitee_email 
  AND status = 'pending' 
  AND expires_at > NOW();
  
  IF existing_invitation IS NOT NULL THEN
    RAISE EXCEPTION 'A pending invitation already exists for this email';
  END IF;
  
  -- Créer l'invitation
  INSERT INTO public.family_invitations (
    family_id, email, first_name, last_name, role, invited_by, message
  )
  VALUES (
    target_family_id, invitee_email, invitee_first_name, 
    invitee_last_name, invitee_role, auth.uid(), invitation_message
  )
  RETURNING id INTO invitation_id;
  
  RETURN invitation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour accepter une invitation
CREATE OR REPLACE FUNCTION accept_family_invitation(
  invitation_token UUID
)
RETURNS UUID AS $$
DECLARE
  invitation_record RECORD;
  member_id UUID;
  user_email TEXT;
BEGIN
  -- Récupérer l'email de l'utilisateur connecté
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Récupérer l'invitation
  SELECT * INTO invitation_record
  FROM public.family_invitations
  WHERE invitation_token = invitation_token
  AND status = 'pending'
  AND expires_at > NOW()
  AND email = user_email; -- Vérifier que l'email correspond
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid, expired, or unauthorized invitation';
  END IF;
  
  -- Vérifier si pas déjà membre
  IF EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_id = invitation_record.family_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Already a member of this family';
  END IF;
  
  -- Créer le lien famille-utilisateur
  INSERT INTO public.family_members (
    family_id, user_id, role, invited_by, invitation_id
  )
  VALUES (
    invitation_record.family_id, auth.uid(), invitation_record.role,
    invitation_record.invited_by, invitation_record.id
  )
  RETURNING id INTO member_id;
  
  -- Marquer l'invitation comme acceptée
  UPDATE public.family_invitations
  SET status = 'accepted', accepted_at = NOW()
  WHERE id = invitation_record.id;
  
  RETURN member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour décliner une invitation
CREATE OR REPLACE FUNCTION decline_family_invitation(
  invitation_token UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Récupérer l'email de l'utilisateur connecté
  SELECT email INTO user_email 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Marquer comme déclinée
  UPDATE public.family_invitations
  SET status = 'declined'
  WHERE invitation_token = invitation_token
  AND email = user_email
  AND status = 'pending'
  AND expires_at > NOW();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid, expired, or unauthorized invitation';
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour quitter une famille
CREATE OR REPLACE FUNCTION leave_family(
  target_family_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM public.family_members
  WHERE family_id = target_family_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'You are not a member of this family';
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- VUES UTILES
-- ========================================

-- Vue des invitations avec détails famille et hub
CREATE VIEW hub_family_invitations_with_details 
WITH (security_invoker = true) AS
SELECT 
  fi.*,
  f.name as family_name,
  f.hub_id,
  h.name as hub_name,
  inviter.username as invited_by_username,
  inviter.full_name as invited_by_name,
  inviter.email as invited_by_email,
  CASE 
    WHEN fi.expires_at < NOW() AND fi.status = 'pending' THEN 'expired'
    ELSE fi.status
  END as computed_status
FROM public.family_invitations fi
JOIN public.families f ON fi.family_id = f.id
JOIN public.hubs h ON f.hub_id = h.id
JOIN public.profiles inviter ON fi.invited_by = inviter.id
WHERE f.hub_id = get_user_active_hub()
ORDER BY fi.created_at DESC;

-- Vue des membres des familles avec détails
CREATE VIEW hub_family_members_with_details 
WITH (security_invoker = true) AS
SELECT 
  fm.*,
  f.name as family_name,
  f.hub_id,
  member.username,
  member.full_name,
  member.email,
  member.avatar_url,
  inviter.username as invited_by_username,
  inviter.full_name as invited_by_name
FROM public.family_members fm
JOIN public.families f ON fm.family_id = f.id
JOIN public.profiles member ON fm.user_id = member.id
LEFT JOIN public.profiles inviter ON fm.invited_by = inviter.id
WHERE f.hub_id = get_user_active_hub()
ORDER BY f.name ASC, fm.joined_at ASC;

-- Vue publique pour les invitations (pour les non-connectés)
CREATE VIEW public_invitation_details 
WITH (security_invoker = false) AS
SELECT 
  fi.invitation_token,
  fi.first_name,
  fi.last_name,
  fi.email,
  fi.role,
  fi.message,
  fi.expires_at,
  fi.status,
  f.name as family_name,
  h.name as hub_name,
  inviter.full_name as invited_by_name,
  CASE 
    WHEN fi.expires_at < NOW() THEN 'expired'
    WHEN fi.status != 'pending' THEN fi.status
    ELSE 'valid'
  END as invitation_status
FROM public.family_invitations fi
JOIN public.families f ON fi.family_id = f.id
JOIN public.hubs h ON f.hub_id = h.id
JOIN public.profiles inviter ON fi.invited_by = inviter.id
WHERE fi.status = 'pending' AND fi.expires_at > NOW();

-- Pas de RLS sur cette vue car elle doit être accessible publiquement
-- ALTER TABLE public_invitation_details DISABLE ROW LEVEL SECURITY;

-- ========================================
-- MISE À JOUR DES VUES EXISTANTES
-- ========================================

-- Mettre à jour la vue des familles pour inclure les stats membres
DROP VIEW IF EXISTS hub_families_with_stats;

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
  END as i_created_this_family,
  -- Statistiques des invitations
  COALESCE(invitation_stats.pending_invitations, 0) as pending_invitations,
  COALESCE(invitation_stats.total_invitations, 0) as total_invitations,
  -- Statistiques des membres
  COALESCE(member_stats.total_members, 0) as total_members,
  COALESCE(member_stats.parents_count, 0) as parents_count,
  COALESCE(member_stats.children_count, 0) as children_count,
  -- Est-ce que je suis membre de cette famille
  CASE 
    WHEN auth.uid() IN (
      SELECT user_id FROM public.family_members WHERE family_id = f.id
    ) THEN true 
    ELSE false 
  END as i_am_member
FROM public.families f
JOIN public.profiles creator ON f.created_by = creator.id
LEFT JOIN (
  SELECT 
    fi.family_id,
    COUNT(*) as total_invitations,
    COUNT(*) FILTER (WHERE fi.status = 'pending' AND fi.expires_at > NOW()) as pending_invitations
  FROM public.family_invitations fi
  GROUP BY fi.family_id
) invitation_stats ON f.id = invitation_stats.family_id
LEFT JOIN (
  SELECT 
    fm.family_id,
    COUNT(*) as total_members,
    COUNT(*) FILTER (WHERE fm.role = 'parent') as parents_count,
    COUNT(*) FILTER (WHERE fm.role = 'child') as children_count
  FROM public.family_members fm
  GROUP BY fm.family_id
) member_stats ON f.id = member_stats.family_id
WHERE f.hub_id = get_user_active_hub()
ORDER BY f.name ASC;

-- ========================================
-- COMMENTAIRES ET DOCUMENTATION
-- ========================================

COMMENT ON TABLE public.family_invitations IS 'Invitations pour rejoindre des familles - avec tokens uniques et expiration';
COMMENT ON TABLE public.family_members IS 'Membres effectifs des familles après acceptation d''invitation';

COMMENT ON FUNCTION invite_to_family(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) 
IS 'Invite une personne à rejoindre une famille via email';
COMMENT ON FUNCTION accept_family_invitation(UUID) 
IS 'Accepte une invitation familiale via le token';
COMMENT ON FUNCTION decline_family_invitation(UUID) 
IS 'Décline une invitation familiale';
COMMENT ON FUNCTION leave_family(UUID) 
IS 'Quitte une famille (se retirer soi-même)';

COMMENT ON VIEW hub_family_invitations_with_details IS 'Invitations du hub avec détails famille et inviteur';
COMMENT ON VIEW hub_family_members_with_details IS 'Membres des familles du hub avec détails utilisateur';
COMMENT ON VIEW public_invitation_details IS 'Vue publique pour afficher les détails d''invitation (sans auth)';