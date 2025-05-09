export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          firebase_uid: string
          email: string
          display_name: string
          created_at: string
          updated_at: string
          subscription_tier: string | null
        }
        Insert: {
          id?: string
          firebase_uid: string
          email: string
          display_name: string
          created_at?: string
          updated_at?: string
          subscription_tier?: string | null
        }
        Update: {
          id?: string
          firebase_uid?: string
          email?: string
          display_name?: string
          created_at?: string
          updated_at?: string
          subscription_tier?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          canvas_state: Json
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          canvas_state: Json
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          canvas_state?: Json
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          tier: string
          status: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          tier: string
          status: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          tier?: string
          status?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}