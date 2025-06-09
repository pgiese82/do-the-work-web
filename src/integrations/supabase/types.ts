export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcement_banners: {
        Row: {
          background_color: string | null
          banner_type: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          link_text: string | null
          link_url: string | null
          message: string
          start_date: string | null
          text_color: string | null
          title: string
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          banner_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          message: string
          start_date?: string | null
          text_color?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          banner_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          link_text?: string | null
          link_url?: string | null
          message?: string
          start_date?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      availability_rules: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          rule_type: string
          rule_value: Json
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          rule_type: string
          rule_value: Json
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          rule_type?: string
          rule_value?: Json
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_modifications: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          booking_id: string
          created_at: string
          id: string
          modification_type: Database["public"]["Enums"]["modification_type"]
          reason: string | null
          refund_amount: number | null
          requested_date_time: string | null
          status: Database["public"]["Enums"]["modification_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          booking_id: string
          created_at?: string
          id?: string
          modification_type: Database["public"]["Enums"]["modification_type"]
          reason?: string | null
          refund_amount?: number | null
          requested_date_time?: string | null
          status?: Database["public"]["Enums"]["modification_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          booking_id?: string
          created_at?: string
          id?: string
          modification_type?: Database["public"]["Enums"]["modification_type"]
          reason?: string | null
          refund_amount?: number | null
          requested_date_time?: string | null
          status?: Database["public"]["Enums"]["modification_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_modifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          attendance_status: string | null
          created_at: string
          date_time: string
          id: string
          internal_notes: string | null
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          service_id: string
          session_notes: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_status?: string | null
          created_at?: string
          date_time: string
          id?: string
          internal_notes?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          service_id: string
          session_notes?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_status?: string | null
          created_at?: string
          date_time?: string
          id?: string
          internal_notes?: string | null
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          service_id?: string
          session_notes?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_history: {
        Row: {
          admin_id: string | null
          communication_type: string
          content: string
          created_at: string
          direction: string
          id: string
          status: string | null
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          communication_type: string
          content: string
          created_at?: string
          direction?: string
          id?: string
          status?: string | null
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string | null
          communication_type?: string
          content?: string
          created_at?: string
          direction?: string
          id?: string
          status?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_history_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_drafts: {
        Row: {
          content_id: string | null
          content_type: string
          created_at: string
          created_by: string | null
          draft_data: Json
          id: string
          is_published: boolean
          published_at: string | null
          updated_at: string
        }
        Insert: {
          content_id?: string | null
          content_type: string
          created_at?: string
          created_by?: string | null
          draft_data: Json
          id?: string
          is_published?: boolean
          published_at?: string | null
          updated_at?: string
        }
        Update: {
          content_id?: string | null
          content_type?: string
          created_at?: string
          created_by?: string | null
          draft_data?: Json
          id?: string
          is_published?: boolean
          published_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_drafts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          title: string
          upload_date: string
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["document_category"]
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          title: string
          upload_date?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          title?: string
          upload_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          admin_id: string | null
          created_at: string
          description: string | null
          follow_up_type: string
          id: string
          priority: string | null
          scheduled_date: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          description?: string | null
          follow_up_type: string
          id?: string
          priority?: string | null
          scheduled_date: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          description?: string | null
          follow_up_type?: string
          id?: string
          priority?: string | null
          scheduled_date?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          admin_id: string
          created_at: string
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          notification_type: Database["public"]["Enums"]["notification_type"]
          toast_enabled: boolean
          updated_at: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          notification_type: Database["public"]["Enums"]["notification_type"]
          toast_enabled?: boolean
          updated_at?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          notification_type?: Database["public"]["Enums"]["notification_type"]
          toast_enabled?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          admin_id: string | null
          booking_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_email_sent: boolean
          is_read: boolean
          message: string
          metadata: Json | null
          payment_id: string | null
          priority: Database["public"]["Enums"]["notification_priority"]
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          booking_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_email_sent?: boolean
          is_read?: boolean
          message: string
          metadata?: Json | null
          payment_id?: string | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          booking_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_email_sent?: boolean
          is_read?: boolean
          message?: string
          metadata?: Json | null
          payment_id?: string | null
          priority?: Database["public"]["Enums"]["notification_priority"]
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          mollie_payment_id: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          mollie_payment_id?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          mollie_payment_id?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          end_date: string | null
          end_time: string | null
          id: string
          is_active: boolean
          price: number
          pricing_type: string
          service_id: string
          start_date: string | null
          start_time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean
          price: number
          pricing_type: string
          service_id: string
          start_date?: string | null
          start_time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean
          price?: number
          pricing_type?: string
          service_id?: string
          start_date?: string | null
          start_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_pricing_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          acquisition_source: string | null
          address: string | null
          client_status: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          health_notes: string | null
          id: string
          last_session_date: string | null
          name: string
          notes: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          total_spent: number | null
          training_preferences: string | null
          updated_at: string
        }
        Insert: {
          acquisition_source?: string | null
          address?: string | null
          client_status?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_notes?: string | null
          id: string
          last_session_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          total_spent?: number | null
          training_preferences?: string | null
          updated_at?: string
        }
        Update: {
          acquisition_source?: string | null
          address?: string | null
          client_status?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_notes?: string | null
          id?: string
          last_session_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          total_spent?: number | null
          training_preferences?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      waiting_list: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          preferred_date: string
          preferred_time_end: string | null
          preferred_time_start: string | null
          service_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date: string
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          service_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          preferred_date?: string
          preferred_time_end?: string | null
          preferred_time_start?: string | null
          service_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waiting_list_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waiting_list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      website_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          metadata: Json | null
          section_type: string
          sort_order: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json | null
          section_type: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          metadata?: Json | null
          section_type?: string
          sort_order?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_refund_amount: {
        Args: { booking_date_time: string; original_amount: number }
        Returns: number
      }
      can_cancel_booking: {
        Args: { booking_date_time: string }
        Returns: boolean
      }
      can_reschedule_booking: {
        Args: { booking_id: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_type: Database["public"]["Enums"]["notification_type"]
          p_title: string
          p_message: string
          p_user_id?: string
          p_booking_id?: string
          p_payment_id?: string
          p_priority?: Database["public"]["Enums"]["notification_priority"]
          p_metadata?: Json
        }
        Returns: string
      }
      get_effective_price: {
        Args: { service_id_param: string; booking_datetime: string }
        Returns: number
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_booking_allowed: {
        Args: {
          service_id_param: string
          booking_datetime: string
          user_id_param?: string
        }
        Returns: boolean
      }
      mark_overdue_followups: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      booking_modification_type: "reschedule" | "cancel"
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      document_category:
        | "contract"
        | "invoice"
        | "receipt"
        | "program"
        | "medical"
        | "other"
      modification_status: "pending" | "approved" | "rejected"
      modification_type: "reschedule" | "cancel"
      notification_priority: "low" | "medium" | "high" | "critical"
      notification_type:
        | "new_booking"
        | "payment_confirmation"
        | "payment_failed"
        | "booking_cancelled"
        | "booking_modified"
        | "same_day_cancellation"
        | "no_show"
        | "system_alert"
      payment_method: "mollie" | "cash" | "bank_transfer" | "ideal"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      subscription_status: "active" | "inactive" | "trial" | "expired"
      user_role: "client" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_modification_type: ["reschedule", "cancel"],
      booking_status: [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      document_category: [
        "contract",
        "invoice",
        "receipt",
        "program",
        "medical",
        "other",
      ],
      modification_status: ["pending", "approved", "rejected"],
      modification_type: ["reschedule", "cancel"],
      notification_priority: ["low", "medium", "high", "critical"],
      notification_type: [
        "new_booking",
        "payment_confirmation",
        "payment_failed",
        "booking_cancelled",
        "booking_modified",
        "same_day_cancellation",
        "no_show",
        "system_alert",
      ],
      payment_method: ["mollie", "cash", "bank_transfer", "ideal"],
      payment_status: ["pending", "paid", "failed", "refunded"],
      subscription_status: ["active", "inactive", "trial", "expired"],
      user_role: ["client", "admin"],
    },
  },
} as const
