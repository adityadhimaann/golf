import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle2, Heart, Trophy, User, Eye, EyeOff } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { MOCK_CHARITIES } from "../../data/mockData"

import api from "../../services/api"

const SlideContainer = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => (
  <AnimatePresence mode="wait">
    {isActive && (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

export const SignUpPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    charityId: "",
    contributionPercentage: 10
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    } else {
      setLoading(true)
      setError("")
      try {
        const response = await api.post('/auth/signup', {
          email: formData.email,
          password: formData.password,
          full_name: `${formData.firstName} ${formData.lastName}`,
          charity_id: formData.charityId || undefined,
          charity_percentage: formData.contributionPercentage
        })

        const { token, user } = response.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        navigate("/dashboard")
      } catch (err: any) {
        setError(err.response?.data?.message || "Registration failed. Please try again.")
        setStep(1) // Go back to check details
      } finally {
        setLoading(false)
      }
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden bg-navy">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      <div className="w-full max-w-lg z-10 relative">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg mb-6 group hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
            <span className="text-white font-display font-bold text-xl">GC</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Join the Movement</h1>
          <p className="text-white/60">Create your account and select your charity</p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-navy-light/40 border-white/10 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <form onSubmit={handleNext} className="mt-4">
            
            {/* Step 1: Account Details */}
            <SlideContainer isActive={step === 1}>
              <div className="mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-1"><User size={20} className="text-emerald-400" /> Personal Details</h2>
                <p className="text-sm text-white/50">Let's start with the basics.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/20 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/20 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email Address</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/20 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Password</label>
                <div className="relative">
                  <input 
                    required 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 placeholder:text-white/20 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </SlideContainer>

            {/* Step 2: Charity Selection */}
            <SlideContainer isActive={step === 2}>
              <div className="mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-1"><Heart size={20} className="text-emerald-400" /> Choose Your Cause</h2>
                <p className="text-sm text-white/50">Select where your subscription contributions go.</p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_CHARITIES.map(charity => (
                  <button
                    key={charity.id}
                    type="button"
                    onClick={() => setFormData({...formData, charityId: charity.id})}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      formData.charityId === charity.id 
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
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        formData.charityId === charity.id ? "border-emerald-400 bg-emerald-400 text-navy" : "border-white/30"
                      }`}>
                        {formData.charityId === charity.id && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </SlideContainer>

            {/* Step 3: Contribution Slider */}
            <SlideContainer isActive={step === 3}>
              <div className="mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-1"><Trophy size={20} className="text-emerald-400" /> Set Your Impact</h2>
                <p className="text-sm text-white/50">Determine your monthly contribution level. Minimum is 10%.</p>
              </div>

              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-display font-bold text-gradient mb-2">{formData.contributionPercentage}%</div>
                  <div className="text-sm text-white/50 uppercase tracking-widest font-semibold">Of Monthly Subscription</div>
                </div>

                <div className="relative px-4">
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    value={formData.contributionPercentage}
                    onChange={(e) => setFormData({...formData, contributionPercentage: parseInt(e.target.value)})}
                    className="w-full h-2 bg-black/40 rounded-full appearance-none cursor-pointer hover:bg-black/60 transition-colors [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                  <div className="flex justify-between text-xs text-white/40 mt-4 font-medium">
                    <span>10% (Min)</span>
                    <span>100% (All to Charity)</span>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3">
                  <Heart className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-emerald-100/80 leading-relaxed">
                    By setting your contribution to <strong className="text-emerald-400">{formData.contributionPercentage}%</strong>, you will be making a direct impact while retaining {100 - formData.contributionPercentage}% towards prize pool entries and platform fees.
                  </p>
                </div>
              </div>
            </SlideContainer>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-medium text-white/50 hover:text-white transition-colors"
                >
                  Back
                </button>
              ) : (
                <div /> // Spacer
              )}
              
              <Button type="submit" variant="primary" className="min-w-[140px]" isLoading={loading} disabled={(step === 2 && !formData.charityId) || loading}>
                {step === 3 ? (loading ? "Joining..." : "Complete Sign Up") : "Continue"}
                {step < 3 && !loading && <ArrowRight size={16} className="ml-2" />}
              </Button>
            </div>
          </form>
        </Card>

        <p className="mt-8 text-center text-sm text-white/40">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
};
