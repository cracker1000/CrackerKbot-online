const Command = require('./index.js');
const { letterTrans } = require('custom-translate');
const Discord = require('discord.js');
const config = require('../../config.js');
const RandomFact = require('discordjs-facts');
const request = require('request');
const got = require('got');
const translate = require('@vitalets/google-translate-api');
let rigged_opinion = null;
let langto = null;
module.exports = [
   //Admin only.
    new Command(
        (msg, bot, args) => {
            let id = -1;
            if (args.length && !Number.isNaN(args[0]))
                id = +args[0];
            request(`https://hellomouse.net/fluff?id=${id}`, {}, (err, res, body) => {
                if (err) {
                    msg.send('Error getting fluff :(');
                    return console.log('Failed to get fluff', err);
                }
                let url = body.match(/src="((\s|\S)*?)"/gm)[0].replace('src="', '').replace('"', '');
                let title = body.match(/<h1>(.*?)<\/h1>/gm)[0].replace('<h1>', '').replace('</h1>', '');
                url = 'https://hellomouse.net' + url;
              
                const test = new Discord.MessageEmbed()
                  .setTitle(title)
                  .setURL(url)
                  .setImage(url);
                msg.channel.send(test);
            });
        }, 'fluff', 'Random fluffy girl', 'fun', 100
    ),

  new Command(
        (msg, bot,args) => {
          let findrole = args.slice(0).join(' ');
          const Role = msg.guild.roles.cache.find(role => role.name == findrole);
        const Members = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);

  const rolefinder = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle("The users having " +findrole+ " role are:")
                .setDescription(`${Members}`);
        msg.channel.send(rolefinder);
        }
        , 'find', 'finds all the members having a certain role', 'fun',100
    ),
  new Command(
        (msg, bot, args) => {
           let title = args.slice(0).join(' ');
            const poll = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle(':bell:  Poll by' + ` ${msg.author.username}` + " :bell:")
                .setTimestamp()
                .setDescription("Title: " + title+"\n\nVote by using the given reactions: \nThumbs up : Yes \nThumbs down : No\n Thinking Face: Can't decide");
           msg.channel.send({embed: poll}).then(embedMessage => {
    embedMessage.react("👍")
    embedMessage.react("🤔")
    embedMessage.react("👎");
});
        }, 'poll', 'Make a poll with given title', 'fun'
    ),

  new Command(
        (message, bot, args) => {
         let rolemap = message.guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(r => r)
            .join(",");
            if (rolemap.length > 1024) rolemap = "To many roles to display";
            if (!rolemap) rolemap = "No roles";
    const embed = new Discord.MessageEmbed()
    .addField("Role List" , rolemap)
    message.channel.send(embed);
        }, 'role', 'Find all the roles in a guild', 'fun'
    ),

    new Command(
        (msg, bot, args) => {
            args = args.map(x => x.toLowerCase());
            let hash = y => y.split('').map((x, i) => x.charCodeAt(0) * i + i).reduce((a, b) => a + b);
            hash = hash(args[0]) + hash(args[1]);
          
            const fun = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Love Result')
                .setDescription(`The love between ${args[0]} and ${args[1]} is ${hash % 101}%`)
                .setURL('https://discord.js.org/');
            msg.channel.send(fun);
        }, 'love', 'love <user1> <user2>', 'fun'
    ),
    new Command(
        (msg, bot) => {
            msg.channel.send(':cow: : **MOOOOO**');
        }, 'moo', 'Jacob1 is a potato that moos', 'fun'
    ),
    
   new Command(
        (msg, bot,args) => {
           let text = args.slice(0).join(' ');
           if (args.length === 0) {
            msg.reply("Please write the text you want to translate!");
        } else {
        translate(text, {to: 'en'})
          .then(msg.channel.send("Translated text:"))
                .then(res => msg.channel.send(res.text));
        }
        }, 'tr', 'Translates the text to English from any language, usage Cr tr <text here>', 'fun'
    ),
   new Command(
        (msg, bot,args) => {
           let text = args.slice(0).join(' ');
        translate(text, {to: langto})
          .then(msg.channel.send("Translated text in " + langto +  ":"   ))
                .then(res => msg.channel.send(res.text));
        }
        , 'trto', 'Translates the text to any language, usage Cr trto <text here>', 'fun'
    ),

 new Command(
        (msg, bot,args) => {
          var dictionary = {
    "a": "ɐ",
    "b": "q",
    "c": "ɔ",
    "d": "p",
    "e": "ǝ",
    "f": "ɟ",
    "g": "ƃ",
    "h": "ɥ",
    "i": "ᴉ",
    "j": "ɾ",
    "k": "ʞ",
    "m": "ɯ",
    "n": "u",
    "p": "d",
    "q": "b",
    "r": "ɹ",
    "t": "ʇ",
    "u": "n",
    "v": "ʌ",
    "w": "ʍ",
    "y": "ʎ",
    "A": "∀",
    "C": "Ɔ",
    "E": "Ǝ",
    "F": "Ⅎ",
    "G": "פ",
    "J": "ſ",
    "L": "˥",
    "M": "W",
    "P": "Ԁ",
    "T": "┴",
    "U": "∩",
    "V": "Λ",
    "W": "M",
    "Y": "⅄",
    "1": "Ɩ",
    "2": "ᄅ",
    "3": "Ɛ",
    "4": "ㄣ",
    "5": "ϛ",
    "6": "9",
    "7": "ㄥ",
    "9": "6",
    ",": "'",
    ".": "˙",
    "'": ",",
    "\"": ",,",
    "_": "‾",
    "&": "⅋",
    "!": "¡",
    "?": "¿",
    "`": ","
}
const text = args.join(' ');
        const converted = letterTrans(text, dictionary);
        msg.channel.send(converted);
        }
        , 'flip', 'Sends inverted text.', 'fun'
    ),
    new Command(
        (msg, bot, args) => {
          langto = args.join(' ');
          const setlang = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Translation language changed to "' + langto + '"');
            msg.channel.send(setlang)
        }, 'setlang', 'sets the translator language usage: Cr setlang <language code here> , refer 2 letter language codes.', 'fun'
    ),
  
    new Command(
        (msg, bot) => {
          const fact = new RandomFact({
    title: 'Fun fact', // Title of the embed while displaying the game. Default: facts
    color: '#FDD017', // Color of the embed. Default: RANDOM
    lang: 'en', // Custom the language for the embeds. Default: en
    footer: ' ', // Custom text for the embed title of the game over embed. Default: 'Game Over'
    subject: "random", // chose a category for the facts. Default: random
    embed: true, // remove rhis for your facts in text version without embed
  });
   if (msg.member.roles.cache.some(role => role.name === 'Member')) {
                 fact.newFact(msg);
               }
                      else 
                    {
 msg.channel.send("Access denied, Member role required.");
                  }
        }, 'fact', 'Sends a cool fun fact', 'fun'
    ),


    new Command(
        (msg, bot) => {
             got('https://www.reddit.com/r/jokes/random/.json').then(response => {
        let content = JSON.parse(response.body);
        var title = content[0].data.children[0].data.title;
        var joke = content[0].data.children[0].data.selftext;
                const joke1 = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Joke:')
               .setDescription('**' + title + '**' + "\n" + joke);
               
            msg.channel.send(joke1)
        .then(sent => console.log(`Sent a reply to ${sent.author.username}`))
    }).catch(console.error);
        }, 'joke', 'Sends a random joke', 'fun'
    ),
  
    new Command(
        (msg, bot, args) => {
           let replies = [
      'Maybe.',
      'Ask Cracker1000.',
      'Ask Bowserinator.',
      'Drinking coffee, try later?',
	    'Certainly not.',
      'I am not sure about this.',
	    'I hope so.',
	    'Not in your wildest dreams.',
    	'There is a good chance.',
	    'Quite likely.',
    	'I think so.',
    	'I hope not.',
    	'I hope so.',
    	'Never!',
    	'Pfft.',
	    'Sorry, bucko.',
    	'Hell, yes.',
    	'Hell to the no.',
    	'The future is bleak.',
	    'The future is uncertain.',
	    'I would rather not say.',
    	'Who cares?',
    	'Possibly.',
    	'Never, ever, ever.',
    	'There is a small chance.',
    	'Yes!',
    	'lol no.',
    	'There is a high probability.',
    	'What difference does it makes?',
    	'Not my problem.'
             ];
          let result = Math.floor((Math.random() * replies.length));
          if (rigged_opinion) {
              result = rigged_opinion;
              rigged_opinion = null;
          }
          else {
              result = replies[result];
          }

          const ques = new Discord.MessageEmbed()
            .setColor('#FDD017')
            .setDescription( ":thinking: Hmm, " + result);
          msg.channel.send(ques);
        }, 'opinion', 'Gives random responses', 'fun'
    ),
    new Command(
        (msg, bot, args) => {
          rigged_opinion = args.join(' ');
          // Don't send anything its secret
        }, 'setop', 'sets the opinion manually', 'fun', 100, null, false, false
    ),

         new Command(
        (msg, bot) => {
            const base = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setTitle('Yes, how can i help?');
            msg.channel.send(base);
        }, 'empty-yes?', 'Reply yes to empty messages', 'hidden', 0, '',
        false, true, [], true, msg => msg.content.trim() === config.prefix.trim()
    )
];
