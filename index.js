const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();

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
                        message.delete(5000)
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
                                if(row === undefined  || '0') {
                                        message.channel.send(`There's nothing to remove!`)
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
                                }
                                })
                                
                                
                                } else {
                                    message.channel.send('stop trying')
                                    message.delete(5000)
                                }
                            }
                            if(message.content.startsWith(`${prefix}top`)) {
                                message.delete()
                                if(message.member.roles.cache.find(r => r.name === "Donations")) {
                                    let splitMessage = message.content.split(" ");
                                    btoppage = splitMessage[1];
                                    console.log(btoppage)
                                    if(btoppage === undefined) {
                                        var description = ""
                                    let all = `SELECT userid , donos FROM donations ORDER BY donos DESC LIMIT 20;`
                                    db.all(all, (err, row) => {
                                        if(err) throw err;
                                        const topembed = new Discord.MessageEmbed()
                                        .setColor('#FF760B')
                                        .setTitle(message.guild.name + "'s TOP Donators!")
                                        .setTimestamp()  
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
                                    message.delete(5000)
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
                                message.delete(5000)
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
                            if(message.member.roles.cache.find(r => r.name === "Donations")) {
                            message.delete()
                            if(!message.member.hasPermission([`MANAGE_MESSAGES`])) return message.channel.send("You can not use this!")
                            const args = message.content.slice(prefix.lenght).trim().split(/ +/g);
                            let saycommand = args.slice(0).join(" ")
                            message.channel.send(saycommand)
                            } else {
                                message.channel.send('nein')
                            }
                        }
                                                             
                                
                                })//message handler
                                                           
    
    client.login(token);