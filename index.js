require('dotenv').config()

const { DISCORD_TOKEN, REFRESH_TIMER } = process.env

const axios = require('axios')

const getFloor = async () =>
  (
    await axios.get(
      'https://api.opensea.io/api/v1/collections?asset_owner=0xFb2CE50C4c8024E037e6be52dd658E2Be23d93Db&offset=0&limit=300'
    )
  ).data[0].stats.floor_price;