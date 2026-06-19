"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Zap, Brain, Sparkles } from "lucide-react"

export interface AIModel {
  id: string
  name: string
  description: string
  icon: typeof Sparkles
  accent: string
  speed: "fast" | "balanced" | "advanced"
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Hızlı ve verimli, gerçek zamanlı yanıtlar",
    icon: Zap,
    accent: "var(--nebula-pink)",
    speed: "fast",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Karmaşık akıl yürütme ve derin kodlama",
    icon: Brain,
    accent: "var(--nebula-blue)",
    speed: "balanced",
  },
  {
    id: "gemini-2.0-flash-thinking",
    name: "Gemini 2.0 Flash Thinking",
    description: "Düşünme süreçlerini gösteren gelişmiş model",
    icon: Sparkles,
    accent: "var(--nebula-purple)",
    speed: "advanced",
  },
]

interface ModelSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = AI_MODELS.find((m) => m.id === value) ?? AI_MODELS[0]
  const Icon = current.icon

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:border-[var(--nebula-pink)]/60"
      >
        <Icon size={14} style={{ color: current.accent }} />
        <span>{current.name}</span>
        <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-30 mb-2 w-80 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
          {AI_MODELS.map((m) => {
            const MIcon = m.icon
            const selected = m.id === value
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m.id)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  selected ? "bg-accent" : "hover:bg-accent/60",
                )}
              >
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in oklch, ${m.accent} 22%, transparent)` }}
                >
                  <MIcon size={15} style={{ color: m.accent }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {m.name}
                    {selected && <Check size={13} className="text-[var(--nebula-pink)]" />}
                  </span>
                  <span className="block text-xs leading-snug text-muted-foreground">{m.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
