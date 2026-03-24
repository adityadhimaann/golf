import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Heart, Save, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { MOCK_CHARITIES } from "../../data/mockData"
import api from "../../services/api"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export const ProfileTab = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    charity_id: "",
    charity_percentage: 10
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me')
        const { user } = response.data.data
        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          charity_id: user.charity_id || "",
          charity_percentage: user.charity_percentage || 10
        })
      } catch (err) {
        console.error("Failed to fetch profile", err)
        setError("Could not load profile settings")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'charity_percentage' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    
    try {
      await api.put('/users/me', {
        full_name: formData.full_name,
        charity_id: formData.charity_id,
        charity_percentage: formData.charity_percentage
      })
      setSuccess("Profile updated successfully")
      // Update local storage user if needed
      const localUser = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...localUser, full_name: formData.full_name }))
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center p-20 text-white/50">Loading settings...</div>

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <User className="text-emerald-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Profile Settings</h1>
          <p className="text-white/60">Manage your account details and impact preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <User size={20} className="text-emerald-400" /> Personal Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-3">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"><User size={18} /></span>
                  <input
                    required
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email Address (Read Only)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"><Mail size={18} /></span>
                  <input
                    readOnly
                    type="email"
                    value={formData.email}
                    className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white/40 cursor-not-allowed outline-none"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Heart size={20} className="text-emerald-400" /> Impact Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/70">Selected Charity</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_CHARITIES.map(charity => (
                  <button
                    key={charity.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, charity_id: charity.id }))}
                    className={`text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      formData.charity_id === charity.id 
                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg" 
                        : "bg-black/20 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <img src={charity.logo} alt={charity.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-sm text-white">{charity.name}</div>
                      <div className="text-[10px] text-white/40 line-clamp-1">{charity.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-white/70">Donation Percentage</label>
                <span className="text-2xl font-display font-bold text-emerald-400">{formData.charity_percentage}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                name="charity_percentage"
                value={formData.charity_percentage}
                onChange={handleChange}
                className="w-full h-2 bg-black/40 rounded-full appearance-none cursor-pointer"
              />
              <p className="text-xs text-white/40 italic">Determines how much of your subscription goes directly to your chosen charity.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" isLoading={saving} className="min-w-[180px]">
            <Save size={18} className="mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
