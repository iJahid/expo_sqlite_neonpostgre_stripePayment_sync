import { isOnline } from "./network"
import { pullAllChanges } from "./pullAll"
import { pushAllChanges } from "./pushAll"

export async function fullSync(userId:string){
  if(!(await isOnline())) return

  await pushAllChanges(userId)   // all tables → server
  await pullAllChanges(userId)   // server → all tables
}