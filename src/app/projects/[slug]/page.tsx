import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlugServer, getPublishedProjectsServer } from "@/lib/supabaseServer";
import { projectsData } from "@/data/projects";
import ProjectDetailView from "@/components/projects/ProjectDetailView";
import { BreadcrumbJsonLd, ProjectListingJsonLd } from "@/components/seo/JsonLd";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) {
    return {
      title: "Property Not Found | The PM Properties",
      description: "The requested real estate property could not be found.",
    };
  }

  const fullTitle = `${project.title} in ${project.location.locality} | The PM Properties`;
  const title = fullTitle.length <= 60 ? fullTitle : `${project.title} | The PM Properties`;
  const description = `${project.title} in ${project.location.locality}, ${project.location.city}. ${project.configurations.join("/")} from ${project.priceDisplay}. 0% brokerage, MahaRERA: ${project.reraId}.`.slice(0, 155);
  const pageUrl = `https://www.thepmproperties.in/projects/${project.slug}`;
  const coverImage =
    project.images && project.images.length > 0
      ? project.images[0]
      : "/images/modern_building.png";

  return {
    title,
    description,
    keywords: [
      project.title,
      project.developer,
      project.location.locality,
      project.location.city,
      ...project.configurations,
      "The PM Properties",
      "PM Properties",
      "RERA Registered",
      "0% Brokerage",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: `${project.title} by ${project.developer} in ${project.location.locality}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlugServer(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getPublishedProjectsServer();
  const pool = allProjects.length > 0 ? allProjects : projectsData;
  const relatedProjects = pool
    .filter(
      (p) =>
        p.slug !== project.slug &&
        (p.location.city === project.location.city || p.category === project.category)
    )
    .slice(0, 3);

  const pageUrl = `https://www.thepmproperties.in/projects/${project.slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://www.thepmproperties.in" },
          { name: "Projects", url: "https://www.thepmproperties.in/projects" },
          { name: project.title, url: pageUrl },
        ]}
      />
      <ProjectListingJsonLd project={project} />
      <ProjectDetailView project={project} relatedProjects={relatedProjects} />
    </>
  );
}
