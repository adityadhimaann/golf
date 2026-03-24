import React from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Heart, Globe, Users, Trophy } from "lucide-react"
import { MOCK_CHARITIES } from "../../data/mockData"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"

export const CharityProfilePage = () => {
  const { id } = useParams()
  // Mock data fetching based on ID, fallback to first if not found 
  const charity = MOCK_CHARITIES.find(c => c.id === id) || MOCK_CHARITIES[0]

  return (
    <div className="min-h-screen">
      {/* Hero Header with Background Image */}
      <div className="relative h-[60vh] md:h-[70vh] w-full flex items-end pb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src={charity.logo} 
            alt={charity.name} 
            className="w-full h-full object-cover block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link to="/charities" className="inline-flex items-center text-white/50 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
            Back to Directory
          </Link>
          
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold tracking-wider uppercase mb-6"
            >
              {charity.category}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight"
            >
              {charity.name}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-6 items-center"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/50 uppercase tracking-widest mb-1">Impact to Date</span>
                <span className="text-3xl font-display font-bold text-gold">${charity.totalImpact.toLocaleString()}</span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20 mx-2" />
              <Link to="/signup">
                <Button variant="primary" size="lg" className="shadow-[0_0_20px_rgba(16,185,129,0.3)] min-w-[200px]">
                  <Heart className="mr-2" size={18} fill="currentColor" />
                  Support This Cause
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-400 rounded-full" />
                About Our Mission
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed">
                <p>
                  {charity.description}
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in odio diam. Mauris interdum diam nec aliquet elementum. Vestibulum varius mi vulputate, tempor magna dictum, sagittis ipsum. Etiam quis enim accumsan, elementum dolor sit amet, efficitur ligula. Phasellus et odio sed elit varius tempor at quis sem. 
                </p>
                <p>
                  Donec ac hendrerit magna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi venenatis, justo eget volutpat cursus, erat sapien varius nulla, ut feugiat felis tortor et magna. 
                </p>
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-400 rounded-full" />
                Impact Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: Trophy, label: "Lives Affected", value: "Over 25,000" },
                  { icon: Globe, label: "Communities Reached", value: "48 Regions" },
                  { icon: Heart, label: "Funding Directed", value: "92% direct to programs" },
                  { icon: Users, label: "Active Volunteers", value: "1,200+" }
                ].map((stat, i) => (
                  <Card key={i} className="p-6 border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <stat.icon size={20} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
                        <div className="text-sm font-medium text-white/50">{stat.label}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card glass className="p-8 border-emerald-500/20 shadow-[0_4px_30px_rgb(16,185,129,0.05)] sticky top-32">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex flex-col items-center justify-center mb-4">
                    <Heart className="text-emerald-400" size={24} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Ready to contribute?</h3>
                  <p className="text-sm text-white/60">
                    Subscribe to the charity draw and allocate your impact directly to {charity.name}.
                  </p>
                </div>
                
                <Link to="/signup" className="block mb-4">
                  <Button variant="primary" className="w-full">Choose this Charity</Button>
                </Link>
                
                <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Current Monthly Support</span>
                    <span className="font-semibold text-white">~$14,500</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Golf Charity Rank</span>
                    <span className="font-semibold text-white">#4</span>
                  </div>
                </div>
                
                <button className="w-full mt-6 py-3 px-4 border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  Visit Official Website <ExternalLink size={14} />
                </button>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  )
}
