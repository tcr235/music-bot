const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discordjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Retira o bot e limpa a fila"), 

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há músicas na fila")
        
        queue.destroy()
        await interaction.editReply("Até mais!")
        
    }

}