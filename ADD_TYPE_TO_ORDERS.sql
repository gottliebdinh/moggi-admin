-- SQL Script zum Hinzufügen der Typ-Spalte zur orders Tabelle
-- Führe dieses Script im Supabase SQL Editor aus

-- Typ-Spalte zur orders Tabelle hinzufügen
ALTER TABLE public.orders 
ADD COLUMN type TEXT;

-- Optional: Index, falls später nach Typ gefiltert wird
CREATE INDEX IF NOT EXISTS idx_orders_type ON public.orders(type);

-- Fertig! 🎉

