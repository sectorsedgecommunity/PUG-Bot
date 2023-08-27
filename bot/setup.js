const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const formats = require("../config/formats.json");

module.exports = {
    createPug: async (interaction) => {
        let name = interaction.options.getString("name");
        let timestamp = interaction.options.getInteger("timestamp");
        let channel = interaction.options.getChannel("announce");
        let format = interaction.options.getString("format");
        let teamsize = interaction.options.getInteger("teamsize");

        let formatObj = formats.find(o => o.id == format);
        let mapNames = []
        for (let i = 0; i < formatObj.maps.length; i++) {
            mapNames.push(formatObj.maps[i].name);
        }

        let embed = new EmbedBuilder()
            .setTitle(name)
            .setDescription("Registration is open for this PUG! Click the button below or run `/register` to register.")
            .setColor("#343deb")
            .addFields(
                {name: "Start Time", value: `<t:${timestamp.toString()}:R>`, inline: true},
                {name: "Format", value: formatObj.name, inline: true},
                {name: "Team Size", value: teamsize == 0 ? "TBD" : teamsize.toString(), inline: true},
                {name: "Map Pool", value: mapNames.join(", ")}
                )
        
        let register = new ButtonBuilder()
			.setCustomId('register')
			.setLabel('Register')
			.setStyle(ButtonStyle.Primary);

        let row = new ActionRowBuilder()
	        .addComponents(register);

        channel.send({embeds: [embed]})
        channel.send({content: "Currently registered: `0`", components: [row]})
            .then(message => {
                console.log(message.id, message.channel.id);
            })

        await interaction.reply("PUG announced! Registration has now opened. This channel will be used to communicate with admins during the PUG.");
    }
}