import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import {
  ActiveBottomNavigation,
  BottomNavigation,
  Footer,
  Header,
} from "@/components/layout";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full bg-background md:bg-muted">
        <Providers>
          {/* group/app: Footer menambah ruang bawah bila halaman punya sticky bar. */}
          <div className="group/app mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background md:shadow-sm">
            <Header />
            <main className="flex-1">{children}</main>
            {/* Footer memberi ruang untuk Bottom Navigation agar konten tidak tertutup. */}
            <Footer />
            <Suspense fallback={<BottomNavigation activeHref={null} />}>
              <ActiveBottomNavigation />
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
