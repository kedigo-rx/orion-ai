"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Sparkles, Code2, Telescope } from "lucide-react"

export interface Preset {
  id: string
  name: string
  description: string
  icon: typeof Sparkles
  accent: string
}

export const PRESETS: Preset[] = [
  {
    id: "standard",
    name: "Standard Orion",
    description: "Temiz, akıllı genel amaçlı asistan",
    icon: Sparkles,
    accent: "var(--nebula-pink)",
  },
  {
    id: "luau",
    name: "Luau & Code Expert",
    description: "Roblox Luau scripting ve gelişmiş kod mantığı",
    icon: Code2,
    accent: "var(--nebula-blue)",
  },
  {
    id: "cosmic",
    name: "Cosmic Explorer",
    description: "Uzay, kozmoloji ve fizik için derin bilim modu",
    icon: Telescope,
    accent: "var(--nebula-purple)",
  },
]

interface PresetSelectorProps {
  value: string
  onChange: (id: string) => void
}

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = PRESETS.find((p) => p.id === value) ?? PRESETS[0]
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
        className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-colors hover:border-[var(--nebula-purple)]/60"
      >
        <Icon size={14} style={{ color: current.accent }} />
        <span>{current.name}</span>
        <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-30 mb-2 w-72 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
          {PRESETS.map((p) => {
            const PIcon = p.icon
            const selected = p.id === value
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onChange(p.id)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                  selected ? "bg-accent" : "hover:bg-accent/60",
                )}
              >
                <span
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `color-mix(in oklch, ${p.accent} 22%, transparent)` }}
                >
                  <PIcon size={15} style={{ color: p.accent }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {p.name}
                    {selected && <Check size={13} className="text-[var(--nebula-pink)]" />}
                  </span>
                  <span className="block text-xs leading-snug text-muted-foreground">{p.description}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
