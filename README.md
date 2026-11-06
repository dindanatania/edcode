# 🎓 Learning Management System (LMS)

Platform Learning Management System full-stack yang dibangun menggunakan **FastAPI** (Backend) dan **Next.js 16 App Router** (Frontend).

---

## 📁 Struktur Direktori

```text
DINDA/
├── backend/                   # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/endpoints/  # Endpoints: auth, courses, enrollments
│   │   ├── core/              # Config, Database, Security (JWT & Bcrypt)
│   │   ├── models/            # SQLAlchemy ORM (User, Course, Module, Lesson, Enrollment)
│   │   ├── schemas/           # Pydantic Schemas (Request/Response DTO)
│   │   └── main.py            # FastAPI Entrypoint
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables
│   └── Dockerfile
│
├── frontend/                  # Next.js 16 App Router
│   ├── src/
│   │   ├── app/               # Landing page, (auth), (dashboard), courses
│   │   ├── components/        # Navbar, CourseCard, Layouts
│   │   ├── lib/               # API fetcher & Token handler
│   │   ├── services/          # auth, course, enrollment services
│   │   └── types/             # TypeScript definitions
│   ├── .env.local             # Frontend environment variables
│   └── Dockerfile
│
├── docker-compose.yml         # Menjalankan PostgreSQL, Backend, Frontend
└── README.md
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan Backend (FastAPI)

Buka terminal dan arahkan ke folder `backend`:
```powershell
cd backend
# Mengaktifkan Virtual Environment
.\venv\Scripts\activate

# Menjalankan Server FastAPI
uvicorn app.main:app --reload --port 8000
```
- **API URL**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 2. Menjalankan Frontend (Next.js)

Buka terminal baru dan arahkan ke folder `frontend`:
```powershell
cd frontend
# Menjalankan Development Server
npm run dev
```
- **Aplikasi Web**: [http://localhost:3000](http://localhost:3000)

---

### 3. Menjalankan via Docker Compose (Opsional)

Untuk menjalankan seluruh stack (PostgreSQL + FastAPI + Next.js):
```powershell
docker-compose up --build
```

---

## 🔑 Fitur Utama yang Sudah Siap

1. **Autentikasi & Otorisasi**:
   - Register akun (Siswa / Instruktur)
   - Login OAuth2 Bearer JWT
   - Penyimpanan token aman di localStorage & auto-injection pada request header.

2. **Manajemen Kursus**:
   - Katalog kursus publik
   - Relasi Modul & Pelajaran (*Lessons*) bertingkat
   - Pengajar dapat membuat dan mengelola kelasnya sendiri.

3. **Progress Belajar Siswa**:
   - Siswa dapat mendaftar (*enroll*) ke kursus
   - Pelacak progres pelajaran otomatis menghitung persentase kelulusan.

