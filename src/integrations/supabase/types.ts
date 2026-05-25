export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_logo: string | null
          bank_name: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          qris_image: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          bank_logo?: string | null
          bank_name: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          qris_image?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_logo?: string | null
          bank_name?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          qris_image?: string | null
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          caption: string | null
          category: Database["public"]["Enums"]["gallery_category"]
          created_at: string
          display_order: number
          file_path: string
          id: string
          is_active: boolean
        }
        Insert: {
          caption?: string | null
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          display_order?: number
          file_path: string
          id?: string
          is_active?: boolean
        }
        Update: {
          caption?: string | null
          category?: Database["public"]["Enums"]["gallery_category"]
          created_at?: string
          display_order?: number
          file_path?: string
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      guestbook_messages: {
        Row: {
          created_at: string
          guest_id: string | null
          id: string
          ip_address: string | null
          is_approved: boolean
          location: string | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          guest_id?: string | null
          id?: string
          ip_address?: string | null
          is_approved?: boolean
          location?: string | null
          message: string
          name: string
        }
        Update: {
          created_at?: string
          guest_id?: string | null
          id?: string
          ip_address?: string | null
          is_approved?: boolean
          location?: string | null
          message?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "guestbook_messages_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          category: Database["public"]["Enums"]["guest_category"]
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          opened_at: string | null
          phone: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["guest_category"]
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          opened_at?: string | null
          phone?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["guest_category"]
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          opened_at?: string | null
          phone?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      love_story_items: {
        Row: {
          content: string
          created_at: string
          display_order: number
          event_date: string | null
          icon: Database["public"]["Enums"]["love_icon"]
          id: string
          is_active: boolean
          location: string | null
          photo: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          event_date?: string | null
          icon?: Database["public"]["Enums"]["love_icon"]
          id?: string
          is_active?: boolean
          location?: string | null
          photo?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          event_date?: string | null
          icon?: Database["public"]["Enums"]["love_icon"]
          id?: string
          is_active?: boolean
          location?: string | null
          photo?: string | null
          title?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attendance: Database["public"]["Enums"]["rsvp_attendance"]
          created_at: string
          guest_id: string | null
          id: string
          ip_address: string | null
          message: string | null
          name: string
          phone: string | null
          session: Database["public"]["Enums"]["rsvp_session"]
          total_guests: number
        }
        Insert: {
          attendance?: Database["public"]["Enums"]["rsvp_attendance"]
          created_at?: string
          guest_id?: string | null
          id?: string
          ip_address?: string | null
          message?: string | null
          name: string
          phone?: string | null
          session?: Database["public"]["Enums"]["rsvp_session"]
          total_guests?: number
        }
        Update: {
          attendance?: Database["public"]["Enums"]["rsvp_attendance"]
          created_at?: string
          guest_id?: string | null
          id?: string
          ip_address?: string | null
          message?: string | null
          name?: string
          phone?: string | null
          session?: Database["public"]["Enums"]["rsvp_session"]
          total_guests?: number
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wedding_settings: {
        Row: {
          accent_color: string | null
          akad_address: string | null
          akad_datetime: string | null
          akad_maps_embed: string | null
          akad_maps_url: string | null
          akad_venue: string | null
          background_color: string | null
          body_font: string | null
          bride_father: string | null
          bride_full_name: string | null
          bride_mother: string | null
          bride_name: string | null
          bride_photo: string | null
          created_at: string
          groom_father: string | null
          groom_full_name: string | null
          groom_mother: string | null
          groom_name: string | null
          groom_photo: string | null
          heading_font: string | null
          id: string
          meta_description: string | null
          music_autoplay: boolean
          music_file: string | null
          music_title: string | null
          og_image: string | null
          opening_quote: string | null
          opening_quote_source: string | null
          ornament_style: Database["public"]["Enums"]["ornament_style"]
          primary_color: string | null
          resepsi_address: string | null
          resepsi_datetime: string | null
          resepsi_maps_embed: string | null
          resepsi_maps_url: string | null
          resepsi_venue: string | null
          rsvp_deadline: string | null
          rsvp_open: boolean
          secondary_color: string | null
          text_color: string | null
          theme: Database["public"]["Enums"]["theme_type"]
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          akad_address?: string | null
          akad_datetime?: string | null
          akad_maps_embed?: string | null
          akad_maps_url?: string | null
          akad_venue?: string | null
          background_color?: string | null
          body_font?: string | null
          bride_father?: string | null
          bride_full_name?: string | null
          bride_mother?: string | null
          bride_name?: string | null
          bride_photo?: string | null
          created_at?: string
          groom_father?: string | null
          groom_full_name?: string | null
          groom_mother?: string | null
          groom_name?: string | null
          groom_photo?: string | null
          heading_font?: string | null
          id?: string
          meta_description?: string | null
          music_autoplay?: boolean
          music_file?: string | null
          music_title?: string | null
          og_image?: string | null
          opening_quote?: string | null
          opening_quote_source?: string | null
          ornament_style?: Database["public"]["Enums"]["ornament_style"]
          primary_color?: string | null
          resepsi_address?: string | null
          resepsi_datetime?: string | null
          resepsi_maps_embed?: string | null
          resepsi_maps_url?: string | null
          resepsi_venue?: string | null
          rsvp_deadline?: string | null
          rsvp_open?: boolean
          secondary_color?: string | null
          text_color?: string | null
          theme?: Database["public"]["Enums"]["theme_type"]
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          akad_address?: string | null
          akad_datetime?: string | null
          akad_maps_embed?: string | null
          akad_maps_url?: string | null
          akad_venue?: string | null
          background_color?: string | null
          body_font?: string | null
          bride_father?: string | null
          bride_full_name?: string | null
          bride_mother?: string | null
          bride_name?: string | null
          bride_photo?: string | null
          created_at?: string
          groom_father?: string | null
          groom_full_name?: string | null
          groom_mother?: string | null
          groom_name?: string | null
          groom_photo?: string | null
          heading_font?: string | null
          id?: string
          meta_description?: string | null
          music_autoplay?: boolean
          music_file?: string | null
          music_title?: string | null
          og_image?: string | null
          opening_quote?: string | null
          opening_quote_source?: string | null
          ornament_style?: Database["public"]["Enums"]["ornament_style"]
          primary_color?: string | null
          resepsi_address?: string | null
          resepsi_datetime?: string | null
          resepsi_maps_embed?: string | null
          resepsi_maps_url?: string | null
          resepsi_venue?: string | null
          rsvp_deadline?: string | null
          rsvp_open?: boolean
          secondary_color?: string | null
          text_color?: string | null
          theme?: Database["public"]["Enums"]["theme_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_guest_by_slug: {
        Args: { _slug: string }
        Returns: {
          category: Database["public"]["Enums"]["guest_category"]
          id: string
          is_active: boolean
          name: string
          opened_at: string
          slug: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      gallery_category: "prewedding" | "couple" | "venue" | "other"
      guest_category: "family" | "friend" | "colleague" | "other"
      love_icon: "heart" | "ring" | "home" | "star"
      ornament_style: "classic" | "botanical" | "geometric" | "batik"
      rsvp_attendance: "hadir" | "tidak_hadir" | "mungkin"
      rsvp_session: "akad" | "resepsi" | "keduanya"
      theme_type: "elegant" | "floral" | "modern-dark" | "javanese"
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
      gallery_category: ["prewedding", "couple", "venue", "other"],
      guest_category: ["family", "friend", "colleague", "other"],
      love_icon: ["heart", "ring", "home", "star"],
      ornament_style: ["classic", "botanical", "geometric", "batik"],
      rsvp_attendance: ["hadir", "tidak_hadir", "mungkin"],
      rsvp_session: ["akad", "resepsi", "keduanya"],
      theme_type: ["elegant", "floral", "modern-dark", "javanese"],
    },
  },
} as const
