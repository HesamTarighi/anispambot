require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const fs = require('fs')
const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const bot = new Telegraf(process.env.TOKEN)
    bot.command('start', ctx => {
        bot.telegram.sendMessage(ctx.message.chat.id, 'سلام , برای استفاده از ربات ابتدا باید ربات را در گروه مورد نظر اضافه کنید و سپس دسترسی های ادمین را به ربات بدهید.')

        fs.writeFileSync('./users.txt', `@${ctx.message.from.username}\n`)
    })
    bot.on(message('text'), ctx => {
        const idRegex = /.*(@(?=.{5,64}(?:\s|$))(?![_])(?!.*[_]{2})[a-zA-Z0-9_]+(?<![_.])).*/
        const linkRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

        if (ctx.message.text.match(idRegex) || ctx.message.text.match(linkRegex)) {
            bot.telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id)
            ctx.reply(`لینک نده @${ctx.message.from.username}`)
        }
    })

app.get('/', (req, res) => {
    res.send('Hello world')
    console.log('get')
})

app.post('/', (req, res) => {
    console.log(req.body.update_id)
})

app.listen(3000, '0.0.0.0')

bot.launch()
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
