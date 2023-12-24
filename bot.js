const http = require("http");
const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();

const port = process.env.PORT || 4000;

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-type": "text/plain",
    });
    res.write(`server started running at ${Date.now()}`);
    res.end();
  })
  .listen(port);

const quoteOfTheDay = async () => {
  let quote, author;
  try {
    const { data } = await axios.get("https://api.quotable.io/random");
    quote = data.content;
    author = data.author;
    return `“${quote}” by ${author}`;
  } catch (error) {
    console.log(error);
  }
};

client.on("ready", () => {
  // Welcome message for starting the bot
  console.log(`logged in as ${client.user.tag}!`);

  setInterval(async () => {
    const quote = await quoteOfTheDay();
    const generalChannelId = client.channels.find(
      (channel) => channel.name === "general"
    ).id;
    client.channels.get(generalChannelId).send(quote);
  }, 86400000);
});

client.on("message", async (msg) => {
  if (msg.content === "/quote") {
    const quote = await quoteOfTheDay();
    msg.reply(quote);
  }
});

client.login(process.env.TOKEN);
