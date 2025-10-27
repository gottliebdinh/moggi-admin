# Supabase-Konfiguration für MOGGI Admin Dashboard

## 🚀 Schnellstart

Das Admin Dashboard ist jetzt bereit für Supabase! Du musst nur noch die Umgebungsvariablen konfigurieren.

## 📋 Schritt-für-Schritt Anleitung

### 1. Supabase-Projekt erstellen (falls noch nicht vorhanden)

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt oder verwende das bestehende MOGGI-Projekt
3. Notiere dir die **Project URL** und **API Keys**

### 2. Supabase-Tabellen erstellen

Führe dieses SQL im **Supabase SQL Editor** aus:

```sql
-- Räume Tabelle
CREATE TABLE public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tische Tabelle
CREATE TABLE public.tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservierungen Tabelle
CREATE TABLE public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guest_name TEXT NOT NULL,
  guests INTEGER NOT NULL,
  tables TEXT,
  note TEXT,
  comment TEXT,
  status TEXT DEFAULT 'placed',
  duration INTEGER DEFAULT 120,
  phone TEXT,
  email TEXT,
  source TEXT DEFAULT 'manual',
  type TEXT DEFAULT 'Abendessen',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kapazitätsregeln Tabelle
CREATE TABLE public.capacity_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  days TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity INTEGER NOT NULL,
  interval_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ausnahmen Tabelle (geschlossene Tage)
CREATE TABLE public.exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Umgebungsvariablen konfigurieren

Erstelle oder aktualisiere die `.env.local` Datei im `moggi-admin-dashboard` Verzeichnis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Wo finde ich die Keys?**
- Gehe zu deinem Supabase-Projekt
- Klicke auf **Settings** → **API**
- Kopiere:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Admin Dashboard neu starten

```bash
# Stoppe den aktuellen Server (Ctrl+C)
# Dann starte neu:
npm run dev
```

### 5. Testen

1. Öffne [http://localhost:3000](http://localhost:3000)
2. Gehe zu **Tische** → **Raum hinzufügen**
3. Erstelle einen Test-Raum
4. Prüfe in Supabase Dashboard: **Table Editor** → **rooms**

## ✅ Erfolg!

Wenn alles funktioniert, siehst du:
- ✅ Keine Fehlermeldungen in der Konsole
- ✅ Daten werden in Supabase gespeichert
- ✅ Admin Dashboard funktioniert vollständig

## 🔗 Verbindung zur MOGGI App

Das Admin Dashboard nutzt jetzt dieselbe Supabase-Datenbank wie die MOGGI App:
- **Gemeinsame Reservierungen**
- **Synchronisierte Tische und Räume**
- **Einheitliche Datenstruktur**

## 🆘 Hilfe

**Problem:** "Missing Supabase environment variables"
**Lösung:** Überprüfe die `.env.local` Datei und stelle sicher, dass alle Keys korrekt sind.

**Problem:** "relation does not exist"
**Lösung:** Führe das SQL-Script im Supabase SQL Editor aus.

**Problem:** API gibt HTML statt JSON zurück
**Lösung:** Starte den Server neu nach Änderungen an `.env.local`.

---

**🎉 Viel Erfolg mit deinem MOGGI Admin Dashboard!**
