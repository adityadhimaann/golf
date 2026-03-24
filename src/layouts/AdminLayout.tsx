import React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/layout/Sidebar"

export const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar isAdmin={true} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Background glow effects specific to admin */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 w-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
