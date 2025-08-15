import StyledComponentsRegistry from "@/lib/styles-registry";

import { ClientProvider } from "@/providers";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StyledComponentsRegistry>
      <TRPCReactProvider>
        <ClientProvider>
          <Toaster
            toastOptions={{
              style: {
                borderRadius: "var(--measurement-medium-30)",
                borderColor: "var(--font-color-alpha-10)",
                background: "var(--body-color)",
                color: "var(--font-color)",
                fontSize: "var(--fontsize-medium-10)",
              },
            }}
          />

          <html lang="en">
            <body>
              {children}
              <div id="portal-container" />
            </body>
          </html>
        </ClientProvider>
      </TRPCReactProvider>
    </StyledComponentsRegistry>
  );
}
