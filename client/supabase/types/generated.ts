export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      families: {
        Row: {
          created_at: string | null
          created_by: string
          hub_id: string
          id: string
          name: string
          number_of_children: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          hub_id: string
          id?: string
          name: string
          number_of_children?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          hub_id?: string
          id?: string
          name?: string
          number_of_children?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["hub_id"]
          },
        ]
      }
      family_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string | null
          family_id: string
          first_name: string | null
          id: string
          invitation_token: string
          invited_by: string
          last_name: string | null
          message: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string | null
          family_id: string
          first_name?: string | null
          id?: string
          invitation_token?: string
          invited_by: string
          last_name?: string | null
          message?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string | null
          family_id?: string
          first_name?: string | null
          id?: string
          invitation_token?: string
          invited_by?: string
          last_name?: string | null
          message?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_invitations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invitations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "hub_families_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
      family_members: {
        Row: {
          family_id: string
          id: string
          invitation_id: string | null
          invited_by: string | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          family_id: string
          id?: string
          invitation_id?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          family_id?: string
          id?: string
          invitation_id?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "hub_families_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "family_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "hub_family_invitations_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hub_members: {
        Row: {
          hub_id: string
          id: string
          invited_by: string | null
          joined_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          hub_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          hub_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_members_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_members_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["hub_id"]
          },
          {
            foreignKeyName: "hub_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "hub_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hubs: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hubs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hubs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: true
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_hub_id: string | null
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          active_hub_id?: string | null
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          active_hub_id?: string | null
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_hub_id_fkey"
            columns: ["active_hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_active_hub_id_fkey"
            columns: ["active_hub_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["hub_id"]
          },
        ]
      }
    }
    Views: {
      current_hub_members: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          hub_id: string | null
          hub_name: string | null
          invited_by: string | null
          invited_by_username: string | null
          joined_at: string | null
          role: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: []
      }
      hub_families_with_stats: {
        Row: {
          children_count: number | null
          created_at: string | null
          created_by: string | null
          created_by_avatar: string | null
          created_by_name: string | null
          created_by_username: string | null
          hub_id: string | null
          i_am_member: boolean | null
          i_created_this_family: boolean | null
          id: string | null
          name: string | null
          number_of_children: number | null
          parents_count: number | null
          pending_invitations: number | null
          total_invitations: number | null
          total_members: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["hub_id"]
          },
        ]
      }
      hub_family_invitations_with_details: {
        Row: {
          accepted_at: string | null
          computed_status: string | null
          created_at: string | null
          email: string | null
          expires_at: string | null
          family_id: string | null
          family_name: string | null
          first_name: string | null
          hub_id: string | null
          hub_name: string | null
          id: string | null
          invitation_token: string | null
          invited_by: string | null
          invited_by_email: string | null
          invited_by_name: string | null
          invited_by_username: string | null
          last_name: string | null
          message: string | null
          role: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["hub_id"]
          },
          {
            foreignKeyName: "family_invitations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invitations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "hub_families_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
      hub_family_members_with_details: {
        Row: {
          avatar_url: string | null
          email: string | null
          family_id: string | null
          family_name: string | null
          full_name: string | null
          hub_id: string | null
          id: string | null
          invitation_id: string | null
          invited_by: string | null
          invited_by_name: string | null
          invited_by_username: string | null
          joined_at: string | null
          role: string | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "families_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["hub_id"]
          },
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "hub_families_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "family_invitations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "hub_family_invitations_with_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
      public_invitation_details: {
        Row: {
          email: string | null
          expires_at: string | null
          family_name: string | null
          first_name: string | null
          hub_name: string | null
          invitation_status: string | null
          invitation_token: string | null
          invited_by_name: string | null
          last_name: string | null
          message: string | null
          role: string | null
          status: string | null
        }
        Relationships: []
      }
      user_current_hub: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          hub_created_at: string | null
          hub_id: string | null
          hub_name: string | null
          hub_updated_at: string | null
          invited_by_name: string | null
          invited_by_user_id: string | null
          invited_by_username: string | null
          is_hub_owner: boolean | null
          joined_at: string | null
          my_role: string | null
          total_children: number | null
          total_families: number | null
          total_members: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_members_invited_by_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_members_invited_by_fkey"
            columns: ["invited_by_user_id"]
            isOneToOne: false
            referencedRelation: "user_current_hub"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Functions: {
      accept_family_invitation: {
        Args: { invitation_token: string }
        Returns: string
      }
      create_family: {
        Args: { family_name: string; family_number_of_children?: number }
        Returns: string
      }
      create_user_hub: { Args: { hub_name: string }; Returns: string }
      decline_family_invitation: {
        Args: { invitation_token: string }
        Returns: boolean
      }
      get_current_hub_info: {
        Args: never
        Returns: {
          hub_id: string
          hub_name: string
          is_owner: boolean
          member_count: number
          my_role: string
        }[]
      }
      get_user_active_hub: { Args: never; Returns: string }
      invite_to_family: {
        Args: {
          invitation_message?: string
          invitee_email: string
          invitee_first_name?: string
          invitee_last_name?: string
          invitee_role?: string
          target_family_id: string
        }
        Returns: string
      }
      join_hub: {
        Args: { invited_by_user_id?: string; target_hub_id: string }
        Returns: boolean
      }
      leave_family: { Args: { target_family_id: string }; Returns: boolean }
      leave_hub: { Args: never; Returns: boolean }
      mark_expired_invitations: { Args: never; Returns: undefined }
      user_has_hub: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

