const Command = require('./index.js');
const Discord = require('discord.js');
const request = require('request');
const he = require('he');

module.exports = new Command(
    (msg, bot) => {
        let id = msg.content.match(/^(~(\d+)|(ID:(\d+))|(id:(\d+)))$/g)[0].replace(/[^0-9]/g, '');
 
        request('https://powdertoy.co.uk/Browse/View.html?ID=' + id, {}, (err, res, body) => {
            if (err || body.includes('Status 404')) {
                const previewerr = new Discord.MessageEmbed()
                  .setColor('#FDD017')
                  .setTitle('Unable to show preview.')
                  .setDescription(`Save ID ${id} is invalid!`)
                msg.channel.send(previewerr);
                return;
            }

            let description = he.decode(body.match(/<div class="SaveDescription">([^>]+)</)[1], {isAttributeValue: false });
            let title = he.decode(body.match(/<h1>(.*?)<\/h1>/gm)[1].split('<h1>')[1].split('<small>')[0].trim(), {isAttributeValue: false });
            let upvotes = body.match(/class="ScoreLike badge badge-success">(\d+)/)[1];
            let downvotes = body.match(/class="ScoreDislike badge badge-important">(\d+)/)[1];
            let totalvotes = upvotes-downvotes;
            let author = he.decode(body.match(/href="\/User.html\?Name=([^"]+)"/)[1], {isAttributeValue: false });
            let time = body.match(/title="Date updated">(.*?)<\/div>/gm)[0].split('</i> ')[1].replace('</div>', '');

            const save = new Discord.MessageEmbed()
                .setColor('#FDD017')
                .setImage
                ('http://static.powdertoy.co.uk/' + id +'.png', true)
                .setDescription('**Save name**: ' + title +'\n' + "**Author**: " + author + '\n**Save id**: ' + id + "\n" +"**Published**: " + time + '\n**Votes**: ' +`${upvotes}-${downvotes} = ${totalvotes}`)
                .setFooter("Requested by "+ `${msg.author.username}`)
              .addField('**Description:**', description)
              .addField("**Options:**", `[Play]( https://crackerkbot2.cracker1000.repl.co/redir.html?=${id})`+
                "\n"+ "[Open in browser](https://powdertoy.co.uk/Browse/View.html?ID="+id+")"
                + "\n"+"[Download](https://powdertoy.co.uk/GetSave.util?ID="+id+")" + "\n" + "[Author profile](https://powdertoy.co.uk/User.html?Name="+author+")" + "\n\n"+ "[Cr1K Mod](https://powdertoy.co.uk/Discussions/Thread/View.html?Thread=23279)")
 if (msg.member.roles.cache.some(role => ((role.name === 'Member')||(role.name === 'Registered')))) 
 {
                 msg.channel.send(save).then(embedMessage => {
    embedMessage.react('⭐')
                 })
 }
  else 
   {
 msg.channel.send("Access denied. Reason: Missing Member Role");
   }
        });
    }, 'save-preview', 'Preview saves with ~id', 'hidden', 0, '',
    false, true, [], true, msg => msg.content.match(/^(~(\d+)|(ID:(\d+))|(id:(\d+)))$/g)
);