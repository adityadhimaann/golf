import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LayoutDashboard } from "lucide-react"
import { Button } from "../ui/Button"
import { cn } from "../../lib/utils"

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    // Check login status on mount and when location changes
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    setIsLoggedIn(!!token)
    if (storedUser) setUser(JSON.parse(storedUser))

    return () => window.removeEventListener("scroll", handleScroll)
  }, [location])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: "How it Works", path: "/#how-it-works" },
    { name: "Charities", path: "/charities" },
    { name: "Pricing", path: "/pricing" },
  ]

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard'

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-navy-dark/80 backdrop-blur-lg border-b border-white/10 py-3" : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
                <span className="text-white font-display font-bold text-xl">GC</span>
              </div>
              <span className="font-display font-semibold text-xl tracking-tight hidden sm:block">
                Golf<span className="text-emerald-400">Charity</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <Link to={dashboardPath}>
                  <Button variant="primary" size="sm" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white">
                    <LayoutDashboard size={16} className="mr-2" /> Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">Subscribe Now</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy-dark/95 backdrop-blur-xl pt-24 pb-6 px-4 flex flex-col md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-6 items-center text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-2xl font-display font-medium text-white hover:text-emerald-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px w-full max-w-xs bg-white/10 my-4" />
              <div className="flex flex-col w-full max-w-xs gap-4">
                {isLoggedIn ? (
                  <Link to={dashboardPath} className="w-full">
                    <Button variant="primary" size="lg" className="w-full">
                      <LayoutDashboard size={20} className="mr-2" /> Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <Button variant="outline" size="lg" className="w-full">Log In</Button>
                    </Link>
                    <Link to="/signup" className="w-full">
                      <Button variant="primary" size="lg" className="w-full">Subscribe Now</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
