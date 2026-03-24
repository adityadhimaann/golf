import React from "react"
import { Outlet } from "react-router-dom"
import { Navbar } from "../components/layout/Navbar"

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      
      {/* Simple Footer built-in */}
      <footer className="border-t border-white/10 bg-navy-dark/50 py-12 mt-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">GC</span>
              </div>
              <span className="font-display font-semibold text-lg text-white">GolfCharity</span>
            </div>
            
            <p className="text-white/50 text-sm text-center md:text-left">
              © 2026 Golf Charity Subscription Platform. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Terms</a>
              <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Privacy</a>
              <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
