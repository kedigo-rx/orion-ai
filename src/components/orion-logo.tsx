import { cn } from "@/lib/utils"

interface OrionLogoProps {
  className?: string
  size?: number
  glow?: boolean
}

/**
 * Sharp, modern, tribal four-pointed star with concave edges and a split
 * faceted center. Filled with the Orion Nebula gradient (pink, purple, orange)
 * and a soft neon glow.
 */
export function OrionLogo({ className, size = 28, glow = true }: OrionLogoProps) {
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
              "radial-gradient(circle, var(--nebula-pink), var(--nebula-purple) 55%, transparent 72%)",
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
        aria-label="Orion logo"
      >
        <defs>
          <linearGradient id="orion-grad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--nebula-orange)" />
            <stop offset="0.5" stopColor="var(--nebula-pink)" />
            <stop offset="1" stopColor="var(--nebula-purple)" />
          </linearGradient>
          <linearGradient id="orion-grad-2" x1="56" y1="6" x2="8" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--nebula-pink)" />
            <stop offset="1" stopColor="var(--nebula-purple)" />
          </linearGradient>
        </defs>

        {/* Main four-pointed concave star */}
        <path
          d="M32 2 Q35 29 62 32 Q35 35 32 62 Q29 35 2 32 Q29 29 32 2 Z"
          fill="url(#orion-grad)"
        />

        {/* Tribal split: diagonal facets give the sharp esports-emblem look */}
        <path
          d="M32 2 Q35 29 62 32 Q41 33 32 32 Q33 18 32 2 Z"
          fill="url(#orion-grad-2)"
          opacity="0.55"
        />
        <path
          d="M32 62 Q29 35 2 32 Q23 31 32 32 Q31 46 32 62 Z"
          fill="url(#orion-grad-2)"
          opacity="0.55"
        />

        {/* Inner emblem diamond (negative-space crest) */}
        <path
          d="M32 22 L40 32 L32 42 L24 32 Z"
          fill="var(--background)"
          opacity="0.9"
        />
        <path
          d="M32 26 L37 32 L32 38 L27 32 Z"
          fill="url(#orion-grad)"
        />

        {/* Crisp fold highlights */}
        <path d="M32 2 L32 62" stroke="var(--nebula-blue)" strokeWidth="0.5" opacity="0.4" />
        <path d="M2 32 L62 32" stroke="var(--nebula-blue)" strokeWidth="0.5" opacity="0.25" />
      </svg>
    </span>
  )
}
