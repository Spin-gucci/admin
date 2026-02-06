# Quick Start Guide - Admin Dashboard

## 🚀 Cara Cepat Mulai (5 Menit)

### Step 1: Disable Email Confirmation (PENTING!)

1. Buka [Supabase Dashboard](https://supabase.com)
2. Pilih project Anda
3. Klik **Authentication** → **Providers**
4. Klik **Email**
5. **Matikan toggle "Confirm email"**
6. Klik **Save**

> ⚠️ Ini wajib dilakukan agar bisa langsung login tanpa konfirmasi email!

---

### Step 2: Setup Master Account

#### Pilihan A: Via Web UI (Mudah)

1. **Buka halaman setup:**
   ```
   http://localhost:3000/setup-master
   ```

2. **Isi form:**
   - Full Name: `Master Admin`
   - Email: `admin@yourcompany.com`
   - Password: `YourPassword123` (min 6 karakter)
   - Phone: (opsional)

3. **Klik "Create Master Account"**

4. **Copy SQL query** yang ditampilkan:
   ```sql
   UPDATE public.profiles SET role = 'master' WHERE email = 'admin@yourcompany.com';
   ```

5. **Jalankan di Supabase:**
   - Buka Supabase Dashboard
   - Klik **SQL Editor**
   - Klik **New query**
   - Paste query di atas
   - Klik **Run**

6. **Login:**
   - Kembali ke `/auth/login`
   - Login dengan email & password tadi
   - Selesai! ✅

#### Pilihan B: Via Sign Up Normal

1. **Sign up biasa** di `/auth/sign-up`
2. **Jalankan SQL di Supabase:**
   ```sql
   UPDATE public.profiles 
   SET role = 'master' 
   WHERE email = 'your-email@example.com';
   ```
3. **Login** di `/auth/login`

---

### Step 3: Verifikasi Setup Berhasil

#### Cara 1: Via Debug Page
```
http://localhost:3000/debug-auth
```
- Cek **Authentication Status**: harus "Logged In"
- Cek **Profile Status**: harus "Found"
- Cek **Role**: harus "MASTER"

#### Cara 2: Via Supabase Dashboard
1. Buka **Table Editor** → **profiles**
2. Cari email Anda
3. Pastikan kolom `role` = `master`

---

## ✅ Checklist Setup

- [ ] Email confirmation sudah dimatikan di Supabase
- [ ] Database scripts sudah dijalankan (001, 002, 003)
- [ ] Master account sudah dibuat via `/setup-master`
- [ ] SQL query upgrade role sudah dijalankan
- [ ] Bisa login dan masuk ke dashboard master
- [ ] Role = 'master' di database

---

## 🎯 Akses Dashboard

Setelah login sebagai Master, Anda bisa akses:

- **Master Dashboard**: `/dashboard/master`
- **User Management**: `/dashboard/users`
- **Transactions**: `/dashboard/transactions`
- **Products**: `/dashboard/products`
- **Activity Logs**: `/dashboard/activity`

---

## ❓ Troubleshooting Cepat

### "Invalid login credentials"
- ✅ Pastikan email confirmation sudah dimatikan
- ✅ Pastikan password benar (min 6 karakter)

### "Tidak redirect setelah sign up"
- ✅ Cek browser console (F12) untuk error
- ✅ Pastikan Supabase connection aktif

### "Role bukan master"
- ✅ Jalankan SQL query upgrade role
- ✅ Logout dan login kembali
- ✅ Cek di Supabase Table Editor

### Masih bermasalah?
- 📖 Baca [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) lengkap
- 🔍 Cek `/debug-auth` untuk diagnostic
- 📝 Cek [FIX_SUMMARY.md](./FIX_SUMMARY.md) untuk detail fixes

---

## 📚 Dokumentasi Lengkap

- **[MASTER_SETUP.md](./MASTER_SETUP.md)** - Setup master account detail
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Panduan troubleshooting lengkap
- **[FIX_SUMMARY.md](./FIX_SUMMARY.md)** - Summary fixes yang sudah dilakukan

---

## 🔐 Role Hierarchy

1. **Master** (Tertinggi)
   - Full access ke semua fitur
   - Bisa manage admin, agent, customer
   - Bisa lihat semua activity logs

2. **Admin**
   - Manage agent dan customer
   - Approve transactions
   - Manage products

3. **Agent**
   - Input transactions
   - View customer data

4. **Customer** (Terendah)
   - View own profile
   - View own transactions
   - Make purchase requests

---

## 🎉 Selesai!

Sekarang Anda siap menggunakan Admin Dashboard dengan role Master!

Jika ada masalah, cek:
1. `/debug-auth` - Status authentication
2. Console browser (F12) - Error messages
3. Supabase Dashboard - Database & logs
4. `TROUBLESHOOTING.md` - Panduan lengkap
