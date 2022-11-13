const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Pula para uma música específica")
        .addNumberOption((option) => 
            option.setName("tracknumber").setDescription("Número da música que vai tocar").setMinValue(1).setRequired(true)
        ), 

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há músicas na fila")
        
        const trackNum = interaction.options.getNumber("tracknumber")
        if (trackNum > queue.tracks.lenght)
            return await interaction.editReply("Número inválido")
        queue.skipTo(trackNum - 1)
        await interaction.editReply(`Passado para a música número ${trackNum}`)
        
    }

}