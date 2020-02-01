const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const axios = require('axios');
require('dotenv').config();

const quoteOfTheDay = async () => {
    let quote, author;
    try {
        const { data } = await axios.get('https://api.quotable.io/random');
        quote = data.content;
        author = data.author;
        return  `“${quote}” by ${author}`;    
    } catch (error) {
        console.log(error);
    }
}

client.on('ready', async  () => {
    // Welcome message for starting the bot
    console.log(`logged in as ${client.user.tag}!`);
     
    if (new Date().getHours() === 10) {
        const quote = await quoteOfTheDay();
        const generalChannelId = client.channels.find(channel => channel.name === 'general').id;
        client.channels.get(generalChannelId).send(quote);
    }
})

client.on('message', async msg => {
    if (msg.content === 'quote') {
        const quote = await quoteOfTheDay();
        msg.reply(quote);
    }
})

client.login(process.env.TOKEN);
