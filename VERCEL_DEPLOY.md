# Vercel Deployment Guide für MOGGI Admin Dashboard

## ✅ Voraussetzungen

1. **Vercel Account** (kostenlos auf [vercel.com](https://vercel.com))
2. **Supabase Projekt** (bereits konfiguriert)
3. **GitHub/GitLab/Bitbucket Repository** (optional, aber empfohlen)

## 🚀 Deployment-Schritte

### 1. Repository vorbereiten

```bash
cd moggi-admin-dashboard
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 2. Projekt auf Vercel importieren

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf **"Add New..."** → **"Project"**
3. Importiere dein Repository (GitHub/GitLab/Bitbucket) oder:
   - **"Deploy Git Repository"** → Wähle dein Repository
   - Oder **"Import Third-Party Git Repository"** falls lokal

### 3. Build-Einstellungen

Vercel erkennt automatisch Next.js-Projekte. Die Einstellungen sollten sein:
- **Framework Preset**: Next.js
- **Root Directory**: `moggi-admin-dashboard` (falls im Root, dann `.`)
- **Build Command**: `npm run build` (automatisch)
- **Output Directory**: `.next` (automatisch)
- **Install Command**: `npm install` (automatisch)

### 4. Environment-Variablen setzen

In Vercel Dashboard → **Settings** → **Environment Variables**:

#### Erforderliche Variablen:

```bash
# Admin Passwort (WICHTIG!)
ADMIN_PASSWORD=dein-sicheres-passwort

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Resend API Key (für E-Mail-Versand)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**Wichtig:**
- Setze die Variablen für **alle Environments** (Production, Preview, Development)
- `ADMIN_PASSWORD` sollte **NICHT** in Git committed werden!
- `SUPABASE_SERVICE_ROLE_KEY` ist **geheim** - nicht öffentlich teilen!

### 5. Deploy

1. Klicke auf **"Deploy"**
2. Warte auf den Build (ca. 2-5 Minuten)
3. Nach erfolgreichem Deploy erhältst du eine URL: `https://moggi-admin.vercel.app`

### 6. Domain anpassen (Optional)

1. **Settings** → **Domains**
2. Füge deine eigene Domain hinzu (z.B. `admin.moggi-restaurant.de`)
3. Folge den DNS-Anweisungen

## ✅ Nach dem Deployment prüfen

1. Öffne die Vercel-URL
2. Du solltest die **Login-Seite** sehen
3. Logge dich mit dem `ADMIN_PASSWORD` ein
4. Teste alle Funktionen:
   - ✅ Bestellungen anzeigen
   - ✅ Reservierungen verwalten
   - ✅ Tische konfigurieren
   - ✅ Einstellungen ändern

## 🔒 Sicherheitshinweise

1. **Passwort ändern**: Verwende ein starkes Passwort für `ADMIN_PASSWORD`
2. **HTTPS**: Vercel verwendet automatisch HTTPS
3. **Cookies**: Werden automatisch als `secure` gesetzt (Production)
4. **Environment Variables**: Niemals in Git committen!

## 🐛 Troubleshooting

### Problem: "Build failed"
**Lösung**: 
- Prüfe die Build-Logs in Vercel
- Stelle sicher, dass alle Dependencies installiert werden können
- Prüfe, ob `better-sqlite3` entfernt wurde (wird nicht benötigt)

### Problem: "Environment variables missing"
**Lösung**:
- Prüfe in Vercel Dashboard → Settings → Environment Variables
- Stelle sicher, dass alle Variablen für das richtige Environment gesetzt sind

### Problem: "Supabase connection failed"
**Lösung**:
- Prüfe, ob `NEXT_PUBLIC_SUPABASE_URL` und Keys korrekt sind
- Teste die Supabase-Verbindung lokal zuerst

### Problem: "Login funktioniert nicht"
**Lösung**:
- Prüfe, ob `ADMIN_PASSWORD` in Vercel gesetzt ist
- Stelle sicher, dass das Cookie `secure` Flag in Production funktioniert

## 📝 Environment-Variablen Checkliste

- [ ] `ADMIN_PASSWORD` - Admin-Login Passwort
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase Projekt URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase Anon Key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase Service Role Key
- [ ] `RESEND_API_KEY` - Optional, für E-Mail-Versand

## 🎉 Erfolg!

Wenn alles funktioniert, hast du jetzt:
- ✅ Passwort-geschütztes Admin-Dashboard
- ✅ HTTPS-gesicherte Verbindung
- ✅ Automatische Deployments bei Git-Push
- ✅ Skalierbare Serverless-Infrastruktur

---

**Viel Erfolg mit deinem Deployment! 🚀**

