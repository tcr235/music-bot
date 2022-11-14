const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Pula a música atual"), 

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há músicas na fila")
        
        const currentSong = queue.current

        queue.skip()
        await interaction.editReply({
            embeds: [
                new EmbedBuilder().setDescription(`${currentSong.title} foi pulada`).setThumbnail(currentSong.thumbnail)
            ]
        })
        
    }

}