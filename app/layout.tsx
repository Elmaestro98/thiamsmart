import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { SanityLive } from "@/sanity/lib/live";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

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
  verification: {
    google: "RV0Uz9UYGIEMZK4eR-D3eEZCWCLg-vNpjREOh3Y4kEk",
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
        {process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <SanityLive />
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