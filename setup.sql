-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- 2. Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy so users can only see/manage their own contacts
CREATE POLICY "Users can manage their own contacts" 
ON contacts FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- 4. (Optional) Create an index for faster searching if needed later
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
