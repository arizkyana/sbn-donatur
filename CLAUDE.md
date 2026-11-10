# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Konteks Project

`sbn-donatur` adalah app publik untuk donatur **SBN Crowdfunding Platform** (domain `sobatbaik.org`). Repo ini bagian dari workspace `../../` yang **bukan monorepo** (tiap folder punya repo git sendiri):

- `../sbn-office`: panel admin. Ini **implementasi acuan**: pola kode donatur disamakan dengan office, jadi lihat file di sana sebelum membuat yang setara di sini (`lib/supabase/*`, `lib/types.ts`, `lib/utils.ts`, `app/providers.tsx`). `containers/auth/login/` di office adalah contoh lengkap pola form (schema, action, hook, form).
- `../sbn-supabase`: migration, RLS, storage bucket, dan generate types. Skema database diubah di sana, bukan di sini. `npm run db:types` di repo itu menulis ulang `lib/supabase/database.types.ts` di kedua app, jadi file ini jangan diedit manual.
- `../../planning/init.md`: spesifikasi utama (routes, data model, RLS, alur Midtrans, design pattern). `../../planning/001-fondasi.md`: backlog fondasi; task khusus donatur adalah `FND014` (samakan fondasi dengan office) dan `FND015` (layout + bottom navigation). `../../planning/002-campaign.md`: backlog campaign; task donatur adalah `CMP007`–`CMP012`. `../../planning/003-donasi-midtrans.md`: backlog donasi (`DON001`–`DON009`), dengan rencana teknis di `003-donasi-midtrans-rencana.md`. `../../planning/005-akun-donatur.md`: backlog akun donatur; task donatur adalah `AKN003`–`AKN008` (AKN001/AKN002 di sbn-supabase dan dashboard Supabase, AKN009–AKN011 di office). `../../planning/006-blog.md`: backlog blog; task donatur adalah bagian donatur `BLG001` dan `BLG006`–`BLG008` (bagian office `BLG001` serta `BLG002`–`BLG005` di office), dengan rencana di `006-blog-rencana.md`. `../../planning/008-tampilan-donatur.md`: backlog tampilan donatur (`UIX001`–`UIX010`). Baca dokumen ini sebelum mengerjakan fitur.

Fondasi sudah selesai (FND014, FND015): Supabase client, `proxy.ts` (refresh session), `lib/auth.ts`, `app/providers.tsx` (Tanstack Query + `<Toaster />`), warna brand, serta layout mobile-first dengan header dan Bottom Navigation (`components/layout/`). Modul campaign ada di `containers/home/` (beranda: banner sambutan dan daftar campaign), `containers/search/` (`/cari`), dan `containers/campaign/detail/` (`/campaign/[slug]`). Modul donasi (DON001–DON008) ada di `containers/donation/`: `form/` (`/campaign/[slug]/donasi`), `notification/` (webhook), dan `status/` (`/donasi/[order_id]`), ditambah email bukti donasi di `lib/email/`. Modul akun donatur (AKN003–AKN008) ada di `containers/auth/` (`confirm/`, `register/` `/daftar`, `login/` `/login`, `forgot-password/` `/lupa-password`, `reset-password/` `/atur-ulang-password`) dan `containers/account/` (`profile/` `/akun`, `history/` `/akun/riwayat`). Modul blog (BLG006–BLG008) ada di `containers/blog/` (`list/` `/blog`, `detail/` `/blog/[slug]`), ditambah `app/sitemap.ts` dan `app/robots.ts`. Halaman S&K dan tentang belum ada.

Route yang direncanakan:

| Route                                 | Halaman                                                               | Login |
| ------------------------------------- | --------------------------------------------------------------------- | ----- |
| `/`                                   | Beranda: banner sambutan, daftar campaign, urutan                     | -     |
| `/cari`                               | Pencarian campaign (`?q=`, tidak diindeks)                            | -     |
| `/campaign/[slug]`                    | Detail campaign: progres, sisa hari, donasi masuk, bagikan, WhatsApp  | -     |
| `/campaign/[slug]/donasi`             | Formulir donasi                                                       | -     |
| `/donasi/[order_id]`                  | Status pembayaran                                                     | -     |
| `/blog`, `/blog/[slug]`               | Blog (filter kategori, artikel & video YouTube)                       | -     |
| `/syarat-ketentuan`, `/tentang`       | S&K dan profil lembaga (dari tabel `settings`)                        | -     |
| `/login`, `/daftar`, `/lupa-password` | Autentikasi donatur                                                   | -     |
| `/akun`, `/akun/riwayat`              | Profil dan riwayat donasi pribadi (filter tanggal & campaign)         | ✓     |
| `POST /api/midtrans/notification`     | Webhook Midtrans                                                      | -     |

## Perintah

```bash
npm run dev            # dev server (Turbopack) di http://localhost:3002 (port 3000 dipakai sbn-office)
npm run build          # production build
npm run lint           # ESLint (flat config) untuk seluruh project
npx eslint <path>      # lint satu file
npx tsc --noEmit       # type check
npx shadcn add <nama>  # tambah komponen UI ke components/ui/
```

Belum ada test runner. Setelah memindah atau menghapus route, `npx tsc --noEmit` bisa error karena `.next/types/validator.ts` masih menyimpan route lama; jalankan `npm run build` atau `npx next typegen` untuk menulis ulangnya. `npx next typegen` juga dibutuhkan setelah menambah route baru agar `PageProps<"/route-baru">` dikenali.

## Next.js 16: Hal yang Berbeda

- `next.config.ts` mengaktifkan `cacheComponents: true` dan `partialPrefetching`. Komponen yang membaca cookies/session **wajib** dibungkus `<Suspense>`, dan session tidak boleh di-`await` di top-level layout. Rujukan: `node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`.
- `middleware.ts` sudah diganti `proxy.ts`. Rujukan: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
- `LayoutProps<"/">` / `PageProps` adalah tipe global hasil typegen Next, jadi tidak perlu di-import.
- Tailwind v4 dimuat lewat loader `@tailwindcss/turbopack` di `next.config.ts`. Tidak ada `tailwind.config` maupun PostCSS config; token tema ada di `app/globals.css`:
  - latar `--background` ber-tint hijau sangat muda dengan `--card` putih, `--muted-foreground` cukup gelap untuk kontras ≥ 4,5:1;
  - `--primary-strong` (ujung gradien, `from-primary to-primary-strong`), `--brand-gold` dan `--brand-gold-strong` (teks emas gelap);
  - `shadow-card` (kartu, header) dan `shadow-bar` (bar bawah), serta `animate-progress-grow` untuk bar progres;
  - font Plus Jakarta Sans (`--font-sans`) dan Geist Mono; `viewport` di root layout memakai `viewportFit: "cover"`, jadi bar bawah memakai `env(safe-area-inset-bottom)`.
- Komponen shadcn memakai style `base-nova`, yang dibangun di atas `@base-ui/react` (bukan Radix). Komposisi elemen memakai prop `render`, bukan `asChild`. Untuk `Button` yang dirender sebagai link, tambahkan `nativeButton={false}`: `<Button nativeButton={false} render={<Link href="/" />}>` (elemen `<a>` yang dihasilkan mendapat `role="button"`). `cn` berasal dari package npm `cn` (pengganti clsx + tailwind-merge), dan `lib/utils.ts` hanya me-re-export-nya.
- Jebakan `cacheComponents` yang membuat `npm run build` gagal:
  - `usePathname()` di luar `<Suspense>` begitu ada route dengan param dinamis (seperti `/campaign/[slug]`). Karena itu `ActiveBottomNavigation` dibungkus `<Suspense>` di root layout. Lakukan hal yang sama untuk komponen client lain di layout yang membaca URL.
  - Membaca `params` di top-level `page.tsx` route dinamis tanpa `<Suspense>` di atasnya. `/campaign/[slug]` aman karena punya `loading.tsx`. Alternatifnya, baca `params` di komponen anak yang dibungkus `<Suspense>`, atau sediakan `generateStaticParams`.
  - `new Date()`, `Date.now()`, atau `Math.random()` saat prerender. Panggil hanya di server component setelah akses data request (cookies/params), atau di client component yang baru dirender setelah data selesai di-fetch (contoh: `CampaignProgress`, `DonationList`).
- `notFound()` di halaman yang punya `loading.tsx` dikirim setelah streaming dimulai, sehingga status HTTP tetap 200 dengan meta `noindex` (soft 404). Ini disengaja untuk `/campaign/[slug]`, `/campaign/[slug]/donasi`, `/donasi/[order_id]`, dan `/blog/[slug]`.
- `"use cache"` tidak boleh memanggil `cookies()`, termasuk lewat `lib/supabase/server.ts`. Di dalam cached scope pakai `lib/supabase/public.ts`.
- `next/image`: prop `priority` sudah deprecated, pakai `preload` (gambar LCP di server component) atau `loading="eager"`.

## Arsitektur

### Struktur folder

- `app/` hanya untuk routing (`page.tsx`, `layout.tsx`, `route.ts`) dan tidak berisi logika. `page.tsx` cukup me-render container.
- `containers/<modul>/<halaman>/` berisi `<Nama>.tsx` (named export, di-re-export lewat `index.ts`), `<Nama>.types.ts` (schema zod + type `z.infer`), `actions.ts` (`"use server"`), `components/`, dan `hooks/use<Nama>.ts` (react-hook-form, pemanggilan action, query).
- `components/layout/`: kerangka halaman donatur.
  - `Header`: logo, nama "Sobat Baik Nusantara", dan `HeaderSearchButton` ke `/cari` (client, `usePathname()` di dalam `<Suspense>`, disembunyikan di `/cari`).
  - `BottomNavigation`: komponen presentasional dengan prop `activeHref`. Dipakai juga sebagai fallback `<Suspense>` (tanpa item aktif).
  - `ActiveBottomNavigation`: client component yang membaca `usePathname()`.
  - `navigation.ts`: `NAV_ITEMS`, `isActivePath()`, dan `getActiveHref()` (`/cari` dianggap Beranda).
  - `Footer`: logo, link Tentang Kami, Syarat & Ketentuan, dan "Hubungi Kami" (WhatsApp, di dalam `<Suspense>`), serta "© Sobat Baik Nusantara" tanpa tahun (`new Date()` saat prerender membuat build gagal).
- `lib/supabase/`:
  - `client.ts` (browser, hanya untuk membaca);
  - `server.ts` (session user, RLS berlaku);
  - `admin.ts` (service role, `import "server-only"`, hanya untuk insert/update `transactions`);
  - `proxy.ts` (`updateSession()` untuk `proxy.ts` root);
  - `public.ts` (`createPublicClient()`: publishable key tanpa session dan tanpa cookies, RLS anon berlaku; untuk `"use cache"` seperti sitemap);
  - `database.types.ts` (hasil generate).
- `lib/midtrans.ts` (`server-only`): integrasi Midtrans lewat `fetch` tanpa SDK. Isinya `ORDER_ID_PATTERN`, `generateOrderId(now)`, `createSnapTransaction()`, `getTransactionStatus()` (GET status Core API), `mapPaymentStatus()`, `getPaidAt(settlementTime, now)`, dan `verifySignature()` (tidak dipakai webhook, lihat alur donasi). `MIDTRANS_SERVER_KEY` hanya boleh dibaca di file ini. Snap dikirim dengan header `X-Override-Notification` ke `${NEXT_PUBLIC_SITE_URL}/api/midtrans/notification`, jadi `NEXT_PUBLIC_SITE_URL` harus sama dengan URL publik donatur (lokal `http://localhost:3002`; uji webhook asli lewat tunnel ngrok, lihat README).
- `lib/email/` (`server-only`): `donation-receipt.ts` membuat subject, HTML (string template, tanpa react-email; input di-escape), dan teks bukti donasi; `send.ts` berisi `sendDonationReceipt(transactionId)` yang mengirim lewat Resend dengan `idempotencyKey` per `order_id`. Resend mengembalikan `{ error }` (tidak melempar), dan kegagalan jaringan muncul sebagai `application_error` tanpa detail. Error dicatat di log dan tidak dilempar ulang.
- `lib/auth.ts`: `getCurrentUser()` (dibungkus `React.cache()`, hasil `CurrentUser` termasuk `phone`/`isActive` atau `null`) dan `requireDonatur(next)` untuk halaman dan action `/akun/*` (tanpa session → `/login?next=…`, nonaktif → `/login?error=nonaktif`). Pemanggilnya wajib berada di dalam `<Suspense>`. **Jangan** salin `requireAdmin()` dari office.
- `lib/redirect.ts`: `getSafeNextPath()` (cegah open redirect; dipakai proxy juga, jadi tanpa `server-only`) dan `getAuthConfirmUrl()` (`${NEXT_PUBLIC_SITE_URL}/auth/confirm`). `lib/auth-errors.ts`: `getAuthErrorMessage()`/`getAuthErrorCode()` memetakan `error.code` Supabase Auth ke Bahasa Indonesia. `lib/validation.ts`: schema nama, email, no. HP, dan password yang dipakai bersama formulir donasi dan akun, serta `SLUG_PATTERN` untuk `queries.ts` campaign dan blog. `components/auth/`: `RedirectIfLoggedIn` dan `AuthPageHeader`.
- Pengaturan dari office (`settings`):
  - `lib/settings.ts` (`server-only`): `getSettings()` (`React.cache()`, server client) mengembalikan `whatsapp_number`, `terms_and_conditions`, `company_profile` (kosong → `null`). Tidak memakai `"use cache"` agar perubahan dari office langsung terlihat, jadi pemanggilnya wajib di dalam `<Suspense>`.
  - `lib/whatsapp.ts`: `getWhatsAppUrl()` (`wa.me`, `null` bila nomor kosong/tidak valid) dan `whatsappMessage` (pesan per halaman: campaign, donation, account, inactiveAccount, general).
  - `components/whatsapp/`: `WhatsAppButton` (varian `button`/`icon`/`link`, tidak merender apa pun bila nomor kosong) dan `AdminWhatsAppButton` (async, membaca nomor sendiri; dipakai footer dan login).
  - `lib/html.ts`: `hasHtmlContent()` untuk HTML editor yang hanya berisi tag kosong (`<p></p>`).
- Helper bersama: `lib/utils.ts` (`cn`, `formatRupiah()`, `getAbsoluteUrl()` dari `NEXT_PUBLIC_SITE_URL`), `lib/youtube.ts` (`getYouTubeId()`, `getYouTubeEmbedUrl()`, `getYouTubeThumbnail()`; **identik dengan office**, jadi bila diubah salin apa adanya ke app lain), `lib/blog.ts` (`postTypeLabel`, `getPostImage()`, `getPostUrl()`), `lib/campaign.ts` (`getProgressPercent()` sama dengan office, plus `getRemainingDays()`, `isCampaignEnded()`, `formatRemainingDays()`, `getCampaignUrl()`), `lib/date.ts` (`formatRelativeTime()`, `formatDateTime()` dalam WIB, `startOfDayJakarta()`/`startOfNextDayJakarta()` untuk filter tanggal `.gte`/`.lt`), `lib/payment-method.ts` (`getPaymentMethodLabel()`, label `payment_type` Midtrans), dan `hooks/use-debounced-value.ts` (sama dengan office).
- Komponen yang dipakai lebih dari satu container ditaruh di `components/<modul>/` (contoh: `components/campaign/CampaignProgress.tsx`, `components/share/ShareButton.tsx`). Komponen internal container memakai default export. Hook yang dipakai lebih dari satu container ditaruh di `hooks/` (contoh: `hooks/use-campaigns.ts`, dipakai beranda dan `/cari`).
- `components/campaign/CampaignCard.tsx`: pola *stretched link* (judul `Link` dengan `after:absolute after:inset-0`), sehingga tombol "Donasi Sekarang" ke `/campaign/[slug]/donasi` tidak bersarang di dalam link. Badge di atas gambar: sisa hari, "Segera berakhir" (≤ 7 hari, emas), atau "Telah berakhir" (tanpa tombol donasi).
- `components/feedback/EmptyState.tsx`: ikon dalam lingkaran, judul, deskripsi, dan aksi opsional, untuk daftar kosong dan error (contoh "Coba lagi").
- Fungsi baca data di server (Server Component dan `generateMetadata`) ditaruh di `containers/<modul>/<halaman>/queries.ts` (`import "server-only"`, dibungkus `React.cache()`), contoh `getCampaignBySlug()` (dipakai ulang oleh formulir donasi dan `createDonation`), `getDonationByOrderId()`, dan `getPostBySlug()`. Data campaign tidak memakai `use cache` karena dana terkumpul harus selalu terbaru.

### Mutasi data: Server Action + Zod

Semua perubahan data (termasuk login/daftar/logout) dilakukan lewat Server Action. Komponen client tidak menulis ke Supabase secara langsung.

1. Schema zod ditulis sekali di `<Nama>.types.ts`, dipakai oleh `zodResolver` di client dan `schema.safeParse()` di server. Schema tidak boleh ditaruh di `actions.ts`, karena file `"use server"` hanya boleh mengekspor async function. Pesan validasi ditulis dalam Bahasa Indonesia.
2. Server Action: `safeParse` (bila gagal, return `z.flattenError(result.error).fieldErrors`) → akses Supabase → `revalidatePath()` / `redirect()` bila perlu → return `ActionResult` (`lib/types.ts`).
3. Hook memanggil action dari `handleSubmit`:
   - Status loading memakai `formState.isSubmitting`.
   - `fieldErrors` dipasang ke field lewat `setError`, sedangkan `message` dipasang ke `setError("root", ...)` dan ditampilkan di atas form.
   - Bila action melakukan `redirect()`, hasil `await action()` di client tidak bisa diandalkan. Karena itu cek dengan `if (!result || result.success) return;`.
   - `redirect()` di dalam action harus berada di luar `try/catch`.
   - Setelah action berhasil, panggil `queryClient.invalidateQueries({ queryKey: ["<modul>"] })`.

### Membaca data

- Halaman publik yang butuh SEO (detail campaign, detail blog, S&K, tentang): Server Component + `lib/supabase/server.ts`, dengan `generateMetadata` (Open Graph: judul, `description`, `cover`).
- Daftar dengan pagination/filter/pencarian (campaign, blog, riwayat): Tanstack Query (`useQuery` + `placeholderData: keepPreviousData`) dengan `lib/supabase/client.ts`, `.range()`, dan `{ count: "exact" }`. Query key: `["<modul>", { ...params }]`. Daftar dengan tombol "Muat lebih banyak" (beranda, pencarian, blog, donasi masuk) memakai `useInfiniteQuery`.
- Pencarian campaign hanya di `/cari` (judul, `ilike`): kata kunci disimpan di `?q=` lewat `router.replace()` setelah jeda, agar hasil tetap ada saat kembali dari detail. Komponen yang membaca `useSearchParams()` dibungkus `<Suspense>`.
- Progres campaign dibaca dari view `campaign_progress` (`collected_amount`, `donor_count`) dengan query kedua (`.in("campaigns_id", ids)`), bukan embed PostgREST, karena relasi ke view tidak terdeteksi. Query campaign tetap memakai `.eq("status", "PUBLISH")` walau RLS sudah membatasi. Daftar donasi masuk dibaca dari view `public_donations` (sudah berisi "Anonim" dan tanpa email/no. HP). Publik tidak bisa membaca tabel `transactions` secara langsung.
- Blog (backlog 006):
  - Post dibaca dengan `.eq("status", "PUBLISH")`, urut `published_at` terbaru (`nullsFirst: false`) lalu `id`. Kategori di-embed (`categories (name)`) karena RLS `categories` terbuka untuk publik. Filter tipe dan kategori disimpan di state, sama dengan beranda.
  - Gambar post lewat `getPostImage()`: cover, atau thumbnail YouTube (`i.ytimg.com`, terdaftar di `images.remotePatterns`) untuk video tanpa cover. Gambar yang sama dipakai untuk `og:image`.
  - Video diputar lewat iframe `youtube-nocookie.com` dengan `referrerPolicy="strict-origin-when-cross-origin"` (`no-referrer` membuat embed gagal). URL yang tidak dikenali `getYouTubeId()` menampilkan "Video tidak tersedia".
  - `content` adalah HTML dari editor office yang sudah disanitasi saat disimpan, dirender dengan `prose`. Konten yang hanya berisi tag kosong (`<p></p>`) tidak dirender.
  - `app/sitemap.ts` membaca `lib/sitemap.ts` (`"use cache"` + `cacheLife("hours")`), jadi post atau campaign baru muncul di sitemap paling lambat sekitar satu jam kemudian. Sitemap juga memuat `/tentang` dan `/syarat-ketentuan`. `app/robots.ts` menutup `/akun`, `/donasi/`, `/campaign/*/donasi`, `/auth/`, dan `/api/`. Matcher `proxy.ts` mengecualikan `sitemap.xml` dan `robots.txt`.
- Riwayat donasi hanya mencakup transaksi dengan `users_id = auth.uid()`, yaitu donasi yang dibuat saat login. Donasi tanpa login tidak digabungkan ke akun.

### Alur donasi (Midtrans Snap)

1. Formulir donasi (nama, email, no. HP opsional, nominal minimal `MIN_DONATION_AMOUNT`, anonim) bisa diisi tanpa login. Bila login, nama, email, dan no. HP terisi dari profil (`getCurrentUser()` di `DonationForm`, aman karena di dalam `<Suspense>` `loading.tsx`) dan tetap bisa diubah. Campaign yang sudah berakhir tidak menampilkan form.
2. `createDonation` (`containers/donation/form/actions.ts`) membuat baris `transactions` berstatus `PENDING` dengan `order_id` `SBN-YYYYMMDD-XXXXXXXX` **lewat `lib/supabase/admin.ts`** (insert/update `transactions` hanya boleh dari server dengan service role), membuat transaksi Snap, lalu menyimpan `redirect_url` di `payment_url`. Bila Snap gagal, baris menjadi `FAILED` dengan pesan error di `midtrans_payload`. Hook mengarahkan donatur dengan `window.location.assign()` (redirect Snap, bukan popup Snap.js), dan tombol tetap disabled selama `isSubmitSuccessful`.
3. `POST /api/midtrans/notification` (`route.ts` tipis, logika di `containers/donation/notification/handler.ts`) memverifikasi notifikasi dengan **GET status ke Midtrans** (`getTransactionStatus()`), bukan dengan `signature_key`: di akun Midtrans ini notifikasi ditandatangani dengan key yang berbeda dari `MIDTRANS_SERVER_KEY`, sehingga `SHA512(order_id + status_code + gross_amount + server_key)` tidak pernah cocok (juga setelah key dirotasi). Body notifikasi hanya pemicu; status, nominal, metode, dan `settlement_time` diambil dari respons GET status. Order yang tidak ada di database diabaikan sebelum memanggil Midtrans, dan GET status yang gagal dibalas 503 agar Midtrans mengirim ulang. Setelah itu webhook mencocokkan nominal, memetakan status, lalu meng-update transaksi secara **idempoten**: hanya baris yang masih `PENDING` yang berubah (`.eq("payment_status", "PENDING")`), jadi notifikasi berulang tidak mengubah transaksi final. `paid_at` diisi dari `settlement_time` (WIB) saat `SUCCESS`. Email bukti donasi dikirim lewat `after()` hanya bila update benar-benar mengubah baris menjadi `SUCCESS`, sehingga respons ke Midtrans tidak menunggu email.
4. `/donasi/[order_id]` membaca status dari database lewat admin client dengan kolom terbatas (tanpa email/no. HP), bukan dari Midtrans. Selama `PENDING`, `AutoRefresh` memanggil `router.refresh()` tiap 5 detik sampai 3 menit.

Pemetaan `transaction_status` → `payment_status`: `settlement` / `capture` (dengan `fraud_status` `accept`) → `SUCCESS`; `pending` dan `capture` + `challenge` → `PENDING`; `expire` → `EXPIRED`; `cancel` / `deny` / `failure` → `FAILED`. Status lain (`refund`, `chargeback`, dll.) diabaikan.

Uji webhook di lokal dengan `curl` (contoh lengkap ada di DON005 backlog 003). Server action bisa dipanggil langsung lewat `POST` dengan header `Next-Action: <id>` (id dari `.next/dev/server/server-reference-manifest.json`) dan body JSON array argumen.

### Auth dan layout

- `proxy.ts` donatur me-refresh session (`getClaims()`) di semua halaman, dan hanya `/akun` serta `/akun/*` tanpa session yang diarahkan optimistis ke `/login?next=<path>` (cookie dan header no-cache ikut disalin). Tidak ada redirect global ke login (berbeda dengan office). Pengecekan sebenarnya tetap di `requireDonatur()` di dalam `<Suspense>`.
- Akun donatur (backlog 005):
  - Semua aksi auth (daftar, login, keluar, lupa/atur ulang password, ubah profil) lewat Server Action dengan **server client**. Pesan Supabase tidak ditampilkan mentah.
  - `/auth/confirm` memverifikasi `token_hash` + `type` (`email`/`recovery`) dari template email AKN002 (`{{ .RedirectTo }}?token_hash=…&type=…`, sehingga `emailRedirectTo` tidak boleh punya query), dengan fallback `?code=` (PKCE) untuk template bawaan.
  - Anti-enumerasi: daftar dengan email terdaftar dan lupa password untuk email tak terdaftar menampilkan pesan yang sama. Batas kirim email (`over_email_send_rate_limit`) di lupa password dan kirim ulang verifikasi juga dibalas pesan netral karena hanya terjadi untuk email terdaftar.
  - Akun nonaktif (`profiles.is_active = false` atau di-ban AKN011): login ditolak (dan di-`signOut`), `requireDonatur` mengarahkan ke `/login?error=nonaktif` tanpa `signOut` (cookie tidak bisa ditulis dari Server Component), dan donasi tetap bisa dilakukan tetapi tanpa prefill dan tanpa `users_id` (A3).
  - Riwayat (`useMyDonations`) wajib memakai `.eq("users_id", userId)` walau RLS membatasi (admin bisa membaca semua), dan `userId` ikut di query key. Campaign arsip/draft tidak bisa dibaca donatur, jadi relasi `campaigns` bernilai `null` ("Campaign tidak tersedia").
  - Di lokal, office (port 3000) dan donatur (3002) memakai project Supabase yang sama, jadi cookie `sb-…-auth-token` di `localhost` terbagi: login di satu app menimpa session app lain. Uji login dengan browser profile terpisah.
- Layout mobile-first dipasang di root `app/layout.tsx`, sehingga semua halaman mendapat header dan Bottom Navigation:
  - konten `max-w-md` di tengah, latar luar `bg-muted` mulai breakpoint `md`;
  - Bottom Navigation fixed dengan 4 item: Beranda (`/`), Blog (`/blog`), Riwayat (`/akun/riwayat`), Akun (`/akun`), dengan `shadow-bar` dan `pb-[env(safe-area-inset-bottom)]`;
  - item aktif berwarna `--primary` dengan pill `bg-primary/10` di belakang ikon, dipilih oleh `getActiveHref()` (href terpanjang yang cocok), sehingga `/akun/riwayat` tidak ikut mengaktifkan Akun;
  - `<main>` diberi `pb-[calc(5rem+env(safe-area-inset-bottom))]` agar konten tidak tertutup navigasi (`h-16` + safe area).

  Bila nanti ada halaman yang tidak boleh menampilkan navigasi, pindahkan layout ini ke route group. Saat ini semua halaman (termasuk login, formulir donasi, dan status) tetap menampilkan navigasi.
- Metadata root: title `{ default: "Sobat Baik Nusantara", template: "%s | Sobat Baik Nusantara" }`, `<html lang="id">`, `metadataBase` dari `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`).

### Konvensi lain

- Teks UI ditulis dalam Bahasa Indonesia.
- Ramah orang tua (backlog 008): info penting (nominal, progres, sisa hari, jumlah donatur, tanggal, ID pesanan) minimal `text-sm`; `text-xs` hanya untuk keterangan tambahan. Target sentuh minimal 44 px: ukuran `components/ui` sudah disesuaikan (Button `default` `h-11`, `lg` `h-12`, `sm` `h-10`, `icon` `size-11`, `icon-lg` `size-12`; Input dan Select `h-11`; Checkbox `size-5`; Badge `text-sm` dengan varian `warning`). Animasi dibungkus `motion-safe:`.
- Nominal rupiah ditampilkan lewat `formatRupiah()` di `lib/utils.ts`.
- Nama kolom foreign key memakai format `<tabel>_id` (contoh: `campaigns_id`, `users_id`).
- Env ada di `.env.local` (di-gitignore). Variabel tanpa prefix `NEXT_PUBLIC_` (`SUPABASE_SERVICE_ROLE_KEY`, `MIDTRANS_SERVER_KEY`, `RESEND_API_KEY`) hanya boleh dipakai di server. `MIDTRANS_IS_PRODUCTION=false` sampai go-live. `EMAIL_FROM` memakai `onboarding@resend.dev` selama domain `sobatbaik.org` belum terverifikasi di Resend; selama itu email hanya bisa dikirim ke pemilik akun Resend.
- Di luar scope (jangan dibuat): halaman zakat, program trending, doa donatur, dan Supabase Realtime.
