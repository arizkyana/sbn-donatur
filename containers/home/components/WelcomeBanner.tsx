import Link from "next/link";
import { SearchIcon } from "lucide-react";

// Teks sambutan sementara sampai ada teks dari klien (D3 backlog 008).
export default function WelcomeBanner() {
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden rounded-b-3xl bg-linear-to-br from-primary to-primary-strong px-5 pt-6 pb-14 text-primary-foreground">
        {/* Ornamen dekoratif, tanpa gambar. */}
        <span
          aria-hidden
          className="absolute -top-12 -right-10 size-44 rounded-full bg-white/10"
        />
        <span
          aria-hidden
          className="absolute right-20 -bottom-14 size-28 rounded-full bg-white/10"
        />
        <div className="relative flex flex-col gap-2">
          <p className="text-sm font-medium text-white/85">Halo, Sobat Baik</p>
          <h1 className="text-2xl leading-tight font-bold">
            Mari berbagi kebaikan hari ini
          </h1>
          <p className="text-base text-white/85">
            Salurkan donasimu untuk program Sobat Baik Nusantara.
          </p>
        </div>
      </div>
      {/* Kolom cari hanya pintu ke halaman pencarian. */}
      <Link
        href="/cari"
        className="relative z-10 mx-4 -mt-7 flex h-14 items-center gap-3 rounded-xl bg-card px-4 text-base text-muted-foreground shadow-card outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <SearchIcon className="size-5 text-primary" />
        Cari campaign kebaikan…
      </Link>
    </div>
  );
}
