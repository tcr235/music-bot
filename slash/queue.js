const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Mostra a fila de músicas atualizada")
    .addNumberOption((option) => option.setName("page").setDescription("Página da fila").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing){
            return await interaction.editReply("Não há músicas na fila")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages)
            return await interaction.editReply(`Página inválida. Há apenas ${totalPages} páginas de músicas`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Reproduzindo**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`: "None") + 
                    `\n\n**Fila**\n${queueString}`
                    )

                    .setFooter({
                        text: `Página ${page + 1} de ${totalPages}`
                    })

                    .setThumbnail(currentSong.thumbnail)
                    
            ]
        })
    }
}