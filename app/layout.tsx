import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import {
  ActiveBottomNavigation,
  BottomNavigation,
  Header,
} from "@/components/layout";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Sobat Baik Nusantara",
    template: "%s | Sobat Baik Nusantara",
  },
  description:
    "Salurkan donasi untuk program kebaikan Sobat Baik Nusantara secara mudah dan transparan.",
};

export const viewport: Viewport = {
  // Sama dengan latar header agar bilah browser HP menyatu dengan header.
  themeColor: "#ffffff",
  // Konten sampai ke tepi layar iPhone; Bottom Navigation memakai safe-area-inset-bottom.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        plusJakartaSans.variable,
      )}
    >
      <body className="min-h-full bg-background md:bg-muted">
        <Providers>
          <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background md:shadow-card">
            <Header />
            {/* Ruang untuk Bottom Navigation (h-16 + safe area) agar konten tidak tertutup. */}
            <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))]">
              {children}
            </main>
            <Suspense fallback={<BottomNavigation activeHref={null} />}>
              <ActiveBottomNavigation />
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
