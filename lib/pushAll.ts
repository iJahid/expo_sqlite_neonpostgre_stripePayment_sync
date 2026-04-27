import { db } from "./db"

export async function pushAllChanges(userId:string){
  const changes = db.getAllSync(
    "SELECT * FROM _sync_queue ORDER BY updatedAt"
  )
  console.log("Queued changes to push:", changes)

  if (changes.length === 0) return
    const s=  await fetch("/(api)/syncme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, changes })
  })

  console.log("Sync response status:", s.status)
  if (!s.ok) {
    console.error("Failed to push changes:", await s.text())
    return
  }

  const result = await s.json()
  console.log("Sync result:", result)

  db.runSync("DELETE FROM _sync_queue")
}