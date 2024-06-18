require("dotenv").config();

const { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

let commands = [];

// admin commands
const formats = require("./config/formats.json");
let formatList = []
for (let i = 0; i < formats.length; i++) {
    formatList.push({name: formats[i].name, value: formats[i].id});
}


let pug = new SlashCommandBuilder()
    .setName('pug')
    .setDescription('Schedule a PUG, send an announcement and open registration.')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('The name of the PUG')
            .setRequired(true))
    .addIntegerOption(option =>
        option.setName('timestamp')
            .setDescription('The UNIX timestamp when the PUG will start.')
            .setRequired(true))
    .addChannelOption(option =>
        option.setName('announce')
            .setDescription('The channel to announce the PUG in')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('format')
            .setDescription('The PUG format')
            .setRequired(true)
            .addChoices(...formatList))
    .addIntegerOption(option =>
        option.setName('teamsize')
            .setDescription('The team size. Set to 0 to decide when the PUG starts.')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('regions')
            .setDescription('A comma separated list (no spaces) of the available server regions.')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
commands.push(pug.toJSON());

let register = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register for the current PUG.')
commands.push(register.toJSON());

let unregister = new SlashCommandBuilder()
    .setName('unregister')
    .setDescription('Unregister from the current PUG.')
commands.push(unregister.toJSON());


const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENTID, process.env.SERVERID),
			{ body: commands },
		);

		console.log(`Successfully refreshed ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();