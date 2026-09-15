-- ==============================================================================
-- PM Properties - Production Supabase Schema for Leads Management
-- ==============================================================================
-- Run this SQL in your Supabase Project:
-- SQL Editor -> New Query -> Paste -> Run

-- 1. Create the leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    requirement TEXT NOT NULL,
    price_range TEXT NOT NULL,
    property_stage TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'modal',
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Add validation check constraints for status and source
ALTER TABLE public.leads 
    DROP CONSTRAINT IF EXISTS check_lead_status;

ALTER TABLE public.leads 
    ADD CONSTRAINT check_lead_status 
    CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed'));

ALTER TABLE public.leads 
    DROP CONSTRAINT IF EXISTS check_lead_source;

ALTER TABLE public.leads 
    ADD CONSTRAINT check_lead_source 
    CHECK (source IN ('modal', 'contact_page', 'website'));

-- 3. Create high-performance indexes for fast filtering and search
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads (phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads (source);

-- 4. Automatically update the updated_at timestamp on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;

CREATE TRIGGER set_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous form submissions (inserts only) from the website
DROP POLICY IF EXISTS "Allow anonymous lead submissions" ON public.leads;
CREATE POLICY "Allow anonymous lead submissions"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow full access to the service_role (used securely by Next.js server route handlers)
DROP POLICY IF EXISTS "Allow service role full access" ON public.leads;
CREATE POLICY "Allow service role full access"
    ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Comment table for documentation
COMMENT ON TABLE public.leads IS 'Stores real estate inquiry leads from the Book Consultation modal and Contact Us page.';
