require("dotenv").config();

const { Client, Events, GatewayIntentBits, ActivityType } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.GuildMembers]});
client.login(process.env.TOKEN);

const setup = require("./bot/setup.js");
const state = require("./lib/state.js");
state.set("client", client);

client.on(Events.ClientReady, () => {
    console.log("Bot connected to Discord");
    client.user.setActivity("the SE comp scene", { type: ActivityType.Competing });
})

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case "pug":
                await setup.createPug(interaction);
                break;
            case "register":
                await setup.register(interaction);
                break;
            case "unregister":
                await setup.unregister(interaction);
                break;
            default:
                await interaction.reply("Sorry, this command isn't working at the moment.");
        }
    } 
    else if (interaction.isButton()) {
        switch (interaction.customId) {
            case "register":
                await setup.register(interaction);
                break;
            default:
                await interaction.reply({ content: "Sorry, this button isn't working at the moment.", ephemeral: true })
        }
    }
    else if (interaction.isStringSelectMenu) {
        switch (interaction.customId) {
            case "registrationRegionSelect":
                await setup.registerWithRegion(interaction);
                break;
            default:
                await interaction.reply({ content: "Sorry, this select menu isn't working at the moment.", ephemeral: true })
        }
    }
});