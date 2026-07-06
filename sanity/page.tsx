"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../sanity.config";
import { StudioProvider } from "sanity";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
