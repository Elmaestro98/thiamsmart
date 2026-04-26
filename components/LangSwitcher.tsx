"use client";
import Image from "next/image";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../navigation"; // ← le vôtre

function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLang = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={switchLang}
      className="flex items-center gap-1.5 hover:opacity-80 hoverEffect"
      title={locale === "fr" ? "Switch to English" : "Passer en Français"}
    >
      <Image
        src={locale === "fr" ? "/flags/la-france.png" : "/flags/drapeauus.png"}
        alt={locale === "fr" ? "Français" : "English"}
        width={20}
        height={14}
        className="rounded-sm object-cover"
      />
      <span className="text-white/70 text-xs font-semibold uppercase">
        {locale === "fr" ? "FR" : "EN"}
      </span>
    </button>
  );
}

export default LangSwitcher;