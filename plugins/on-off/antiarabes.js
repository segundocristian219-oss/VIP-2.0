import { getConfig } from '../../db/index.js'

const handler = async (m, { conn }) => {
  try {
    // Solo grupos
    if (!m.isGroup) return

    // ChatGPT activado?
    const enabled = getConfig(m.chat, 'chatgpt')
    if (!enabled) return

    // Debe ser respuesta a un mensaje
    const ctx = m.message?.extendedTextMessage?.contextInfo
    if (!ctx?.quotedMessage) return

    // El mensaje citado debe ser del bot
    const quotedFrom = ctx.participant || ctx.remoteJid
    const botJid = conn.user.id

    if (!quotedFrom || !quotedFrom.includes(botJid.split('@')[0])) return

    // Texto del usuario
    const text =
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      ''

    if (!text.trim()) return

    // 🔹 AQUÍ VA TU IA / CHATGPT
    // Ejemplo simple:
    const reply = `🤖 Dijiste:\n${text}`

    await conn.sendMessage(
      m.chat,
      { text: reply },
      { quoted: m }
    )

  } catch (e) {
    console.error('[chat-reply]', e)
  }
}

handler.all = true
export default handler