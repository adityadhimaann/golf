import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Ticket, Trophy, Calendar, CheckSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import api from "../../services/api"

export const MyDrawsTab = () => {
  const [draws, setDraws] = useState<any[]>([])
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drawsRes, winnersRes] = await Promise.all([
          api.get('/draws'),
          api.get('/winners/me')
        ])
        setDraws(drawsRes.data.data)
        setWinners(winnersRes.data.data)
      } catch (err) {
        console.error("Failed to fetch draws history", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const findUserWinnerForDraw = (drawId: string) => {
    return winners.find(w => w.draw_id._id === drawId || w.draw_id === drawId)
  }

  if (loading) return <div className="flex items-center justify-center p-20 text-white/50">Loading draws...</div>
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Draw History</h1>
        <p className="text-white/60">View the results of past draws and check your upcoming entries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draws.map((draw, i) => {
          const userWinner = findUserWinnerForDraw(draw._id);
          const isPublished = draw.status === 'published';
          
          return (
            <motion.div
              key={draw._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full flex flex-col relative overflow-hidden ${
                !isPublished 
                  ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent' 
                  : 'border-white/10 bg-black/20'
              }`}>
                {!isPublished && (
                  <div className="absolute top-0 right-0 p-4">
                    <Badge variant="success" className="animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.3)]">Upcoming</Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-emerald-400" />
                    <CardTitle className="text-xl">{draw.month}</CardTitle>
                  </div>
                  <div className="text-sm text-white/50">
                    {isPublished ? "Published on: " : "Expected on: "} {new Date(draw.draw_date).toLocaleDateString()}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-white/50">Total Jackpot</span>
                      <span className="font-bold text-gold">${draw.jackpot_amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                       {draw.drawn_numbers?.map((n: number, idx: number) => (
                         <div key={idx} className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                           {n}
                         </div>
                       ))}
                    </div>
                  </div>

                  {isPublished ? (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-xs uppercase tracking-widest text-white/50 mb-3 font-semibold text-center">Your Result</div>
                      <div className="flex items-center justify-center gap-4">
                        {userWinner ? (
                          <>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <Trophy size={20} />
                            </div>
                            <div>
                              <div className="font-bold text-white mb-1">Won {userWinner.tier} Tier</div>
                              <div className="text-emerald-400 font-bold">Prize: ${userWinner.prize_amount.toLocaleString()}</div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className="font-bold text-white/70 mb-1">No Match</div>
                            <div className="text-sm text-white/40">Better luck next time! Your charity still benefited.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                      <CheckSquare className="mx-auto mb-2 text-emerald-400" size={24} />
                      <div className="font-semibold text-emerald-100 mb-1">Entry Confirmed</div>
                      <div className="text-xs text-emerald-200/70">Ensure you have 5 active scores by the draw date to maximize your chances.</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}
