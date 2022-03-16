const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cmc')
    .setDescription('CoinMarketCap listing')
    .addStringOption((option) =>
      option
        .setName('name')
        .setRequired(true)
        .setDescription('Crypto Name')
        .addChoice('Bitcoin', 'BTC')
        .addChoice('Ethereum', 'ETH')
    ),
  async execute(interaction) {
    const symbol = interaction.options.get('name').value;
    let response = null;
    try {
      response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD',
        {
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_KEY,
          },
        }
      );
    } catch (ex) {
      // error
      response = null;
      console.log(ex);
    }
    if (response) {
      // success
      const json = response.data;
      const index = json.data.findIndex((d) => d.symbol == symbol);
      if (index < 0) {
        await interaction.reply(`Symbol ${symbol} is not found.`);
      } else {
        const data = json.data[index];
        await interaction.reply(`${symbol} to USD is **${data.quote.USD.price}** and change **${data.quote.USD.percent_change_1h}** in an hour.`);
      }
      //console.log(json);
    } else {
      await interaction.reply('Something went wrong!');
    }
  },
};
