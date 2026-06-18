"use client"

import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { OrionLogo } from "@/components/orion-logo"
import {
  X,
  Palette,
  Cpu,
  Check,
  Github,
  Mail,
  Sparkles,
  Zap,
  Infinity as InfinityIcon,
  Brain,
  ShieldCheck,
} from "lucide-react"

/* ------------------------------ Modal shell ------------------------------ */

function ModalShell({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "orion-rise relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-popover shadow-2xl",
          className,
        )}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

/* ----------------------------- Settings modal ---------------------------- */

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  glow: number
  onGlowChange: (v: number) => void
}

export function SettingsModal({ open, onClose, glow, onGlowChange }: SettingsModalProps) {
  const [tab, setTab] = useState<"appearance" | "ai">("appearance")

  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <OrionLogo size={22} />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      <div className="flex gap-1 border-b border-border px-4 pt-3">
        <TabButton active={tab === "appearance"} onClick={() => setTab("appearance")} icon={Palette}>
          Appearance
        </TabButton>
        <TabButton active={tab === "ai"} onClick={() => setTab("ai")} icon={Cpu}>
          AI Settings
        </TabButton>
      </div>

      <div className="p-6">
        {tab === "appearance" ? (
          <div className="space-y-6">
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-foreground">
                <span>Nebula glow intensity</span>
                <span className="text-xs text-muted-foreground">{Math.round(glow * 100)}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={glow}
                onChange={(e) => onGlowChange(Number(e.target.value))}
                className="orion-range mt-3 w-full"
              />
              <div
                className="mt-4 flex h-24 items-center justify-center rounded-2xl border border-border"
                style={{
                  background: `radial-gradient(circle, color-mix(in oklch, var(--nebula-pink) ${Math.round(
                    glow * 60,
                  )}%, transparent), transparent 70%)`,
                }}
              >
                <OrionLogo size={48} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Tüm uygulamadaki kozmik parıltı yoğunluğunu ayarlar.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ToggleRow label="Streaming yanıtlar" description="Yanıtları kelime kelime canlı göster" defaultOn />
            <ToggleRow label="Markdown render" description="Kod blokları ve biçimlendirmeyi etkinleştir" defaultOn />
            <ToggleRow label="Sohbet hafızası" description="Aynı oturumdaki önceki mesajları hatırla" defaultOn />
            <div className="rounded-2xl border border-border bg-card/60 p-4 text-xs text-muted-foreground">
              Orion, GYF (Gmary Yazılım Firması) tarafından geliştirilen gelişmiş bir yapay zeka altyapısı kullanır.
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Palette
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-b-2 border-[var(--nebula-pink)] text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon size={15} />
      {children}
    </button>
  )
}

function ToggleRow({
  label,
  description,
  defaultOn,
}: {
  label: string
  description: string
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(!!defaultOn)
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setOn((o) => !o)}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          on ? "bg-[var(--nebula-pink)]" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
            on ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  )
}

/* ------------------------------ Sign-in modal ---------------------------- */

interface SignInModalProps {
  open: boolean
  onClose: () => void
  onSignIn: (provider: string) => void
}

export function SignInModal({ open, onClose, onSignIn }: SignInModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
        <OrionLogo size={52} />
        <h2 className="mt-4 text-xl font-semibold">Connect your account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sohbet geçmişini kaydet ve Orion&apos;u her yerde kullan.
        </p>

        <div className="mt-6 flex w-full flex-col gap-3">
          <button
            onClick={() => onSignIn("Google")}
            className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Mail size={18} className="text-[var(--nebula-pink)]" />
            Sign in with Google
          </button>
          <button
            onClick={() => onSignIn("GitHub")}
            className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <GitHub size={18} />
            Sign in with GitHub
          </button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          Bu bir demo girişidir — gerçek kimlik doğrulaması yapılmaz.
        </p>
      </div>
    </ModalShell>
  )
}

/* -------------------------------- Pro modal ------------------------------ */

interface ProModalProps {
  open: boolean
  onClose: () => void
}

const PERKS = [
  { icon: InfinityIcon, text: "Unlimited Luau Scripting" },
  { icon: Brain, text: "Access to Advanced Reasoning Models" },
  { icon: Zap, text: "Öncelikli hız ve daha uzun bağlam" },
  { icon: ShieldCheck, text: "Erken erişim özellikleri ve premium destek" },
]

export function ProModal({ open, onClose }: ProModalProps) {
  const [email, setEmail] = useState("")
  const [joined, setJoined] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)

  function reset() {
    setEmail("")
    setJoined(false)
    setShowWaitlist(false)
  }

  return (
    <ModalShell
      open={open}
      onClose={() => {
        onClose()
        // delay reset until after close animation
        setTimeout(reset, 200)
      }}
    >
      <div className="relative">
        {/* Gradient header banner */}
        <div className="bg-gradient-to-br from-[var(--nebula-purple)] via-[var(--nebula-pink)] to-[var(--nebula-orange)] px-6 py-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-black/25 backdrop-blur-sm">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-white">Orion Pro</h2>
          <p className="mt-1 text-sm text-white/85">Kozmik gücün tamamını aç</p>
          <p className="mt-3 text-white">
            <span className="text-4xl font-extrabold">$9</span>
            <span className="text-sm text-white/85">/month</span>
          </p>
        </div>

        <div className="p-6">
          {!showWaitlist ? (
            <>
              <ul className="space-y-3">
                {PERKS.map((perk) => {
                  const Icon = perk.icon
                  return (
                    <li key={perk.text} className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                        <Icon size={16} className="text-[var(--nebula-pink)]" />
                      </span>
                      <span className="text-sm text-foreground">{perk.text}</span>
                    </li>
                  )
                })}
              </ul>
              <button
                onClick={() => setShowWaitlist(true)}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[var(--nebula-pink)] to-[var(--nebula-purple)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-4px_var(--nebula-pink)] transition-opacity hover:opacity-90"
              >
                Purchase
              </button>
            </>
          ) : joined ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-[var(--nebula-pink)]/20">
                <Check size={28} className="text-[var(--nebula-pink)]" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">Listeye eklendin!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Erken erişim açıldığında <span className="text-foreground">{email}</span> adresine haber vereceğiz.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.trim()) setJoined(true)
              }}
              className="flex flex-col gap-3"
            >
              <p className="text-sm text-muted-foreground">
                Orion Pro çok yakında geliyor! Erken erişim için e-postanı bırak.
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@cosmos.dev"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--nebula-purple)]"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[var(--nebula-pink)] to-[var(--nebula-purple)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_-4px_var(--nebula-pink)] transition-opacity hover:opacity-90"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>
      </div>
    </ModalShell>
  )
}
