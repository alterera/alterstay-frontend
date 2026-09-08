import type { Metadata } from "next";

import { BlogPage } from "@/components/static/blog-page";

export const metadata: Metadata = {
  title: "Blog",
  description: "Travel stories and updates from Alterstay.",
};

export default function BlogRoutePage() {
  return <BlogPage />;
}
