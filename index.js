require("dotenv").config();

const axios = require("axios");
const { Client, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const { DISCORD_TOKEN, REFRESH_TIMER } = process.env;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const getFloorPrice = async() => {
    try {
        const floorPrice = (
            await axios.get(
                "https://api.opensea.io/api/v1/collections?asset_owner=0xFb2CE50C4c8024E037e6be52dd658E2Be23d93Db&offset=0&limit=300"
            )
        ).data[0].stats.floor_price;

        return `${floorPrice} ETH`;
    } catch (err) {
        return err;
    }
};

const getCartelFloorPrice = async() => {
    try {
        const floorPrice = (
            await axios.get(
                "https://api.opensea.io/api/v1/collections?asset_owner=0x2e70ff6761c1d183788cb13a6b49304f79b436bc&offset=0&limit=300"
            )
        ).data[0].stats.floor_price;

        return `${floorPrice} ETH`;
    } catch (err) {
        return err;
    }
};

const commands = [{
        name: "floor",
        description: "Show current land floor price",
    },
    {
        name: "cartelFloor",
        description: "Show current cartel floor price",
    },
];

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

(async() => {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(
                "887116641442357289",
                "882367467022868570"
            ), { body: commands }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

client.on("ready", async() => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Fetch floor price and set as bot activity/status
    client.user.setActivity(await getFloorPrice(), { type: "WATCHING" });
    client.user.setActivity(await getCartelFloorPrice(), { type: "WATCHING" });

    // Set status at set intervals
    setInterval(async() => {
        client.user.setActivity(await getFloorPrice(), { type: "WATCHING" });
        client.user.setActivity(await getCartelFloorPrice(), { type: "WATCHING" });
    }, REFRESH_TIMER || 3600000);
});

client.on("interactionCreate", async(interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "floor") {
        await interaction.reply(await getFloorPrice());
    }

    if (interaction.commandName === "cartelFloor") {
        await interaction.reply(await getCartelFloorPrice());
    }
});

client.login(DISCORD_TOKEN);
