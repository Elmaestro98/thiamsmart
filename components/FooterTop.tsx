import { Clock, Mail, MapPin, Phone } from "lucide-react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href?: string;
}

const data: ContactItemData[] = [
  {
    title: "Visitez-nous",
    subtitle: "Dakar pikine - Sedima",
    icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />,
    href: "https://maps.google.com/?q=Smart+Technology+Keur massar+Dakar+Senegal",
  },
  {
    title: "Appelez-nous",
    subtitle: "+221 763853811",
    icon: <Phone className="h-5 w-5 sm:h-6 sm:w-6" />,
    href: "tel:+221763853811",
  },
  {
    title: "Email",
    subtitle: "smarttechnologiekeurmassar@gmail.com",
    icon: <Mail className="h-5 w-5 sm:h-6 sm:w-6" />,
    href: "mailto:smarttechnologiekeurmassar@gmail.com",
  },
  {
    title: "Horaires",
    subtitle: "9H — 21H",
    icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
  },
];

function FooterTop() {
  return (
    <div
      id="contact"
      className="grid grid-cols-2 lg:grid-cols-4 border-b border-white/10 divide-x divide-y lg:divide-y-0 divide-white/10"
    >
      {data?.map((item, index) => {
        const Wrapper = item.href ? "a" : "div";
        const wrapperProps = item.href
          ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
          : {};

        return (
          <Wrapper
            key={index}
            {...(wrapperProps as any)}
            className="flex items-center gap-2 sm:gap-4 group p-3 sm:p-5 lg:p-6 hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            {/* Icône avec fond coloré */}
            <div className="flex-shrink-0 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-shop_orange/10 flex items-center justify-center text-shop_orange group-hover:bg-shop_orange group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>

            {/* Texte */}
            <div className="min-w-0 flex-1">
              <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-sm font-semibold text-white mt-0.5 group-hover:text-shop_orange transition-colors duration-200 break-words leading-snug">
                {item.subtitle}
              </p>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}

export default FooterTop;
