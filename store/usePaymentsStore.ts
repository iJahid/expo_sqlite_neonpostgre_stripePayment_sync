import { queueChange } from "@/lib/syncQueue"
import uuid from "react-native-uuid"
import { create } from "zustand"
import { db } from "../lib/db"

interface Payment {
  id: string
  userId: string
  fullName: string
  email: string
  payAmount: number
  updatedAt: number
  deleted: number
}

interface PaymentsState {
  payments: Payment[]
  loadPayments: (userId: string) => void
  addPayment: (userId: string, fullName: string, email: string, payAmount: number) => void
  deletePayment: (id: string) => void
}

export const usePaymentsStore = create<PaymentsState>((set) => ({
  payments: [],

  loadPayments: (userId) => {
    const data = db.getAllSync(
      "SELECT * FROM payments WHERE userId=? ORDER BY updatedAt DESC",
      [userId]
    )
    set({ payments: data as Payment[] })
  },

  addPayment: (userId, fullName, email, payAmount) => {
    const id = uuid.v4().toString()
    const now = Date.now()
    const payment = { id, userId, fullName, email, payAmount, updatedAt:now, deleted:0 }
    db.runSync(
      "INSERT INTO payments (id,userId,fullName,email,payAmount,synced,updatedAt,deleted) VALUES (?,?,?,?,?,?,?,?,?)",
      [id, userId, fullName, email, payAmount, 0, now,0]
    )

    queueChange(userId, "payments", id, "insert", payment)
    set((state) => ({
      payments: [{ id, userId, fullName, email, payAmount, updatedAt: now, deleted: 0 }, ...state.payments],
    }))
  },

  deletePayment: (id) => {
    db.runSync("DELETE FROM payments WHERE id=?", [id])
    set((state) => ({
      payments: state.payments.filter((n) => n.id !== id),
    }))
  },
}))