import React from "react"
import { cn } from "../../lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "outline"
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    
    const variants = {
      default: "bg-white/10 text-white border-white/10",
      success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      warning: "bg-gold/10 text-gold-light border-gold/20",
      error: "bg-red-500/10 text-red-400 border-red-500/20",
      outline: "border-white/20 text-white/80"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"
