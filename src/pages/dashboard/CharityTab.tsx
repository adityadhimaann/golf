import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Edit2, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { MOCK_CHARITIES } from "../../data/mockData"
import { StatCounter } from "../../components/ui/StatCounter"
import { Modal } from "../../components/ui/Modal"
import api from "../../services/api"

export const CharityTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updateError, setUpdateError] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState("")
  const [tempAllocation, setTempAllocation] = useState(10)

  useEffect(() => {
    const fetchCharityData = async () => {
      try {
        const response = await api.get('/auth/me')
        const userData = response.data.data.user
        setUser(userData)
        setStats(response.data.data.stats)
        setTempAllocation(userData.charity_percentage)
      } catch (err) {
        console.error("Failed to fetch charity data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCharityData()
  }, [])

  const handleCharityChange = async (charityId: string) => {
    setIsModalOpen(false)
    setSaving(true)
    setUpdateError("")
    setUpdateSuccess("")
    
    try {
      const res = await api.put('/users/me', {
        charity_id: charityId
      })
      setUser(res.data.data)
      setUpdateSuccess("Charity updated successfully")
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || "Failed to update charity")
    } finally {
      setSaving(false)
    }
  }

  const handleAllocationUpdate = async () => {
    setSaving(true)
    setUpdateError("")
    setUpdateSuccess("")

    try {
      const res = await api.put('/users/me', {
        charity_percentage: tempAllocation
      })
      setUser(res.data.data)
      setUpdateSuccess("Donation allocation updated")
    } catch (err: any) {
      setUpdateError(err.response?.data?.message || "Failed to update allocation")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center p-20 text-white/50">Loading philanthropy data...</div>
  if (!user) return null

  const currentCharityId = user.charity_id
  const currentCharity = MOCK_CHARITIES.find(c => c.id === currentCharityId)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {(updateError || updateSuccess) && (
        <div className={`p-4 rounded-xl border mb-4 ${
          updateError ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
        }`}>
          {updateError || updateSuccess}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">My Philanthropy</h1>
        <p className="text-white/60">Manage your targeted charity and view your personal impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2"
        >
          <Card className="h-full border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)] bg-[#051410]">
            <CardHeader className="border-b border-emerald-500/10 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Heart size={20} className="text-emerald-400" /> Currently Supporting
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} disabled={saving}>
                <Edit2 size={14} className="mr-2" /> Change
              </Button>
            </CardHeader>
            <CardContent className="pt-8">
              {currentCharity ? (
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                    <img src={currentCharity.logo} alt={currentCharity.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs font-bold text-emerald-400">
                      {currentCharity.category}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-3">{currentCharity.name}</h2>
                    <p className="text-white/60 leading-relaxed mb-6">{currentCharity.description}</p>
                    <div className="flex items-center gap-4 pb-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-white/50 uppercase tracking-wider mb-1">Your Match Rate</span>
                        <div className="font-display font-bold text-2xl text-gradient">{user.charity_percentage}%</div>
                      </div>
                      <div className="w-px h-10 bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-xs text-white/50 uppercase tracking-wider mb-1">Total Impact</span>
                        <div className="font-display font-bold text-2xl text-emerald-400">
                          $<StatCounter value={stats.totalContributed} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart size={48} className="text-white/10 mx-auto mb-4" />
                  <p className="text-white/50 mb-6">No charity selected yet. Select a cause to start making an impact.</p>
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>Choose a Charity</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="h-full border-white/5 bg-white/[0.02]">
            <CardHeader>
              <CardTitle>Adjust Impact Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-white/60">
                You currently allocate <strong className="text-emerald-400">{user.charity_percentage}%</strong> of your subscription to charity.
              </p>
              
              <div className="relative py-4">
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  step="5"
                  value={tempAllocation}
                  onChange={(e) => setTempAllocation(parseInt(e.target.value))}
                  className="w-full h-2 bg-black/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                />
                <div className="flex justify-between text-xs text-white/40 mt-4">
                  <span>Min 10%</span>
                  <span>100%</span>
                </div>
              </div>

              <Button className="w-full" variant="primary" onClick={handleAllocationUpdate} isLoading={saving}>
                Update Allocation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select a Charity">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {MOCK_CHARITIES.map(charity => (
            <button
              key={charity.id}
              onClick={() => handleCharityChange(charity.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                user.charity_id === charity.id 
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                  : "bg-black/20 border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <img src={charity.logo} alt={charity.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-white">{charity.name}</h4>
                  <p className="text-xs text-white/50 line-clamp-1">{charity.description}</p>
                </div>
                {user.charity_id === charity.id && (
                  <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}
