import uuid from "react-native-uuid"
import { db } from "./db"
import { fullSync } from "./fullSync"

export function queueChange(
  userId:string,
  tableName:string,
  recordId:string,
  operation:"insert"|"update"|"delete",
  payload:any
){
  
  db.runSync(
    `INSERT INTO _sync_queue VALUES (?,?,?,?,?,?)`,
    [
      uuid.v4(),
      tableName,
      recordId,
      operation,
      JSON.stringify(payload),
      Date.now()
    ]
  )
  fullSync(userId) // trigger sync immediately after queuing a change
}