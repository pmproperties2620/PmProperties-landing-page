import type { Metadata } from "next";
import ProjectsView from "@/components/projects/ProjectsView";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getPublishedProjectsServer } from "@/lib/supabaseServer";
import { projectsData } from "@/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Projects in Dombivli, Kalyan & Thane | The PM Properties",
  description:
    "Explore verified 1, 2 & 3 BHK flats and commercial hubs in Dombivli, Kalyan & Thane. 100% MahaRERA registered with 0% brokerage on builder bookings.",
  keywords: [
    "The PM Properties",
    "PM Properties",
    "Real Estate Kalyan",
    "Flats in Dombivli",
    "Properties in Thane",
    "Regency Antilia",
    "Lodha Palava",
    "Runwal Gardens",
    "Commercial Property Kalyan",
    "0% Brokerage Flats",
  ],
  alternates: {
    canonical: "https://www.thepmproperties.in/projects",
  },
  openGraph: {
    title: "New Projects in Dombivli, Kalyan & Thane | The PM Properties",
    description:
      "Explore verified 1, 2 & 3 BHK flats and commercial hubs in Dombivli, Kalyan & Thane with 0% brokerage on direct builder bookings.",
    url: "https://www.thepmproperties.in/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Projects in Dombivli, Kalyan & Thane | The PM Properties",
    description:
      "Explore verified 1, 2 & 3 BHK flats and commercial hubs in Dombivli, Kalyan & Thane with 0% brokerage on direct builder bookings.",
  },
};

export default async function ProjectsPage() {
  const dbProjects = await getPublishedProjectsServer();
  const initialProjects = dbProjects.length > 0 ? dbProjects : projectsData;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "Projects", url: "https://www.thepmproperties.in/projects" },
        ]}
      />
      <ProjectsView initialProjects={initialProjects} />
    </>
  );
}

