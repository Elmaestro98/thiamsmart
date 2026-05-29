// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "never",
});

export default clerkMiddleware((auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/") || pathname.startsWith("/trpc/")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|studio|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
