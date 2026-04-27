import * as SQLite from "expo-sqlite"

export const db = SQLite.openDatabaseSync("app.db")

export function initDB() {
  db.execSync(`
   
    CREATE TABLE IF NOT EXISTS notes(
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      title TEXT,
      synced INTEGER DEFAULT 0,
      updatedAt BIGINT,
      deleted INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS projects(
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      projectName TEXT,
      synced INTEGER DEFAULT 0,
      updatedAt BIGINT,
      deleted INTEGER DEFAULT 0
    );
     CREATE TABLE IF NOT EXISTS payments(
      id TEXT PRIMARY KEY NOT NULL,
      userId TEXT,
      fullName TEXT,
      email TEXT,
      payAmount INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 0,
      updatedAt BIGINT,
      deleted INTEGER DEFAULT 0
    );
     
  
  CREATE TABLE IF NOT EXISTS _sync_queue(
  id TEXT PRIMARY KEY,
  tableName TEXT,
  recordId TEXT,
  operation TEXT, -- insert/update/delete
  payload TEXT,
  updatedAt INTEGER
);

CREATE TABLE IF NOT EXISTS _sync_state(
  tableName TEXT PRIMARY KEY,
  lastSync INTEGER
);





  `)
}