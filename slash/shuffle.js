const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Mistura a ordem da fila"), 

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há músicas na fila")
        
        queue.shuffle()
        await interaction.editReply(`A fila contendo ${queue.tracks.length} músicas foi reordenada!`)
        
    }

}