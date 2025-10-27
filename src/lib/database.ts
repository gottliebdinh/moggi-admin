import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Erstelle Datenbank-Verzeichnis falls es nicht existiert
const dbDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'moggi.db')
const db = new Database(dbPath)

// Initialisiere Tabellen
export function initDatabase() {
  // Räume Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tische Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 2,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
    )
  `)

  // Reservierungen Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Kapazitätsregeln Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS capacity_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      days TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      interval_minutes INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Ausnahmen Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS exceptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Datenbank initialisiert:', dbPath)
}

// Räume CRUD
export const rooms = {
  getAll: () => {
    const stmt = db.prepare(`
      SELECT r.*, 
             json_group_array(
               json_object('id', t.id, 'name', t.name, 'capacity', t.capacity)
             ) as tables
      FROM rooms r
      LEFT JOIN tables t ON r.id = t.room_id
      GROUP BY r.id
      ORDER BY r.name
    `)
    return stmt.all().map((room: any) => ({
      ...room,
      tables: room.tables ? JSON.parse(room.tables) : []
    }))
  },

  create: (name: string, description: string) => {
    const stmt = db.prepare('INSERT INTO rooms (name, description) VALUES (?, ?)')
    const result = stmt.run(name, description)
    return result.lastInsertRowid
  },

  update: (id: number, name: string, description: string) => {
    const stmt = db.prepare('UPDATE rooms SET name = ?, description = ? WHERE id = ?')
    return stmt.run(name, description, id)
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM rooms WHERE id = ?')
    return stmt.run(id)
  }
}

// Tische CRUD
export const tables = {
  create: (roomId: number, name: string, capacity: number) => {
    const stmt = db.prepare('INSERT INTO tables (room_id, name, capacity) VALUES (?, ?, ?)')
    const result = stmt.run(roomId, name, capacity)
    return result.lastInsertRowid
  },

  update: (id: number, name: string, capacity: number) => {
    const stmt = db.prepare('UPDATE tables SET name = ?, capacity = ? WHERE id = ?')
    return stmt.run(name, capacity, id)
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM tables WHERE id = ?')
    return stmt.run(id)
  }
}

// Reservierungen CRUD
export const reservations = {
  getAll: () => {
    const stmt = db.prepare(`
      SELECT id, date, time, guest_name as guestName, guests, tables, note, comment, status, duration, phone, email, source, type
      FROM reservations ORDER BY date ASC, time ASC
    `)
    return stmt.all()
  },

  getByDate: (date: string) => {
    const stmt = db.prepare(`
      SELECT id, date, time, guest_name as guestName, guests, tables, note, comment, status, duration, phone, email, source, type
      FROM reservations WHERE date = ? ORDER BY time ASC
    `)
    return stmt.all(date)
  },

  getById: (id: number) => {
    const stmt = db.prepare(`
      SELECT id, date, time, guest_name as guestName, guests, tables, note, comment, status, duration, phone, email, source, type
      FROM reservations WHERE id = ?
    `)
    return stmt.get(id)
  },

  create: (data: any) => {
    const stmt = db.prepare(`
      INSERT INTO reservations 
      (date, time, guest_name, guests, tables, note, comment, status, duration, phone, email, source, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.date, data.time, data.guestName, data.guests, data.tables,
      data.note, data.comment, data.status, data.duration, data.phone,
      data.email, data.source, data.type
    )
    return result.lastInsertRowid
  },

  update: (id: number, data: any) => {
    const stmt = db.prepare(`
      UPDATE reservations SET 
      date = ?, time = ?, guest_name = ?, guests = ?, tables = ?, 
      note = ?, comment = ?, status = ?, duration = ?, phone = ?, 
      email = ?, source = ?, type = ?
      WHERE id = ?
    `)
    return stmt.run(
      data.date, data.time, data.guestName, data.guests, data.tables,
      data.note, data.comment, data.status, data.duration, data.phone,
      data.email, data.source, data.type, id
    )
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM reservations WHERE id = ?')
    return stmt.run(id)
  }
}

// Kapazitätsregeln CRUD
export const capacityRules = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM capacity_rules ORDER BY start_time')
    return stmt.all()
  },

  create: (data: any) => {
    const stmt = db.prepare(`
      INSERT INTO capacity_rules (days, start_time, end_time, capacity, interval_minutes)
      VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(data.days, data.startTime, data.endTime, data.capacity, data.interval)
    return result.lastInsertRowid
  },

  update: (id: number, data: any) => {
    const stmt = db.prepare(`
      UPDATE capacity_rules SET 
      days = ?, start_time = ?, end_time = ?, capacity = ?, interval_minutes = ?
      WHERE id = ?
    `)
    return stmt.run(data.days, data.startTime, data.endTime, data.capacity, data.interval, id)
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM capacity_rules WHERE id = ?')
    return stmt.run(id)
  }
}

// Ausnahmen CRUD
export const exceptions = {
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM exceptions ORDER BY date')
    return stmt.all()
  },

  create: (date: string) => {
    const stmt = db.prepare('INSERT INTO exceptions (date) VALUES (?)')
    const result = stmt.run(date)
    return result.lastInsertRowid
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM exceptions WHERE id = ?')
    return stmt.run(id)
  }
}

// Initialisiere Datenbank beim Import
initDatabase()

export default db
