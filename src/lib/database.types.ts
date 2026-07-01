export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      team_members: {
        Row: {
          id: number;
          name: string;
          role: string | null;
          class: string;
          image_url: string | null;
          emoji: string | null;
          is_leader: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
      };
      events: {
        Row: {
          id: number;
          title: string;
          slug: string;
          date: string;
          description: string | null;
          status: string;
          location: string | null;
          duration: string | null;
          participants_count: number | null;
          logo_url: string | null;
          registration_url: string | null;
          registration_open: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      event_winners: {
        Row: {
          id: number;
          event_id: number;
          team_name: string;
          rank: string;
          prize: string | null;
          category: string;
          medal_key: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['event_winners']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_winners']['Insert']>;
      };
      event_timeline: {
        Row: {
          id: number;
          event_id: number;
          time: string;
          label: string;
          sub_text: string | null;
          emoji: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['event_timeline']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['event_timeline']['Insert']>;
      };
      winner_members: {
        Row: {
          id: number;
          winner_id: number;
          name: string;
          class: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['winner_members']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['winner_members']['Insert']>;
      };
      gallery: {
        Row: {
          id: number;
          type: 'image' | 'video';
          url: string;
          caption: string | null;
          title: string | null;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['gallery']['Insert']>;
      };
      sessions: {
        Row: {
          id: number;
          title: string;
          embed_url: string;
          download_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
      faqs: {
        Row: {
          id: number;
          question: string;
          answer: string;
          sort_order: number;
          page: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>;
      };
      tools: {
        Row: {
          id: number;
          title: string;
          description: string;
          icon_name: string;
          url: string;
          color: string;
          badge: string | null;
          cta_text: string;
          is_download: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tools']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tools']['Insert']>;
      };
      chatbot_qa: {
        Row: {
          id: number;
          keywords: string[];
          answer: string;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['chatbot_qa']['Row'], 'id' | 'created_at'> & {
          id?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['chatbot_qa']['Insert']>;
      };
      site_settings: {
        Row: {
          id: number;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'> & {
          id?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience type aliases
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventWinner = Database['public']['Tables']['event_winners']['Row'];
export type WinnerMember = Database['public']['Tables']['winner_members']['Row'];
export type GalleryItem = Database['public']['Tables']['gallery']['Row'];
export type Session = Database['public']['Tables']['sessions']['Row'];
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type Tool = Database['public']['Tables']['tools']['Row'];
export type ChatbotQA = Database['public']['Tables']['chatbot_qa']['Row'];
export type SiteSetting = Database['public']['Tables']['site_settings']['Row'];

// Extended types for joined queries
export type EventWinnerWithMembers = EventWinner & {
  winner_members: WinnerMember[];
};
