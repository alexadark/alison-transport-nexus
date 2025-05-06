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
      contacts: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          contact_type: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          vat_number: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          contact_type?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          vat_number?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          contact_type?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          vat_number?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      conversation_summaries: {
        Row: {
          attachment_links: Json | null
          conversation_thread_id: string
          id: string
          summary_data: Json | null
          summary_text: string
          updated_at: string
        }
        Insert: {
          attachment_links?: Json | null
          conversation_thread_id: string
          id?: string
          summary_data?: Json | null
          summary_text: string
          updated_at?: string
        }
        Update: {
          attachment_links?: Json | null
          conversation_thread_id?: string
          id?: string
          summary_data?: Json | null
          summary_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summaries_thread_fk"
            columns: ["conversation_thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_threads: {
        Row: {
          created_at: string | null
          id: string
          outlook_conversation_id: string | null
          status: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          outlook_conversation_id?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          outlook_conversation_id?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          document_type: string | null
          email_id: string | null
          file_url: string | null
          id: string
          shipment_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type?: string | null
          email_id?: string | null
          file_url?: string | null
          id?: string
          shipment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string | null
          email_id?: string | null
          file_url?: string | null
          id?: string
          shipment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      email_attachments: {
        Row: {
          created_at: string | null
          email_id: string | null
          file_url: string | null
          filename: string | null
          id: string
          mime_type: string | null
        }
        Insert: {
          created_at?: string | null
          email_id?: string | null
          file_url?: string | null
          filename?: string | null
          id?: string
          mime_type?: string | null
        }
        Update: {
          created_at?: string | null
          email_id?: string | null
          file_url?: string | null
          filename?: string | null
          id?: string
          mime_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_attachments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_summaries: {
        Row: {
          created_at: string | null
          email_id: string | null
          id: string
          summary_text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email_id?: string | null
          id?: string
          summary_text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email_id?: string | null
          id?: string
          summary_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_summaries_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          body_preview: string | null
          classification_emailtype: string | null
          classification_workflow: string | null
          created_at: string | null
          direction: string | null
          email_type: string | null
          id: string
          message_content: string | null
          outlook_message_id: string | null
          received_at: string | null
          sender_contact_id: string | null
          sender_email: string | null
          sender_name: string | null
          status: string | null
          subject: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          body_preview?: string | null
          classification_emailtype?: string | null
          classification_workflow?: string | null
          created_at?: string | null
          direction?: string | null
          email_type?: string | null
          id?: string
          message_content?: string | null
          outlook_message_id?: string | null
          received_at?: string | null
          sender_contact_id?: string | null
          sender_email?: string | null
          sender_name?: string | null
          status?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          body_preview?: string | null
          classification_emailtype?: string | null
          classification_workflow?: string | null
          created_at?: string | null
          direction?: string | null
          email_type?: string | null
          id?: string
          message_content?: string | null
          outlook_message_id?: string | null
          received_at?: string | null
          sender_contact_id?: string | null
          sender_email?: string | null
          sender_name?: string | null
          status?: string | null
          subject?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_sender_contact_id_fkey"
            columns: ["sender_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          contact_id: string | null
          created_at: string | null
          id: string
          is_order_lead: boolean | null
          is_quote_lead: boolean | null
          originating_thread_id: string | null
          source_email_id: string | null
          status: string | null
          supplier_contact_name: string | null
          supplier_email: string | null
          supplier_phone: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          is_order_lead?: boolean | null
          is_quote_lead?: boolean | null
          originating_thread_id?: string | null
          source_email_id?: string | null
          status?: string | null
          supplier_contact_name?: string | null
          supplier_email?: string | null
          supplier_phone?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          is_order_lead?: boolean | null
          is_quote_lead?: boolean | null
          originating_thread_id?: string | null
          source_email_id?: string | null
          status?: string | null
          supplier_contact_name?: string | null
          supplier_email?: string | null
          supplier_phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_originating_thread_id_fkey"
            columns: ["originating_thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_source_email_id_fkey"
            columns: ["source_email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string | null
          destination: string | null
          dimensions: Json | null
          id: string
          incoterm: string | null
          modeoftransport: string | null
          origin: string | null
          quotenumber: string | null
          related_thread_id: string | null
          requesting_contact_id: string | null
          status: string | null
          totalpieces: number | null
          totalweight: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination?: string | null
          dimensions?: Json | null
          id?: string
          incoterm?: string | null
          modeoftransport?: string | null
          origin?: string | null
          quotenumber?: string | null
          related_thread_id?: string | null
          requesting_contact_id?: string | null
          status?: string | null
          totalpieces?: number | null
          totalweight?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string | null
          dimensions?: Json | null
          id?: string
          incoterm?: string | null
          modeoftransport?: string | null
          origin?: string | null
          quotenumber?: string | null
          related_thread_id?: string | null
          requesting_contact_id?: string | null
          status?: string | null
          totalpieces?: number | null
          totalweight?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_related_thread_id_fkey"
            columns: ["related_thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_requesting_contact_id_fkey"
            columns: ["requesting_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          actual_delivery_date: string | null
          carrier_contact_id: string | null
          created_at: string | null
          current_status: string | null
          estimated_delivery_date: string | null
          id: string
          order_id: string | null
          pickup_date: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          carrier_contact_id?: string | null
          created_at?: string | null
          current_status?: string | null
          estimated_delivery_date?: string | null
          id?: string
          order_id?: string | null
          pickup_date?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          carrier_contact_id?: string | null
          created_at?: string | null
          current_status?: string | null
          estimated_delivery_date?: string | null
          id?: string
          order_id?: string | null
          pickup_date?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_carrier_contact_id_fkey"
            columns: ["carrier_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "shipping_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_orders: {
        Row: {
          agent_contact_id: string | null
          created_at: string | null
          customer_contact_id: string | null
          destination: string | null
          dimensions: Json | null
          id: string
          importer_contact_id: string | null
          incoterm: string | null
          instructions: string | null
          modeoftransport: string | null
          ordernumber: string | null
          origin: string | null
          related_quote_id: string | null
          related_thread_id: string | null
          requesteddeliverydate: string | null
          status: string | null
          supplier_contact_id: string | null
          totalpieces: number | null
          totalweight: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_contact_id?: string | null
          created_at?: string | null
          customer_contact_id?: string | null
          destination?: string | null
          dimensions?: Json | null
          id?: string
          importer_contact_id?: string | null
          incoterm?: string | null
          instructions?: string | null
          modeoftransport?: string | null
          ordernumber?: string | null
          origin?: string | null
          related_quote_id?: string | null
          related_thread_id?: string | null
          requesteddeliverydate?: string | null
          status?: string | null
          supplier_contact_id?: string | null
          totalpieces?: number | null
          totalweight?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_contact_id?: string | null
          created_at?: string | null
          customer_contact_id?: string | null
          destination?: string | null
          dimensions?: Json | null
          id?: string
          importer_contact_id?: string | null
          incoterm?: string | null
          instructions?: string | null
          modeoftransport?: string | null
          ordernumber?: string | null
          origin?: string | null
          related_quote_id?: string | null
          related_thread_id?: string | null
          requesteddeliverydate?: string | null
          status?: string | null
          supplier_contact_id?: string | null
          totalpieces?: number | null
          totalweight?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_orders_agent_contact_id_fkey"
            columns: ["agent_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_orders_customer_contact_id_fkey"
            columns: ["customer_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_orders_importer_contact_id_fkey"
            columns: ["importer_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_orders_related_quote_id_fkey"
            columns: ["related_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_orders_related_thread_id_fkey"
            columns: ["related_thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_orders_supplier_contact_id_fkey"
            columns: ["supplier_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipping_orders_thread_fk"
            columns: ["related_thread_id"]
            isOneToOne: false
            referencedRelation: "conversation_threads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
