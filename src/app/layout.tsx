import RootLayout from "@/layouts/RootLayout";
import type { Metadata, Viewport } from "next";

const siteUrl = "https://runp.dev";
const siteName = "Runp";
const appTitle = "Runp | Foundation UI";
const appDescription =
  "Build features at the speed of thought. Generate, iterate, and ship UI with AI-assisted workflows.";

const ogImage = {
  url: `${siteUrl}/og.jpg`,
  width: 1200,
  height: 630,
  alt: "Runp — Build features at the speed of thought",
};

export const metadata: Metadata = {
  title: {
    default: appTitle,
    template: "%s | Runp",
  },

  description: appDescription,
  applicationName: siteName,

  keywords: [
    "Runp",
    "Foundation UI",
    "AI UI builder",
    "UI generation",
    "AI design",
    "v0.dev alternative",
    "Lovable alternative",
    "React",
    "Next.js",
    "Tailwind",
    "Design to code",
    "Vibe coding",
    "Rapid prototyping",
  ],

  authors: [{ name: "Nicolas Nunes", url: "https://github.com/nnsncl" }],
  creator: "Runp",
  publisher: "Runp",
  generator: "Next.js",

  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },

  category: "technology",
  classification: "Software",
  referrer: "strict-origin-when-cross-origin",

  // Open Graph
  openGraph: {
    title: appTitle,
    description: appDescription,
    url: siteUrl,
    siteName,
    images: [ogImage],
    locale: "en_US",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: appTitle,
    description: appDescription,
    images: [ogImage.url],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}
