import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
import fetch from "node-fetch";

import dotenv from "dotenv";
dotenv.config();

const sadWords = ["sad", "depressed", "unhappy", "angry"];
const starterEncouragements = [
  "Cheer up!",
  "Hang in there",
  "You are a great person!",
];

function updateEncouragements(encouragement) {
  starterEncouragements.push(encouragement);
}
function deleteEncouragements(index) {
  starterEncouragements.splice(index, 1);
}
function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data[0]["q"] + " -" + data[0]["a"];
    });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "/gyan") {
    getQuote().then((quote) => msg.channel.send(quote));
  }
  if (sadWords.some((word) => msg.content.includes(word))) {
    const encouragement =
      starterEncouragements[
        Math.floor(Math.random() * starterEncouragements.length)
      ];
    msg.reply(encouragement);
  }

  if (msg.content.startsWith("/new")) {
    const encouragingMessage = msg.content.split("/new ")[1];
    updateEncouragements(encouragingMessage);
    msg.channel.send("New encouraging message added.");
  }

  if (msg.content.startsWith("/del")) {
    const index = parseInt(msg.content.split("/del ")[1]);
    deleteEncouragements(index);
    msg.channel.send("New encouraging message deleted.");
  }
});

client.login(process.env.TOKEN);
