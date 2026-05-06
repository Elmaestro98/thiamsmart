"use client";

import Container from "./Container";
import Logo from "./Logo";
import CartIcon from "./CartIcon";

import LangSwitcher from "./LangSwitcher";
import FavoriteButton from "./FavoriteButton";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import SignIn from "./SignIn";
import CategoryMenuDynamic from "./CategoryMenuDynamic";

import { Logs, Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { ClerkLoaded, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";

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

          <nav
            aria-label="Liens utiles"
            className="flex items-center gap-4 text-white/60 text-xs"
          >
            <LangSwitcher />

            <Link href="/faq" className="hover:text-white hoverEffect">
              FAQ
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/contact" className="hover:text-white hoverEffect">
              Contact
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/about" className="hover:text-white hoverEffect">
              À propos
            </Link>
          </nav>
        </Container>
      </div>

      {/* ─── Ligne principale : Logo + Recherche + Icônes ─── */}
      <div className="py-4">
        <Container className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center justify-center w-[100%]">
            <SearchBar />
          </div>

          {/* Icônes d'action */}
          <div className="flex items-center gap-5">
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

            {/* Bouton menu mobile */}
            <button
              className="md:hidden text-white hover:text-shop_orange hoverEffect"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </Container>
      </div>

      {/* ─── Recherche mobile ─── */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

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
      {mobileMenuOpen && (
        <div className="md:hidden bg-shop_light_brown/95 border-t border-white/10 px-4 pb-4">
          <nav
            aria-label="Navigation mobile"
            className="flex flex-col gap-3 pt-3"
          >
            <CategoryMenuDynamic />
            <HeaderMenu />
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
