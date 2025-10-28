-- SQL Script zum Hinzufügen der Notizen-Spalte zur orders Tabelle
-- Führe dieses Script in Supabase SQL Editor aus

-- Notizen-Spalte zur orders Tabelle hinzufügen
ALTER TABLE public.orders 
ADD COLUMN note TEXT;

-- Optional: Index für bessere Performance bei Suche nach Notizen
CREATE INDEX IF NOT EXISTS idx_orders_note ON public.orders(note);

-- Fertig! 🎉
-- Die orders Tabelle hat jetzt eine 'note' Spalte für Notizen/Besondere Wünsche
