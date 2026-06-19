import { SlimeLogo } from "@/components/slime-logo"

export function ThinkingIndicator() {
  return (
    <div className="orion-rise flex w-full items-start gap-3">
      <SlimeLogo size={30} className="orion-spin-slow mt-1 shrink-0" />
      <div className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">SlimeAI is thinking…</p>
        {/* Gemini-style fluid wave bars */}
        <div className="space-y-2.5">
          <div className="orion-thinking-bar h-3 w-full rounded-full opacity-90" />
          <div className="orion-thinking-bar h-3 w-[85%] rounded-full opacity-70" />
          <div className="orion-thinking-bar h-3 w-[60%] rounded-full opacity-50" />
        </div>
      </div>
    </div>
  )
}
