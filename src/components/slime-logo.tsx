import { cn } from "@/lib/utils"

interface SlimeLogoProps {
  className?: string
  size?: number
  glow?: boolean
}

/**
 * SlimeAI logo - Modern, sleek slime-drop shape with cyan/neon blue gradient
 * and a vibrant neon glow effect
 */
export function SlimeLogo({ className, size = 28, glow = true }: SlimeLogoProps) {
  return (
    <span
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 blur-md opacity-70"
          style={{
            background:
              "radial-gradient(circle, #00d9ff, #0099ff 50%, transparent 70%)",
          }}
        />
      )}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        className="relative"
        role="img"
        aria-label="SlimeAI logo"
      >
        <defs>
          <linearGradient id="slime-grad-1" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00d9ff" />
            <stop offset="0.5" stopColor="#00a8ff" />
            <stop offset="1" stopColor="#0066ff" />
          </linearGradient>
          <linearGradient id="slime-grad-2" x1="56" y1="10" x2="8" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00d9ff" />
            <stop offset="1" stopColor="#0099ff" />
          </linearGradient>
          <filter id="slime-glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main slime drop shape */}
        <path
          d="M32 8 C42 12 50 20 50 32 C50 48 42 56 32 56 C22 56 14 48 14 32 C14 20 22 12 32 8 Z"
          fill="url(#slime-grad-1)"
          filter="url(#slime-glow)"
        />

        {/* Highlight / shine effect */}
        <path
          d="M32 12 C40 14 46 22 46 32 C46 44 40 52 32 52 C26 52 20 46 18 38"
          fill="url(#slime-grad-2)"
          opacity="0.6"
        />

        {/* Inner bubble effect */}
        <circle cx="32" cy="24" r="6" fill="var(--background)" opacity="0.8" />
        <circle cx="32" cy="24" r="5" fill="url(#slime-grad-1)" opacity="0.7" />

        {/* Neon edges */}
        <path
          d="M20 32 Q20 50 32 56 Q44 50 44 32"
          stroke="#00d9ff"
          strokeWidth="0.8"
          opacity="0.4"
          fill="none"
        />
      </svg>
    </span>
  )
}
