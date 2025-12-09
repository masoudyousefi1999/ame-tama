import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance
  poweredByHeader: false, // Remove X-Powered-By header

  // Modern browser support
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console logs in production
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
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
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
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
    // Cache optimized images for ~30 days to satisfy Lighthouse caching
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: "default",
    unoptimized: true,
  },
  // Enable compression
  compress: true,
  // Optimize bundle
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
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Webpack optimizations (only for production builds, not Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Only apply webpack optimizations in production builds
    if (!dev && !isServer && process.env.NODE_ENV === "production") {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 5000,
        maxSize: 100000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
            maxSize: 80000,
          },
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: "radix-ui",
            chunks: "async",
            priority: 20,
            maxSize: 30000,
          },
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: "next",
            chunks: "all",
            priority: 30,
            maxSize: 60000,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "async",
            priority: 5,
            maxSize: 20000,
          },
        },
      };

      // Optimize for modern browsers
      config.target = ["web", "es2020"];

      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
