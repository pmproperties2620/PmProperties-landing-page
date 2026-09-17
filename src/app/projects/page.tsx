import type { Metadata } from "next";
import ProjectsView from "@/components/projects/ProjectsView";
import { getPublishedProjectsServer } from "@/lib/supabaseServer";
import { projectsData } from "@/data/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Real Estate Projects & Properties | PM Properties",
  description:
    "Explore verified new residential projects, luxury apartments, verified resale properties, and commercial hubs in Kalyan, Dombivli, Thane & Badlapur. 100% RERA registered with 0% brokerage on direct builder bookings.",
  keywords: [
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
  openGraph: {
    title: "Real Estate Projects & Properties | PM Properties",
    description:
      "Curated residential and commercial properties across Kalyan, Dombivli, Thane & beyond with 0% brokerage on new builder projects.",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const dbProjects = await getPublishedProjectsServer();
  const initialProjects = dbProjects.length > 0 ? dbProjects : projectsData;

  return <ProjectsView initialProjects={initialProjects} />;
}

