import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, DollarSign, Heart, Activity, ArrowUpRight, Trophy } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { StatCounter } from "../../components/ui/StatCounter"
import api from "../../services/api"

export const AdminOverviewTab = () => {
  const [stats, setStats] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, activityRes, chartRes] = await Promise.all([
          api.get('/reports/overview'),
          api.get('/reports/activity'),
          api.get('/reports/subscribers')
        ])
        setStats(statsRes.data.data)
        setActivities(activityRes.data.data)
        setChartData(chartRes.data.data)
      } catch (err) {
        console.error("Failed to fetch admin data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAdminData()
  }, [])

  if (loading || !stats) return <div className="p-12 text-center text-white/50">Processing platform metrics...</div>

  const kpis = [
    { label: "Active Subscribers", value: stats.active_subscribers, icon: Users, color: "text-blue-400", change: stats.growth?.subscribers || "+0%" },
    { label: "Total Prize Pool", value: stats.total_prize_distributed + stats.current_jackpot, icon: DollarSign, color: "text-gold", prefix: "$", change: stats.growth?.prize || "+0%" },
    { label: "Charity Donated", value: stats.total_charity_contributed, icon: Heart, color: "text-emerald-400", prefix: "$", change: stats.growth?.charity || "+0%" },
    { label: "Total Users", value: stats.total_users, icon: Trophy, color: "text-red-400", prefix: "", change: stats.growth?.users || "+0%" }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Command Center</h1>
          <p className="text-white/60">Live platform performance and ecosystem health.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-6 border-white/10 bg-black/20 relative overflow-hidden group hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change} <ArrowUpRight size={14} className={stat.change.startsWith('-') ? 'rotate-90' : ''} />
                </div>
              </div>
              <div className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">{stat.label}</div>
              <div className="text-3xl font-display font-bold text-white tabular-nums flex items-baseline">
                {stat.prefix}<StatCounter value={stat.value} duration={1} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real Dynamic Growth Chart */}
        <Card className="lg:col-span-2 p-6 border-white/10 bg-black/20 flex flex-col justify-between min-h-[400px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-display font-bold text-xl text-white">Platform Growth</h3>
            <div className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">Real-time Subscriber Acquisition</div>
          </div>
          <div className="flex-1 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="lg:col-span-1 border-white/10 bg-black/20 flex flex-col">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-xl">System Pulse</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
            <div className="space-y-6">
              {activities.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {i !== activities.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-24px] w-px bg-white/10" />
                  )}
                  <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 ${
                    activity.type === 'score' ? 'text-blue-400' : activity.type === 'subscription' ? 'text-emerald-400' : 'text-gold'
                  }`}>
                    <Activity size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white/90 leading-snug">
                       <span className="font-bold text-white">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1.5 font-bold">
                      {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-12 text-white/10 italic">Quiet day. No anomalies detected.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
