import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import {
  ActiveBottomNavigation,
  BottomNavigation,
  FloatingContactButton,
  Footer,
  Header,
  LogoProvider,
} from "@/components/layout";
import { getLogoSrc } from "@/lib/settings";
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

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: {
      default: "Sobat Baik Nusantara",
      template: "%s | Sobat Baik Nusantara",
    },
    description:
      "Salurkan donasi untuk program kebaikan Sobat Baik Nusantara secara mudah dan transparan.",
    // Favicon mengikuti logo di pengaturan office.
    icons: { icon: await getLogoSrc() },
  };
}

export const viewport: Viewport = {
  // Sama dengan latar header agar bilah browser HP menyatu dengan header.
  themeColor: "#ffffff",
  // Konten sampai ke tepi layar iPhone; Bottom Navigation memakai safe-area-inset-bottom.
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Di-cache (lib/settings.ts), jadi tidak menunda kerangka statis halaman.
  const logoSrc = await getLogoSrc();

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
          <LogoProvider src={logoSrc}>
            {/* group/app: Footer menambah ruang bawah bila halaman punya sticky bar. */}
            <div className="group/app mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background md:shadow-card">
              <Header />
              <main className="flex-1">{children}</main>
              {/* Footer memberi ruang untuk Bottom Navigation agar konten tidak tertutup. */}
              <Footer />
              {/* Membaca nomor admin dari settings; tanpa nomor, tombol tidak tampil. */}
              <Suspense fallback={null}>
                <FloatingContactButton />
              </Suspense>
              <Suspense fallback={<BottomNavigation activeHref={null} />}>
                <ActiveBottomNavigation />
              </Suspense>
            </div>
          </LogoProvider>
        </Providers>
      </body>
    </html>
  );
}
