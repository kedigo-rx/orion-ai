"use client"

import { useEffect, useState } from "react"
import { OrionLogo } from "@/components/orion-logo"
import type { ChatMessage } from "./types"
import { Download, RotateCw, User, Sparkles } from "lucide-react"

interface MessageBubbleProps {
  message: ChatMessage
  onRegenerate?: (message: ChatMessage) => void
}

export function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === "user"

  if (isUser) {
    return (
      <div className="orion-rise flex w-full items-start justify-end gap-3">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-secondary px-4 py-3 text-secondary-foreground">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User size={18} />
        </span>
      </div>
    )
  }

  return (
    <div className="orion-rise flex w-full items-start gap-3">
      <OrionLogo size={30} className="mt-1 shrink-0" />
      <div className="min-w-0 flex-1 space-y-3">
        {message.content && (
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{message.content}</p>
        )}

        {message.kind === "image" && (
          <ImageBlock message={message} onRegenerate={onRegenerate} />
        )}
      </div>
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0">
      <div className="orion-shimmer absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="flex gap-1.5">
          <span className="orion-glow-dot size-2.5 rounded-full bg-[var(--nebula-pink)]" />
          <span
            className="orion-glow-dot size-2.5 rounded-full bg-[var(--nebula-purple)]"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="orion-glow-dot size-2.5 rounded-full bg-[var(--nebula-orange)]"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
        <p className="flex items-center gap-1.5 text-sm text-foreground/80">
          <Sparkles size={14} className="text-[var(--nebula-pink)]" />
          Conjuring cosmic dust…
        </p>
      </div>
    </div>
  )
}

function ImageBlock({
  message,
  onRegenerate,
}: {
  message: ChatMessage
  onRegenerate?: (message: ChatMessage) => void
}) {
  const [loaded, setLoaded] = useState(false)

  // Reset the loading state whenever a new image URL is requested (e.g. regenerate).
  useEffect(() => {
    setLoaded(false)
  }, [message.imageUrl])

  const showSkeleton = message.loading || !message.imageUrl || !loaded

  return (
    <div className="w-full max-w-md">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border">
        {message.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.imageUrl || "/placeholder.svg"}
            alt={message.imagePrompt || "Generated cosmic image"}
            className="h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: loaded ? 1 : 0 }}
            crossOrigin="anonymous"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        )}
        {showSkeleton && <LoadingOverlay />}

        {/* Elegant translucent Orion watermark, bottom-right */}
        {message.imageUrl && loaded && (
          <div className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/35 px-2 py-1 backdrop-blur-sm">
            <OrionLogo size={14} glow={false} />
            <span className="text-[10px] font-semibold tracking-wide text-white/85">Orion</span>
          </div>
        )}
      </div>
      {message.imagePrompt && (
        <p className="mt-2 text-xs italic text-muted-foreground">{message.imagePrompt}</p>
      )}
      <div className="mt-3 flex gap-2">
        <a
          href={message.imageUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          download="orion-creation.png"
          aria-disabled={!loaded}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-[var(--nebula-blue)]/60 hover:text-[var(--nebula-blue)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          <Download size={15} />
          Download
        </a>
        <button
          onClick={() => onRegenerate?.(message)}
          disabled={!loaded}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-[var(--nebula-pink)]/60 hover:text-[var(--nebula-pink)] disabled:pointer-events-none disabled:opacity-50"
        >
          <RotateCw size={15} />
          Regenerate
        </button>
      </div>
    </div>
  )
}
