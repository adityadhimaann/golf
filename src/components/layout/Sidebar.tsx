import React, { useState } from "react"
import { NavLink, useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Target, 
  Ticket, 
  Heart, 
  Trophy,
  Users,
  Building2,
  BarChart3,
  LogOut,
  Settings,
  ShieldCheck
} from "lucide-react"
import { cn } from "../../lib/utils"

interface SidebarProps {
  isAdmin?: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const [collapsed, setCollapsed] = useState(false)

  const userLinks = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard", exact: true },
    { icon: Target, label: "My Scores", path: "/dashboard/scores" },
    { icon: Ticket, label: "My Draws", path: "/dashboard/draws" },
    { icon: Heart, label: "Charity", path: "/dashboard/charity" },
    { icon: Trophy, label: "Winnings", path: "/dashboard/winnings" },
    { icon: Settings, label: "Settings", path: "/dashboard/profile" },
  ]

  const adminLinks = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin", exact: true },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Ticket, label: "Draws", path: "/admin/draws" },
    { icon: Building2, label: "Charities", path: "/admin/charities" },
    { icon: Trophy, label: "Winners", path: "/admin/winners" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  ]

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isUserAdmin = storedUser?.role === 'admin';

  const navigate = useNavigate()
  const links = isAdmin ? adminLinks : userLinks
  
  if (!isAdmin && isUserAdmin) {
    // Add admin portal entry point to dashboard sidebar
    userLinks.push({ icon: ShieldCheck, label: "Admin Portal", path: "/admin" } as any);
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate("/")
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.1 }}
      className="sticky top-0 h-screen glass border-r border-white/10 flex flex-col shrink-0 z-40"
    >
      <div className="p-4 flex items-center justify-between min-h-[80px]">
        {/* Logo and App Name */}
        <Link to="/" className={cn("flex items-center gap-3 overflow-hidden group/logo transition-transform hover:scale-105", collapsed && "justify-center w-full")}>
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-display font-bold">GC</span>
          </div>
          {!collapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-display font-semibold text-lg whitespace-nowrap"
            >
              {isAdmin ? "Admin Portal" : "Member Area"}
            </motion.span>
          )}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-white/10 border border-white/20 p-1 rounded-full text-white/70 hover:text-white backdrop-blur-md z-50 transition-colors hover:bg-white/20"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.exact}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap group relative",
              isActive 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "text-white/70 hover:bg-white/5 hover:text-white border border-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent z-[-1]"
                  />
                )}
                <link.icon size={22} className={cn("shrink-0", isActive ? "text-emerald-400" : "group-hover:text-white")} />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                    {link.label}
                  </motion.span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-all duration-200 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 group overflow-hidden whitespace-nowrap",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={22} className="shrink-0" />
          {!collapsed && <span className="font-medium">Log Out</span>}
        </button>
      </div>
    </motion.aside>
  )
}
