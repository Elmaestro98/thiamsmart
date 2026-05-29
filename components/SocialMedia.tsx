import React from "react";
import Link from "next/link";
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "./ui/tooltip";
import { FaTiktok, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { Instagram } from "lucide-react";

import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
// TooltipContent imported from ./ui/tooltip above
const socialLink = [
  {
    title: "Tiktok",
    href: "https://vm.tiktok.com/ZMHKWty1C5YdC-MfHpv/",
    icon: <FaTiktok className="w-5 h-5" />,
  },

  {
    title: "WhatsApp",
    href: "#",
    icon: <FaWhatsapp className="w-5 h-5" />,
  },

  {
    title: "Facebook",
    href: "https://www.facebook.com/share/17ctSdWH6C/",
    icon: <FaFacebook className="w-5 h-5" />,
  },

  {
    title: "Instagram",
    href: "https://www.instagram.com/lbc_ugb?igsh=NHNjemltOG45cmIz",
    icon: <Instagram className="w-5 h-5" />,
  },
  {
    title: "Email",
    href: "#",
    icon: <Mail className="w-5 h-5" />,
  },
];

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

function SocialMedia({ className, iconClassName, tooltipClassName }: Props) {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLink?.map((item, idx) => (
          <Tooltip key={`${item?.title}-${idx}`}>
            <TooltipTrigger>
              <Link
                href={item?.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full hover:text-white hover:border-shop_orange hoverEffect",
                  iconClassName,
                )}
              >
                {item?.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-shop_orange text-white font-semibold", // This line is correct, no change needed here.
                tooltipClassName,
              )}
            >
              {item?.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

export default SocialMedia;
