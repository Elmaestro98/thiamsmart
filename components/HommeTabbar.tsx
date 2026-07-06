"use client";
import { productType } from "@/app/constants/data";
import Link from "next/link";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex flex-col mt-2 gap-3 sm:flex-row sm:items-center sm:justify-between sm:flex-wrap">
      {/* Tabs — scroll horizontal sur mobile */}
      <div
        className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-sm font-semibold w-max sm:w-auto">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`
                flex-shrink-0 whitespace-nowrap
                border px-3 py-2 sm:px-4 sm:py-1.5 md:px-6 md:py-2
                text-xs sm:text-sm
                rounded-full hoverEffect transition-all duration-200
                ${
                  selectedTab === item?.title
                    ? "bg-shop_orange text-white border-shop_light_green shadow-md scale-105"
                    : "bg-shop_light_brown border-shop_light_green/30 text-white hover:bg-shop_orange hover:border-shop_light_green hover:text-white"
                }
              `}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>

      {/* Voir plus */}
      <Link
        href={"/shop"}
        className="self-end sm:self-auto flex-shrink-0 whitespace-nowrap border border-darkColor px-4 py-2 sm:py-1.5 text-xs sm:text-sm rounded-full hover:bg-shop_light_brown hover:text-white hover:border-shop_light_green hoverEffect transition-all duration-200"
      >
        Voir plus →
      </Link>
    </div>
  );
};

export default HomeTabbar;
