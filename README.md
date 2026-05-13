# Portfolio v2 — Ridho Kusumo Hariadi

## "Defensible Portfolio"

**Headline:** Care-driven. Hospitality-tested. AI-augmented.

Portfolio website versi 2 dengan positioning baru: **Healthcare empathy + Hospitality operational discipline + AI-enabled productivity**.

### 🔗 Live Preview

Buka `index.html` di browser atau jalankan:

```bash
# Python 3
python -m http.server 8000
# lalu buka http://localhost:8000

# Atau dengan PHP
php -S localhost:8000
```

### 📁 Struktur

```
portfolio-v2/
├── index.html           # Halaman utama (Tailwind CSS inline)
├── images/
│   └── profile.jpg      # Foto profil
└── README.md            # Dokumentasi ini
```

### 🧱 Sections

| Section | Konten |
|---------|--------|
| **A. Hero — Executive Snapshot** | Nama, lokasi, visa, licence, headline + 3 CTA + Quick Facts + foto profil |
| **B. Bento Grid Value Proposition** | 6 kartu modular: Healthcare, Hospitality, AI/Vibe Coding, Mental Health+Law, Analytical Thinking, Credentials |
| **C. Experience Timeline** | 5 pengalaman dengan metric badges, skill tags, expandable responsibilities |
| **D. AI/Tech Showcase** | Automation stack + AI-Assisted Learning Workflow mini case study |
| **E. Credentials & Proof** | Ringkasan kredensial dalam grid compact |
| **F. Contact + AI Agent Ready** | Email, LinkedIn, Download CV + AI assistant integration point |

### 🎨 Desain

- **Dark-first** — hemat baterai OLED, sustainable
- **Tailwind CSS** — utility-first, via CDN (untuk development cepat)
- **Bento Layout** — mobile-first, grid modular di desktop
- **Aksesibilitas** — skip link, focus-visible, semantic HTML, aria-live, prefers-reduced-motion
- **Minimal JS** — hanya theme toggle, current year, scroll reveal, AI placeholder
- **prefers-reduced-motion** dihormati

### ⚡ Production Notes

Untuk production:
1. **Tailwind jangan pakai CDN** — compile via build pipeline dengan purge scanning agar CSS minimal
2. **AI assistant** — wajib lewat backend/serverless API, bukan langsung dari browser
3. **Tambahkan light-mode class** — jika toggle light mode ingin mengubah seluruh warna

### 📬 Kontak

- **Email:** ridho90@gmail.com
- **LinkedIn:** linkedin.com/in/ridho-hariadi
- **Lokasi:** Auckland, New Zealand

---

&copy; 2026 Ridho Kusumo Hariadi. Built for speed, accessibility, and low-carbon browsing.
