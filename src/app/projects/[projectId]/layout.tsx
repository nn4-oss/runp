import React from "react";
import EditorLayout from "@/layouts/EditorLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <EditorLayout>
      <div className="w-100 h-100 p-medium-40">{children}</div>
    </EditorLayout>
  );
}
