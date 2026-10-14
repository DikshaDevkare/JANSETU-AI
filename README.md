# JANSETU AI (जनसेतु AI)

**Tagline:** *One Platform. Every Citizen. Clear Next Steps.*  
*(एक मंच। हर नागरिक। स्पष्ट अगला कदम।)*

---

## 1. Project Overview

**JanSetu AI** is a multilingual, voice-enabled public-service platform designed to empower Indian citizens to:
1. **Discover verified government schemes** (Central & State level) with instant eligibility assessment.
2. **Navigate essential identity documents & services** (Aadhaar, PAN, Domicile, Driving License) with official fees, timelines, document readiness checklists, and video guides.
3. **Draft statutory civic complaints** (road potholes, garbage, water leaks, broken streetlights) automatically formatted for local municipal ward offices (BMC Mumbai) and central portals (CPGRAMS / Aaple Sarkar).
4. **Access 24x7 emergency helplines** (112, 108 ambulance, 1098 childline, 1930 cyber fraud) via single-tap calling without requiring any login.
5. **Interact seamlessly using Voice and Indian Languages** (English, हिन्दी, मराठी, and Hinglish) through Speech-to-Text (STT) and natural Text-to-Speech (TTS).
6. **Chat with a shared Grounded AI Assistant (JanSetu Mitra)** that provides answers backed by approved official sources with real verification dates and citations.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Custom Indian Government Portal Palette: Navy `#0F2B5C`, Saffron `#FF9933`, Emerald Green `#138808`, Glassmorphism, and Glass-Shine effects)
- **Internationalization:** `i18next` & `react-i18next` (English, Hindi, Marathi, Hinglish)
- **Icons:** `lucide-react`
- **Speech API:** Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) with sanitized plain-text audio reader

### Backend
- **Framework:** Python 3.12 with FastAPI
- **Data Validation:** Pydantic v2 with `ConfigDict`
- **Database & ORM:** SQLAlchemy with auto-seeding
- **Default Database:** SQLite (`jansetu.db`) with zero setup required; MySQL-ready via `DATABASE_URL`
- **Testing:** Pytest & FastAPI `TestClient`
- **RAG & Knowledge Engine:** Multilingual rule-based validation and source-grounded retrieval engine

---

## 3. Core Modules & Capabilities

### Module A — Schemes & Benefits (सरकारी योजनाएं)
- **12 Verified National & State Schemes:** PM-KISAN, Ayushman Bharat PM-JAY, Mukhyamantri Majhi Ladki Bahin Yojana (Maharashtra), PM Awas Yojana, Sukanya Samriddhi Yojana, PM Vishwakarma, PM Mudra, NSAP Old Age Pension, PM SVANidhi, Sanjay Gandhi Niradhar, PM Poshan, MahaDBT Scholarships.
- **Interactive Eligibility Assessment:** Checks age, gender, income, category, state, and landholding against published rules.
- **Interactive Document Checklist:** Citizens can tick off documents they possess, view readiness percentage (e.g. 75%), and bookmark the scheme.

### Module B — Civic Complaints (नागरिक शिकायत)
- **4-Step AI Grievance Assistant:**
  1. Category selection (Potholes, Garbage, Water disruption, Drainage, Streetlights, Fallen trees, Sanitation).
  2. Problem description with real-time Speech-to-Text microphone recording.
  3. Location & BMC Mumbai Ward selector (Ward A, C, D, F/N, G/S, H/W, K/E, K/W, P/N, R/C) + Landmark.
  4. Photo attachment (simulated upload preview under 5MB).
  5. AI-Assisted Formal Grievance Letter generation with unique reference code (e.g. `JS-MUM-2026-4819`), routed authority, direct links to BMC Portal (`portal.mcgm.gov.in`), WhatsApp Grievance (`+91 8999 22 8999`), and 1916 Control Room.

### Module C — Documents & Services (दस्तावेज़ एवं सेवाएं)
- **8 Essential Public Services:** Aadhaar address update, Instant e-PAN, Income Certificate, Domicile Certificate, Driving License, Ayushman Card, Voter ID (EPIC), Ration Card.
- **Document Readiness Checklist:** Shows verified alternative documents if a citizen lacks a primary document (e.g., Bank Passbook or Voter ID in lieu of Electricity Bill).
- **Watch & Learn Section:** Curated official video guides from UIDAI, Income Tax India, Parivahan, and MahaOnline.

### Module D — Emergency Help (आपातकालीन 112)
- **Instant No-Login Tap-to-Call Directory:**
  - `112` — National Unified Emergency (Police, Fire, Ambulance, Disaster)
  - `108 / 102` — Free Emergency Ambulance Service
  - `1098` — Childline India Child Protection
  - `1091 / 181` — Women in Distress Helpline
  - `1930` — National Cyber Crime & Financial Fraud
  - `1077 / 1070` — Disaster Management Control Room
  - `14416` — Tele-MANAS Mental Health Support
  - `1916` — BMC Mumbai Disaster & Civic Control
- **Dispatch Guidance:** Actionable instructions on what to tell the 112 dispatcher.
- **Text-to-Speech:** Listen to emergency instructions in your preferred language.

### Module E — Multilingual Interface
- Seamless live switching across **English**, **हिन्दी (Hindi)**, **मराठी (Marathi)**, and **Hinglish (हिंग्लिश)**.
- Persistent language preference saved in browser storage.

### Module F & G — Speech-to-Text & Text-to-Speech
- **Voice Dictation (STT):** Microphone integration with animated soundwave visualizer across the Universal Search Bar, Civic Complaint problem box, and AI Chatbot.
- **Voice Audio (TTS):** "Listen" buttons on AI answers, Scheme details, and Emergency instructions. Sanitizes raw markdown and URLs to produce natural speech.

### Module H — Floating AI Assistant (JanSetu Mitra)
- Persistent floating widget with Ashoka emblem badge.
- Grounded RAG knowledge retrieval with verified citations (`[Source: myscheme.gov.in, Last Verified: Oct 2026]`).
- Quick prompt suggestion chips and direct action buttons (Check Eligibility, Draft Complaint, Open Official Portal).

---

## 4. Quick Start Guide (Windows)

### Option 1: One-Click Startup (Recommended)
Simply double-click the included batch script:
```cmd
start_all.bat
```
*(Or in PowerShell: `.\start_all.ps1`)*

This script automatically:
1. Launches the FastAPI backend on `http://127.0.0.1:8000`.
2. Launches the React Vite frontend on `http://localhost:5173`.
3. Opens the website in your default browser.

---

### Option 2: Manual Terminal Execution

#### 1. Backend Setup:
```powershell
# Open terminal in project root
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Run FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

#### 2. Frontend Setup:
```powershell
# Open a second terminal in project root
cd frontend

# Install packages (if needed)
npm install

# Start Vite development server
npm run dev
```
- Web Application URL: `http://localhost:5173`

---

## 5. Running Automated Tests

Run backend tests from the project root:
```powershell
.\backend\venv\Scripts\python.exe -m pytest
```
**Results:** `9 passed in 0.76s` covering:
- Health check & database connectivity
- Scheme retrieval & category/state filters
- Eligibility evaluation logic
- Citizen services & prerequisites
- Civic complaint classification & draft generation
- Emergency helplines (112, 108, 1098, 1930)
- Voice API capabilities & languages
- Grounded AI Assistant chat with Hindi, Marathi, and Hinglish queries

To test frontend production build:
```powershell
cd frontend
npm run build
```
**Results:** `✓ built in 2.22s` with 0 TypeScript errors.

---

## 6. Statutory Disclaimer

JanSetu AI is an assistive civic-tech prototype developed for Algothon. It provides structured guidance grounded in officially published government portals (myscheme.gov.in, india.gov.in, services.india.gov.in, portal.mcgm.gov.in, and 112.gov.in). JanSetu AI does not claim to replace official statutory authorities, guarantee welfare approvals, or submit complaints without user confirmation on official government portals.
