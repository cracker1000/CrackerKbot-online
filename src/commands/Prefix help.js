const Command = require('./index.js');
const Discord = require('discord.js');

const is_msg = msg => msg.content.trim().split(' ').length === 2 && msg.content.startsWith('cr ')

module.exports =[
  new Command(
    (msg, bot) => {
                const Prefixerror = new Discord.MessageEmbed()
                  .setColor('#FDD017')
                  .setTitle(':warning: Please use correct prefix that is "Cr" :warning:')
                  msg.channel.send(Prefixerror);
        ;
    }, 'Prefix help', 'Help users if they enter wrong prefix', 'hidden', 0, '',
    false, true, [], true, is_msg
)
];