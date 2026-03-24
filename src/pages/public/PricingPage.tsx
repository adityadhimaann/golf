import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { CheckCircle2, ChevronDown, Heart, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { cn } from "../../lib/utils"
import api from "../../services/api"

const faqs = [
  {
    question: "How much actually goes to charity?",
    answer: "A minimum of 10% of every subscription goes directly to your chosen charity. You have the option to increase this percentage up to 100% of your subscription value through your dashboard settings."
  },
  {
    question: "How do the monthly draws work?",
    answer: "Each month, our random selection algorithm draws 5 winning scores. The scores you log during your actual rounds of golf act as your 'tickets'. Match 3, 4, or 5 scores identically to win from our tier prize pools."
  },
  {
    question: "Do I need to be a good golfer to win?",
    answer: "Not at all! Since we use the Stableford scoring system and your official handicap, every golfer has an equal statistical chance of shooting their drawn score. It's about participation, not professional skill."
  },
  {
    question: "Can I change my chosen charity?",
    answer: "Yes, you can change the charity you support at any time through your dashboard. Contributions from future subscription payments will automatically route to your new choice."
  }
]

export const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const handleSubscriptionAction = async (planType: 'monthly' | 'yearly') => {
    if (!isLoggedIn) {
      navigate('/signup')
      return
    }

    setProcessingPlan(planType)
    try {
      const res = await api.post('/subscriptions/create-checkout', { plan: planType })
      // Use the checkout URL from backend (mocked during dev)
      if (res.data.data?.url) {
         window.location.href = res.data.data.url
      } else {
         navigate('/dashboard')
      }
    } catch (err) {
      console.error("Subscription initiation failed", err)
      alert("Something went wrong. Please try again.")
    } finally {
      setProcessingPlan(null)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-20 relative">
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            Simple Pricing. <br/> <span className="text-gradient">Massive Impact.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 font-medium"
          >
            Choose the plan that fits your game. {isLoggedIn && <span className="text-emerald-400 font-bold block mt-2">Authenticated: Ready to activate your play.</span>}
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-16"
        >
          <div className="glass p-1 rounded-full flex items-center gap-2 relative border-white/20">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "relative text-sm px-6 py-3 rounded-full transition-colors z-10",
                !isYearly ? "text-white font-bold" : "text-white/70 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "relative text-sm px-6 py-3 rounded-full transition-colors z-10",
                isYearly ? "text-white font-bold" : "text-white/70 hover:text-white"
              )}
            >
              Yearly <span className="text-[10px] ml-1 text-white bg-white/20 px-2 py-0.5 rounded-full font-bold">Save 20%</span>
            </button>
            <motion.div
              className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-emerald-400 rounded-full z-0"
              animate={{ x: isYearly ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
          {/* Base Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 md:p-10 h-full flex flex-col hover:border-emerald-500/30 transition-all transform hover:-translate-y-1">
              <h3 className="text-2xl font-display font-semibold mb-2">Member</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-display font-bold">
                  ${isYearly ? "12" : "15"}
                </span>
                <span className="text-white/50">/month</span>
              </div>
              <p className="text-white/70 mb-8 border-b border-white/10 pb-8">
                Perfect for the casual golfer looking to make an impact and enter the draws.
              </p>
              <ul className="space-y-4 mb-10 flex-1">
                {["1 x Entry to Monthly Draw", "Minimum 10% Charity Contribution", "Access to Charity Impact Dashboard", "Digital Member Card"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full h-14 text-lg" 
                onClick={() => handleSubscriptionAction('monthly')}
                disabled={processingPlan !== null}
              >
                {processingPlan === 'monthly' ? <Loader2 className="animate-spin mr-2" /> : null}
                {isLoggedIn ? "Activate Play" : "Get Started"}
              </Button>
            </Card>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card glass={false} className="p-8 md:p-10 h-full flex flex-col bg-gradient-to-br from-navy-light to-navy border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden transform hover:-translate-y-1 transition-all">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full" />
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-display font-semibold text-emerald-400">Pro Member</h3>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-5xl font-display font-bold">
                  ${isYearly ? "24" : "30"}
                </span>
                <span className="text-white/50">/month</span>
              </div>
              <p className="text-white/70 mb-8 border-b border-white/10 pb-8">
                Maximized entries for serious golfers who want to give back even more.
              </p>
              <ul className="space-y-4 mb-10 flex-1 relative z-10">
                {["3 x Entries to Monthly Draw", "Minimum 10% Charity Contribution", "Access to Charity Impact Dashboard", "Premium Metal Member Card", "Exclusive Partner Discounts"].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="primary" 
                className="w-full h-14 text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                onClick={() => handleSubscriptionAction('yearly')}
                disabled={processingPlan !== null}
              >
                {processingPlan === 'yearly' ? <Loader2 className="animate-spin mr-2" /> : null}
                {isLoggedIn ? "Subscribe Securely" : "Join the Pro Club"}
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Charity Callout */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-32"
        >
          <Card className="bg-emerald-950/30 border-emerald-500/20 p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Heart className="text-emerald-400 animate-pulse" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">The Giving Guarantee</h3>
              <p className="text-white/70 leading-relaxed font-medium">
                We believe golf should be a force for good. That's why <strong className="text-white">at least 10%</strong> of every dollar you spend on your subscription goes directly to the charity of your choice. You choose who you support, and we make sure they get the funds.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-white/60">Everything you need to know about becoming a member of our Impact Community.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card 
                key={idx} 
                className="overflow-hidden bg-white/5 hover:bg-white/10 transition-colors border-white/10 shadow-xl"
              >
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left"
                >
                  <span className="text-lg font-medium text-white/90 pr-8">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="text-white/50 shrink-0" size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
