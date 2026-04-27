import { queueChange } from "@/lib/syncQueue"
import uuid from "react-native-uuid"
import { create } from "zustand"
import { db } from "../lib/db"

interface Project {
  id: string
  projectName: string
  synced: number
}

interface ProjectsState {
  projects: Project[]
  loadProjects: (userId: string) => void
  addProject: (userId: string, projectName: string) => void
  deleteProject: (id: string) => void
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],

  loadProjects: (userId) => {
    const data = db.getAllSync(
      "SELECT * FROM projects WHERE userId=? ORDER BY updatedAt DESC",
      [userId]
    )
    set({ projects: data as Project[] })
  },

  addProject: (userId, projectName) => {
    const id = uuid.v4().toString()
    const now = Date.now()
 const project = { id, userId, projectName, updatedAt:now, deleted:0 }
    db.runSync(
      "INSERT INTO projects (id,userId,projectName,synced,updatedAt,deleted) VALUES (?,?,?,?,?,?)",
      [id, userId, projectName, 0, now,0]
    )

    queueChange(userId, "projects", id, "insert", project)
    set((state) => ({
      projects: [{ id, projectName, synced: 0 }, ...state.projects],
    }))
  },

  deleteProject: (id) => {
    db.runSync("DELETE FROM projects WHERE id=?", [id])
    set((state) => ({
      projects: state.projects.filter((n) => n.id !== id),
    }))
  },
}))