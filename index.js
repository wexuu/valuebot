const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();
const mineflayer = require("mineflayer");

var currentdate = new Date(); 
var datetime = " " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes();

let ftopsearch = false;
let ftopvalue = [];
let ftopfac = [];
let pos = 1;

const error = new Discord.MessageEmbed()
    .setDescription(`:x: Error :x:`)
    .setColor(`#F23612`)

const config = require("./config.json");
const username = config.username;
const password = config.password;
const server = config.server;
const version = config.version;
const chan = config.ftopChannel;
const cmd = config.joincommand
const fcmd = config.ftopcommand
const enabled = config.autoftop
const hub = "/hub"

const bot = mineflayer.createBot({
    version: version,
    host: server,
    username: username,
    password: password
});
bot.on("login", async () => {
    console.log(`- [ Bot (${bot.username}) is now online on ${server} ]`)
    console.log("────────────────────────────────────────────────────────────")
    bot.chat(cmd)
})
bot.on("message", async message => {
    if (ftopsearch == true) {
        let factionTop = `${message}`.match(/\$([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(.[0-9][0-9])?/g)
        let factionName = `${message}`.split(" ")[3];
        if (factionTop == null) return
        if (factionName == null) return
        ftopvalue.push(factionTop[0])
        ftopfac.push(`**${pos}.  ** ${factionName}`)
        pos = pos + 1
    }
})

    client.once('ready', () => {
        console.log('Ready!');
        client.user.setActivity('My code', { type: 'WATCHING' });
        let db  = new sqlite.Database(`./blop.db`, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE)
    }) 

    client.on('message', message => {

        let db  = new sqlite.Database(`./blop.db`, sqlite.OPEN_READWRITE);
        db.run(`CREATE TABLE IF NOT EXISTS donations(userid INTEGER NOT NULL, donos NUMBER NOT NULL)`)    
        

            if(message.content.startsWith(`${prefix}add` )) {
                if(message.member.roles.cache.find(r => r.name === "Donations")) {
                    userid = message.mentions.members.first().toString()
                    let query = `SELECT * FROM donations WHERE userid = ?`
                        db.get(query, [userid], (err, row) => {
                            if(err) throw err;
                let splitMessage = message.content.split(" ");
                valuetoadd = splitMessage[2];
                    if(!userid) {
                        message.channel.send('Please mention somebody!');
                    } else {
                        if(row === undefined) {
                            let insert = db.prepare(`INSERT INTO donations VALUES (?, ?)`)
                            insert.run(userid, valuetoadd);
                            const topembed = new Discord.MessageEmbed()
                            .setColor(`#FF6600`)
                            .setTitle(`🧾 Donation Receipt!`)
                            .setDescription(`Donation by: ${userid}`)
                            .addFields(
                                {name: 'Donation Amount:', value: `$` + valuetoadd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
                                {name: 'Total Donations:', value: `$` + valuetoadd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
                                {name: 'Confirmed by:', value: `<@${message.author.id}>`}
                            )
                            .setTimestamp()
                            .setFooter('nigels is gay')
                                message.channel.send(topembed)
                          } else {
                              let tax = row.donos + Number(valuetoadd)
                              db.run(`UPDATE donations SET donos = ? WHERE userid = ?`, [tax, userid])
                              const topembed = new Discord.MessageEmbed()
                            .setColor(`#FF6600`)
                            .setTitle(`🧾 Donation Receipt!`)
                            .setDescription(`Donation by: ${userid}`)
                            .addFields(
                                {name: 'Donation Amount:', value: `$` + valuetoadd.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
                                {name: 'Total Donations:', value: `$` + tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
                                {name: 'Confirmed by:', value: `<@${message.author.id}>`}
                            )
                            .setTimestamp()
                            .setFooter('nigels is gay')
                                message.channel.send(topembed)
                          }
                    
                    }


                
        })
                    } else {
                        message.channel.send('no permsLLL');
                    }
            }
        
                    if(message.content.startsWith(`${prefix}remove` )) {

                        if(message.member.roles.cache.find(r => r.name === "Donations")) {
                            userid = message.mentions.members.first().toString()
                            let query = `SELECT * FROM donations WHERE userid = ?`
                                db.get(query, [userid], (err, row) => {
                                    if(err) throw err;
                        let splitMessage = message.content.split(" ");
                        valuetoremove = splitMessage[2];
                            if(!userid) {
                                message.channel.send('Please mention somebody!');
                            } else {
                                      let tax2 = row.donos - Number(valuetoremove)
                                      db.run(`UPDATE donations SET donos = ? WHERE userid = ?`, [tax2, userid])
                                      const topembed = new Discord.MessageEmbed()
                                    .setColor(`#FF6600`)
                                    .setTitle(`🧾 Donation Receipt!`)
                                    .setDescription(`Donation removed from: ${userid}`)
                                    .addFields(
                                        {name: 'Amount Removed:', value: `$` + valuetoremove.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
                                        {name: 'Total Donations:', value: `$` + tax2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")},
                                        {name: 'Confirmed by:', value: `<@${message.author.id}>`}
                                    )
                                    .setTimestamp()
                                    .setFooter('nigels is gay')
                                        message.channel.send(topembed)
                                    
                                }
                                })
                                
                                
                                } else {
                                    message.channel.send('stop trying')
                                }
                    
                            }
                            if(message.content.startsWith(`${prefix}top`)) {
                                message.delete()
                                if(message.member.roles.cache.find(r => r.name === "Walls")) {
                                    let splitMessage = message.content.split(" ");
                                    btoppage = splitMessage[1];
                                    if(btoppage === undefined) {
                                        var description = ""
                                    let all = `SELECT userid , donos FROM donations ORDER BY donos DESC LIMIT 20;`
                                    db.all(all, (err, row) => {
                                        if(err) throw err;
                                        const topembed = new Discord.MessageEmbed()
                                        .setColor('#FF760B')
                                        .setTitle(message.guild.name + "'s TOP Donators!")
                                        .setTimestamp()  
                                        .setFooter('Page 1 of 2')
                                        let i = 0;
                                            row.forEach(function (row) {
                                                i++;
                                                if(row.donos === 0) {
                                                    return;
                                                }
                                            description +=` ${i}. ` + row.userid + `** - $${row.donos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**\n`
                                        })
                                        
                                        topembed.setDescription(description)
                                        message.channel.send(topembed)
                                    })
                                    } else if (btoppage === `2`) {
                                        var description = ""
                                    let all = `SELECT userid , donos FROM donations ORDER BY donos DESC LIMIT 20 OFFSET 20;`
                                    db.all(all, (err, row) => {
                                        if(err) throw err;
                                        const topembed = new Discord.MessageEmbed()
                                        .setColor('#FF760B')
                                        .setTitle(message.guild.name + "'s TOP Donators!")
                                        .setTimestamp()
                                        .setFooter('Page 2 of 2')  
                                        let i = 0;
                                            row.forEach(function (row) {
                                                i++;
                                                if(row.donos === 0) {
                                                    return;
                                                }
                                            description +=` ${i}. ` + row.userid + `** - $${row.donos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}**\n`
                                        })
                                        
                                        topembed.setDescription(description)
                                        message.channel.send(topembed)
                                    
                                    
                                    })
                                }
                                } else {
                                    message.channel.send('not working.!.')
                                }
                            }
                            if(message.content.startsWith(`${prefix}purge`)){
                                if(message.member.roles.cache.find(r => r.name === "Donations")) {
                                    let splitMessage = message.content.split(" ");
                                    purgenumber = splitMessage[1];
                                    console.log(purgenumber)
                                    if(purgenumber > 100) {
                                        message.channel.send("Please supply a number less than **1000**")
                                    } else if(!purgenumber) {
                                        message.channel.send("Please supply a valid amount!")
                                    } else {
                                        if(purgenumber)
                                        message.channel.bulkDelete(purgenumber)
                                        message.channel.send(`**Successfully deleted ${purgenumber} messages!**`)
                                    }
                                        
                            
                                } else {
                                message.channel.send('no perms')
                            } 
                        }
                        if(message.content.startsWith(`${prefix}ban`)) {
                            if(!message.member.hasPermission([`BAN_MEMBERS`, `ADMINISTRATOR`])) {
                                message.channel.send('no permissions!')
                            } 
                            let membertoban = message.guild.member(message.mentions.members.first())
                            if(!membertoban) return message.channel.send ('Please provide a user to ban!')
                            const banembed = new Discord.MessageEmbed()
                            .setColor(`#FF0000`)
                            .setTitle(`**Player has just been banned!**`)
                            message.guild.member(membertoban).ban()
                            message.channel.send(banembed)

                        }
                        if(message.content.startsWith(`${prefix}kick`)) {
                            if(!message.member.hasPermission([`KICK_MEMBERS`, `ADMINISTRATOR`])) {
                                message.channel.send('no permissions!')
                            } 
                            let membertokick = message.guild.member(message.mentions.members.first())
                            if(!membertokick) return message.channel.send ('Please provide a user to kick!')
                            const kickembed = new Discord.MessageEmbed()
                            .setColor(`#FF0000`)
                            .setTitle(`**Player has just been kicked!**`)
                            message.guild.member(membertokick).kick()
                            message.channel.send(kickembed)

                        }
                        if(message.content.startsWith(`${prefix}say`)) {
                            message.delete()
                            if(message.member.roles.cache.find(r => r.name === "Donations")) {
                            if(!message.member.hasPermission([`MANAGE_MESSAGES`])) return message.channel.send("You can not use this!")
                            const args = message.content.slice(prefix.lenght).trim().split(/ +/g);
                            let saycommand = args.slice(1).join(" ")
                            message.channel.send(saycommand)
                            return;
                            } else {
                                message.channel.send('nein')
                            }
                        }
                        if(message.content.startsWith(`${prefix}botreconnect`)) {
                            setInterval(() => {
                                bot.chat(hub)
                                function reconnect() {
                                    bot.chat(cmd)
                                }
                                setTimeout(reconnect, 5000);
                            }, 1800000);
                        }
                        if(message.content.startsWith(`${prefix}ftop`)){
                            if(message.member.roles.cache.find(r => r.name === "Walls")) {
                            ftopsearch = true
                            bot.chat(fcmd)
                            setTimeout(() => {
                                ftopsearch = false
                                if (ftopvalue == "" || ftopfac == "") return message.channel.send(error)
                                const embed = new Discord.MessageEmbed()
                                    .setColor(`#F13613`)
                                    .setTitle(`FTOP - ${datetime} CET`)
                                    .setFooter(`Server - ${server}`)
                                    .addField("Faction", `${ftopfac.join("\n")}`, true)
                                    .addField("Value", `${ftopvalue.join("\n")}`, true)
                                message.channel.send(embed)
                                ftopvalue = []
                                ftopfac = []
                                pos = 1
                            }, 750);
                        } else {
                            message.channel.send('no')
                            return;
                        }
                    }
                        if(message.content.startsWith(`${prefix}warn`)) {
                            message.delete()
                            if(message.member.roles.cache.find(r => r.name === "Donations")) {
                            userid = message.mentions.members.first()
                            const argss = message.content.slice(prefix.lenght).trim().split(/ +/g);
                            let warnn = argss.slice(2).join(" ")
                                if(!userid) {
                                    message.channel.send('Please mention a user! :saxophone:')
                                    return;
                                } 
                                if(!warnn){
                                    const warn = new Discord.MessageEmbed()
                                    .setColor("#0000CC")
                                    .setDescription('You have been **warned** on ' + message.guild.name + "!")
                                    userid.send(warn)
                                    const warnchannel = new Discord.MessageEmbed()
                                    .setColor(`#212F3C`)
                                    .setDescription('User has just been **warned!**')
                                    message.channel.send(warnchannel)
                                } else {
                                    const warn = new Discord.MessageEmbed()
                                    .setColor("#0000CC")
                                    .setDescription('You have been **warned** on ' + message.guild.name + "!" + "\n" + "Reason: " + warnn)
                                    userid.send(warn)
                                    const warnchannel = new Discord.MessageEmbed()
                                    .setColor(`#212F3C`)
                                    .setDescription('User has just been **warned!**' + "\n" + "Reason: " + warnn)
                                    message.channel.send(warnchannel)
                                }
                                
                            } else {
                                message.channel.send("doesn't work")
                            }
                        }
                            
                        
                        })//message handler
                                                           
    
    client.login(process.env.BOT_TOKEN);
