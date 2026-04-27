import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req:Request){
  const { changes } = await req.json()
console.log(`Received ${changes.length} changes from client to sync with server.`)
  for (const c of changes) {
    const data = JSON.parse(c.payload)
console.log("tableName",c );
console.log("data",data );
    if (c.operation === "delete") {
    const qd=  await sql`
        UPDATE ${c.tableName}
        SET deleted=true, updated_at=${data.updatedAt}
        WHERE id=${c.recordId}
      `
      console.log(`Synced delete for record ${c.recordId} in table ${c.tableName} with server.`, qd)
    } else {

      if(c.tableName==="notes"){
        try{
        const q= await sql`INSERT INTO notes(id,userid,title,updatedat)
      VALUES(${data.id},${data.userId},${data.title},${data.updatedAt})
      ON CONFLICT (id) DO NOTHING;
      `
      console.log(`Synced change for record ${c.recordId} in table ${c.tableName} with server.`, q)
        }catch(e){
          console.error("Error syncing note to server:", e)
        }
      }
      else if(c.tableName==="projects"){
        try{  
        const q= await sql`INSERT INTO projects(id,userid,projectName,updatedat)
      VALUES(${data.id},${data.userId},${data.projectName},${data.updatedAt})
      ON CONFLICT (id) DO NOTHING;
      `
      console.log(`Synced change for record ${c.recordId} in table ${c.tableName} with server.`, q)
        }catch(e){
          console.error("Error syncing project to server:", e)
        }
      }
    }
  }

  return Response.json({ success:true })
}

/*
export async function POST(req: Request) {
  const notes = await req.json()
 console.log("apinotes",notes);
  for (const n of notes) {
    console.log("Syncing note to server...", n);
 const rs=   await sql`
      INSERT INTO notes(id,userid,title)
      VALUES(${n.id},${n.userId},${n.title})
      ON CONFLICT (id) DO NOTHING
    `
  }
 // console.log("Synced all notes to server.",rs.json())

  return Response.json({ success: true })
}*/