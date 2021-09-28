require('dotenv').config()

const axios = require('axios')
const { Client, Intents } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const { DISCORD_TOKEN, REFRESH_TIMER } = process.env

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

const getFloorPrice = async () => {
  try {
    const floorPrice = (
      await axios.get(
        'https://api.opensea.io/api/v1/collections?asset_owner=0xFb2CE50C4c8024E037e6be52dd658E2Be23d93Db&offset=0&limit=300',
      )
    ).data[0].stats.floor_price

    return `${floorPrice} ETH`
  } catch (err) {
    return err
  }
}

const commands = [
  {
    name: 'floor',
    description: 'Show current land floor price',
  },
]

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN)

;(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(
        '887116641442357289',
        '882367467022868570',
      ),
      { body: commands },
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  try {
    // Fetch floor price and set as bot activity/status
    client.user.setActivity(await getFloorPrice(), { type: 'WATCHING' })
  } catch (err) {
    console.error('Error setting activity', err)
  }

  // Set status at set intervals
  setInterval(async () => {
    try {
      client.user.setActivity(await getFloorPrice(), { type: 'WATCHING' })
    } catch (err) {
      console.error('Error setting activity at interval', err)
    }
  }, REFRESH_TIMER || 3600000)
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'floor') {
    try {
      await interaction.reply(await getFloorPrice())
    } catch (err) {
      console.error('Error responding to floor command', err)
    }
  }
})

client.login(DISCORD_TOKEN)
