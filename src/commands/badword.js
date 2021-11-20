const Command = require('./index.js');
const Discord = require('discord.js');
/**
 * Does a message contain bad word
 * @param {Message} msg Message
 * @return {boolean}
 */
function containsBadWord(msg) {
    let bad = 'fuck bitch nigga nigger xxx shit ass asshole suck trigger'.split(' ');
    if (bad.includes(msg.content.trim().toLowerCase()))
        return true;
    return false;
}

module.exports = new Command(
    (msg, bot) => {
      msg.delete().then(function() {
        const Filter = new Discord.MessageEmbed()
            .setColor('#FDD017')
            .setTitle(":warning:")
            .setDescription('You have been warned.\nReason: Bad word usage!')
        msg.reply(Filter).then(function(warnMessage) {
          setTimeout(function() {
            warnMessage.delete();
          }, 10000);
        });
      }).catch(function() {});
    }, 'bad-word-filter', 'Filter for bad words', 'hidden', 0, '',
    false, true, [], true, msg => containsBadWord(msg)
);