"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

function LangSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();

  const switchLang = () => {
    const newLocale = locale === "fr" ? "en" : "fr";

    // Encode le pathname pour éviter les erreurs avec les paramètres d'URL
    const encodedRedirect = encodeURIComponent(pathname);

    // Appelle l'API qui pose le cookie puis redirige vers la page d'origine
    window.location.href = `/api/set-locale?locale=${newLocale}&redirect=${encodedRedirect}`;
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