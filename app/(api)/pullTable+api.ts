import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request:Request){
  try{
     const body = await request.json();
      const { userId, table, lastSync } = body;
      const query = `
      SELECT *
      FROM ${table}
      WHERE userid = $1
      AND updatedat > $2
      ORDER BY updatedat ASC
      LIMIT 1000
      OFFSET 0;
      `
 const rows = await sql.query(query, [userId, lastSync])

console.log(`(PullTable.ts) Pulled ${rows.length} changes from table ${table} for user ${userId} since ${new Date(lastSync).toISOString()}`,rows)
   const hasMore = rows.length === 1000

    return Response.json({
      rows,
      hasMore,
      serverTime: Date.now() // mobile will store as next lastSync
    })
  }
  catch(e){
    console.error("Error in pullTable API:", e)
    return Response.json({ error: "Failed to pull changes" }, { status: 500 })
  }
}

