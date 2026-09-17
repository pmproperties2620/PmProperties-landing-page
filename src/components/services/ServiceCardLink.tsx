"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { trackServiceClick, trackContactClick } from "@/lib/analytics";

interface ServiceCardLinkProps {
  href: string;
  serviceId: string;
  serviceTitle: string;
  category?: string;
  className?: string;
  children: ReactNode;
}

export default function ServiceCardLink({
  href,
  serviceId,
  serviceTitle,
  category,
  className,
  children,
}: ServiceCardLinkProps) {
  const handleClick = () => {
    trackServiceClick({
      serviceId,
      serviceTitle,
      category,
      action: "whatsapp_enquire",
    });
    trackContactClick({
      method: "whatsapp",
      location: "services_page",
      destination: href,
      label: serviceTitle,
    });
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
