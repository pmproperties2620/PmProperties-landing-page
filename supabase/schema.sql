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
-- Composite indexes for optimal filter + newest sort performance
CREATE INDEX IF NOT EXISTS idx_leads_status_created ON public.leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source_created ON public.leads (source, created_at DESC);

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

-- 7. Admin Settings Table (Stores persistent admin configurations such as the admin passcode)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow full access only to service_role (used securely by Next.js server route handlers)
DROP POLICY IF EXISTS "Allow service role full access on admin_settings" ON public.admin_settings;
CREATE POLICY "Allow service role full access on admin_settings"
    ON public.admin_settings
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Disallow public anon access to admin_settings for maximum security
DROP POLICY IF EXISTS "Disallow public access to admin_settings" ON public.admin_settings;
CREATE POLICY "Disallow public access to admin_settings"
    ON public.admin_settings
    FOR ALL
    TO anon
    USING (false);

COMMENT ON TABLE public.admin_settings IS 'Stores administrative configurations, security credentials, and system settings.';

-- ==============================================================================
-- 8. High-Performance Server Aggregation RPC Functions
-- ==============================================================================
-- Computes 30-day daily counts directly inside Postgres engine
CREATE OR REPLACE FUNCTION public.get_leads_30day_trend()
RETURNS TABLE (day DATE, count BIGINT) 
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT 
    d::DATE AS day,
    COUNT(l.id) AS count
  FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, '1 day'::interval) d
  LEFT JOIN public.leads l 
    ON DATE(l.created_at) = d::DATE
  GROUP BY d::DATE
  ORDER BY d::DATE ASC;
$$;

-- Computes requirement breakdown directly inside Postgres engine
CREATE OR REPLACE FUNCTION public.get_leads_requirement_counts()
RETURNS TABLE (requirement TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT 
    requirement,
    COUNT(*) AS count
  FROM public.leads
  GROUP BY requirement
  ORDER BY count DESC;
$$;

