"use client";
import React, { useState } from "react";
import Container from "./Container";

import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import FooterTop from "./FooterTop";
import { quickLinksData, categoriesData } from "@/app/constants/data";
import Logo from "./Logo";
import { SubText, Subtitle } from "./text";
import SocialMedia from "./SocialMedia";

import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Une erreur s'est produite.");

      toast.success(data.message);
      setEmail("");
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur s'est produite. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#DBC8C8] via-amber-50 to-amber-100 border-t"
      role="contentinfo"
    >
      <Container>
        <FooterTop />

        <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-6 lg:gap-8">
          {/* ── Section À propos ── */}
          <div className="space-y-4 py-5 sm:py-0 border-b sm:border-b-0">
            <Logo />
            <SubText>
              Boostez vos performances avec notre matériel tech de dernière
              génération. Profitez de nos offres exclusives — Commandez
              {` aujourd'hui.`}
            </SubText>
            <SocialMedia
              className="text-shop_orange"
              iconClassName="border-white hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-shop_light_blue text-white"
            />
          </div>

          {/* ── Liens utiles — accordion sur mobile ── */}
          <div className="border-b sm:border-b-0">
            <button
              className="w-full flex items-center justify-between py-4 sm:py-0 sm:pointer-events-none"
              onClick={() => toggleSection("links")}
              aria-expanded={openSection === "links"}
            >
              <span className="font-bold text-base tracking-wide">
                Liens utiles
              </span>
              <span
                className="sm:hidden text-gray-400 text-lg transition-transform duration-300 inline-block"
                style={{
                  transform:
                    openSection === "links" ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </button>

            {/* Toujours visible sur sm+, accordion sur mobile */}
            <nav
              aria-label="Liens utiles"
              className={`overflow-hidden transition-all duration-300 sm:block ${
                openSection === "links"
                  ? "max-h-96 pb-4"
                  : "max-h-0 sm:max-h-none"
              }`}
            >
              <ul className="space-y-3 mt-2 sm:mt-4">
                {quickLinksData?.map((item) => (
                  <li key={item?.title}>
                    <Link
                      href={item?.href}
                      className="text-sm sm:text-base hover:text-shop_light_green hoverEffect font-medium transition-colors duration-200"
                    >
                      {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Catégories — accordion sur mobile ── */}
          <div className="border-b sm:border-b-0">
            <button
              className="w-full flex items-center justify-between py-4 sm:py-0 sm:pointer-events-none"
              onClick={() => toggleSection("categories")}
              aria-expanded={openSection === "categories"}
            >
              <span className="font-bold text-base tracking-wide">
                Catégories
              </span>
              <span
                className="sm:hidden text-gray-400 text-lg transition-transform duration-300 inline-block"
                style={{
                  transform:
                    openSection === "categories"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </button>

            <nav
              aria-label="Catégories de produits"
              className={`overflow-hidden transition-all duration-300 sm:block ${
                openSection === "categories"
                  ? "max-h-96 pb-4"
                  : "max-h-0 sm:max-h-none"
              }`}
            >
              <ul className="space-y-3 mt-2 sm:mt-4">
                {categoriesData?.map((item) => (
                  <li key={item?.title}>
                    <Link
                      href={`/category/${item?.href}`}
                      className="text-sm sm:text-base hover:text-shop_light_green hoverEffect font-medium transition-colors duration-200"
                    >
                      {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── Newsletter ── */}
          <div className="space-y-3 sm:space-y-4 py-5 sm:py-0 sm:col-span-2 lg:col-span-1">
            <Subtitle>Newsletter</Subtitle>
            <SubText>
              Abonnez-vous pour recevoir nos actualités et offres exclusives.
            </SubText>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-2 sm:gap-3"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse e-mail
              </label>
              <Input
                id="newsletter-email"
                placeholder="Entrez votre e-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full text-sm"
              />
              <Button
                type="submit"
                className="w-full font-bold bg-shop_orange hover:bg-amber-600 transition-colors duration-200 text-white sm:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="py-4 sm:py-6 border-t text-center text-xs sm:text-sm text-gray-600">
          © {currentYear} <Logo />. Tous droits réservés.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
