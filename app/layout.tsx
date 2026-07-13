import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thiamsmart.com"),
  title: {
    default: "ThiamSmart — Électroménager en ligne au meilleur prix",
    template: "%s | ThiamSmart",
  },
  description:
    "Commandez et achetez tous vos produits électroménagers en un clic : livraison rapide, prix compétitifs et large choix pour la maison.",
  keywords: [
    "électroménager",
    "électroménager en ligne",
    "achat électroménager",
    "ThiamSmart",
  ],
  openGraph: {
    type: "website",
    siteName: "ThiamSmart",
    locale: "fr_FR",
    title: "ThiamSmart — Électroménager en ligne au meilleur prix",
    description:
      "Commandez et achetez tous vos produits électroménagers en un clic : livraison rapide, prix compétitifs et large choix pour la maison.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const RootLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const locale = await getLocale();
  const messages = await getMessages(); // Récupère les messages pour la locale active

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ThiamSmart",
    url: "https://thiamsmart.com",
    logo: "https://thiamsmart.com/icon.svg",
  };

  return (
    <html lang={locale} className={poppins.variable}>
      <body className="font-poppins antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#66030E",
                color: "#fff",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;