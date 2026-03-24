import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, RotateCw, CheckCircle, Database, AlertTriangle, Trophy } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Badge } from "../../components/ui/Badge"
import api from "../../services/api"

export const DrawManagementTab = () => {
  const [draws, setDraws] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [pendingDraw, setPendingDraw] = useState<any>(null)

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const response = await api.get('/draws/admin/all')
        const allDraws = response.data.data
        setDraws(allDraws)
        
        // Find existing pending or simulated draw
        const active = allDraws.find((d: any) => d.status === 'pending' || d.status === 'simulated')
        setPendingDraw(active)
      } catch (err) {
        console.error("Failed to fetch draws", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDraws()
  }, [])

  const initializeNewDraw = async () => {
    setLoading(true)
    try {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const now = new Date()
      const monthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`
      
      const res = await api.post('/draws', {
        month: monthStr,
        draw_date: new Date(now.getFullYear(), now.getMonth() + 1, 0), // End of month
        mode: 'random'
      })
      setPendingDraw(res.data.data)
      // Refresh list
      const listRes = await api.get('/draws/admin/all')
      setDraws(listRes.data.data)
    } catch (err) {
      console.error("Failed to initialize draw", err)
    } finally {
      setLoading(false)
    }
  }

  const runSimulation = async () => {
    if (!pendingDraw) return
    setSimulationRunning(true)
    try {
      const response = await api.post(`/draws/${pendingDraw._id}/simulate`)
      setSimulationResults(response.data.data)
      
      // Update pending draw status in local state
      setPendingDraw({ ...pendingDraw, status: 'simulated', drawn_numbers: response.data.data.drawn_numbers })
      
      // Refresh list
      const listRes = await api.get('/draws/admin/all')
      setDraws(listRes.data.data)
    } catch (err) {
      console.error("Simulation failed", err)
    } finally {
      setSimulationRunning(false)
    }
  }

  const handlePublish = async () => {
    if (!pendingDraw || pendingDraw.status !== 'simulated') return
    setLoading(true)
    try {
      await api.post(`/draws/${pendingDraw._id}/publish`)
      setSimulationResults(null)
      setPendingDraw(null)
      
      // Refresh list
      const listRes = await api.get('/draws/admin/all')
      setDraws(listRes.data.data)
    } catch (err) {
      console.error("Publish failed", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && draws.length === 0) return <div className="p-12 text-center text-white/50">Loading draw system...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Draw Management</h1>
          <p className="text-white/60">Configure, simulate, and publish monthly results.</p>
        </div>
        {!pendingDraw && (
          <Button onClick={initializeNewDraw} variant="primary">
            Initialize Next Draw
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Draw Configuration & Simulation */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 h-full">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-emerald-400">
              {pendingDraw ? `Active Draw: ${pendingDraw.month}` : "No Active Draw"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {!pendingDraw ? (
              <div className="text-center py-12 text-white/30 italic">
                Initialize a new draw to start the monthly cycle.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-white/70 block mb-2">Draw Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button className={`p-4 rounded-xl border transition-all ${pendingDraw.mode === 'random' ? 'border-emerald-500/50 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-white/10 bg-black/20 opacity-50'}`}>
                      <div className="font-bold text-white mb-1">Random Select</div>
                      <div className="text-xs text-white/50">Pure RNG across 0-45</div>
                    </button>
                    <button className="p-4 rounded-xl border border-white/10 bg-black/20 text-center opacity-50 cursor-not-allowed">
                      <div className="font-bold text-white mb-1">Algorithmic</div>
                      <div className="text-xs text-white/50">Waitlisted Beta</div>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <Button 
                    variant="outline" 
                    className="w-full mb-4 border-white/30 text-white/90 font-bold"
                    onClick={runSimulation}
                    isLoading={simulationRunning}
                    disabled={pendingDraw.status === 'published'}
                  >
                    {!simulationRunning && <RotateCw size={16} className="mr-2" />}
                    {simulationRunning ? "Simulating Results..." : (pendingDraw.status === 'simulated' ? "Re-run Simulation" : "Run Preview Simulation")}
                  </Button>

                  {(simulationResults || pendingDraw.drawn_numbers?.length > 0) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-4 mt-4">
                      <div className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2 flex items-center justify-between">
                        {simulationResults ? "Live Simulation Results" : "Previous Simulation"}
                        <Badge variant="success">Safe to Publish</Badge>
                      </div>
                      
                      <div className="flex justify-center gap-2 mb-4">
                        {(simulationResults?.drawn_numbers || pendingDraw.drawn_numbers).map((num: number, i: number) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center font-bold text-emerald-400 text-lg">
                            {num}
                          </div>
                        ))}
                      </div>

                      {simulationResults && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-white/50 mb-1">5-Match Winners</div>
                            <div className="font-bold text-white">{simulationResults.counts.tier_5} {simulationResults.counts.tier_5 === 0 && <span className="text-gold">(Rollover)</span>}</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-white/50 mb-1">4-Match Winners</div>
                            <div className="font-bold text-white">{simulationResults.counts.tier_4}</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-white/50 mb-1">3-Match Winners</div>
                            <div className="font-bold text-white">{simulationResults.counts.tier_3}</div>
                          </div>
                        </div>
                      )}

                      <Button 
                        variant="primary" 
                        onClick={handlePublish}
                        className="w-full mt-4 bg-red-500/80 hover:bg-red-500 border-none shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                        disabled={pendingDraw.status !== 'simulated'}
                      >
                        <AlertTriangle size={16} className="mr-2" /> Publish Draw Results
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Draw Status */}
        <Card className="border-white/10 bg-black/20 h-full">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-lg">Draw History Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {draws.map(draw => (
                <div key={draw._id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white mb-1">{draw.month}</div>
                    <div className="text-xs text-white/50 flex items-center gap-4">
                      <span>Entries: {draw.subscriber_count}</span>
                      {draw.drawn_numbers?.length > 0 && (
                        <span className="flex items-center gap-1"><Trophy size={12} className="text-emerald-400" /> {draw.drawn_numbers.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Badge variant={draw.status === 'published' ? 'default' : 'warning'}>
                      {draw.status.charAt(0).toUpperCase() + draw.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
              {draws.length === 0 && (
                <div className="text-center py-12 text-white/20">No draw history available.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
