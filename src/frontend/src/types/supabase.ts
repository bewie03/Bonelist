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
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          website: string | null
          bullish_votes: number
          bearish_votes: number
          token_info: string | null
          transaction_hash: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          website?: string | null
          bullish_votes?: number
          bearish_votes?: number
          token_info?: string | null
          transaction_hash?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          website?: string | null
          bullish_votes?: number
          bearish_votes?: number
          token_info?: string | null
          transaction_hash?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          project_id: string
          vote_type: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          vote_type: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          vote_type?: string
          user_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
