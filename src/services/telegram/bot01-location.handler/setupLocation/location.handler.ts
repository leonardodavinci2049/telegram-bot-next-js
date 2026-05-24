import type { Bot } from "grammy";

export async function setupLocationHandler(bot: Bot): Promise<void> {
  bot.on(":location", async (ctx) => {
    try {
      const location = ctx.msg.location;
      const latitude = location.latitude;
      const longitude = location.longitude;

      console.log(
        `[telegram] Received location from chat ${ctx.chat.id}: ${latitude}, ${longitude}`,
      );

      await ctx.reply(
        `Recebi sua localização! 📍\nLatitude: ${latitude}\nLongitude: ${longitude}`,
      );
    } catch (error) {
      console.error(
        `[telegram] Failed to process location from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });
}
