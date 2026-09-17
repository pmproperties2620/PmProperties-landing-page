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

-- 9. Add is_read Column and Indexes for Unread Tracking
ALTER TABLE public.leads 
    ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_leads_is_read ON public.leads (is_read);
CREATE INDEX IF NOT EXISTS idx_leads_unread ON public.leads (is_read, created_at DESC);

-- ==============================================================================
-- 10. Web Push Subscriptions Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT UNIQUE NOT NULL,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (used securely by Next.js server route handlers)
DROP POLICY IF EXISTS "Allow service role full access on push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "Allow service role full access on push_subscriptions"
    ON public.push_subscriptions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Disallow public anon access
DROP POLICY IF EXISTS "Disallow public access to push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "Disallow public access to push_subscriptions"
    ON public.push_subscriptions
    FOR ALL
    TO anon
    USING (false);

COMMENT ON TABLE public.push_subscriptions IS 'Stores Web Push notification subscriptions for real-time lead alerts.';

-- ==============================================================================
-- 11. Projects CMS Table & Storage
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    category TEXT NOT NULL, -- 'buy_new' | 'verified_resale' | 'commercial' | 'industrial_rental'
    status TEXT NOT NULL,   -- 'ready_to_move' | 'under_construction'
    brokerage_label TEXT DEFAULT '0% Brokerage',
    is_featured BOOLEAN DEFAULT false,
    rera_number TEXT,
    rera_verified BOOLEAN DEFAULT false,
    price_min NUMERIC,
    price_max NUMERIC,
    price_unit TEXT DEFAULT 'Lakhs', -- 'Lakhs' | 'Cr'
    price_per_sqft NUMERIC,
    configurations TEXT[] DEFAULT '{}', -- e.g. ['1 BHK','2 BHK','3 BHK']
    property_type TEXT DEFAULT 'Residential',
    carpet_area_min NUMERIC,
    carpet_area_max NUMERIC,
    rera_usable BOOLEAN DEFAULT true,
    possession_text TEXT, -- e.g. "Immediate Possession", "Dec 2026"
    possession_status_tag TEXT, -- e.g. "Ready to Move", "Ready & Nearing Possession"
    description TEXT,
    highlights TEXT[] DEFAULT '{}', -- Key Project Highlights list
    amenities TEXT[] DEFAULT '{}',  -- World-Class Amenities list
    cover_image_url TEXT,
    gallery_image_urls TEXT[] DEFAULT '{}',
    brochure_url TEXT,
    contact_phone TEXT DEFAULT '919029923246',
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_published_order ON public.projects (is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_location ON public.projects (location);

-- Trigger for auto-updating updated_at on projects
DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access on projects" ON public.projects;
CREATE POLICY "Service role full access on projects"
    ON public.projects FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.projects IS 'Stores dynamic real estate projects managed via the Admin CMS.';

-- Storage bucket setup for project-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read images from project-images bucket
DROP POLICY IF EXISTS "Public can view project images" ON storage.objects;
CREATE POLICY "Public can view project images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'project-images');

-- Service role full access to project-images bucket
DROP POLICY IF EXISTS "Service role full access to project images" ON storage.objects;
CREATE POLICY "Service role full access to project images"
    ON storage.objects FOR ALL
    TO service_role
    USING (bucket_id = 'project-images')
    WITH CHECK (bucket_id = 'project-images');

-- ==============================================================================
-- PM Properties - Content CMS Schema (Testimonials, Partners, About, Banners)
-- ==============================================================================

-- 1. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT,
    image_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published_order ON public.testimonials (is_published, display_order);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
    ON public.testimonials FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access to testimonials" ON public.testimonials;
CREATE POLICY "Service role full access to testimonials"
    ON public.testimonials FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.testimonials IS 'Dynamic client testimonial photos and reviews managed via Admin CMS.';

-- 2. Trusted Partners / Developer Logos Table
CREATE TABLE IF NOT EXISTS public.trusted_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT,
    logo_url TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partners_published_order ON public.trusted_partners (is_published, display_order);

ALTER TABLE public.trusted_partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published partners" ON public.trusted_partners;
CREATE POLICY "Public can view published partners"
    ON public.trusted_partners FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access to partners" ON public.trusted_partners;
CREATE POLICY "Service role full access to partners"
    ON public.trusted_partners FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.trusted_partners IS 'Developer and institutional partner logos shown in Homepage marquee.';

-- 3. About Bento Showcase Table
CREATE TABLE IF NOT EXISTS public.about_showcase (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_about_showcase_published_order ON public.about_showcase (is_published, display_order);

ALTER TABLE public.about_showcase ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published about showcase" ON public.about_showcase;
CREATE POLICY "Public can view published about showcase"
    ON public.about_showcase FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access to about showcase" ON public.about_showcase;
CREATE POLICY "Service role full access to about showcase"
    ON public.about_showcase FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.about_showcase IS 'Rotating property photography displayed in the Homepage About Bento card.';

-- 4. About Timeline Milestones Table
CREATE TABLE IF NOT EXISTS public.timeline_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_label TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timeline_published_order ON public.timeline_milestones (is_published, display_order);

ALTER TABLE public.timeline_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published timeline milestones" ON public.timeline_milestones;
CREATE POLICY "Public can view published timeline milestones"
    ON public.timeline_milestones FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access to timeline milestones" ON public.timeline_milestones;
CREATE POLICY "Service role full access to timeline milestones"
    ON public.timeline_milestones FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.timeline_milestones IS 'Company journey milestones and nested multi-image sliders on About page.';

-- 5. Page Banners Table (Unified for Hero, About, How We Work, Services, Contact)
CREATE TABLE IF NOT EXISTS public.page_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    image_url TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.page_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view page banners" ON public.page_banners;
CREATE POLICY "Public can view page banners"
    ON public.page_banners FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role full access to page banners" ON public.page_banners;
CREATE POLICY "Service role full access to page banners"
    ON public.page_banners FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.page_banners IS 'Unified hero banner background images keyed by page route.';

-- 6. Hero Showcase Card Table (Right card on Homepage Hero)
CREATE TABLE IF NOT EXISTS public.hero_showcase (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.hero_showcase ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view hero showcase" ON public.hero_showcase;
CREATE POLICY "Public can view hero showcase"
    ON public.hero_showcase FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role full access to hero showcase" ON public.hero_showcase;
CREATE POLICY "Service role full access to hero showcase"
    ON public.hero_showcase FOR ALL
    TO service_role
    USING (true) WITH CHECK (true);

COMMENT ON TABLE public.hero_showcase IS 'Primary hero card image showcased on Homepage right fold.';

-- Default Seed Rows for Page Banners
INSERT INTO public.page_banners (page_key, label, image_url) VALUES
    ('home_hero', 'Homepage Hero Banner Backdrop', '/images/hero-bg-new.png'),
    ('about', 'About Us Page Hero Banner', '/images/hero-bg-new.png'),
    ('how_we_work', 'How We Work Page Hero Banner', '/images/hero-bg-new.png'),
    ('services', 'Services Page Hero Banner', '/images/hero-bg-new.png'),
    ('contact', 'Contact Us Page Hero Banner', '/images/hero-bg-new.png')
ON CONFLICT (page_key) DO NOTHING;


