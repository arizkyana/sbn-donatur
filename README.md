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

Buka http://localhost:3002. Halaman donatur bisa dibuka tanpa login, kecuali `/akun` dan `/akun/riwayat`.

Dev server donatur memakai port 3002 (`next dev --port 3002`) karena port 3000 dipakai `sbn-office`. Isi `NEXT_PUBLIC_SITE_URL` lokal dengan `http://localhost:3002`, karena link email, redirect setelah bayar, dan URL notifikasi Midtrans dibentuk dari variabel ini.

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
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Client key Midtrans Snap. Belum dipakai: pembayaran memakai redirect Snap, bukan popup Snap.js |
| `MIDTRANS_IS_PRODUCTION` | `false` sampai go-live |
| `RESEND_API_KEY` | Hanya di server. Untuk email bukti donasi |
| `EMAIL_FROM` | Pengirim email bukti donasi, contoh `Sobat Baik Nusantara <donasi@sobatbaik.org>`. Sebelum domain terverifikasi di Resend, pakai `onboarding@resend.dev` (hanya bisa mengirim ke email pemilik akun Resend) |
| `NEXT_PUBLIC_SITE_URL` | URL publik aplikasi. Dipakai untuk link di email, redirect setelah bayar (`callbacks.finish`), URL notifikasi Midtrans, dan Open Graph. Lokal: `http://localhost:3002` |

Variabel berawalan `NEXT_PUBLIC_` ditanam ke kode saat `npm run build`. Bila nilainya berubah, build ulang aplikasinya.

## Menguji webhook Midtrans di lokal

Midtrans tidak bisa mengirim notifikasi ke `localhost`, jadi buka dev server ke publik lewat tunnel:

1. Jalankan `npm run dev`, lalu `ngrok http 3002`.
2. Isi `NEXT_PUBLIC_SITE_URL` dengan URL `https://...ngrok-free.app` dari ngrok, lalu restart `npm run dev` (nilai `NEXT_PUBLIC_*` dibaca saat kompilasi). Domain ngrok sudah ada di `allowedDevOrigins`.
3. Berdonasi dari `https://...ngrok-free.app/campaign/<slug>/donasi`, pilih metode di Snap, lalu bayar lewat [Midtrans Payment Simulator](https://simulator.sandbox.midtrans.com) (contoh BCA VA).
4. Midtrans mengirim notifikasi ke `<tunnel>/api/midtrans/notification`. Respons webhook terlihat di http://127.0.0.1:4040. Halaman status berubah menjadi berhasil, dan link di email bukti donasi membuka `<tunnel>/donasi/<order_id>`.

Transaksi yang dibuat saat `NEXT_PUBLIC_SITE_URL` masih `localhost` tidak akan menerima notifikasi, karena URL notifikasinya ikut tersimpan di Midtrans saat transaksi dibuat. Kembalikan `NEXT_PUBLIC_SITE_URL` ke `http://localhost:3002` setelah selesai.

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
6. Di dashboard Midtrans, arahkan Payment Notification URL ke `https://<domain>/api/midtrans/notification`. Transaksi dari aplikasi juga mengirim header `X-Override-Notification` ke `${NEXT_PUBLIC_SITE_URL}/api/midtrans/notification`, jadi notifikasi transaksi selalu kembali ke deployment yang membuatnya; URL di dashboard tetap dipakai untuk tombol "Test notification".
