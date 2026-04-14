export interface Contact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  category?: string;
  memo?: string;
  avatar_url?: string;
  created_at?: string;
  deleted_at?: string | null;
}
