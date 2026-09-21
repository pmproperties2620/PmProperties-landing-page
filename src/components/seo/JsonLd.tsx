import React from "react";
import type { Project } from "@/data/projects";
import { faqs } from "@/data/properties";

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Universal JSON-LD script injector
 */
export function JsonLdScript({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * LocalBusiness (RealEstateAgent) Schema
 */
export function RealEstateAgentJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://www.thepmproperties.in/#realestateagent",
    name: "The PM Properties",
    alternateName: "PM Properties",
    url: "https://www.thepmproperties.in",
    logo: "https://www.thepmproperties.in/images/logo.png",
    image: "https://www.thepmproperties.in/og-image.jpg",
    telephone: "+919029923246",
    email: "thepmproperties4u@gmail.com",
    priceRange: "₹₹ - ₹₹₹₹",
    description:
      "RERA-certified real estate consultancy in Dombivli & Kalyan by Pritesh Mhamunkar. Specializing in verified residential and commercial properties with 0% brokerage on builder bookings.",
    founder: {
      "@type": "Person",
      name: "Pritesh Pravin Mhamunkar",
      jobTitle: "Founder & Principal Real Estate Consultant",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Shop No: 6, Gangeshwar Maya CHS, Opp KDMC H Ward Office, Phule Road",
      addressLocality: "Dombivli West",
      addressRegion: "Maharashtra",
      postalCode: "421202",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.2183,
      longitude: 73.0867,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/the.pmproperties/",
      "https://www.youtube.com/@ThePMProperties",
    ],
    areaServed: [
      { "@type": "AdministrativeArea", name: "Dombivli" },
      { "@type": "AdministrativeArea", name: "Kalyan" },
      { "@type": "AdministrativeArea", name: "Thane" },
      { "@type": "AdministrativeArea", name: "Ambernath" },
      { "@type": "AdministrativeArea", name: "Badlapur" },
      { "@type": "AdministrativeArea", name: "Mumbai Metropolitan Region" },
    ],
    memberOf: {
      "@type": "Organization",
      name: "Kalyan Dombivli Realtors Welfare Association (KDRA)",
    },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: "MahaRERA Real Estate Agent Registration",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Maharashtra Real Estate Regulatory Authority (MahaRERA)",
        },
        identifier: "A51700019203",
      },
    ],
  };

  return <JsonLdScript data={schema} />;
}

/**
 * FAQPage Schema
 */
export function FAQPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * BreadcrumbList Schema
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLdScript data={schema} />;
}

/**
 * Real Estate Listing Schema for individual project pages
 */
export function ProjectListingJsonLd({ project }: { project: Project }) {
  const pageUrl = `https://www.thepmproperties.in/projects/${project.slug}`;
  const images =
    project.images && project.images.length > 0
      ? project.images.map((img) =>
          img.startsWith("http") ? img : `https://www.thepmproperties.in${img}`
        )
      : ["https://www.thepmproperties.in/og-image.jpg"];

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${pageUrl}#listing`,
    name: `${project.title} by ${project.developer}`,
    description: project.description || `${project.title} in ${project.location.locality}, ${project.location.city}`,
    url: pageUrl,
    image: images,
    datePosted: "2024-01-01",
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: project.priceStarting,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: project.priceStarting,
        priceCurrency: "INR",
      },
      description: `Starting from ${project.priceDisplay}. 0% Brokerage on direct builder bookings.`,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "RealEstateAgent",
        name: "The PM Properties",
        telephone: "+919029923246",
        url: "https://www.thepmproperties.in",
      },
    },
    contentLocation: {
      "@type": "Place",
      name: `${project.title}, ${project.location.locality}, ${project.location.city}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: project.location.landmark || project.location.locality,
        addressLocality: project.location.locality,
        addressRegion: project.location.city,
        addressCountry: "IN",
      },
    },
  };

  return <JsonLdScript data={schema} />;
}
