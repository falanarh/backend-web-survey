# Backend Aplikasi Survei Web

Layanan backend untuk aplikasi survei web yang dibangun menggunakan Express.js dan TypeScript. Proyek ini menyediakan API untuk otentikasi pengguna, manajemen sesi survei, dan pengumpulan tanggapan survei.

## Fitur Utama

-   **Otentikasi Pengguna**: Registrasi dan login menggunakan email/password serta otentikasi melalui Google (OAuth 2.0). Menggunakan JSON Web Tokens (JWT) untuk mengamankan *endpoint*.
-   **Manajemen Sesi Survei**: Membuat, mengambil, memperbarui, dan menghapus sesi survei untuk pengguna yang terotentikasi.
-   **Pengumpulan Tanggapan**: Menyimpan tanggapan yang dikirimkan oleh pengguna untuk setiap sesi survei.
-   **Keamanan**: Dilengkapi dengan `helmet` untuk mengamankan aplikasi dari beberapa kerentanan web umum.
-   **Logging**: Menggunakan `morgan` untuk *logging* permintaan HTTP.

## Teknologi yang Digunakan

-   **Framework**: Express.js
-   **Bahasa**: TypeScript
-   **Database**: MongoDB dengan Mongoose ODM
-   **Otentikasi**: JSON Web Token (JWT), `bcryptjs` untuk *hashing password*.
-   **Keamanan & Middleware**: `helmet`, `cors`, `morgan`.
-   **Manajemen Environment**: `dotenv`.

## Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut:

-   [Node.js](https://nodejs.org/) (v18.x atau lebih tinggi)
-   [npm](https://www.npmjs.com/) (terinstal bersama Node.js)
-   [MongoDB](https://www.mongodb.com/try/download/community) (atau akses ke cluster MongoDB Atlas)

## Instalasi dan Konfigurasi

1.  **Kloning Repositori**
    ```bash
    git clone https://github.com/username/backend-web-survey.git
    cd backend-web-survey
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Variabel Lingkungan**
    Buat file `.env` di direktori utama proyek dan isi dengan konfigurasi berikut. Ganti nilai placeholder dengan nilai Anda yang sebenarnya.

    ```env
    # URL koneksi ke database MongoDB Anda
    MONGODB_URI=mongodb://localhost:27017/nama_database_anda

    # Kunci rahasia untuk menandatangani token JWT
    JWT_SECRET=kunci_rahasia_anda_yang_sangat_aman

    # (Opsional) Kredensial Google OAuth 2.0
    GOOGLE_CLIENT_ID=client_id_google_anda
    GOOGLE_CLIENT_SECRET=client_secret_google_anda

    # (Opsional) URL aplikasi frontend untuk CORS
    FRONTEND_URL=http://localhost:3000
    ```

## Menjalankan Aplikasi

-   **Mode Pengembangan (Development)**
    Jalankan server dengan *hot-reloading* menggunakan `nodemon`.
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:PORT` (sesuai konfigurasi port Anda).

-   **Mode Produksi (Production)**
    Pertama, *build* proyek dari TypeScript ke JavaScript.
    ```bash
    npm run build
    ```
    Kemudian, jalankan aplikasi yang sudah di-*build*.
    ```bash
    npm start
    ```

## Endpoint API

Berikut adalah daftar *endpoint* API yang tersedia:

#### Otentikasi (`/api/auth`)
-   `POST /register`: Mendaftarkan pengguna baru.
-   `POST /login`: Login pengguna dengan email dan password.
-   `POST /google`: Login atau registrasi menggunakan Google OAuth.
-   `GET /profile`: Mendapatkan profil pengguna yang sedang login (memerlukan token otentikasi).
-   `POST /logout`: Logout pengguna.

#### Sesi Survei (`/api/survey-sessions`)
-   `POST /`: Membuat sesi survei baru (memerlukan otentikasi).
-   `GET /all-sessions`: Mendapatkan semua sesi survei milik pengguna (memerlukan otentikasi).
-   `GET /:id`: Mendapatkan detail sesi survei spesifik.
-   `PUT /:id`: Memperbarui sesi survei (memerlukan otentikasi).
-   `DELETE /:id`: Menghapus sesi survei (memerlukan otentikasi).
-   `POST /:id/submit-response`: Mengirimkan tanggapan untuk sebuah survei.

## Struktur Proyek

```
backend-web-survey/
├── api/                # Konfigurasi serverless untuk Vercel
│   └── index.ts
├── src/
│   ├── controllers/    # Logika untuk menangani request dan response
│   ├── middleware/     # Middleware Express (misal: otentikasi)
│   ├── models/         # Skema database Mongoose
│   ├── routes/         # Definisi rute API
│   ├── services/       # Logika bisnis
│   ├── config/         # Konfigurasi (misal: koneksi database)
│   └── app.ts          # Titik masuk utama aplikasi Express
├── .env                # File variabel lingkungan (tidak ada di repo)
├── package.json        # Dependensi dan skrip proyek
└── tsconfig.json       # Konfigurasi TypeScript
```

## Deployment

Proyek ini telah dikonfigurasi untuk *deployment* ke **Vercel**. Untuk instruksi lebih lanjut, silakan lihat file [DEPLOYMENT.md](./DEPLOYMENT.md).