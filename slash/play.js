const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discordjs')
const { QueryType } = require('discord-player')


module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Carrega músicas através do youtube")
        .addSubcommand((subcommand) => 
            subcommand.setName("song")
            .setDescription("Carrega apenas uma única música a partir de um link")
            .addStringOption((option) => option.setName("url").setDescription("url da música").setRequired(true))
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("playlist")
                .setDescription("Carrega uma playlist completa a partir de um link")
                .addStringOption((option) => option.setName("url").setDescription("url da playlist").setRequired(true))
        )
        
        .addSubcommand((subcommand) => 
            subcommand.setName("search").setDescription("Procura uma música a partir de palavras-chave")
            .addStringOption((option) => option.setName("searchterms").setDescription("As palavras-chave procuradas").setRequired(true))
        ),
        
        run: async ({ client, interaction }) => {
            if (!interaction.member.voice.channel)
                return interaction.editReply("Você precisa estar em um canal de voz para executar esse comando")
            
            const queue = await client.player.createQueue(interaction.guild)
            if (!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new MessageEmbed()

            if (interaction.options.getSubcommand() === "song"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("Sem resultados")

                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** foi adicionada à fila`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duração: ${song.duration}`})

            } else if (interaction.options.getSubcommand() === "playlist"){
                let url = interaction.options.getString("url")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("Sem resultados")

                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`**${result.tracks.length} músicas da playlist [${playlist.title}](${playlist.url})** foram adicionadas à fila`)
                    .setThumbnail(playlist.thumbnail)

            } else if (interaction.options.getSubcommand() === "search"){
                let url = interaction.options.getString("searchterms")
                const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                if (result.tracks.length === 0)
                    return interaction.editReply("Sem resultados")

                const song = result.tracks[0]
                await queue.addTrack(song)
                embed
                    .setDescription(`**[${song.title}](${song.url})** foi adicionada à fila`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duração: ${song.duration}`})

            }
            if (!queue.playing) await queue.play()
            await interaction.editReply({
                embeds: [embed]
            })
            
        }
        
}