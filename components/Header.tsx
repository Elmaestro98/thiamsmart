"use client";

import Container from "./Container";
import Logo from "./Logo";
import CartIcon from "./CartIcon";

import FavoriteButton from "./FavoriteButton";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import SignIn from "./SignIn";
import CategoryMenuDynamic from "./CategoryMenuDynamic";

import { Logs, Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { ClerkLoaded, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-shop_light_brown shadow-lg">
      {/* ─── Barre supérieure ─── */}
      <div className="bg-shop_light_brown/65 py-1 hidden md:block border-b border-white/10">
        <Container className="flex items-center justify-between">
          <p className="text-white/60 text-xs">
            Livraison rapide partout au Sénégal
          </p>
        </Container>
      </div>

      {/* ─── Ligne principale : Logo + Recherche + Icônes ─── */}
      <div className="relative z-50 py-4 bg-shop_light_brown">
        <Container className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Bouton menu mobile - à gauche du logo */}
            <button
              className="md:hidden text-white hover:text-shop_orange hoverEffect"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X size={22} /> : <MenuIcon size={22} />}
              </motion.div>
            </button>

            <Logo />
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <SearchBar />
          </div>

          {/* Icônes d'action */}
          <div className="flex items-center gap-3 sm:gap-5">
            <CartIcon />
            <FavoriteButton />

            {user && (
              <Link
                href="/orders"
                className="relative text-white hover:text-shop_orange hoverEffect"
                aria-label="Mes commandes"
                title="Mes commandes"
              >
                <Logs size={22} />
              </Link>
            )}

            <ClerkLoaded>
              {user ? <UserButton afterSignOutUrl="/" /> : <SignIn />}
            </ClerkLoaded>
          </div>
        </Container>
      </div>

      {/* ─── Recherche mobile ─── */}
      <Container className="relative z-50 bg-shop_light_brown md:hidden px-4 pb-3">
        <SearchBar />
      </Container>

      {/* ─── Catégories + Navigation — desktop ─── */}
      <nav
        aria-label="Navigation principale"
        className="hidden md:block border-t border-white/10"
      >
        <Container className="flex items-center justify-around gap-2 py-1">
          <CategoryMenuDynamic />
          <HeaderMenu />
        </Container>
      </nav>

      {/* ─── Menu mobile déroulant ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay de fond - clic pour fermer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden relative z-50 bg-shop_light_brown border-t border-white/10 shadow-2xl overflow-hidden"
            >
              {/* En-tête du menu */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10">
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="text-white/60 hover:text-shop_orange hoverEffect"
                >
                  <X size={18} />
                </button>
              </div>

              <nav
                aria-label="Navigation mobile"
                className="flex flex-col gap-4 px-4 pt-4 pb-5"
              >
                <CategoryMenuDynamic
                  mobile
                  onNavigate={() => setMobileMenuOpen(false)}
                />

                <div className="h-px bg-white/10" />

                <HeaderMenu
                  mobile
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
