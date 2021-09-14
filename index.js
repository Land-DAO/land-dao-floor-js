require('dotenv').config()

const axios = require('axios')
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const { DISCORD_TOKEN, REFRESH_TIMER } = process.env

const getFloorPrice = async () => {
  const floorPrice = (
    await axios.get(
      'https://api.opensea.io/api/v1/collections?asset_owner=0xFb2CE50C4c8024E037e6be52dd658E2Be23d93Db&offset=0&limit=300'
    )
  ).data[0].stats.floor_price;

  return `${floorPrice} ETH`;
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(DISCORD_TOKEN);
