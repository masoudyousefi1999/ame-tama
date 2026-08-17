import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  swcMinify: true,
  reactStrictMode: false,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOSTNAME,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ame-tama.storage.c2.liara.space",
        port: "",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 600, 800],
    formats: ["image/webp", "image/avif"],
    qualities: [30, 60, 70, 75, 80, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: "custom",
    loaderFile: "./image-loader.js",
    unoptimized: process.env.NODE_ENV === "production" ? false : true,
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Allow Enamad's trust-seal page to iframe the homepage preview.
            // X-Frame-Options: DENY blocks that iframe (and CSP frame-ancestors
            // is ignored while DENY is present), so we use CSP instead.
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://trustseal.enamad.ir https://enamad.ir https://www.enamad.ir https://reg.enamad.ir https://reg2.enamad.ir",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-toast",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "zod",
      "date-fns",
      "react-day-picker",
      "react-hook-form",
      "react-resizable-panels",
      "recharts",
      "schema-dts",
      "sonner",
      "tailwind-merge",
      "tailwindcss-animate",
      "vaul",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
