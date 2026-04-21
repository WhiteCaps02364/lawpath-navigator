-- Advisors table
CREATE TABLE public.advisors (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  phone TEXT,
  years_advising TEXT NOT NULL,
  biography TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_advisors_institution ON public.advisors(institution);
CREATE INDEX idx_advisors_slug ON public.advisors(slug);

ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;

-- Public read of advisor directory info (needed for public profile pages and student "find advisor" lookup)
CREATE POLICY "Advisors are publicly viewable"
  ON public.advisors FOR SELECT
  USING (true);

CREATE POLICY "Advisors can insert own row"
  ON public.advisors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Advisors can update own row"
  ON public.advisors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE TRIGGER set_advisors_updated_at
  BEFORE UPDATE ON public.advisors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Allow advisors to view intake submissions linked to them
CREATE POLICY "Advisors view linked submissions"
  ON public.intake_submissions FOR SELECT
  TO authenticated
  USING (
    advisor_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.advisors a
      WHERE a.id = auth.uid() AND a.id::text = intake_submissions.advisor_id
    )
  );