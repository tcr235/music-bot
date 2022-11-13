const Discord = require('discord.js')
const dotenv = require('dotenv')
const { REST } = require('@discordjs/rest')
const { Routes } = require('@discord-api-types/v9')
const fs = require('fs')
const { Player } = require('discord-player')


dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "1040739486134448229"
const GUILD_ID = "396457801884368896"

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
});

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});