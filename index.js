require("dotenv").config();

const { Client, Events, GatewayIntentBits } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.GuildMembers]});
client.login(process.env.TOKEN);

const setup = require("./bot/setup.js");

client.on(Events.ClientReady, () => {
    console.log("Bot connected to Discord");
})

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case "pug":
                await setup.createPug(interaction);
                break;
            default:
                await interaction.reply("Sorry, this command isn't working at the moment.");
        }
    }
});