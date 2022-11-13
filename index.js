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

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Adicionando comandos slash")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID, {body: commands}))
    .then(() => {
        console.log("Carregado com sucesso")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log("Erro")
            process.exit(1)
        }
    })
}