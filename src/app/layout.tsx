import RootLayout from "@/layouts/RootLayout";
import type { Metadata } from "next";

const metadataHead = {
  title: "Runp",
  description: "Build production ready apps and features by chatting with AI.",
};

export const metadata: Metadata = {
  ...metadataHead,
  openGraph: {
    ...metadataHead,
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "runp Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    ...metadataHead,
    card: "summary_large_image",
    images: [""],
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayout>{children}</RootLayout>;
}
