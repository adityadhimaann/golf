import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, Target, Trophy, Heart, CheckCircle2 } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import { StatCounter } from "../../components/ui/StatCounter"
import { MOCK_STATS, MOCK_CHARITIES } from "../../data/mockData"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

export const LandingPage = () => {
  const featuredCharity = MOCK_CHARITIES.find(c => c.featured)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
        
        <div className="container relative mx-auto px-4 sm:px-6 z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Over $1.2M Donated to Charity This Year
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight">
              Play Your Game. <br/>
              <span className="text-gradient">Change The World.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Join the premium golf subscription where your on-course scores fund life-changing charities and enter you into spectacular monthly prize draws.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 group">
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <Link to="/#how-it-works">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                  How It Works
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="px-4 py-4 md:py-0"
            >
              <h3 className="text-4xl md:text-5xl font-display font-bold text-gradient-gold mb-2">
                <StatCounter value={MOCK_STATS.totalPrizePool} prefix="$" />
              </h3>
              <p className="text-white/60 font-medium uppercase tracking-wider text-sm">Total Prize Pool</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="px-4 py-6 md:py-0"
            >
              <h3 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
                <StatCounter value={MOCK_STATS.totalCharityDonated} prefix="$" />
              </h3>
              <p className="text-white/60 font-medium uppercase tracking-wider text-sm">Charity Contributed</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="px-4 pt-6 md:pt-0"
            >
              <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                <StatCounter value={MOCK_STATS.activeMembers} />
              </h3>
              <p className="text-white/60 font-medium uppercase tracking-wider text-sm">Active Members</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Effortless Impact</h2>
            <p className="text-lg text-white/70">A seamless experience designed to maximize your philanthropic footprint while bringing excitement to every round of golf you play.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "1. Subscribe & Select", desc: "Choose your subscription tier and select a charity to direct your minimum 10% contribution towards." },
              { icon: Target, title: "2. Enter Scores", desc: "Play your standard rounds of golf. Enter your Stableford scores directly into your dashboard." },
              { icon: Trophy, title: "3. Win & Give", desc: "In the monthly draw, your active scores are matched against the winning numbers for jackpot cash prizes." }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.2 }}
              >
                <Card className="h-full p-8 text-center hover:bg-white/10 transition-colors cursor-default">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-navy-light to-navy border border-white/10 flex items-center justify-center mb-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <step.icon size={32} className="text-emerald-400 relative z-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Draw Mechanics Explainer */}
      <section className="py-24 bg-navy-dark border-y border-white/10 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">The Winning Formula</h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  Every month, a random selection algorithms pulls the winning scores. The more matching scores you submitted, the higher your prize tier.
                </p>
              </div>
              
              <ul className="space-y-6">
                {[
                  { tier: "5-Match Jackpot", desc: "Match all 5 scores identically. Wins 60% of the massive rollover prize pool.", color: "border-gold", text: "text-gold" },
                  { tier: "4-Match Elite", desc: "Match 4 of the 5 numbers. Secures 30% of the prize pool.", color: "border-emerald-400", text: "text-emerald-400" },
                  { tier: "3-Match Pro", desc: "Match 3 numbers. Guaranteed $150 minimum payout.", color: "border-teal-400", text: "text-teal-400" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className={`w-1 h-auto rounded-full ${item.color} bg-current`} />
                    <div>
                      <h4 className={`text-xl font-bold ${item.text} mb-1`}>{item.tier}</h4>
                      <p className="text-white/60">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full max-w-lg mx-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-emerald-500/20 blur-3xl opacity-50 rounded-full" />
              <Card glass className="relative p-8 border-gold/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
                <div className="text-center mb-8">
                  <h3 className="text-gold font-bold text-sm uppercase tracking-widest mb-2">Next Estimated Jackpot</h3>
                  <div className="text-6xl font-display font-bold text-white">$450,000</div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-white/60">Current Total Prize Pool</span>
                    <span className="text-emerald-400">$650,490</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-gold w-[70%]" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      {featuredCharity && (
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl overflow-hidden shadow-2xl border-white/10 flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={featuredCharity.logo} 
                  alt={featuredCharity.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-navy to-transparent" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 self-start">
                  Spotlight Charity
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{featuredCharity.name}</h2>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  {featuredCharity.description}
                </p>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-3xl font-display font-bold text-emerald-400 mb-1">
                      <StatCounter value={featuredCharity.totalImpact} prefix="$" />
                    </div>
                    <div className="text-sm font-medium text-white/50 uppercase tracking-wider">Total Impact</div>
                  </div>
                </div>
                
                <Link to="/charities">
                  <Button variant="outline" className="w-full sm:w-auto">View All Charities</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass rounded-3xl p-12 md:p-20 border-white/20 shadow-[0_0_100px_rgba(16,185,129,0.15)]"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Play With Purpose.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Become part of a community that turns passion into philanthropy. Subscribe today and let your next round make a difference.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-10 py-7 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                Join The Movement
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
