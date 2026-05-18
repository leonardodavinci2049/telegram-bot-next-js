import { type Bot, InlineKeyboard } from "grammy";

// Usamos um objeto literal com type casting para adicionar atributos como 'style'
// (recurso a partir do Bot API 9.4), que permite botões coloridos no Telegram.
const botoes = {
  inline_keyboard: [
    [
      {
        text: "🔥 Apollyon",
        url: "https://t.me/seu_link_apollyon",
        style: "danger",
      },
      {
        text: "💎 Sathariel",
        url: "https://t.me/seu_link_sathariel",
        style: "primary",
      },
    ],
    [
      {
        text: "®️ Delfos",
        url: "https://t.me/seu_link_delfos",
        style: "danger",
      },
      {
        text: "©️ The Olympus",
        url: "https://t.me/seu_link_olympus",
        style: "primary",
      },
    ],
    [
      {
        text: "🗂 Pasta Completa",
        url: "https://t.me/seu_link_pasta",
        style: "success",
      },
    ],
  ],
} as any;

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
