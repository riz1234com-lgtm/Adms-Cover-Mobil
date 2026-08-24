# ADMS COVER MOBIL - E-Commerce & WhatsApp Ordering System

Website e-commerce profesional untuk toko online **ADMS COVER MOBIL** yang menjual sarung/cover mobil pelindung debu, panas sinar UV matahari, dan air hujan (waterproof).

> **Slogan:** *“Lindungi Mobil Anda, Setiap Saat.”*

---

## 🌟 Konsep Utama & Alur Pemesanan WhatsApp
Website ini **TIDAK MENGGUNAKAN** checkout atau sistem pembayaran online otomatis (tanpa payment gateway / QRIS / e-wallet). 

### Alur Pembelian:
1. **Pelanggan Memilih Produk & Varian:** Memilih model cover, ukuran mobil (M, L, XL, XXL, Custom), dan warna.
2. **Klik Tombol "Pesan via WhatsApp":** Otomatis membuka aplikasi/web WhatsApp Admin dengan pesan pesanan rapi yang sudah terisi otomatis (Detail produk, SKU, varian ukuran/warna, jumlah, total harga, dan link produk).
3. **Konfirmasi Admin:** Admin mengonfirmasi ketersediaan stok, alamat tujuan, dan ongkos kirim.
4. **Pembayaran & Pengiriman:** Pelanggan mentransfer secara manual dan admin mencatat transaksi di Dashboard Admin.

---

## 🚀 Fitur Unggulan

### 1. Halaman Publik (Toko Online)
- **Desain Modern, Otomotif, & Elegan:** Tema gelap berkelas (Automotive Slate & Emerald Green) yang responsif dan mobile-first.
- **Interactive Fit Finder:** Fitur pencocokan ukuran cover berdasarkan merk & model mobil (Toyota Avanza, Honda HR-V, Mitsubishi Pajero, Suzuki Ertiga, Wuling Almaz, dll.).
- **Katalog & Filter Multi-Kriteria:** Filter berdasarkan kategori, tipe cuaca (Outdoor / Indoor / All-Weather), ukuran, promo diskon, dan produk terlaris.
- **Quick View Modal & Zoom Gallery:** Pratinjau cepat produk tanpa meninggalkan halaman.
- **Konsultasi WhatsApp Cepat & Floating Widget:** Tombol WhatsApp mengambang dengan template tanya ukuran dan promo.
- **Keranjang Pemesanan WhatsApp:** Memungkinkan pelanggan memilih beberapa cover dan mengirimkannya dalam 1 pesan WhatsApp terkonsolidasi.
- **Review & Ulasan Pelanggan:** Pengunjung dapat memberikan rating dan ulasan pengalaman produk.

### 2. Dashboard Admin Panel (`/admin`)
- **Login Admin:** Keamanan berbasis JWT dan password hash bcrypt.
- **Ringkasan & Statistik:** Total produk aktif, total klik pemesanan WhatsApp real-time, jumlah transaksi, dan total omset.
- **Kelola Produk (CRUD):** Tambah, edit, hapus cover mobil, upload/link foto, set harga diskon, varian ukuran & warna, dan status stok.
- **Kelola Kategori:** Pengelompokan produk cover.
- **Buku Catatan Penjualan Manual:** Mencatat transaksi yang masuk dari WhatsApp, Marketplace, atau Toko Fisik.
- **Log Lead WhatsApp:** Melacak produk mana saja yang paling banyak di-klik tombol pemesanannya oleh pengunjung.
- **Pengaturan WhatsApp & Toko:** Mengubah nomor WhatsApp tujuan, teks template, kontak, dan banner pengumuman promo kapan saja.
- **Backup Data JSON:** Ekspor cadangan database dengan sekali klik.

---

## 📁 Struktur Project

```
├── .env.example            # Template environment variables
├── package.json            # Dependencies & Scripts
├── server.ts               # Backend Express + Vite Server Entry Point
├── server/
│   ├── db.ts               # Data persistence adapter (JSON / MySQL)
│   ├── routes.ts           # REST API endpoints (/api/*)
│   ├── schema.sql          # Skema Database MySQL Hostinger
│   └── seedData.ts         # Data awal produk & pengaturan
├── src/
│   ├── App.tsx             # Root component & SPA Router
│   ├── main.tsx            # Entry point React
│   ├── types.ts            # TypeScript definitions
│   ├── context/
│   │   ├── AuthContext.tsx # Context autentikasi admin
│   │   └── StoreContext.tsx# Context keranjang, wishlist, settings
│   ├── components/         # Komponen UI (Navbar, Footer, ProductCard, CarFitFinder, dll.)
│   ├── lib/
│   │   └── whatsapp.ts     # Generator URL & format pesan WhatsApp
│   └── pages/              # Halaman publik & Dashboard Admin
```

---

## 🌐 Panduan Deployment ke Hostinger

Website ADMS COVER MOBIL dirancang 100% siap di-hosting di **Hostinger (Node.js App + MySQL / Cloud Hosting)**:

### 1. Buat Database MySQL di hPanel Hostinger
1. Masuk ke **hPanel Hostinger** &gt; **Databases** &gt; **Management**.
2. Buat database baru (contoh: `u123456_adms_db`) dan user database.
3. Buka **phpMyAdmin**, pilih database tersebut, lalu klik tab **Import** dan upload file `server/schema.sql`.

### 2. Setup Node.js Application di Hostinger
1. Di hPanel Hostinger, buka menu **Node.js**.
2. Klik **Create Application**:
   - **Node.js Version:** Pilih `v18.x`, `v20.x`, atau `v22.x`
   - **Application Root:** `/public_html`
   - **Application Startup File:** `dist/server.cjs`
3. Upload seluruh file project (atau via Git Deployment).

### 3. Konfigurasi Environment (`.env`)
Di direktori root project di Hostinger, buat file `.env` dengan isi:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_USER=u123456_adms_user
DB_PASSWORD=PasswordDatabaseAnda
DB_NAME=u123456_adms_db
DB_PORT=3306
JWT_SECRET=rahasia_adms_super_aman_2026
WHATSAPP_NUMBER=6281234567890
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 4. Build & Jalankan Aplikasi
Jalankan perintah build di terminal / SSH Hostinger:
```bash
npm install
npm run build
```
Lalu restart aplikasi Node.js Anda di hPanel. Website langsung online!

---

## 🔑 Kredensial Default Admin
- **URL Admin:** `https://domain-anda.com/admin`
- **Username:** `admin`
- **Password:** `admin123` *(Dapat diubah di database atau `.env`)*
