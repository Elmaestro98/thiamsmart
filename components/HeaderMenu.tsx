"use client";
import { usePathname } from "next/navigation";
import { headerData } from "../app/constants/data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderMenuProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

function HeaderMenu({ mobile = false, onNavigate }: HeaderMenuProps) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        {headerData?.map((item) => {
          const isActive = pathname === item?.href;
          return (
            <Link
              key={item?.title}
              href={item?.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold capitalize transition-colors",
                isActive
                  ? "bg-shop_orange/15 text-shop_orange"
                  : "text-white hover:bg-white/5 hover:text-shop_orange",
              )}
            >
              {item?.title}
              <ChevronRight
                size={16}
                className={isActive ? "text-shop_orange" : "text-white/30"}
              />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center flex-wrap gap-x-4 gap-y-2 lg:gap-x-7 text-sm capitalize font-semibold text-lightColor">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`whitespace-nowrap text-white hover:text-lightOrange hoverEffect relative group
            ${pathname === item?.href && "text-lightOrange"}`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-lightOrange group-hover:w-1/2
              hoverEffect group-hover:left-0 ${
                pathname === item?.href && "w-1/2"
              }`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-lightOrange
              group-hover:w-1/2 hoverEffect group-hover:right-0
              ${pathname === item?.href && "w-1/2"}`}
          />
        </Link>
      ))}
    </div>
  );
}

export default HeaderMenu;
