# Master Account Setup Guide

## Cara Mudah Login Sebagai Master

### ⚠️ PENTING: Disable Email Confirmation (Jika Diperlukan)

Jika Anda tidak bisa login setelah mendaftar, kemungkinan email confirmation masih aktif. Ikuti langkah ini:

1. **Buka Supabase Dashboard**
2. **Klik "Authentication" di menu kiri**
3. **Klik tab "Providers"**
4. **Klik "Email" provider**
5. **Scroll ke bawah dan MATIKAN "Confirm email"**
6. **Klik "Save"**

Setelah ini, pengguna baru bisa langsung login tanpa konfirmasi email.

### Metode 1: Setup Cepat (RECOMMENDED)

1. **Buka halaman setup:**
   - Development: `http://localhost:3000/setup-master`
   - Production: `https://your-app.vercel.app/setup-master`

2. **Isi form dengan data Anda:**
   ```
   Email: admin@yourcompany.com
   Password: YourSecurePassword123
   Full Name: Master Administrator
   Phone: +62 812 3456 7890 (opsional)
   ```

3. **Klik "Create Master Account"**

4. **Setelah akun dibuat, Anda akan melihat SQL query:**
   ```sql
   UPDATE public.profiles 
   SET role = 'master' 
   WHERE email = 'admin@yourcompany.com';
   ```

5. **Jalankan query di Supabase:**
   - Buka Supabase Dashboard
   - Klik "SQL Editor" di menu kiri
   - Klik "New query"
   - Paste query di atas
   - Klik "Run"

6. **Login:**
   - Kembali ke aplikasi
   - Klik "Continue to Login"
   - Masukkan email dan password yang tadi dibuat
   - Anda akan masuk sebagai Master!

### Metode 2: Upgrade User yang Sudah Ada

Jika sudah punya akun, jalankan query ini di Supabase SQL Editor:

```sql
-- Ganti dengan email Anda
UPDATE public.profiles 
SET role = 'master' 
WHERE email = 'your-email@example.com';
```

Kemudian logout dan login kembali.

### Metode 3: Manual dari Auth Sign Up

1. Sign up di `/auth/sign-up`
2. Setelah sign up, catat email Anda
3. Jalankan query upgrade di Supabase:
   ```sql
   UPDATE public.profiles 
   SET role = 'master' 
   WHERE email = 'your-email@example.com';
   ```
4. Login di `/auth/login`

## Contoh Kredensial untuk Testing

```
Email: master@demo.com
Password: Master123456
Full Name: Demo Master
```

## Setelah Login Sebagai Master

Anda akan memiliki akses ke:
- Dashboard Master di `/dashboard/master`
- User Management
- Transaction Approval
- Product Management  
- Activity Logs
- Semua fitur sistem

## Troubleshooting

### "Email not confirmed" atau "Tidak ada tindakan setelah mendaftar"
**SOLUSI UTAMA:**
1. Buka Supabase Dashboard
2. Pergi ke Authentication > Providers > Email
3. **MATIKAN "Confirm email"**
4. Save dan coba daftar ulang dengan email berbeda

**ALTERNATIF:** Jika ingin tetap menggunakan email confirmation:
1. Cek inbox email Anda (termasuk folder spam)
2. Klik link konfirmasi dari Supabase
3. Setelah konfirmasi, jalankan SQL query untuk upgrade ke master
4. Baru bisa login

### "Tidak bisa login" atau "Invalid login credentials"
- Pastikan email dan password benar
- Pastikan sudah konfirmasi email (jika email confirmation aktif)
- Pastikan query SQL sudah dijalankan di Supabase
- Coba logout dan login kembali
- Clear browser cache

### "Role tidak berubah"
- Pastikan query SQL berhasil dijalankan
- Cek di Supabase Dashboard > Table Editor > profiles
- Pastikan kolom `role` berubah menjadi `master`
- Logout dan login kembali untuk refresh session

### "Error saat membuat akun"
- Pastikan password minimal 6 karakter
- Pastikan email belum terdaftar
- Cek koneksi internet dan Supabase status
- Pastikan email confirmation sudah dimatikan (lihat solusi di atas)
