import React from "react"
import { motion } from "framer-motion"
import { Trophy, Target, Heart, ArrowRight, CreditCard, Calendar } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import { CountdownTimer } from "../../components/ui/CountdownTimer"
import { StatCounter } from "../../components/ui/StatCounter"
import api from "../../services/api"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export const OverviewTab = () => {
  const navigate = useNavigate()
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [nextDraw, setNextDraw] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, drawsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/draws')
        ])
        setData(meRes.data.data)
        // Find next drawing from published draws or mock upcoming for now if none published
        const publishedDraws = drawsRes.data.data
        if (publishedDraws.length > 0) {
           setNextDraw(publishedDraws[0])
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex items-center justify-center p-20 text-white/50">Loading dashboard...</div>
  if (!data) return <div className="text-white text-center p-20">Error loading data. Please log in again.</div>

  const { user, subscription_status: subStatus } = data
  const subscription = data.subscription
  const planName = subscription?.plan === 'yearly' ? 'Yearly' : 'Monthly'
  const renewalDate = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Welcome Banner */}
      <motion.div variants={fadeIn} className="relative rounded-3xl overflow-hidden glass border-white/10 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
              Welcome back, <span className="text-emerald-400">{user.full_name.split(' ')[0]}</span>!
            </h1>
            <p className="text-white/70 text-lg">Your next opportunity to win and make an impact is approaching.</p>
          </div>
          
          {nextDraw && (
            <div className="bg-black/20 border border-white/10 p-6 rounded-2xl backdrop-blur-md">
              <div className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-4">Next Draw</div>
              <CountdownTimer targetDate={nextDraw.draw_date} />
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription Status */}
        <motion.div variants={fadeIn} className="md:col-span-1">
          <Card className="h-full border-white/10 bg-white/[0.02]">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="flex justify-between items-center text-lg">
                Subscription
                <Badge variant={subStatus === "active" ? "success" : "warning"}>
                  {subStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <CreditCard className="text-blue-400" size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1">Current Plan</div>
                  <div className="font-bold text-white text-lg">{planName} Member</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Calendar className="text-white/60" size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1">Renews On</div>
                  <div className="font-medium text-white">{renewalDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Cards */}
        <motion.div variants={fadeIn} className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card 
            className="border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group cursor-pointer" 
            onClick={() => navigate('/dashboard/scores')}
          >
            <CardContent className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                  <Target className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Log Score</h3>
                <p className="text-white/60 line-clamp-2">Enter your latest Stableford score to validate your draw entries.</p>
              </div>
              <div className="mt-8 flex items-center text-emerald-400 font-medium">
                Add New Score <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer" 
            onClick={() => navigate('/dashboard/winnings')}
          >
            <CardContent className="p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Trophy className="text-blue-400" size={28} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Check Winnings</h3>
                <p className="text-white/60 line-clamp-2">See if your recent scores matched the draw results.</p>
              </div>
              <div className="mt-8 flex items-center text-blue-400 font-medium font-sans">
                View History <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Draws Entered", value: data.stats.totalDrawsEntered, icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Times Won", value: data.stats.timesWon, icon: Trophy, color: "text-gold", bg: "bg-gold/10" },
          { label: "Total Winnings", value: data.stats.totalWinnings, prefix: "$", icon: Trophy, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Charity Contributed", value: data.stats.totalContributed, prefix: "$", icon: Heart, color: "text-red-400", bg: "bg-red-500/10" }
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeIn} className="h-full">
            <Card className="h-full p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative overflow-hidden group flex flex-col justify-between">
              <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity ${stat.bg}`} />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2 min-h-[32px] flex items-start">
                    {stat.label}
                  </div>
                  <div className="text-3xl font-display font-bold text-white flex items-baseline">
                    {stat.prefix}
                    <StatCounter value={stat.value} duration={1.5} />
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.bg} mt-0.5`}>
                  <stat.icon className={stat.color} size={20} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
