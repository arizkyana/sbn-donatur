# SBN Donatur

Aplikasi publik SBN Crowdfunding Platform (`sobatbaik.org`) untuk donatur: melihat campaign, berdonasi lewat Midtrans Snap, membaca blog, dan melihat riwayat donasi. Tampilannya mobile-first dengan Bottom Navigation. Dibangun dengan Next.js 16, Supabase (Database, Auth), Tailwind, dan shadcn.

Repository terkait:

- [`sbn-supabase`](https://github.com/arizkyana/sbn-supabase): migration database, storage, dan generate types.
- [`sbn-office`](https://github.com/arizkyana/sbn-office): panel admin untuk mengelola campaign, transaksi, donatur, blog, dan pengaturan.

## Prasyarat

- Node.js ≥ 20.9 dan npm
- Akses ke Supabase project SBN (URL, publishable key, dan service role key)
- Akun Midtrans sandbox dan API key Resend, untuk alur donasi dan email bukti donasi

## Menjalankan di lokal

```bash
npm install
# buat .env.local dan isi variabel di bawah
npm run dev
```

Buka http://localhost:3000. Halaman donatur bisa dibuka tanpa login, kecuali `/akun` dan `/akun/riwayat`.

Bila `sbn-office` juga berjalan di port 3000, jalankan donatur di port lain (`npm run dev -- -p 3001`) dan sesuaikan `NEXT_PUBLIC_SITE_URL`.

Perintah lain:

```bash
npm run build      # production build
npm run start      # menjalankan hasil build
npm run lint       # ESLint
npx tsc --noEmit   # type check
```

## Environment variables

Ditulis di `.env.local` (tidak di-commit). Rujukan lengkap ada di tabel Environment variables pada `planning/init.md`.

| Variabel | Keterangan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Hanya di server. Untuk insert/update transaksi donasi |
| `MIDTRANS_SERVER_KEY` | Hanya di server. Untuk membuat Snap token dan memverifikasi notifikasi Midtrans |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Client key Midtrans Snap |
| `MIDTRANS_IS_PRODUCTION` | `false` sampai go-live |
| `RESEND_API_KEY` | Hanya di server. Untuk email bukti donasi |
| `NEXT_PUBLIC_SITE_URL` | URL publik aplikasi, untuk link di email dan Open Graph. Lokal: `http://localhost:3000` |

Variabel berawalan `NEXT_PUBLIC_` ditanam ke kode saat `npm run build`. Bila nilainya berubah, build ulang aplikasinya.

## Database types

`lib/supabase/database.types.ts` di-generate dari skema Supabase. Setiap ada migration baru, jalankan dari repository `sbn-supabase`:

```bash
npm run db:types
```

Lalu commit file types yang berubah di repository ini.

## Deploy ke VPS

Mengikuti FND016 di `planning/001-fondasi.md`:

1. Siapkan VPS dengan Node.js ≥ 20.9, Nginx, certbot, dan PM2.
2. Clone repository, lalu buat `.env.local` di server sebelum build. Environment variables tidak disimpan di repository. Isi `NEXT_PUBLIC_SITE_URL` dengan domain aplikasi.
3. Build dan jalankan dengan port khusus untuk aplikasi ini:

   ```bash
   npm ci
   npm run build
   pm2 start npm --name sbn-donatur -- start -- -p <port>
   ```

4. Atur Nginx sebagai reverse proxy ke `<port>` untuk domain donatur (production: `sobatbaik.org`), lalu pasang SSL dengan certbot.
5. Di Supabase Dashboard → Authentication → URL Configuration, tambahkan URL aplikasi ke Redirect URLs.
6. Di dashboard Midtrans, arahkan Payment Notification URL ke `https://<domain>/api/midtrans/notification`.
