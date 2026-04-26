import Link from "next/link";
import { Zap } from "lucide-react";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group select-none">
      {/* Icône */}
      <div className="relative flex items-center justify-center w-11 h-11 bg-shop_orange rounded-xl shadow-lg group-hover:shadow-shop_orange/40 group-hover:scale-105 transition-all duration-300">
        <Zap className="w-6 h-6 text-white fill-white drop-shadow" />
        <span className="absolute -bottom-1.5 -right-1.5 text-xs leading-none">
          🔌
        </span>
      </div>

      {/* Texte */}
      <div className="flex flex-col leading-none gap-0.5">
        <div className="flex items-baseline gap-1">
          <span className="text-white font-extrabold text-2xl tracking-tight">
            Thiam
          </span>
          <span className="text-shop_orange font-extrabold text-2xl tracking-tight">
            Smart
          </span>
        </div>
        <span className="text-white/50 text-[10px] font-medium tracking-[0.25em] uppercase">
          Électroménager
        </span>
      </div>
    </Link>
  );
}

export default Logo;