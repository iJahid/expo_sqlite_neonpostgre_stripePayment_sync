import { db } from "./db"

export function upsertLocalRow(table:string,row:any){
  const cols = Object.keys(row)
  const values = Object.values(row)
  const placeholders = cols.map(()=>"?").join(",")
  
  console.log(`Upserting row into local table ${table}:`, values)
 
 
  db.runSync(
   `INSERT OR REPLACE INTO ${table} (${cols.join(",")})
     VALUES (${placeholders})`,
     values
     
  )
}