# Troubleshooting Guide - Masalah Login & Signup

## 🚨 Masalah Utama: "Tidak bisa login setelah mendaftar"

### Penyebab
Masalah ini terjadi karena **Supabase secara default mengaktifkan email confirmation**. Setelah mendaftar, pengguna harus:
1. Membuka email konfirmasi
2. Klik link konfirmasi
3. Baru bisa login

Jika email konfirmasi tidak sampai atau Anda ingin skip proses ini, ikuti solusi di bawah.

---

## ✅ Solusi 1: Matikan Email Confirmation (RECOMMENDED untuk Development)

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com
   - Pilih project Anda

2. **Pergi ke Authentication Settings**
   - Klik "Authentication" di sidebar kiri
   - Klik tab "Providers"

3. **Edit Email Provider**
   - Klik pada "Email" provider
   - Scroll ke bawah hingga menemukan "Confirm email"

4. **Disable Email Confirmation**
   - **MATIKAN toggle "Confirm email"**
   - Klik "Save"

5. **Coba Daftar Lagi**
   - Gunakan email baru (atau hapus user lama di Supabase)
   - Daftar melalui `/auth/sign-up` atau `/setup-master`
   - Sekarang bisa langsung login tanpa konfirmasi email!

---

## ✅ Solusi 2: Konfirmasi Email Manual (Untuk Production)

Jika Anda ingin tetap menggunakan email confirmation:

### Cara 1: Via Email
1. Daftar akun baru
2. Cek inbox email (termasuk folder Spam/Junk)
3. Klik link konfirmasi dari Supabase
4. Setelah dikonfirmasi, bisa login

### Cara 2: Manual Confirmation di Supabase (Development Only)
1. Buka Supabase Dashboard
2. Klik "Authentication" > "Users"
3. Cari user yang baru didaftarkan
4. Klik user tersebut
5. Set "Email Confirmed" menjadi `true`
6. Save

---

## ✅ Solusi 3: Setup Master Account dengan Benar

Untuk membuat akun Master (role = 'master'):

### Langkah-langkah Lengkap:

1. **Matikan Email Confirmation** (lihat Solusi 1 di atas)

2. **Buka halaman setup master:**
   ```
   http://localhost:3000/setup-master
   ```

3. **Isi form:**
   ```
   Full Name: Master Admin
   Email: admin@yourcompany.com
   Phone: +62812345678 (opsional)
   Password: YourPassword123
   ```

4. **Klik "Create Master Account"**
   - Anda akan melihat pesan sukses
   - SQL query akan ditampilkan

5. **Jalankan SQL Query di Supabase:**
   ```sql
   UPDATE public.profiles 
   SET role = 'master' 
   WHERE email = 'admin@yourcompany.com';
   ```
   
   Caranya:
   - Buka Supabase Dashboard
   - Klik "SQL Editor"
   - Klik "New query"
   - Paste query di atas
   - Klik "Run"

6. **Login:**
   - Kembali ke `/auth/login`
   - Login dengan email dan password yang tadi dibuat
   - Anda akan masuk sebagai Master!

---

## 🔍 Debug: Cara Cek Status User

### Cek di Supabase Dashboard:

1. **Cek Auth Users:**
   - Buka "Authentication" > "Users"
   - Pastikan user ada dalam list
   - Cek kolom "Email Confirmed" (harus true atau email confirmation harus dimatikan)

2. **Cek Profile Role:**
   - Buka "Table Editor" > "profiles"
   - Cari user berdasarkan email
   - Pastikan kolom `role` = `master` (atau role yang diinginkan)

3. **Cek RLS Policies:**
   - Pastikan RLS policies sudah dibuat (jalankan scripts/002_create_rls_policies.sql)
   - Buka "Database" > "Policies"
   - Pastikan ada policies untuk table `profiles`

---

## ❌ Error Messages & Solusi

### 1. "Invalid login credentials"
**Penyebab:**
- Email belum dikonfirmasi (jika email confirmation aktif)
- Password salah
- User belum terdaftar

**Solusi:**
- Matikan email confirmation (Solusi 1)
- Atau konfirmasi email terlebih dahulu
- Cek password, minimal 6 karakter

### 2. "Email not confirmed"
**Penyebab:**
- Email confirmation masih aktif di Supabase

**Solusi:**
- Matikan email confirmation (Solusi 1)
- Atau konfirmasi email via link yang dikirim ke inbox

### 3. "User already registered"
**Penyebab:**
- Email sudah digunakan

**Solusi:**
- Gunakan email lain
- Atau login dengan email yang sudah terdaftar
- Atau hapus user lama di Supabase Dashboard

### 4. "Tidak ada tindakan setelah klik Sign Up"
**Penyebab:**
- Form tidak submit dengan benar
- atau Email confirmation sedang menunggu

**Solusi:**
- Matikan email confirmation (Solusi 1)
- Cek console browser untuk error (F12)
- Cek network tab untuk request yang gagal

### 5. Role tidak berubah ke Master
**Penyebab:**
- SQL query belum dijalankan
- Query salah

**Solusi:**
```sql
-- Cek role saat ini
SELECT id, email, role FROM public.profiles WHERE email = 'your@email.com';

-- Update ke master
UPDATE public.profiles SET role = 'master' WHERE email = 'your@email.com';

-- Verify
SELECT id, email, role FROM public.profiles WHERE email = 'your@email.com';
```

---

## 🎯 Checklist Setup Master (Step-by-Step)

- [ ] Matikan Email Confirmation di Supabase
- [ ] Jalankan script database (001, 002, 003)
- [ ] Buka `/setup-master`
- [ ] Isi form dan klik Create
- [ ] Copy SQL query yang muncul
- [ ] Buka Supabase SQL Editor
- [ ] Paste dan Run query
- [ ] Verify di Table Editor > profiles bahwa role = 'master'
- [ ] Login di `/auth/login`
- [ ] Seharusnya redirect ke `/dashboard/master`

---

## 📧 Untuk Production

Di production, sebaiknya:

1. **Aktifkan Email Confirmation** untuk keamanan
2. **Setup SMTP yang benar** di Supabase untuk kirim email
3. **Customize email template** di Supabase Dashboard
4. **Gunakan domain sendiri** untuk email sender
5. **Test email delivery** sebelum launch

---

## 🆘 Masih Ada Masalah?

1. Cek console log di browser (F12 > Console)
2. Cek Supabase Logs di Dashboard
3. Pastikan semua environment variables sudah diset
4. Coba clear cache browser
5. Coba logout dan login kembali
6. Coba dengan incognito/private window

---

## 📝 Catatan Penting

- Password minimal **6 karakter**
- Email harus valid dan unik
- Setelah update role, **logout dan login kembali**
- Master role memiliki akses penuh ke semua fitur
- Jangan share kredensial master di production!
