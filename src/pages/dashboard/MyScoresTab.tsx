import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Target, CheckCircle2, History, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import api from "../../services/api"

export const MyScoresTab = () => {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newScore, setNewScore] = useState("")
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])

  const fetchScores = async () => {
    try {
      const response = await api.get('/scores')
      // Try both wrapped and direct array
      const data = response.data.data || response.data
      setScores(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to fetch scores", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [])

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScore || Number(newScore) < 1 || Number(newScore) > 45) {
      alert("Please enter a valid Stableford score between 1 and 45.")
      return
    }
    
    setSubmitting(true)
    try {
      const response = await api.post('/scores', {
        score: Number(newScore),
        date_played: newDate
      })
      
      const updatedScores = response.data.data || response.data
      setScores(Array.isArray(updatedScores) ? updatedScores : [updatedScores, ...scores].slice(0, 5))
      setNewScore("")
      alert("Score submitted successfully!")
    } catch (err: any) {
      console.error("Failed to add score", err)
      const message = err.response?.data?.message || "Score submission failed. Check your internet or subscription."
      alert(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center p-20 text-white/50">Processing score history...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Scores</h1>
        <p className="text-white/60">Log your latest Stableford rounds to increase your chances in the upcoming draw.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Score Entry Form */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 border-emerald-500/20 bg-[#0A1128] shadow-[0_4px_30px_rgb(16,185,129,0.1)]">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-white">
                <Plus size={20} className="text-emerald-400" /> Log New Score
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddScore} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Stableford Points</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="45" 
                    required 
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                    placeholder="e.g. 36" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/20 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 text-2xl font-bold font-display text-center" 
                  />
                  <p className="text-xs text-white/40 text-center">Valid range: 1-45</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Date of Round</label>
                  <input 
                    type="date" 
                    required 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" 
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
                    {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    Submit Score
                  </Button>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 mt-4 flex gap-3 text-xs text-white/60">
                  <Target size={16} className="text-emerald-400 shrink-0" />
                  <p>Only your most recent 5 scores are kept active for the monthly draw.</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Score History */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-display font-semibold text-white flex items-center gap-2">
              <History size={20} /> Recent Entries
            </h3>
            <span className="text-sm text-white/50">{scores.length}/5 Scores Logged</span>
          </div>

          <div className="space-y-3">
            {scores.map((scoreObj, i) => (
              <motion.div
                key={scoreObj._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.005 }}
              >
                <Card className="flex items-center justify-between p-4 md:p-6 transition-colors border border-emerald-500/20 bg-emerald-500/5">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border font-display bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30">
                      <span className="text-2xl md:text-3xl font-bold text-emerald-400">
                        {scoreObj.score}
                      </span>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-white mb-1 tracking-wide">
                        {new Date(scoreObj.date_played).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-white/50 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Active for next draw
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex shrink-0">
                    <Badge variant="success" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Eligible</Badge>
                  </div>
                </Card>
              </motion.div>
            ))}

            {scores.length === 0 && (
              <div className="text-center py-16 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                <Target size={40} className="text-white/10 mx-auto mb-4" />
                <p className="text-white/40 font-medium">No scores logged for March yet.</p>
                <p className="text-white/20 text-xs mt-1">Add your first score to qualify for the jackpot!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
