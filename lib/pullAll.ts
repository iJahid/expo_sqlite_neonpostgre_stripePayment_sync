import { db } from "./db";
import { upsertLocalRow } from "./upsertLocal";

const TABLES = ["notes","tasks","projects"]

export async function pullAllChanges(userId:string){

  for (const table of TABLES) {

    const state = db.getFirstSync(
      "SELECT lastSync FROM _sync_state WHERE tableName=?",
      [table]
    )

    const lastSync = state?.lastSync ?? 0

   /* const res = await axios.post(
      "https://yourapi.com/api/pullTable",
      { userId, table, lastSync }
    )*/
   console.log("puling");
    const res = await fetch("/(api)/pullTable", {
      method: "POST",
      headers: {    
        "Content-Type": "application/json"
        },      
        body: JSON.stringify({ userId, table, lastSync })
    });
    
    const { rows, hasMore } = await res.json()

    console.log(`(PullAll.ts) Pulled ${rows.length} rows for table ${table}. Has more: ${hasMore}`)
    for (const row of rows) {
      upsertLocalRow(table, row)
    }

    db.runSync(
      "INSERT OR REPLACE INTO _sync_state VALUES (?,?)",
      [table, Date.now()]
    )
  }
}