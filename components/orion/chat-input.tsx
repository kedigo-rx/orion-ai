"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"
import { Mic, Paperclip, ArrowUp } from "lucide-react"
import { PresetSelector } from "./preset-selector"

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
  preset: string
  onPresetChange: (id: string) => void
}

export function ChatInput({ onSend, disabled, preset, onPresetChange }: ChatInputProps) {
  const [value, setValue] = useState("")
  const taRef = useRef<HTMLTextAreaElement>(null)

  function submit() {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue("")
    if (taRef.current) taRef.current.style.height = "auto"
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function autoGrow() {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-2 flex items-center justify-between px-1">
        <PresetSelector value={preset} onChange={onPresetChange} />
      </div>
      <div
        className={cn(
          "flex items-end gap-2 rounded-[28px] border border-border bg-card/80 p-2 pl-4 shadow-lg backdrop-blur-md transition-colors",
          "focus-within:border-[var(--nebula-purple)]/70",
        )}
      >
        <button
          type="button"
          aria-label="Attach file or image"
          className="mb-1 shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={taRef}
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            autoGrow()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask Orion anything, or type 'generate image of…'"
          className="orion-scroll max-h-44 flex-1 resize-none self-center bg-transparent py-2.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <button
          type="button"
          aria-label="Voice input"
          className="mb-1 shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Mic size={20} />
        </button>

        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
          className={cn(
            "mb-0.5 flex size-10 shrink-0 items-center justify-center rounded-full transition-all",
            value.trim() && !disabled
              ? "bg-gradient-to-br from-[var(--nebula-pink)] to-[var(--nebula-purple)] text-white shadow-[0_0_18px_-2px_var(--nebula-pink)] hover:opacity-90"
              : "bg-muted text-muted-foreground",
          )}
        >
          <ArrowUp size={20} />
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Orion can make mistakes. This is a simulated cosmic experience.
      </p>
    </div>
  )
}
