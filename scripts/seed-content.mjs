import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...vals] = trimmed.split("=");
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join("=").trim();
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function seed() {
  console.log("Starting seed of current images into Supabase Content CMS...");

  // 1. Testimonials
  const testimonials = [
    { client_name: "Happy Family & Homeowner", image_url: "/images/testimonials/testimonial-1.jpeg", display_order: 1, is_published: true },
    { client_name: "Verified Client Review", image_url: "/images/testimonials/testimonial-2.jpeg", display_order: 2, is_published: true },
    { client_name: "Delighted Property Buyer", image_url: "/images/testimonials/testimonial-3.jpeg", display_order: 3, is_published: true },
    { client_name: "Satisfied Homeowner", image_url: "/images/testimonials/testimonial-4.jpeg", display_order: 4, is_published: true },
    { client_name: "Trusted Client Feedback", image_url: "/images/testimonials/testimonial-5.jpeg", display_order: 5, is_published: true },
    { client_name: "Successful Deal Closed", image_url: "/images/testimonials/testimonial-6.jpeg", display_order: 6, is_published: true },
    { client_name: "Happy Client in Thane", image_url: "/images/testimonials/testimonial-7.jpeg", display_order: 7, is_published: true },
    { client_name: "Client Property Handover", image_url: "/images/testimonials/testimonial-8.jpeg", display_order: 8, is_published: true },
    { client_name: "First-Time Home Buyer", image_url: "/images/testimonials/testimonial-9.jpg", display_order: 9, is_published: true },
    { client_name: "Luxury Apartment Owner", image_url: "/images/testimonials/testimonial-10.jpg", display_order: 10, is_published: true },
  ];

  const { count: tCount, error: tErr } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
  if (tErr) {
    console.error("Error checking testimonials:", tErr.message);
  } else if (tCount === 0) {
    const { error: insErr } = await supabase.from("testimonials").insert(testimonials);
    if (insErr) console.error("Error inserting testimonials:", insErr.message);
    else console.log(`Inserted ${testimonials.length} testimonials.`);
  } else {
    console.log(`Testimonials already has ${tCount} rows.`);
  }

  // 2. Trusted Partners
  const partners = [
    { company_name: "Regency Group", logo_url: "/logos/logo1.png", display_order: 1, is_published: true },
    { company_name: "Lodha Group", logo_url: "/logos/logo2.png", display_order: 2, is_published: true },
    { company_name: "Runwal Group", logo_url: "/logos/logo3.png", display_order: 3, is_published: true },
    { company_name: "Godrej Properties", logo_url: "/logos/logo4.png", display_order: 4, is_published: true },
    { company_name: "Hiranandani Communities", logo_url: "/logos/logo5.png", display_order: 5, is_published: true },
    { company_name: "Kalpataru", logo_url: "/logos/logo6.png", display_order: 6, is_published: true },
  ];

  const { count: pCount, error: pErr } = await supabase.from("trusted_partners").select("*", { count: "exact", head: true });
  if (pErr) {
    console.error("Error checking trusted_partners:", pErr.message);
  } else if (pCount === 0) {
    const { error: insErr } = await supabase.from("trusted_partners").insert(partners);
    if (insErr) console.error("Error inserting partners:", insErr.message);
    else console.log(`Inserted ${partners.length} partners.`);
  } else {
    console.log(`Trusted partners already has ${pCount} rows.`);
  }

  // 3. About Bento Showcase
  const aboutShowcase = [
    { image_url: "/images/about1.png", display_order: 1, is_published: true },
    { image_url: "/images/about2.png", display_order: 2, is_published: true },
    { image_url: "/images/about3.png", display_order: 3, is_published: true },
    { image_url: "/images/about4.png", display_order: 4, is_published: true },
  ];

  const { count: aCount, error: aErr } = await supabase.from("about_showcase").select("*", { count: "exact", head: true });
  if (aErr) {
    console.error("Error checking about_showcase:", aErr.message);
  } else if (aCount === 0) {
    const { error: insErr } = await supabase.from("about_showcase").insert(aboutShowcase);
    if (insErr) console.error("Error inserting about showcase:", insErr.message);
    else console.log(`Inserted ${aboutShowcase.length} about showcase photos.`);
  } else {
    console.log(`About showcase already has ${aCount} rows.`);
  }

  // 4. Timeline Milestones
  const milestones = [
    {
      year_label: "Pre-2020",
      title: "Building the Foundation",
      description:
        "Graduating with Distinction in B.Com, I built a strong foundation through 8 years of experience in leadership roles at top MNCs like Sutherland, TinyOwl, and Wipro. Yet, deep down, I always nurtured a dream—to build an honest business that earns people's trust.",
      image_urls: ["/images/whatsapp-avatar.jpeg"],
      display_order: 1,
      is_published: true,
    },
    {
      year_label: "2020",
      title: "The Turning Point",
      description:
        "The 2020 pandemic became my catalyst. Seeing acquaintances face scams and poor guidance while buying homes, I found my calling. I decided to step up and ensure people get their rightful homes through transparent, secure, and guided transactions.",
      image_urls: ["/images/timeline_2_new.jpg"],
      display_order: 2,
      is_published: true,
    },
    {
      year_label: "September 1, 2020",
      title: "The Beginning",
      description:
        "Equipped with proper RERA training and licensing, I took the leap and founded 'Siddhivinayak Enterprise – Real Estate & Interior'. Despite early hurdles, my resolve was unbreakable—there was no turning back. With determination, the journey began.",
      image_urls: ["/images/timeline_3_new.jpeg"],
      display_order: 3,
      is_published: true,
    },
    {
      year_label: "2021 - 2024",
      title: "Growth & Partnerships",
      description:
        "The journey blossomed as I joined KDRA (Kalyan Dombivli Realtors Welfare Association) and collaborated with renowned developers like Regency Group, Lodha Group, and Runwal Group. To date, I've had the privilege of helping over 500 families find their perfect homes.",
      image_urls: [
        "/images/timeline_4_1.jpeg",
        "/images/timeline_4_2.jpeg",
        "/images/timeline_4_3.jpeg",
        "/images/timeline_4_4.jpeg",
        "/images/timeline_4_5.jpeg",
      ],
      display_order: 4,
      is_published: true,
    },
    {
      year_label: "Early 2025",
      title: "A New Identity",
      description:
        "Celebrating 5 years of trust, we took a monumental step forward. To secure a distinct and official identity, the company evolved into 'The PM Properties' with a registered trademark. Fulfilling your dream of a home remains my greatest privilege.",
      image_urls: [
        "/images/PM_propreties.jpeg",
        "/images/pm.jpeg",
        "/images/pm3.jpeg",
        "/images/pm1.jpeg",
        "/images/pm2.jpeg",
      ],
      display_order: 5,
      is_published: true,
    },
  ];

  const { count: mCount, error: mErr } = await supabase.from("timeline_milestones").select("*", { count: "exact", head: true });
  if (mErr) {
    console.error("Error checking timeline_milestones:", mErr.message);
  } else if (mCount === 0) {
    const { error: insErr } = await supabase.from("timeline_milestones").insert(milestones);
    if (insErr) console.error("Error inserting milestones:", insErr.message);
    else console.log(`Inserted ${milestones.length} timeline milestones.`);
  } else {
    console.log(`Timeline milestones already has ${mCount} rows.`);
  }

  // 5. Hero Showcase Card
  const { count: hCount, error: hErr } = await supabase.from("hero_showcase").select("*", { count: "exact", head: true });
  if (hErr) {
    console.error("Error checking hero_showcase:", hErr.message);
  } else if (hCount === 0) {
    const { error: insErr } = await supabase.from("hero_showcase").insert({
      image_url: "/images/hero_img_right.png",
    });
    if (insErr) console.error("Error inserting hero showcase:", insErr.message);
    else console.log("Inserted hero showcase image.");
  } else {
    console.log(`Hero showcase already has ${hCount} rows.`);
  }

  // 6. Page Banners
  const pageBanners = [
    { page_key: "home_hero", label: "Homepage Hero Banner Backdrop", image_url: "/images/hero-bg-new.png" },
    { page_key: "about", label: "About Us Page Hero Banner", image_url: "/images/hero-bg-new.png" },
    { page_key: "how_we_work", label: "How We Work Page Hero Banner", image_url: "/images/hero-bg-new.png" },
    { page_key: "services", label: "Services Page Hero Banner", image_url: "/images/hero-bg-new.png" },
    { page_key: "contact", label: "Contact Us Page Hero Banner", image_url: "/images/hero-bg-new.png" },
  ];

  for (const banner of pageBanners) {
    const { error: bErr } = await supabase
      .from("page_banners")
      .upsert(banner, { onConflict: "page_key" });
    if (bErr) console.error(`Error upserting banner ${banner.page_key}:`, bErr.message);
  }
  console.log("Upserted 5 page banners.");

  console.log("ALL CURRENT IMAGES POPULATED SUCCESSFULLY INTO SUPABASE!");
}

seed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
