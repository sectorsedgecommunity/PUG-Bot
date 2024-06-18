const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const formats = require("../config/formats.json");
const state = require("../lib/state.js");

module.exports = {
    createPug: async (interaction) => {
        let pugStatus = state.get("pugStatus");
        if (pugStatus !== "none") {
            await interaction.reply("A PUG is already in progress!"); 
        }

        else {
            let name = interaction.options.getString("name");
            let timestamp = interaction.options.getInteger("timestamp");
            let channel = interaction.options.getChannel("announce");
            let format = interaction.options.getString("format");
            let teamSize = interaction.options.getInteger("teamsize");
            let regions = interaction.options.getString("regions");
            
            state.set("pugStatus", "registration");
            state.set("pugName", name);
            state.set("startTimestamp", timestamp);
            state.set("announceChannel", channel);
            state.set("format", format);
            state.set("teamSize", teamSize);
            state.set("adminChannel", interaction.channel);
            
            let formatObj = formats.find(o => o.id == format);
            let mapNames = []
            for (let i = 0; i < formatObj.maps.length; i++) {
                mapNames.push(formatObj.maps[i].name);
            }

            let regionsList = regions.split(",");
            state.set("regions", regionsList);
        
            let embed = new EmbedBuilder()
                .setTitle(name)
                .setDescription("Registration is open for this PUG! Click the button below or run `/register` to register.")
                .setColor("#343deb")
                .addFields(
                    { name: "Start Time", value: `<t:${timestamp.toString()}:R>`, inline: true },
                    { name: "Format", value: formatObj.name, inline: true },
                    { name: "Team Size", value: teamSize == 0 ? "TBD" : teamSize.toString(), inline: true },
                    { name: "Map Pool", value: mapNames.join(", ") }
                    )
            
            if (regionsList.length > 1) {
                embed.addFields({ name: "Available Server Regions", value: regionsList.join(", ") })
            }
                
            let register = new ButtonBuilder()
		    	.setCustomId('register')
		    	.setLabel('Register')
		    	.setStyle(ButtonStyle.Primary);
                
            let row = new ActionRowBuilder()
	            .addComponents(register);
                
            channel.send({embeds: [embed]})
            channel.send({content: "Currently registered: `0`", components: [row]})
                .then(message => {
                    state.set("counterMessage", message);
                })
            
            await interaction.reply("PUG announced! Registration has now opened. This channel will be used to communicate with admins during the PUG.");
        }
    },
    register: async (interaction) => {
        let pugStatus = state.get("pugStatus");
        if (pugStatus == "none") {
            await interaction.reply({ content: "There is no active PUG to register for!", ephemeral: true }); 
        }
        else if (pugStatus == "registration") {
            let playerList = state.get("registered");
            let ids = playerList.map(p => p.id);
            let regions = state.get("regions");

            if (ids.includes(interaction.user.id)) {
                await interaction.reply({ content: "You have already registered for this PUG! To unregister, run `/unregister`.", ephemeral: true })
            }
            else if (regions.length > 1) {
                let select = new StringSelectMenuBuilder()
		        	.setCustomId('registrationRegionSelect')
		        	.setPlaceholder('Select one:')
                
                for (let i = 0; i < regions.length; i++) {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(regions[i])
                            .setValue(regions[i])
                    )
                }
                
		        let row = new ActionRowBuilder()
		        	.addComponents(select);
                
		        await interaction.reply({
		        	content: "What's your preferred server region?",
		        	components: [row],
                    ephemeral: true
                });
            } 
            else {
                playerList.push({id: interaction.user.id})
                await interaction.reply({ content: "You have successfully registered for this PUG! To unregister, run `/unregister`.", ephemeral: true });
                
                let message = state.get("counterMessage");
                message.edit(`Currently registered: \`${playerList.length}\``);
            }
        }
        else {
            await interaction.reply({ content: "Sorry, registration for the PUG has closed.", ephemeral: true }); 
        }
    },
    registerWithRegion: async (interaction) => {
        let chosenRegion = interaction.values[0]
        let pugStatus = state.get("pugStatus");
        if (pugStatus == "none") {
            await interaction.reply({ content: "There is no active PUG to register for!", ephemeral: true }); 
        }
        else if (pugStatus == "registration") {
            let playerList = state.get("registered");
            let ids = playerList.map(p => p.id);
            if (ids.includes(interaction.user.id)) {
                await interaction.reply({ content: "You have already registered for this PUG! To unregister, run `/unregister`.", ephemeral: true });
            }
            else {
                playerList.push({id: interaction.user.id, region: chosenRegion});
                await interaction.reply({ content: "You have successfully registered for this PUG! To unregister, run `/unregister`.", ephemeral: true });
                
                let message = state.get("counterMessage");
                message.edit(`Currently registered: \`${playerList.length}\``);
            }
        }
        else {
            await interaction.reply({ content: "Sorry, registration for the PUG has closed.", ephemeral: true }); 
        }
    },
    unregister: async (interaction) => {
        let pugStatus = state.get("pugStatus");
        if (pugStatus == "none") {
            await interaction.reply({ content: "There is no active PUG to register for!", ephemeral: true }); 
        }
        else if (pugStatus == "registration") {
            let playerList = state.get("registered");
            let ids = playerList.map(p => p.id);
            if (ids.includes(interaction.user.id)) {
                index = ids.findIndex(id => id == interaction.user.id);
                playerList.splice(index, 1);

                await interaction.reply({ content: "You have successfully unregistered from this PUG.", ephemeral: true });

                let message = state.get("counterMessage");
                message.edit(`Currently registered: \`${playerList.length}\``);
            }
            else {
                await interaction.reply({ content: "You haven't registered for the current PUG.", ephemeral: true });
            }
        }
        else {
            await interaction.reply({ content: "You may not unregister now as registration has closed. Contact the admins if you wish to leave the PUG.", ephemeral: true }); 
        }
    }
}