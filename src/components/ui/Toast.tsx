import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

const icons = {
  success: <CheckCircle className="text-emerald-400" size={20} />,
  error: <XCircle className="text-red-400" size={20} />,
  warning: <AlertCircle className="text-gold" size={20} />,
  info: <Info className="text-teal-400" size={20} />
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="flex w-full max-w-md items-start space-x-4 glass p-4 rounded-xl shadow-lg border-white/10 mb-3"
    >
      <div className="flex-shrink-0 pt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 w-0">
        <p className="text-sm font-medium text-white">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-white/70">{toast.message}</p>
        )}
      </div>
      <div className="flex flex-shrink-0 ml-4">
        <button
          className="inline-flex text-white/50 hover:text-white transition-colors"
          onClick={() => onDismiss(toast.id)}
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  )
}

// Simple Toast Container implementation for layout purposes
export const ToastContainer: React.FC<{ toasts: ToastMessage[], onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 sm:p-6 flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
