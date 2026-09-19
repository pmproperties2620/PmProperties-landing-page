import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlugServer } from "@/lib/supabaseServer";
import ProjectDetailView from "@/components/projects/ProjectDetailView";

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
      title: "Property Not Found | PM Properties",
      description: "The requested real estate property could not be found.",
    };
  }

  const title = `${project.title} by ${project.developer} — ${project.location.locality}, ${project.location.city} | PM Properties`;
  const description = `${project.title} in ${project.location.locality}, ${project.location.city}. Starting from ${project.priceDisplay}. Configurations: ${project.configurations.join(", ")}. Carpet Area: ${project.carpetArea}. 100% MahaRERA verified (${project.reraId}) with 0% brokerage on direct builder bookings.`;
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
          alt: `${project.title} by ${project.developer}`,
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

  return <ProjectDetailView project={project} />;
}
