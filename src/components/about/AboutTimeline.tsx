"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const timelineData = [
  {
    year: "Pre-2020",
    title: "Building the Foundation",
    description:
      "Graduating with Distinction in B.Com, I built a strong foundation through 8 years of experience in leadership roles at top MNCs like Sutherland, TinyOwl, and Wipro. Yet, deep down, I always nurtured a dream—to build an honest business that earns people's trust.",
    image: "/images/whatsapp-avatar.jpeg",
  },
  {
    year: "2020",
    title: "The Turning Point",
    description:
      "The 2020 pandemic became my catalyst. Seeing acquaintances face scams and poor guidance while buying homes, I found my calling. I decided to step up and ensure people get their rightful homes through transparent, secure, and guided transactions.",
    image: "/images/timeline_2_new.jpg",
  },
  {
    year: "September 1, 2020",
    title: "The Beginning",
    description:
      "Equipped with proper RERA training and licensing, I took the leap and founded 'Siddhivinayak Enterprise – Real Estate & Interior'. Despite early hurdles, my resolve was unbreakable—there was no turning back. With determination, the journey began.",
    image: "/images/timeline_3_new.jpeg",
  },
  {
    year: "2021 - 2024",
    title: "Growth & Partnerships",
    description:
      "The journey blossomed as I joined KDRA (Kalyan Dombivli Realtors Welfare Association) and collaborated with renowned developers like Regency Group, Lodha Group, and Runwal Group. To date, I've had the privilege of helping over 500 families find their perfect homes.",
    image: [
      "/images/timeline_4_1.jpeg",
      "/images/timeline_4_2.jpeg",
      "/images/timeline_4_3.jpeg",
      "/images/timeline_4_4.jpeg",
      "/images/timeline_4_5.jpeg",
    ],
  },
  {
    year: "Early 2025",
    title: "A New Identity",
    description:
      "Celebrating 5 years of trust, we took a monumental step forward. To secure a distinct and official identity, the company evolved into 'The PM Properties' with a registered trademark. Fulfilling your dream of a home remains my greatest privilege.",
    image: "/images/PM_propreties.jpeg",
  },
];

function ImageSlider({ images, fit }: { images: string[]; fit: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full">
      {images.map((img, idx) => (
        <Image
          key={img}
          src={img}
          alt={`Slider image ${idx + 1}`}
          fill
          className={`
            ${fit ? "object-contain bg-slate-100 p-2" : "object-cover"} 
            transition-all duration-1000 ease-in-out group-hover:scale-105
            ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
          `}
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      ))}
    </div>
  );
}

export default function AboutTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-16 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-xs sm:text-sm uppercase tracking-[0.05em] leading-none text-[#0a1128] mb-2">
              Our Journey
            </h2>
            <h3 className="font-heading font-bold text-2xl sm:text-4xl text-slate-900 mb-4 leading-[1.15] tracking-[-0.02em]">
              The Story of PM Properties
            </h3>
            <p className="font-body font-normal text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-[1.6]">
              A journey of determination, honesty, and a commitment to helping people find their
              rightful homes.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line Track */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 transform md:-translate-x-1/2 rounded-full" />
          
          {/* Animated Vertical Line Fill */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-brand-600 transform md:-translate-x-1/2 origin-top rounded-full z-0"
          />

          {timelineData.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                className={`relative flex flex-col md:flex-row items-center justify-between mb-16 last:mb-0 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Dot */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute left-8 md:left-1/2 w-5 h-5 rounded-full bg-brand-600 border-4 border-white shadow-md transform -translate-x-1/2 mt-1.5 md:mt-0 z-10"
                />

                {/* Content Side */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? "md:text-left" : "md:text-right"}`}>
                  <div className="bg-slate-50 p-6 rounded-3xl shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#0a1128]/5 text-[#0a1128] font-heading font-semibold text-xs mb-3">
                      {item.year}
                    </span>
                    <h4 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mb-3 leading-[1.2] tracking-[-0.02em]">{item.title}</h4>
                    <p className="font-body font-normal text-xs sm:text-sm text-slate-600 leading-[1.6]">{item.description}</p>
                  </div>
                </div>

                {/* Image Side */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 mt-6 md:mt-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
                  <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-lg group">
                    {Array.isArray(item.image) ? (
                      <ImageSlider images={item.image} fit={index <= 3} />
                    ) : (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className={`${index <= 3 ? "object-contain bg-slate-100 p-2" : "object-cover"} transition-transform duration-700 group-hover:scale-105`}
                        sizes="(max-width: 768px) 100vw, 45vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-20 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <AnimatedSection>
          <div className="mt-20 text-center max-w-3xl mx-auto">
            <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 mb-8">
              <div className="bg-white rounded-[14px] px-6 py-8">
                <p className="font-body font-medium text-base md:text-lg text-slate-800 italic leading-[1.6] mb-6">
                  &ldquo;To play a part in fulfilling someone&apos;s dream of a home is my privilege. I pray to God that this service continues uninterrupted.&rdquo;
                </p>
                <div className="flex flex-col items-center justify-center">
                  <p className="font-heading font-semibold text-xs uppercase tracking-[0.05em] text-slate-500 mb-1">Yours sincerely,</p>
                  <p className="font-heading font-bold text-lg sm:text-xl text-[#0a1128]">Mr. Pritesh Pravin Mhamunkar</p>
                  <p className="font-body font-normal text-xs sm:text-sm text-slate-600 mt-1">Founder, PM Properties</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
