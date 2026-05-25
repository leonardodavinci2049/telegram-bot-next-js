import { join } from "node:path";
import axios from "axios";
import { type Bot, InlineKeyboard, InputFile, Keyboard } from "grammy";

const tecladoOpcoes = new Keyboard()
  .text("O que são bots?")
  .text("O que verei no curso?")
  .row()
  .text("Posso mesmo automatizar tarefas?")
  .row()
  .text("Como comprar o curso?")
  .resized();

const botoes = new InlineKeyboard().text("Sim", "s").text("Não", "n");

const localizacao = new Keyboard()
  .requestLocation("Clique aqui para enviar sua localização")
  .resized()
  .oneTime();

export async function setupCourseBot(bot: Bot): Promise<void> {
  bot.command("start", async (ctx) => {
    const nome = ctx.from?.first_name || "Usuário";
    await ctx.reply(`*Olá, ${nome}!*\nEu sou o ChatBot do curso`, {
      parse_mode: "Markdown",
    });

    try {
      await ctx.replyWithPhoto(
        new InputFile(join(process.cwd(), "public/images/bot_myh.png")),
      );
    } catch (error) {
      console.error(
        "[telegram:course-bot] Failed to send course photo:",
        error,
      );
    }

    await ctx.reply("_Posso te ajudar em algo?_", {
      parse_mode: "Markdown",
      reply_markup: tecladoOpcoes,
    });
  });

  bot.hears("O que são bots?", async (ctx) => {
    await ctx.reply("Bots são blá, blá, blá...\n_Algo mais?_", {
      parse_mode: "Markdown",
      reply_markup: tecladoOpcoes,
    });
  });

  bot.hears("O que verei no curso?", async (ctx) => {
    await ctx.reply("No *curso* ... tb vamos criar *3 projetos*:", {
      parse_mode: "Markdown",
    });
    await ctx.reply("1. Um bot que vai gerenciar a sua lista de compras");
    await ctx.reply("2. Um bot que vai te permitir cadastrar seus eventos");
    await ctx.reply(
      "3. E você verá como eu fui feito, isso mesmo, você poderá fazer uma cópia de mim",
    );
    await ctx.reply("\n\n_Algo mais?_", {
      parse_mode: "Markdown",
      reply_markup: tecladoOpcoes,
    });
  });

  bot.hears("Posso mesmo automatizar tarefas?", async (ctx) => {
    await ctx.reply("Claro que sim, o bot servirá...\nQuer uma palhinha?", {
      parse_mode: "Markdown",
      reply_markup: botoes,
    });
  });

  bot.hears("Como comprar o curso?", async (ctx) => {
    await ctx.reply("Que bom... [link](https://www.cod3r.com.br/)", {
      parse_mode: "Markdown",
      reply_markup: tecladoOpcoes,
    });
  });

  bot.callbackQuery("n", async (ctx) => {
    await ctx.reply("Ok, não precisa ser grosso :(", {
      reply_markup: tecladoOpcoes,
    });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery("s", async (ctx) => {
    await ctx.reply(
      "Que legal, tente me enviar a sua localização, ou escreva uma mensagem qualquer...",
      {
        reply_markup: localizacao,
      },
    );
    await ctx.answerCallbackQuery();
  });

  bot.hears(/mensagem qualquer/i, async (ctx) => {
    await ctx.reply("Essa piada é velha, tenta outra...", {
      reply_markup: tecladoOpcoes,
    });
  });

  // grammy hears matching regex can also handle other text, but to match legacy
  // let's place text handler at the end so it acts as fallback for all text messages
  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    const msg = text.split("").reverse().join("");
    await ctx.reply(`A sua mensagem, ao contrário é: ${msg}`);
    await ctx.reply(
      "Isso mostra que eu consigo ler o que você escreve e processar sua mensagem",
      {
        reply_markup: tecladoOpcoes,
      },
    );
  });

  bot.on("message:location", async (ctx) => {
    try {
      const url = "http://api.openweathermap.org/data/2.5/weather";
      const { latitude: lat, longitude: lon } = ctx.message.location;
      const res = await axios.get(
        `${url}?lat=${lat}&lon=${lon}&APPID=d1511249e345599ff0559312d64c15ad&units=metric`,
      );
      await ctx.reply(`Hum... Você está em ${res.data.name}`);
      await ctx.reply(`A temperatura por aí está em ${res.data.main.temp}°C`, {
        reply_markup: tecladoOpcoes,
      });
    } catch (e) {
      console.error("[telegram:course-bot] Location/weather error:", e);
      await ctx.reply(
        "Estou tendo problemas para pegar a tua localização, Você está no planeta terra? :P",
        {
          reply_markup: tecladoOpcoes,
        },
      );
    }
  });
}
