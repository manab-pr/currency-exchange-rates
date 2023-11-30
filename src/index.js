const { default: axios } = require("axios");
const { Bot } = require("grammy");
require("dotenv").config();

const TOKEN = process.env.BOT_API_KEY;
const BASE_URL = process.env.BASE_URL;
const ER_API_KEY = process.env.EXCHANGE_RATES_API;
const HOST_API = process.env.HOST_URL;

const bot = new Bot(TOKEN);

bot.on("message", async (msg) => {
  const text = msg.message.text;
  const name = msg.chat.first_name;
  const chatID = msg.message.chat.id;

  const numbers = text.match(/\d+/g);

  if (numbers) {
    const options = {
      method: "GET",
      url: BASE_URL,
      params: {
        from: "INR",
        to: "USD",
        amount: String(numbers),
      },
      headers: {
        "X-RapidAPI-Key": ER_API_KEY,
        "X-RapidAPI-Host": HOST_API,
      },
    };

    try {
      const response = await axios.request(options);
      const result = response.data.result;
      const time = response.data.date;
      await bot.api.sendMessage(
        chatID,
        `<b><i>${numbers} INR = ${result} USD</i></b>\n<b><i>date: ${time}</i></b>`,
        {
          parse_mode: "HTML",
        }
      );
    } catch (error) {
      console.log(error);
      bot.api.sendMessage(chatID, "unable to fetch the data");
    }
  }
  if (!numbers) {
    try {
      await bot.api.sendMessage(
        chatID,
        `<b><i>welcome ${name}\nthis is a currency exchange bot,feel free to write any number mixed with text and we will show you equivalent dollar</i></b>`,
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.log(error);
    }
  }
  console.log(name);
});

bot.start();
