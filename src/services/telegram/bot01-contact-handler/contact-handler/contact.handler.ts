import type { Bot } from "grammy";

export async function setupContactHandler(bot: Bot): Promise<void> {
  bot.on(":contact", async (ctx) => {
    try {
      const contact = ctx.msg.contact;
      const phoneNumber = contact.phone_number;
      const firstName = contact.first_name;
      const lastName = contact.last_name || "Não informado";
      const userId = contact.user_id || "Não disponível";

      console.log(
        `[telegram] Received contact from chat ${ctx.chat.id}: ${firstName} ${lastName} - ${phoneNumber}`,
      );

      await ctx.reply(
        `Recebi seu contato! 📞\n\nNome: ${firstName} ${lastName}\nTelefone: ${phoneNumber}\nID do usuário: ${userId}`,
      );
    } catch (error) {
      console.error(
        `[telegram] Failed to process contact from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });
}
