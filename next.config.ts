import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST?.trim();

if (mediaHost && /[/:]/.test(mediaHost)) {
  throw new Error("NEXT_PUBLIC_MEDIA_HOST must be a bare hostname, e.g. media.alterstay.in");
}
if (!mediaHost && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_MEDIA_HOST is required for production builds");
}

const mediaPatterns: RemotePattern[] = mediaHost
  ? [{ protocol: "https", hostname: mediaHost, pathname: "/**" }]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...mediaPatterns,
    ],
  },
  allowedDevOrigins: ["192.168.1.18"],
};

export default nextConfig;
