ALTER TABLE public.advisors
  ADD COLUMN IF NOT EXISTS institutional_bio_url text,
  ADD COLUMN IF NOT EXISTS verification_notes text;