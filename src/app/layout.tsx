import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { DemoDirector } from "@/components/demo/demo-director";
import { ToastBridge } from "@/components/shared/toast-bridge";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NIGHTLINK — Enter the room. Feel the crowd. Find your table.",
  description:
    "18+ virtual nightlife and social-presence platform. Investor demo — mock rooms, crowd, tables, and DJ mode.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${outfit.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <TooltipProvider>
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Suspense fallback={null}>
              <DemoDirector />
            </Suspense>
            <ToastBridge />
            <Toaster theme="dark" position="top-center" richColors />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
