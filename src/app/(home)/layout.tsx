import React from "react";
import PagesLayout from "@/layouts/PagesLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PagesLayout>{children}</PagesLayout>;
}
