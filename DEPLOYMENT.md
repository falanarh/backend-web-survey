# Deployment Guide untuk Vercel

## Prerequisites
- Akun Vercel (gratis di [vercel.com](https://vercel.com))
- MongoDB database (MongoDB Atlas atau lainnya)
- Google OAuth credentials (jika menggunakan Google login)

## Langkah-langkah Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Environment Variables
Sebelum deploy, pastikan untuk mengatur environment variables berikut di Vercel Dashboard:

#### Database Configuration
- `MONGODB_URI` - URI MongoDB database Anda
- `NODE_ENV` - Set ke "production"

#### JWT Configuration
- `JWT_SECRET` - Secret key untuk JWT tokens
- `JWT_EXPIRES_IN` - Expiration time (default: "7d")

#### Google OAuth (jika menggunakan)
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret

#### CORS Configuration
- `FRONTEND_URL` - URL frontend aplikasi Anda

### 4. Deploy ke Vercel

#### Opsi A: Deploy via CLI
```bash
# Deploy pertama kali
vercel

# Deploy ke production
vercel --prod
```

#### Opsi B: Deploy via GitHub
1. Push code ke GitHub repository
2. Import project di Vercel Dashboard
3. Connect dengan GitHub repository
4. Set environment variables
5. Deploy

### 5. Update CORS Configuration
Setelah deploy, update CORS origin di `src/app.ts` dengan domain Vercel Anda:

```typescript
app.use(
  cors({
    origin: [
      'https://your-frontend-domain.vercel.app', // Frontend domain
      'https://your-backend-domain.vercel.app',  // Backend domain (jika diperlukan)
      'http://localhost:3000',
      'http://localhost:3001'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
```

## File Konfigurasi yang Sudah Dibuat

### vercel.json
Konfigurasi untuk Vercel deployment dengan:
- Build configuration untuk TypeScript
- Routing untuk semua requests ke API
- Function timeout settings

### api/index.ts
Entry point untuk Vercel serverless function yang mengimport Express app

### package.json
Updated dengan:
- Main entry point untuk Vercel
- Vercel-specific build scripts
- Proper TypeScript configuration

### tsconfig.json
Updated untuk kompatibilitas dengan Vercel deployment

## Troubleshooting

### Error: MongoDB Connection
- Pastikan `MONGODB_URI` sudah benar
- Pastikan IP address Vercel sudah di-whitelist di MongoDB Atlas

### Error: CORS
- Update CORS origin dengan domain frontend yang benar
- Pastikan semua required headers sudah di-set

### Error: JWT
- Pastikan `JWT_SECRET` sudah di-set dengan value yang aman
- Gunakan random string yang panjang untuk security

## Monitoring dan Logs
- Gunakan Vercel Dashboard untuk melihat deployment logs
- Monitor function execution time dan memory usage
- Set up alerts untuk error rates

## Production Checklist
- [ ] Environment variables sudah di-set
- [ ] CORS configuration sudah benar
- [ ] MongoDB connection sudah teruji
- [ ] JWT secret sudah aman
- [ ] Frontend URL sudah di-update
- [ ] Error handling sudah proper
- [ ] Logging sudah di-setup

## Support
Jika ada masalah, cek:
1. Vercel deployment logs
2. MongoDB connection logs
3. Environment variables di Vercel Dashboard
4. CORS configuration 