import type { Bot } from "grammy";

export async function setupPhotoHandler(bot: Bot): Promise<void> {
  bot.on(":photo", async (ctx) => {
    try {
      const photo = ctx.msg.photo;
      const photoCount = photo.length;
      const largestPhoto = photo[photoCount - 1];
      const fileId = largestPhoto.file_id;
      const width = largestPhoto.width;
      const height = largestPhoto.height;
      const fileSize = largestPhoto.file_size || "Não disponível";

      console.log(
        `[telegram] Received photo from chat ${ctx.chat.id}: ${width}x${height}, File ID: ${fileId}`,
      );

      await ctx.reply(
        `Recebi sua foto! 📷\n\nResolução: ${width}x${height}\nTamanho: ${fileSize} bytes\nID do arquivo: ${fileId}`,
      );
    } catch (error) {
      console.error(
        `[telegram] Failed to process photo from chat ${ctx.chat.id}:`,
        error,
      );
    }
  });
}
