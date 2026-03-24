import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Download, UploadCloud, CheckCircle2, AlertCircle, FileText, Trophy } from "lucide-react"
import { Card, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { StatCounter } from "../../components/ui/StatCounter"
import api from "../../services/api"

export const WinningsTab = () => {
  const [winnings, setWinnings] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchData = async () => {
    try {
      const [winningsRes, meRes] = await Promise.all([
        api.get('/winners/me'),
        api.get('/auth/me')
      ])
      setWinnings(winningsRes.data.data)
      setStats(meRes.data.data.stats)
    } catch (err) {
      console.error("Failed to fetch winnings", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const uploadFile = async (file: File, winnerId: string) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('proof', file)
    try {
      await api.post(`/winners/${winnerId}/upload-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert("Proof uploaded successfully! Admin will review it shortly.")
      fetchData()
    } catch (err) {
      console.error("Upload failed", err)
      alert("Failed to upload proof. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent, winnerId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0], winnerId)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, winnerId: string) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0], winnerId)
    }
  }

  if (loading || !stats) return <div className="flex items-center justify-center p-20 text-white/50">Gathering prize data...</div>

  // Find first winner that needs proof
  const pendingWinner = winnings.find(w => w.proof_status === 'pending' && !w.proof_url) || winnings.find(w => !w.proof_url)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2 text-glow-emerald">My Winnings</h1>
        <p className="text-white/60">Upload handicap proofs to verify your scores and claim prizes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Summary */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1">
          <Card className="p-8 text-center border-emerald-500/30 bg-[#0A1128] relative overflow-hidden h-full flex flex-col justify-center shadow-[0_20px_50px_rgba(16,185,129,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />
            
            <Trophy className="mx-auto mb-4 text-emerald-400" size={48} />
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Total Prize Earnings</h3>
            <div className="text-6xl font-display font-bold text-white mb-6">
              $<StatCounter value={stats.totalWinnings || 0} />
            </div>
            
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
              <span className="text-white/60 text-sm">Verified & Paid</span>
              <span className="font-bold text-emerald-400">${winnings.filter(w => w.payout_status === 'paid').reduce((sum, w) => sum + w.prize_amount, 0)}</span>
            </div>
            
            <Button variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20" disabled={stats.totalWinnings === 0}>
               Withdraw to Bank
            </Button>
          </Card>
        </motion.div>

        {/* Verification Action Needed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          {pendingWinner ? (
            <Card className="h-full border-indigo-500/30 bg-indigo-950/20 p-6 flex flex-col">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <AlertCircle className="text-indigo-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Verify Your {pendingWinner.tier}-Match Win</h3>
                  <p className="text-white/60 text-sm">Upload a screenshot of your official Golf Handicap network app (e.g. GHIN, WHS) showing the qualifying round for the {pendingWinner.draw_id?.month} draw.</p>
                </div>
              </div>

              <div 
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all ${
                  dragActive ? "border-emerald-400 bg-emerald-500/10 scale-[0.99]" : "border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, pendingWinner._id)}
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <UploadCloud size={28} className={uploading ? "text-emerald-400 animate-bounce" : "text-white/30"} />
                </div>
                <div className="text-center font-bold text-white mb-1">{uploading ? "Uploading Proof..." : "Drop score screenshot here"}</div>
                <div className="text-center text-xs text-white/40 mb-6">PNG or JPG up to 10MB</div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileInput(e, pendingWinner._id)}
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                   onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  Browse Device
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full border-white/10 bg-white/[0.02] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">You're All Caught Up</h3>
              <p className="text-white/50 text-sm max-w-sm">No pending verifications. We'll alert you here when you win your next draw!</p>
            </Card>
          )}
        </motion.div>
      </div>

      {/* History Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="overflow-hidden bg-black/20 border-white/10">
          <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
             <h3 className="font-bold text-white">Winning History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.01]">
                  <th className="px-6 py-4 font-semibold text-white/40 text-xs uppercase tracking-wider">Month</th>
                  <th className="px-6 py-4 font-semibold text-white/40 text-xs uppercase tracking-wider">Tier</th>
                  <th className="px-6 py-4 font-semibold text-white/40 text-xs uppercase tracking-wider">Prize</th>
                  <th className="px-6 py-4 font-semibold text-white/40 text-xs uppercase tracking-wider">Proof</th>
                  <th className="px-6 py-4 font-semibold text-white/40 text-xs uppercase tracking-wider text-right">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {winnings.map((win) => (
                  <tr key={win._id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {win.draw_id?.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{win.tier} Match</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-white">${win.prize_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <Badge variant={win.proof_status === 'approved' ? 'success' : win.proof_status === 'pending' ? 'warning' : 'outline'}>
                         {win.proof_status.toUpperCase()}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                       <div className="flex items-center justify-end gap-2">
                         {win.payout_status === 'paid' ? (
                           <CheckCircle2 size={16} className="text-emerald-400" />
                         ) : (
                           <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                         )}
                         <span className={win.payout_status === 'paid' ? 'text-emerald-400 font-bold' : 'text-white/60'}>
                           {win.payout_status === 'paid' ? 'PAID' : 'PENDING'}
                         </span>
                       </div>
                    </td>
                  </tr>
                ))}
                {winnings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">No prizes found yet. Keep playing!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
