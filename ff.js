require('dotenv').config()

const express = require('express')
const app = express()
const Epub = require("epub-gen")
const fetch = require("node-fetch")
const fs = require("fs")
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const getBook = require('./js/ffnet/getBook.js')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '15mb', extended: false }))

const server = require('http').createServer(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: server, path: '/download', port: process.env.WEBSOCKET})

app.get("/", async (req, res) => {
    res.render("index")
})

wss.on('connection', (ws) => {
    console.log('client connected')
    ws.send('succmessage:Connection successful')

    ws.on('message', async (message) => {
        if (message.match(/link:.*/i)) {
            try {
                var option = await getBook.book(message.substring(5,message.length), ws)
                if (option[0] == 'exists already') {
                    ws.send('path:/epub/' + option[1] + "[" + option[2] + "].epub")
                } else {
                    var epub = await new Epub(option, "./public/epub/" + option.title + "[" + option.author + "].epub")
                    ws.send('path:/epub/' + option.title + "[" + option.author + "].epub")
                }
            } catch (err) {
                ws.send('errmessage:' + err.message)
            }
            
        }
    }) 
})

server.listen(process.env.WEBSOCKET)
app.listen(process.env.PORT)
