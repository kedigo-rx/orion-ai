"use client"

import { useEffect, useRef, useState } from "react"
import { OrionSidebar, type OrionUser } from "./orion-sidebar"
import { WelcomeScreen } from "./welcome-screen"
import { MessageBubble } from "./message-bubble"
import { ThinkingIndicator } from "./thinking-indicator"
import { ChatInput } from "./chat-input"
import { OrionLogo } from "@/components/orion-logo"
import { SettingsModal, SignInModal, ProModal } from "./modals"
import type { ChatMessage, ChatSession } from "./types"
import { Menu } from "lucide-react"

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function isImagePrompt(text: string) {
  return (
    /\b(generate (an? )?image|draw|create a picture|picture of|make an image|image of|render of)\b/i.test(
      text,
    ) || /(resim|görsel|fotoğraf|çiz|illüstrasyon)/i.test(text)
  )
}

// Strips the instruction words so the actual subject of the image remains.
function extractImageSubject(text: string) {
  const cleaned = text
    .replace(
      /\b(generate (an? )?image of|generate (an? )?image|create a picture of|make an image of|picture of|image of|render of|draw (me )?(an? )?|draw)\b/gi,
      "",
    )
    .replace(/(bana |bir )?(resim|görsel|fotoğraf|illüstrasyon)(ini)?( çiz| oluştur| yap)?/gi, "")
    .replace(/\b(çiz|oluştur)\b/gi, "")
    .trim()
  return cleaned || text.trim()
}

// Builds a dynamic, prompt-driven image URL. The topic follows the user's words
// — it is NOT forced into a cosmic/space theme.
function buildImageUrl(subject: string, seed: number) {
  const enhanced = `${subject}, high quality, ultra detailed, sharp focus, 4k`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    enhanced,
  )}?width=768&height=768&nologo=true&seed=${seed}`
}

function makeSession(): ChatSession {
  return { id: uid(), title: "New Chat", messages: [], createdAt: Date.now() }
}

const SEED_SESSIONS: ChatSession[] = [
  { id: uid(), title: "Roblox Luau script yardımı", messages: [], createdAt: Date.now() - 86400000 },
  { id: uid(), title: "Yıldız gözlem uygulaması", messages: [], createdAt: Date.now() - 172800000 },
  { id: uid(), title: "Bilim kurgu öyküsü", messages: [], createdAt: Date.now() - 259200000 },
]

export function OrionChat() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sessions, setSessions] = useState<ChatSession[]>(() => [makeSession(), ...SEED_SESSIONS])
  const [activeId, setActiveId] = useState<string>(() => "")
  const [thinking, setThinking] = useState(false)
  const [preset, setPreset] = useState("standard")

  // Account + modal + appearance state
  const [user, setUser] = useState<OrionUser | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [proOpen, setProOpen] = useState(false)
  const [glow, setGlow] = useState(0.7)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveId((cur) => cur || sessions[0]?.id || "")
  }, [sessions])

  // Apply nebula glow intensity globally.
  useEffect(() => {
    document.documentElement.style.setProperty("--orion-glow", String(glow))
  }, [glow])

  const active = sessions.find((s) => s.id === activeId) ?? sessions[0]
  const messages = active?.messages ?? []

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length, thinking])

  function updateActive(updater: (s: ChatSession) => ChatSession) {
    setSessions((prev) => prev.map((s) => (s.id === active.id ? updater(s) : s)))
  }

  function pushMessage(msg: ChatMessage) {
    updateActive((s) => ({
      ...s,
      title: s.messages.length === 0 && msg.role === "user" ? truncateTitle(msg.content) : s.title,
      messages: [...s.messages, msg],
    }))
  }

  function patchMessage(id: string, patch: Partial<ChatMessage>) {
    updateActive((s) => ({
      ...s,
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }))
  }

  function handleSend(text: string) {
    if (!active || thinking) return
    pushMessage({ id: uid(), role: "user", kind: "text", content: text })

    if (isImagePrompt(text)) {
      generateImage(text)
      return
    }

    const history = [
      ...messages
        .filter((m) => m.kind === "text" && m.content.trim())
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: text },
    ]
    streamReply(history)
  }

  async function streamReply(history: { role: string; content: string }[]) {
    setThinking(true)
    const msgId = uid()
    let started = false

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, preset }),
      })

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "")
        setThinking(false)
        pushMessage({
          id: msgId,
          role: "assistant",
          kind: "text",
          content: errText || "Üzgünüm, bir sorun oluştu. Lütfen tekrar deneyin.",
        })
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        if (!started) {
          started = true
          setThinking(false)
          pushMessage({ id: msgId, role: "assistant", kind: "text", content: acc })
        } else {
          patchMessage(msgId, { content: acc })
        }
      }

      if (!started) {
        setThinking(false)
        pushMessage({ id: msgId, role: "assistant", kind: "text", content: acc || "…" })
      }
    } catch {
      setThinking(false)
      pushMessage({
        id: msgId,
        role: "assistant",
        kind: "text",
        content: "Bağlantı hatası. Lütfen tekrar deneyin.",
      })
    }
  }

  function generateImage(prompt: string) {
    setThinking(true)
    const subject = extractImageSubject(prompt)
    const msgId = uid()
    window.setTimeout(() => {
      setThinking(false)
      pushMessage({
        id: msgId,
        role: "assistant",
        kind: "image",
        content: "İşte senin için oluşturduğum görsel:",
        imagePrompt: subject,
        imageUrl: buildImageUrl(subject, Math.floor(Math.random() * 1_000_000)),
      })
    }, 500)
  }

  function handleRegenerate(msg: ChatMessage) {
    patchMessage(msg.id, {
      imageUrl: buildImageUrl(msg.imagePrompt || "abstract art", Math.floor(Math.random() * 1_000_000)),
    })
  }

  // Fix "New Chat" spam: if the current chat is already empty and unused, reuse it.
  function handleNewChat() {
    if (active && active.messages.length === 0) {
      return
    }
    const existingEmpty = sessions.find((s) => s.messages.length === 0)
    if (existingEmpty) {
      setActiveId(existingEmpty.id)
      return
    }
    const s = makeSession()
    setSessions((prev) => [s, ...prev])
    setActiveId(s.id)
  }

  return (
    <div className="orion-cosmos flex h-dvh w-full overflow-hidden text-foreground">
      <OrionSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        sessions={sessions}
        activeId={active?.id ?? ""}
        onSelect={(id) => setActiveId(id)}
        onNewChat={handleNewChat}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenPro={() => setProOpen(true)}
        user={user}
      />

      <main className="relative flex h-full flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border/60 px-4 py-3 backdrop-blur-sm">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <OrionLogo size={24} />
            <span className="text-base font-semibold tracking-tight">Orion</span>
            <span className="rounded-full border border-border bg-card/60 px-2 py-0.5 text-[11px] text-muted-foreground">
              GYF
            </span>
          </div>
        </header>

        <div ref={scrollRef} className="orion-scroll flex-1 overflow-y-auto">
          {messages.length === 0 && !thinking ? (
            <div className="flex min-h-full items-center justify-center">
              <WelcomeScreen onPick={handleSend} />
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} onRegenerate={handleRegenerate} />
              ))}
              {thinking && <ThinkingIndicator />}
            </div>
          )}
        </div>

        <div className="px-4 pb-5 pt-2">
          <ChatInput onSend={handleSend} disabled={thinking} preset={preset} onPresetChange={setPreset} />
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        glow={glow}
        onGlowChange={setGlow}
      />
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignIn={(provider) => {
          setUser({ name: "CosmicDeveloper", provider })
          setSignInOpen(false)
        }}
      />
      <ProModal open={proOpen} onClose={() => setProOpen(false)} />
    </div>
  )
}

function truncateTitle(text: string) {
  const clean = text.trim().replace(/\s+/g, " ")
  return clean.length > 32 ? clean.slice(0, 32) + "…" : clean
}
