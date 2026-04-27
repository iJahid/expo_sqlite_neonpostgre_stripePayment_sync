import { queueChange } from "@/lib/syncQueue"
import uuid from "react-native-uuid"
import { create } from "zustand"
import { db } from "../lib/db"

interface Note {
  id: string
  title: string
  synced: number
}

interface NotesState {
  notes: Note[]
  loadNotes: (userId: string) => void
  addNote: (userId: string, title: string) => void
  deleteNote: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],

  loadNotes: (userId) => {
    const data = db.getAllSync(
      "SELECT * FROM notes WHERE userId=? ORDER BY updatedAt DESC",
      [userId]
    )
    set({ notes: data as Note[] })
  },

  addNote: (userId, title) => {
    const id = uuid.v4().toString()
    const now = Date.now()
 const note = { id, userId, title, updatedAt:now, deleted:0 }
    db.runSync(
      "INSERT INTO notes (id,userId,title,synced,updatedAt,deleted) VALUES (?,?,?,?,?,?)",
      [id, userId, title, 0, now,0]
    )

    queueChange(userId, "notes", id, "insert", note)
    set((state) => ({
      notes: [{ id, title, synced: 0 }, ...state.notes],
    }))
  },

  deleteNote: (id) => {
    db.runSync("DELETE FROM notes WHERE id=?", [id])
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }))
  },
}))