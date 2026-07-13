import Link from "next/link";
import { Zap } from "lucide-react";
import { Kablammo } from "next/font/google";

const spaceGrotesk = Kablammo({
  subsets: ["latin"],
  weight: "400",
});

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 md:gap-3 group select-none"
    >
      {/* Icône */}
      <div className="relative flex items-center justify-center w-8 h-8 md:w-11 md:h-11 bg-shop_orange rounded-lg md:rounded-xl shadow-lg group-hover:shadow-shop_orange/40 group-hover:scale-105 transition-all duration-300">
        <span
          className={`text-white font-extrabold text-lg md:text-3xl p-0.5 tracking-tight ${spaceGrotesk.className}`}
        >
          T
        </span>
        <Zap className="w-4 h-4 md:w-6 md:h-6 text-white fill-white drop-shadow" />
      </div>

      {/* Texte */}
      <div className="flex flex-col leading-none gap-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-white font-extrabold text-base md:text-2xl tracking-tight">
            <span className={`${spaceGrotesk.className}`}> T</span>
            hiam
          </span>
          <span className="text-shop_orange font-extrabold text-base md:text-2xl tracking-tight inline-flex items-center">
            <Zap className="w-3.5 h-3.5 md:w-5 md:h-5 fill-shop_orange stroke-shop_orange" />
            mart
          </span>
        </div>
        <span className="hidden sm:block text-white/50 text-[10px] font-medium tracking-[0.25em] uppercase">
          Électroménager
        </span>
      </div>
    </Link>
  );
}

export default Logo;
