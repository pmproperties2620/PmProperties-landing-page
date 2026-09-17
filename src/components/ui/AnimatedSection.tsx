"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Section-level entrance animation
 * Subtle fade-in with 20px upward slide.
 */
interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeInSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: FadeInSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const directionOffset = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 },
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = directionOffset[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent container that staggers entrance of its child items
 */
interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function StaggerGrid({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
}: StaggerGridProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual card/box element inside a StaggerGrid
 */
interface FadeInCardProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}

export function FadeInCard({
  children,
  className,
  yOffset = 15,
}: FadeInCardProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pop-in scale animation for metric numbers, credentials, and stat badges
 */
interface ScaleInBadgeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScaleInBadge({
  children,
  className,
  delay = 0,
}: ScaleInBadgeProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward Compatibility Aliases for Existing Imports
// ─────────────────────────────────────────────────────────────────────────────
export default function AnimatedSection(props: FadeInSectionProps) {
  return <FadeInSection {...props} />;
}

export function StaggerContainer(props: StaggerGridProps) {
  return <StaggerGrid {...props} />;
}

export function StaggerItem(props: FadeInCardProps) {
  return <FadeInCard {...props} />;
}
