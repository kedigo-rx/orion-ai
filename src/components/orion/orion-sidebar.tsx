"use client"

import { cn } from "@/lib/utils"
import { SlimeLogo } from "@/components/slime-logo"
import type { ChatSession } from "./types"
import {
  PanelLeftClose,
  PanelLeft,
  Plus,
  MessageSquare,
  Settings,
  Sparkles,
  LogIn,
} from "lucide-react"

export interface OrionUser {
  name: string
  provider: string
}

interface OrionSidebarProps {
  open: boolean
  onToggle: () => void
  sessions: ChatSession[]
  activeId: string
  onSelect: (id: string) => void
  onNewChat: () => void
  onOpenSettings: () => void
  onOpenSignIn: () => void
  onOpenPro: () => void
  user: OrionUser | null
}

export function OrionSidebar({
  open,
  onToggle,
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onOpenSettings,
  onOpenSignIn,
  onOpenPro,
  user,
}: OrionSidebarProps) {
  return (
    <aside
      className={cn(
        "relative z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        open ? "w-72" : "w-0 md:w-[68px]",
      )}
    >
      <div className={cn("flex flex-col gap-3 overflow-hidden p-3", !open && "items-center px-2")}>
        {/* Header */}
        <div className={cn("flex items-center", open ? "justify-between" : "justify-center")}>
          {open && (
            <div className="flex items-center gap-2 pl-1">
              <SlimeLogo size={26} />
              <span className="text-lg font-semibold tracking-tight">SlimeAI</span>
            </div>
          )}
          <button
            onClick={onToggle}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            {open ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
          </button>
        </div>

        {/* Account */}
        {user ? (
          <button
            onClick={onOpenSettings}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 transition-colors hover:bg-sidebar-accent",
              open ? "px-3 py-2" : "h-11 w-11 justify-center self-center p-0",
            )}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--nebula-pink)] to-[var(--nebula-purple)] text-xs font-bold text-white">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            {open && (
              <span className="min-w-0 text-left">
                <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
                <span className="block text-xs text-muted-foreground">Google Auth</span>
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={onOpenSignIn}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-sidebar-border font-medium text-foreground transition-colors hover:bg-sidebar-accent",
              open ? "px-4 py-2.5" : "h-11 w-11 justify-center self-center p-0",
            )}
          >
            <LogIn size={18} className="shrink-0 text-[var(--nebula-blue)]" />
            {open && <span className="text-sm">Sign In</span>}
          </button>
        )}

        {/* New chat */}
        <button
          onClick={onNewChat}
          className={cn(
            "group flex items-center gap-2 rounded-xl bg-sidebar-accent font-medium text-sidebar-accent-foreground transition-all hover:opacity-90",
            open ? "px-4 py-2.5" : "h-11 w-11 justify-center p-0",
          )}
        >
          <Plus size={20} className="shrink-0 text-[var(--nebula-pink)]" />
          {open && <span className="text-sm">New Chat</span>}
        </button>
      </div>

      {/* Recent chats */}
      <div className="orion-scroll flex-1 overflow-y-auto px-3">
        {open && (
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Chats
          </p>
        )}
        <nav className="flex flex-col gap-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              title={s.title}
              className={cn(
                "flex items-center gap-3 rounded-lg text-left text-sm transition-colors",
                open ? "px-3 py-2.5" : "h-11 w-11 justify-center self-center p-0",
                s.id === activeId
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <MessageSquare size={18} className="shrink-0" />
              {open && <span className="truncate">{s.title}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-sidebar-border p-3">
        {/* Upgrade to Pro */}
        <button
          onClick={onOpenPro}
          className={cn(
            "orion-pro-border group flex items-center gap-2 font-semibold text-foreground transition-transform hover:scale-[1.01]",
            open ? "px-4 py-2.5" : "h-11 w-11 justify-center self-center p-0",
          )}
        >
          <Sparkles size={18} className="shrink-0 text-[var(--nebula-orange)]" />
          {open && <span className="text-sm">Upgrade to Pro</span>}
        </button>

        <button
          onClick={onOpenSettings}
          className={cn(
            "flex items-center gap-3 rounded-lg text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            open ? "w-full px-3 py-2.5" : "h-11 w-11 justify-center self-center p-0",
          )}
        >
          <Settings size={18} className="shrink-0" />
          {open && <span>Settings</span>}
        </button>
      </div>
    </aside>
  )
}
