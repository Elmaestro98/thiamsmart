// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "never",
});

const BYPASS_PATHS = [
  "/sitemap.xml",
  "/robots.txt",
  "/opengraph-image",
  "/icon.svg",
];

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/trpc/") ||
    BYPASS_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|studio|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
