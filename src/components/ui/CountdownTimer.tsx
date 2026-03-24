import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  targetDate: string
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const addLeadingZero = (value: number) => {
    return value < 10 ? `0${value}` : value
  }

  return (
    <div className="flex items-center gap-3 md:gap-6">
      <TimeUnit value={addLeadingZero(timeLeft.days)} label="Days" />
      <span className="text-2xl font-bold text-white/20 pb-6">:</span>
      <TimeUnit value={addLeadingZero(timeLeft.hours)} label="Hours" />
      <span className="text-2xl font-bold text-white/20 pb-6">:</span>
      <TimeUnit value={addLeadingZero(timeLeft.minutes)} label="Minutes" />
      <span className="text-2xl font-bold text-white/20 pb-6 hidden sm:block">:</span>
      <TimeUnit value={addLeadingZero(timeLeft.seconds)} label="Seconds" className="hidden sm:flex" />
    </div>
  )
}

const TimeUnit = ({ value, label, className = "" }: { value: string | number, label: string, className?: string }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden mb-2">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
      <motion.span 
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-4xl font-display font-bold text-white tabular-nums relative z-10"
      >
        {value}
      </motion.span>
    </div>
    <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</span>
  </div>
)
