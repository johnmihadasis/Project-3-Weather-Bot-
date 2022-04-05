const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix } = require('./config.json');
const axios = require('axios')
//const server = require('./server')

client.once('ready', () => {
  client.user.setActivity('with weather. | W!help')
  //server()
    console.log(client.user.username + '#' + client.user.discriminator + ' is online.');
});



const exampleEmbed = (
	temp,
	maxTemp,
	minTemp,
	pressure,
	humidity,
	wind,
	cloudness,
	icon,
	author,
	profile,
	cityName,
	country,
    modcurrenttemp,
    modmaxtemp,
    modmintemp
) =>
	new Discord.RichEmbed()
		.setColor('#0099ff')
		.setAuthor(`Hello, ${author}`, profile)
		.setTitle(`There is ${temp}\u00B0C in ${cityName}, ${country}`)
		.addField(`Maximum Temperature:`, `${maxTemp}\u00B0C`)
		.addField(`Minimum Temperature:`, `${minTemp}\u00B0C`)
        .addField(`Currect Temparature in Kelvin:`, `${modcurrenttemp}°K`)
        .addField(`Maximum Temparature in Kelvin:`, `${modmaxtemp}°K`)
        .addField(`Minimum Temparature in Kelvin:`, `${modmintemp}°K`)
		.addField(`Humidity:`, `${humidity} %`, true)
		.addField(`Wind Speed:`, `${wind} m/s`, true)
		.addField(`Pressure:`, `${pressure} hpa`, true)
		.addField(`Cloudiness:`, `${cloudness}`, true)
		.setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
    .setFooter('Made by Michh#7658')



client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();
    if (message.content.startsWith(prefix + 'ping')) {
        message.channel.send(`Hoold on!`).then(message => {
        message.edit(`**Pong!**\nMessage edit time is ` + (message.createdTimestamp - message.createdTimestamp) + `ms, Discord API heartbeat is ` + Math.round(client.ping) + `ms.`).then(message.react('🏓'))});
    } else if (message.content.startsWith (prefix + 'help')) {
        const helpEmbed = () =>
        new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('**Command list**')
        .addField(`'${prefix}w or ${prefix}weather (City Name)'`, 'Tells you weather information about the specified city.')
        .addField(`'${prefix}ping'`, 'Ping-Pong')
      .setFooter('Made by Michh#7658')
        message.channel.send(helpEmbed());
    }
    else if (command === 'w' || 'weather') {
        axios
            .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=${process.env['apikey']}`
            )
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp)
                let maxTemp = apiData.data.main.temp_max;
                let minTemp = apiData.data.main.temp_min;
                let humidity = apiData.data.main.humidity;
                let wind = apiData.data.wind.speed;
                let author = message.author.username
                let profile = message.author.displayAvatarURL
                let icon = apiData.data.weather[0].icon
                let cityName = args
                let country = apiData.data.sys.country
                let pressure = apiData.data.main.pressure;
                let cloudness = apiData.data.weather[0].description;
                let modcurrenttemppost = (currentTemp + 273.15)
                let modmaxtemppost = (maxTemp + 273.15)
                let modmintemppost = (minTemp + 273.15)
                let modcurrenttemp = modcurrenttemppost.toFixed(2)
                let modmaxtemp = modmaxtemppost.toFixed(2)
                let modmintemp = modmintemppost.toFixed(2)
                message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country, modcurrenttemp, modmaxtemp, modmintemp));
            }).catch(err => {
                //console.log(err)
                message.reply(`Enter a vailid city name.`)
            })
    }
}
)

client.login(process.env['token']);
