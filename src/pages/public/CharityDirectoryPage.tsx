import React, { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, Heart, MapPin, Grid, List } from "lucide-react"
import { MOCK_CHARITIES } from "../../data/mockData"
import { Card, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"

export const CharityDirectoryPage = () => {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  
  const categories = useMemo(() => {
    const cats = new Set(MOCK_CHARITIES.map(c => c.category))
    return ["All", ...Array.from(cats)]
  }, [])

  const filteredCharities = useMemo(() => {
    return MOCK_CHARITIES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6"
          >
            <Heart size={32} className="text-emerald-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Find Your Cause
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70"
          >
            Explore the incredible organizations verified by our platform. Choose where your contributions go and make every swing count.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search charities..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-white placeholder:text-white/40 transition-all font-sans"
            />
          </div>

          <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2 snap-x">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat 
                    ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredCharities.map((charity, i) => (
              <motion.div
                key={charity.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col group overflow-hidden border-white/10 hover:border-emerald-500/30">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={charity.logo} 
                      alt={charity.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 bg-navy-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
                      {charity.category}
                    </div>
                  </div>
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {charity.name}
                    </h3>
                    <p className="text-white/60 line-clamp-3 mb-6 text-sm flex-1 leading-relaxed">
                      {charity.description}
                    </p>
                    <div className="pt-6 mt-auto border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Total Raised</span>
                        <span className="font-display font-bold text-white text-lg">
                          ${charity.totalImpact.toLocaleString()}
                        </span>
                      </div>
                      <Link to={`/charities/${charity.id}`}>
                        <Button variant="outline" size="sm" className="whitespace-nowrap hover:bg-emerald-500 hover:border-emerald-500 hover:text-white group-hover:border-emerald-500/50">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCharities.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Search className="text-white/30" size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">No charities found</h3>
            <p className="text-white/50">Try adjusting your search or category filters.</p>
            <Button 
              variant="ghost" 
              className="mt-6"
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
