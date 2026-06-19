export type MessageKind = "text" | "image"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  kind: MessageKind
  content: string
  // for image messages
  imageUrl?: string
  imagePrompt?: string
  loading?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
}
