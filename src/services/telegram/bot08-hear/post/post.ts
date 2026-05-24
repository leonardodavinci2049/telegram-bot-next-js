import { type Bot, InlineKeyboard } from "grammy";

const botoes = new InlineKeyboard()
  .url(
    { text: "🔥 Apollyon", style: "danger" },
    "https://t.me/seu_link_apollyon",
  )
  .url(
    { text: "💎 Sathariel", style: "primary" },
    "https://t.me/seu_link_sathariel",
  )
  .row()
  .url({ text: "®️ Delfos", style: "danger" }, "https://t.me/seu_link_delfos")
  .url(
    { text: "©️ The Olympus", style: "primary" },
    "https://t.me/seu_link_olympus",
  )
  .row()
  .url(
    { text: "🗂 Pasta Completa", style: "success" },
    "https://t.me/seu_link_pasta",
  );

export async function setupPostHandler(bot: Bot): Promise<void> {
  // Responde aos comandos /start ou /post com a postagem
  bot.command(["start", "post"], async (ctx) => {
    const caption = `🧙‍♂️ <b>Opa, Tio @xEistibus aqui!</b> - ✅ ON

🔥 Todos os projetos do canal, sejam bem-vindos e divirtam-se!

🔥 <b>Apollyon</b> - Receitas
💎 <b>Sathariel</b> - Tecnologia

®️ <b>Delfos</b> - Fórum geral
©️ <b>Olympus</b> - Fórum de Negócios`;

    // URL de imagem de exemplo (placeholder).
    // Para usar uma imagem específica, você pode fazer o upload no Telegram e usar o 'file_id'
    // ou usar uma URL de uma imagem hospedada publicamente.
    const imageUrl =
      "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop";

    await ctx.replyWithPhoto(imageUrl, {
      caption,
      parse_mode: "HTML",
      reply_markup: botoes,
    });
  });
}
