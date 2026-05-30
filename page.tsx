"use client";

import { NextStudio } from "next-sanity/studio";
import { config } from "process";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
