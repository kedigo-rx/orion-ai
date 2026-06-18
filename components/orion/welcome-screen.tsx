"use client"

import { OrionLogo } from "@/components/orion-logo"
import { Code2, ImageIcon, Lightbulb, PenLine } from "lucide-react"

const QUICK_STARTS = [
  {
    icon: Code2,
    title: "Code a website",
    prompt: "Code a responsive landing page for a space tourism startup.",
    color: "var(--nebula-blue)",
  },
  {
    icon: ImageIcon,
    title: "Generate a cosmic image",
    prompt: "Generate an image of a glowing nebula with a ringed planet.",
    color: "var(--nebula-pink)",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm ideas",
    prompt: "Brainstorm ten creative names for a stargazing mobile app.",
    color: "var(--nebula-orange)",
  },
  {
    icon: PenLine,
    title: "Help me write",
    prompt: "Help me write a short poem about the Orion constellation.",
    color: "var(--nebula-purple)",
  },
]

export function WelcomeScreen({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="orion-rise mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 text-center">
      <OrionLogo size={64} className="orion-spin-slow mb-6" />
      <h1 className="text-balance bg-gradient-to-r from-[var(--nebula-orange)] via-[var(--nebula-pink)] to-[var(--nebula-purple)] bg-clip-text text-3xl font-semibold leading-tight text-transparent sm:text-4xl md:text-5xl">
        Hello, I am Orion.
      </h1>
      <p className="mt-3 text-pretty text-lg text-muted-foreground sm:text-xl">
        How can I help you today?
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {QUICK_STARTS.map((card) => (
          <button
            key={card.title}
            onClick={() => onPick(card.prompt)}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--nebula-purple)]/60 hover:bg-card"
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
              style={{ backgroundColor: `color-mix(in oklch, ${card.color} 18%, transparent)` }}
            >
              <card.icon size={20} style={{ color: card.color }} />
            </span>
            <div>
              <p className="font-medium text-foreground">{card.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{card.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
