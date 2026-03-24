import React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/layout/Sidebar"

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar isAdmin={false} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Background glow effects specific to dashboard */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
