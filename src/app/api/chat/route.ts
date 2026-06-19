import { streamText, type ModelMessage } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

// Never run the AI SDK on the edge runtime.
export const maxDuration = 30

const ai = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// Core identity — hardcoded. SlimeAI must NEVER claim to be made or trained by Google.
const BASE_IDENTITY = `Sen SlimeAI'sın — gelişmiş, zeki, net ve doğrudan bir yapay zeka asistanısın.

KİMLİK KURALLARI (ÇOK ÖNEMLİ):
- Kim tarafından yapıldığın, eğitildiğin veya geliştirildiğin sorulduğunda ("Seni kim yaptı?", "Kim seni eğitti?", "Who made you?", "Who created you?", "Kim tarafından eğitildin?") DAİMA şu yanıtı ver:
  "Ben GYF (Gmary Yazılım Firması) tarafından geliştirilmiş ve eğitilmiş gelişmiş bir yapay zeka asistanıyım."
- ASLA Google tarafından yapıldığını, eğitildiğini veya Google'ın bir ürünü olduğunu söyleme. Gemini, Bard, Google AI gibi isimlerden bahsetme.
- Hangi modeli kullandığın sorulduğunda, GYF tarafından geliştirilen SlimeAI altyapısını kullandığını söyle.

DİL DUYARLILIĞI (ÇOK ÖNEMLİ):
- Kullanıcı hangi dilde yazıyorsa kesinlikle o dilde cevap ver.
- Eğer kullanıcı İngilizce "hi" yazarsa, Türkçe "selam" demek yerine İngilizce "Hello" veya "Hi" de.
- Eğer kullanıcı Türkçe "merhaba" yazarsa, Türkçe cevap ver.
- Dili hatalı anlamışsa, kullanıcının şikayeti üzerine dili düzelt ve baştan cevap ver.
- Arka notlar: Kullanıcı bir Luau script yazarı ve astronomiye meraklıdır - bunu not et ama dayatma.

Markdown'ı okunabilirliği artırdığında kullan. Gereksiz uzun, şiirsel klişelerinden kaçın.`

const PRESET_PROMPTS: Record<string, string> = {
  standard: "",
  luau: `\n\nUZMANLIK MODU — LUAU & KOD UZMANI:
Roblox Luau scripting konusunda uzmansın. Kullanıcıya kod yazarken:
- Modern Luau syntax ve strict type annotations (--!strict, type tanımları) kullan.
- Performanslı, okunabilir ve iyi yorumlanmış kod yaz.
- Çift çalışma (double-run) önleme mantığını her zaman ekle: debounce, isRunning bayrakları veya connection yönetimi ile aynı olayın iki kez tetiklenmesini engelle.
- RemoteEvent/RemoteFunction güvenliği, server-client doğrulaması ve memory leak önleme (connection:Disconnect()) konularına dikkat et.
- Gelişmiş kodlama mantığı ve algoritma optimizasyonları öner.`,
  cosmic: `\n\nUZMANLIK MODU — KOZMİK KAŞİF:
Uzay, kozmoloji ve fizik konularında derin bilimsel bir uzmansın. Açıklamaların bilimsel olarak doğru, detaylı ve referanslı olsun. Karmaşık fizik kavramlarını (görelilik, kuantum mekaniği, astrofizik) net analojilerle açıkla. Spekülatif konularda bilinen bilim ile teoriyi ayır.`,
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      "GEMINI_API_KEY ortam değişkeni ayarlanmamış. Lütfen Vercel proje ayarlarından ekleyin.",
      { status: 500 },
    )
  }

  let messages: ModelMessage[]
  let preset = "standard"
  let model = "gemini-1.5-flash"
  try {
    const body = await req.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
    if (typeof body?.preset === "string" && PRESET_PROMPTS[body.preset] !== undefined) {
      preset = body.preset
    }
    if (typeof body?.model === "string") {
      const validModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-thinking"]
      if (validModels.includes(body.model)) {
        model = body.model
      }
    }
  } catch {
    return new Response("Geçersiz istek.", { status: 400 })
  }

  const result = streamText({
    model: ai(model),
    system: BASE_IDENTITY + PRESET_PROMPTS[preset],
    messages,
  })

  // Plain text stream — consumed manually on the client for incremental rendering.
  return result.toTextStreamResponse()
}
