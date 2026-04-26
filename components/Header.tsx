"use client"
import Container from "./Container";
import Logo from "./Logo";
import CartIcon from "./CartIcon";
import LangSwitcher from "./LangSwitcher";
import FavoriteButton from "./FavoriteButton";
import HeaderMenu from "./HeaderMenu";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import SignIn from "./SignIn";
import { Logs, LayoutGrid, ChevronDown, Tv, Refrigerator, Wind, WashingMachine, Microwave } from "lucide-react";
import Link from "next/link";
import { ClerkLoaded, UserButton, useUser } from "@clerk/nextjs";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

const categories = [
  { title: "Télévision", href: "/shop?category=television", icon: "📺" },
  { title: "Réfrigérateur", href: "/shop?category=refrigerateur", icon: "🧊" },
  { title: "Climatiseur", href: "/shop?category=climatiseur", icon: "❄️" },
  { title: "Machine à laver", href: "/shop?category=machine-a-laver", icon: "🌀" },
  { title: "Cuisinière", href: "/shop?category=cuisiniere", icon: "🍳" },
  { title: "Micro-ondes", href: "/shop?category=micro-ondes", icon: "📡" },
  { title: "Aspirateur", href: "/shop?category=aspirateur", icon: "🌪️" },
  { title: "Fer à repasser", href: "/shop?category=fer-a-repasser", icon: "👔" },
];

const Header = () => {
  const { user } = useUser();

  return (
    <header className="bg-shop_light_brown shadow-lg">
      {/* Barre supérieure */}
      <div className="bg-shop_light_brown/90 py-1 hidden md:block border-b border-white/10">
        <Container className="flex items-center justify-between">
          <p className="text-white/60 text-xs">
            Livraison rapide partout au Sénégal 
          </p>
          <div className="flex items-center gap-4 text-white/60 text-xs">
            <div>
                    {/*Drapeau Francais et Américain */}
                        <LangSwitcher/>

                     {/*Icon de switch de langage */}

                   
            </div>

        
            <div>
               {/*Reseaux sociaux */}

            </div>
            <Link href="/faq" className="hover:text-white hoverEffect">FAQ</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white hoverEffect">Contact</Link>
            <span>|</span>
            <Link href="/about" className="hover:text-white hoverEffect">À propos</Link>
          </div>
        </Container>
      </div>

      {/* Ligne principale — Logo + Recherche + Icônes */}
      <div className="py-4 ">
        <Container className="flex items-center justify-between gap-4">
          {/* Gauche */}
          <div className="flex items-center gap-3">
            {/*<MobileMenu />*/}
            <Logo />
          </div>

          {/* Centre — Recherche */}
          <div className="hidden md:flex flex-1 max-w-2xl">
           {/* <SearchBar />*/}
          </div>

          {/* Droite — Icônes */}
          <div className="flex items-center gap-5">
            <FavoriteButton />
            <CartIcon />
            {user && (
              <Link
                href="/orders"
                className="relative text-white hover:text-shop_orange hoverEffect"
                title="Mes commandes"
              >
                <Logs size={22} />
                <span className="absolute -top-1.5 -right-1.5 bg-shop_orange text-white h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center">
                  0
                </span>
              </Link>
            )}
            <ClerkLoaded>
              {user ? <UserButton /> : <SignIn />}
            </ClerkLoaded>
          </div>
        </Container>
      </div>

      {/* Ligne 2 — Catégories + Navigation */}
      <div className="hidden md:block py-0">
        <Container className="flex items-center justify-around gap-2">
          {/* Dropdown Catégories */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 bg-shop_light_bg text-white px-5 py-3 font-bold text-sm rounded-t-sm  hoverEffect h-full">
              <LayoutGrid className="text-shop_light_brown" size={18} />
              <span className="text-shop_light_brown">Toutes les catégories</span>
              <ChevronDown className="text-shop_light_brown" size={15} />
            </MenuButton>

            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <MenuItems className="absolute left-0 top-full mt-0 w-64 bg-white rounded-b-xl shadow-2xl z-50  focus:outline-none overflow-hidden border border-gray-100">
                {categories.map((cat) => (
                  <MenuItem key={cat.title}>
                    <Link
                      href={cat.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm  text-shop_light_brown hover:bg-shop_light_brown/90 hover:text-shop_light_bg border-b border-gray-50 last:border-0 transition-colors duration-150"
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="font-poppins">{cat.title}</span>
                    </Link>
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>

          

          {/* Menu navigation */}
          <HeaderMenu />
        </Container>
      </div>

      {/* Recherche mobile */}
      <div className="md:hidden px-4 pb-3 pt-1">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;