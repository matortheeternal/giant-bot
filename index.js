const Discord = require("discord.js");
const commands = require('./commands.js');

const client = new Discord.Client();
client.config = require("./config.json");

// This event will run if the bot starts, and logs in, successfully.
client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

// This event triggers when the bot joins a guild.
client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

// this event triggers when the bot is removed from a guild.
client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

// This event will run on every single message received, from any channel or DM.
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(client.config.prefix)) return;
  
  let args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  let commandKey = args.shift();

  let command = commands[commandKey];
  if (!command) return;

  command(client, message, args).catch(err => {
    message.reply('Error: ' + err.message);
    console.log(err.stack);
  });
});

client.login(client.config.token);