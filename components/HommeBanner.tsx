"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { P1, P2, P3, P4, P5 } from "@/images/banner";
import Link from "next/link";

import Image, { type StaticImageData } from "next/image";
import Autoplay from "embla-carousel-autoplay";

interface BannerSlide {
  src: StaticImageData;
  alt: string;
  title: string;
  description: string;
  href: string;
  /** Direction du gradient pour varier l'ambiance visuelle */
  gradientDir?: "bottom" | "left" | "right";
  ctaLabel?: string;
}

const bannerSlides: BannerSlide[] = [
  {
    src: P1,
    alt: "Climatisseur",
    title: "Climatisseur",
    description:
      "Des appareils electroménagers de qualités chez Smart Technology",
    href: "/shop?category=claviers",
    gradientDir: "left",
    ctaLabel: "Découvrir",
  },
  {
    src: P2,
    alt: "Fer à repasser",
    title: "Nouveautés",
    description: "Consommation en éléctricité faible",
    href: "/shop?category=ordinateurs",
    gradientDir: "bottom",
    ctaLabel: "Explorer",
  },
  {
    src: P3,
    alt: "Refrigérateur",
    title: "Refrigérateur",
    description: "Refrigérateur de derniére génération",
    href: "/shop?category=smartphones",
    gradientDir: "right",
    ctaLabel: "Voir les modèles",
  },
  {
    src: P4,
    alt: "Ecran plat ",
    title: "Ecran Plat Oled",
    description: "Ecran Plat connécté",
    href: "/shop?category=casques",
    gradientDir: "bottom",
    ctaLabel: "Écouter",
  },
  {
    src: P5,
    alt: "Ventilateur",
    title: "Ventilateur",
    description: "Ventilateur",
    href: "/shop?category=casques",
    gradientDir: "bottom",
    ctaLabel: "Écouter",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const gradientClasses: Record<
  NonNullable<BannerSlide["gradientDir"]>,
  string
> = {
  bottom: "bg-gradient-to-t from-black/65 via-black/20 to-transparent",
  left: "bg-gradient-to-r from-black/65 via-black/20 to-transparent",
  right: "bg-gradient-to-l from-black/65 via-black/20 to-transparent",
};

// ─── Component ────────────────────────────────────────────────────────────────

function HomeBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isVisible, setIsVisible] = useState(true);

  /* Sync index with carousel */
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
      // Reset animation trigger
      setIsVisible(false);
      requestAnimationFrame(() => setIsVisible(true));
    };

    // Defer initial call to avoid synchronous setState in effect
    const timer = requestAnimationFrame(() => {
      handleSelect();
      api.on("select", handleSelect);
    });

    return () => {
      cancelAnimationFrame(timer);
      api.off("select", handleSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  return (
    <section
      role="region"
      aria-label="Bannière promotionnelle"
      aria-live="polite"
      className="relative overflow-hidden w-full"
    >
      <Carousel
        setApi={setApi}
        plugins={[
          Autoplay({
            delay: 4500,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {bannerSlides.map((slide, index) => {
            const gradient = gradientClasses[slide.gradientDir ?? "bottom"];
            const isActive = index === currentIndex;
            const isLeft = slide.gradientDir === "left";

            return (
              <CarouselItem key={index}>
                <div className="relative h-[350px] md:h-[500px] lg:h-[650px] w-full group">
                  <Link
                    href={slide.href}
                    className="block w-full h-full"
                    aria-label={`${slide.title} — ${slide.description}`}
                  >
                    {/* Image */}
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        priority={index === 0}
                        quality={95}
                        sizes="100vw"
                      />
                      {/* Gradient overlay (direction variable) */}
                      <div className={`absolute inset-0 ${gradient}`} />
                    </div>

                    {/* Texte — positionné selon la direction du gradient */}
                    <div
                      className={`absolute inset-0 flex items-end ${
                        isLeft
                          ? "justify-start items-center"
                          : "items-end justify-start"
                      } p-6 md:p-10 lg:p-16`}
                    >
                      <div className="max-w-lg">
                        {/* Compteur de slides */}
                        <span className="inline-block text-white/60 text-xs md:text-sm font-mono mb-3 tracking-widest">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(bannerSlides.length).padStart(2, "0")}
                        </span>

                        <h2
                          className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4
                            transition-all duration-500
                            ${isActive && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                            group-hover:translate-x-1`}
                        >
                          {slide.title}
                        </h2>

                        <p
                          className={`text-sm md:text-lg lg:text-xl text-white/85 mb-4 md:mb-6
                            transition-all duration-500 delay-100
                            ${isActive && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                            group-hover:translate-x-1`}
                        >
                          {slide.description}
                        </p>

                        <button
                          aria-label={`${slide.ctaLabel ?? "Acheter"} — ${slide.title}`}
                          className={`bg-shop_light_brown text-white px-6 md:px-8 py-2.5 md:py-3
                            rounded-full font-medium text-sm md:text-base
                            hover:bg-shop_light_brown/60 transition-all duration-300
                            transform hover:scale-105 shadow-lg hover:shadow-xl
                            transition-all duration-500 delay-200
                            ${isActive && isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                        >
                          {slide.ctaLabel ?? "Acheter"}
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Flèches de navigation */}
        <CarouselPrevious className="left-2 md:left-6 bg-white/90 hover:bg-white border-none shadow-lg transition-all duration-300 hover:scale-110 w-10 h-10 md:w-12 md:h-12" />
        <CarouselNext className="right-2 md:right-6 bg-white/90 hover:bg-white border-none shadow-lg transition-all duration-300 hover:scale-110 w-10 h-10 md:w-12 md:h-12" />

        {/* Indicateurs de pagination */}
        <div
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10"
          role="tablist"
          aria-label="Navigation des slides"
        >
          {bannerSlides.map((slide, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Aller à la slide : ${slide.title}`}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-8 md:w-10 h-2 md:h-2.5 bg-white"
                  : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}

export default HomeBanner;
