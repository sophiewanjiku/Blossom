# 🌸 Blossom — Women's Period Health Tracker

> *A fairytale-themed reproductive health app built with React, Django, and love.*

---

## ✨ What is Blossom?

Blossom is a full-stack women's health application that helps users understand and track their reproductive health — wrapped in a beautiful, immersive fairytale design system. Choose your world, and the entire app transforms around you.

---

## 🏰 Fairytale Themes

Users pick a fairytale world during onboarding. Each theme changes **everything** — colors, typography, particle animations, AI chatbot personality, and cycle poetry.

| Theme | World | Particles | AI Companion |
|-------|-------|-----------|--------------|
| ❄️ Frozen | Ice & Snow | Falling snowflakes | Elsa-inspired |
| 🐸 Tiana | New Orleans Magic | Dancing fireflies | Tiana-inspired |
| 🏮 Rapunzel | Golden Tower | Floating lanterns | Rapunzel-inspired |
| ✨ Cinderella | Enchanted Ball | Glittering sparkles | Cinderella-inspired |

---

## 🌿 Core Features

### 🗓️ Cycle & Symptom Tracker
- Animated calendar with phase visualizations
- Daily log for symptoms, mood, flow, and notes
- Cycle history and pattern overview

### 🌱 Fertility & Conception Tracking
- Fertile window calculations
- Ovulation predictions
- Conception planning insights

### 💜 Women's Health Awareness
Expandable condition cards covering:
- Endometriosis
- PCOS (Polycystic Ovary Syndrome)
- Fibroids
- Adenomyosis
- Cervical Cancer
- Premature Ovarian Insufficiency (POI)

### 🤖 Luna — AI Health Chatbot
- Powered by the Anthropic API (Claude)
- Personality and name adapt to your chosen fairytale theme
- Answers health questions with care and nuance

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Framer Motion | UI animations & tab transitions |
| GSAP | Canvas-based particle animations |
| Zustand | Global state management |
| Axios | HTTP client |

### Backend
| Tool | Purpose |
|------|---------|
| Django + DRF | API server |
| PostgreSQL | Primary database |
| Redis | Email token caching & task queuing |
| Celery | Background tasks |
| djangorestframework-simplejwt | JWT authentication |
| Anthropic Python SDK | Luna AI integration |

### Infrastructure
| Tool | Purpose |
|------|---------|
| Docker Compose | Local development environment |
| Railway / Render | Planned cloud deployment |

---

## 🏗️ Project Structure

```
blossom/
├── frontend/               # React + TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── store/          # Zustand state stores
│   │   ├── themes/         # CSS variable theme definitions
│   │   ├── particles/      # GSAP canvas particle engines
│   │   └── api/            # Axios API calls
│   └── vite.config.ts
│
├── backend/                # Django API
│   ├── users/              # Custom user model + auth
│   ├── cycles/             # Cycle data models + prediction
│   ├── chat/               # Luna AI chatbot views
│   └── blossom/            # Django settings + URLs
│
└── docker-compose.yml
```

---

## 🎨 Design System

Blossom uses a **CSS variable-based theme architecture**. All four themes share identical variable names — switching themes changes only the `data-theme` attribute on the `<html>` element.

```css
/* Example — colors shift completely per theme */
[data-theme="frozen"]     { --color-primary: #a8d8f0; }
[data-theme="tiana"]      { --color-primary: #4a7c59; }
[data-theme="rapunzel"]   { --color-primary: #c9a84c; }
[data-theme="cinderella"] { --color-primary: #b8a9d9; }
```

The dark fairytale aesthetic is the settled, final design direction.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/blossom.git
cd blossom
```

### 2. Set up environment variables

**Backend** — create `backend/.env`:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=postgresql://postgres:password@db:5432/blossom
REDIS_URL=redis://redis:6379/0
ANTHROPIC_API_KEY=your-anthropic-api-key
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 3. Start with Docker

```bash
docker-compose up --build
```

### 4. Run migrations

```bash
docker-compose exec backend python manage.py migrate
```

### 5. Open the app

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Django Admin:** http://localhost:8000/admin

---

## 🔐 Auth Flow

1. **Sign up** — email, password (with strength scoring), and validation
2. **Email verification** — token sent via email, cached in Redis
3. **Onboarding** — 3-step wizard collecting:
   - Date of birth
   - Cycle length + last period date
   - Health conditions (optional)
   - Fairytale theme selection
4. **Dashboard** — fully personalized experience

---

## 📡 API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | Create account |
| `/api/auth/verify-email/` | POST | Confirm email token |
| `/api/auth/login/` | POST | Get JWT tokens |
| `/api/auth/onboarding/` | PATCH | Save onboarding data |
| `/api/cycles/` | GET/POST | Cycle data |
| `/api/chat/` | POST | Message Luna (AI) |

---

## 🧠 About This Project

Blossom was built with two goals in mind:

1. **Health education** — helping women understand their reproductive health in a warm, accessible way
2. **Learning by building** — exploring how algorithms, AI APIs, and full-stack architecture work in a real product

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">Made with 🌸 and a little bit of fairytale magic</p>
