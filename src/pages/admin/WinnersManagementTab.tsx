import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, CheckCircle2, XCircle, FileImage, ShieldAlert, Award, DollarSign } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { Modal } from "../../components/ui/Modal"
import api from "../../services/api"

export const WinnersManagementTab = () => {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  const fetchWinners = async () => {
    try {
      const response = await api.get('/winners/admin')
      const data = response.data.data || response.data
      setWinners(Array.isArray(data) ? data : (data.winners || []))
    } catch (err) {
      console.error("Failed to fetch winners", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  const handleReview = async (id: string, decision: 'approved' | 'rejected') => {
    setProcessing(true)
    try {
      await api.put(`/winners/admin/${id}/verify`, { decision })
      alert(`Proof document ${decision}!`)
      setIsReviewOpen(false)
      fetchWinners()
    } catch (err) {
      console.error("Verification failed", err)
    } finally {
      setProcessing(false)
    }
  }

  const handlePayout = async (id: string) => {
    setProcessing(true)
    try {
      await api.put(`/winners/admin/${id}/payout`)
      alert("Payout successfully processed!")
      setIsReviewOpen(false)
      fetchWinners()
    } catch (err) {
      console.error("Payout failed", err)
    } finally {
      setProcessing(false)
    }
  }

  const filteredWinners = winners.filter(w => {
    if (filter === "All") return true
    if (filter === "Under Review") return w.proof_status === 'pending'
    if (filter === "Approved") return w.proof_status === 'approved' && w.payout_status === 'pending'
    if (filter === "Paid") return w.payout_status === 'paid'
    if (filter === "Rejected") return w.proof_status === 'rejected'
    return true
  })

  const openReviewModal = (winner: any) => {
    setSelectedWinner(winner)
    setIsReviewOpen(true)
  }

  if (loading) return <div className="p-12 text-center text-white/50">Loading winners database...</div>

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Winners & Payouts</h1>
          <p className="text-white/60">Review winning score proofs, approve payouts, and manage disputes.</p>
        </div>
        
        <div className="flex border border-white/10 rounded-xl bg-black/20 p-1 flex-wrap">
          {["All", "Under Review", "Approved", "Paid", "Rejected"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === f ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-white/10 bg-black/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Player</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Draw & Tier</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Prize Amount</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider">Proof Status</th>
                <th className="px-6 py-4 font-semibold text-white/50 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredWinners.map((winner) => (
                <tr key={winner._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{winner.user_id?.full_name}</div>
                    <div className="text-white/50 text-xs">{winner.user_id?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{winner.tier}-Match Elite</div>
                    <div className="text-white/50 text-xs">{winner.draw_id?.month}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-emerald-400 text-lg">${winner.prize_amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      winner.payout_status === 'paid' ? "success" : 
                      winner.proof_status === 'approved' ? "default" :
                      winner.proof_status === 'pending' ? "warning" :
                      winner.proof_status === 'rejected' ? "error" : "default"
                    }>
                      {winner.payout_status === 'paid' ? "PAID" : winner.proof_status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" onClick={() => openReviewModal(winner)}>
                      {winner.proof_status === 'pending' ? "Review Proof" : "View Record"}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredWinners.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/50">No winner records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} title="Verify Winner Proof" className="max-w-2xl">
        {selectedWinner && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="space-y-1 text-sm">
                <div className="text-white/50 uppercase tracking-wider text-xs font-semibold">Player</div>
                <div className="font-medium text-white">{selectedWinner.user_id?.full_name}</div>
                <div className="text-white/50 text-xs">{selectedWinner.user_id?.email}</div>
              </div>
              <div className="space-y-1 text-sm text-center border-l border-white/10">
                <div className="text-white/50 uppercase tracking-wider text-xs font-semibold">Draw Match</div>
                <div className="font-medium text-white flex justify-center items-center gap-2"><Award size={14} className="text-gold" /> {selectedWinner.tier} Match</div>
                <div className="text-white/50 text-xs">{selectedWinner.draw_id?.month}</div>
              </div>
              <div className="space-y-1 text-sm text-right border-l border-white/10 lg:pl-4">
                <div className="text-white/50 uppercase tracking-wider text-xs font-semibold">Payout Value</div>
                <div className="font-display font-bold text-2xl text-emerald-400">${selectedWinner.prize_amount.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Uploaded Proof (Mobile App Screenshot)</h4>
              <div className="w-full h-[400px] border border-white/10 rounded-xl bg-black/50 overflow-hidden relative flex items-center justify-center">
                {selectedWinner.proof_url ? (
                  <img src={api.defaults.baseURL?.replace('/api', '') + selectedWinner.proof_url} alt="Golf Handicap Proof" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-white/30">
                    <FileImage size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No proof uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            {selectedWinner.proof_status === 'pending' && (
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                <Button variant="danger" className="w-full" onClick={() => handleReview(selectedWinner._id, 'rejected')} isLoading={processing}>
                  <XCircle size={18} className="mr-2" /> Reject Proof
                </Button>
                <Button variant="primary" className="w-full" onClick={() => handleReview(selectedWinner._id, 'approved')} isLoading={processing}>
                  <CheckCircle2 size={18} className="mr-2" /> Approve Proof
                </Button>
              </div>
            )}

            {selectedWinner.proof_status === 'approved' && selectedWinner.payout_status === 'pending' && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-500" onClick={() => handlePayout(selectedWinner._id)} isLoading={processing}>
                  <DollarSign size={18} className="mr-2" /> Process Payout
                </Button>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
              <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Close Record</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
