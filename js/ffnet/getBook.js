var startTime, endTime
function start() {
    startTime = new Date()
}
function end() {
    endTime = new Date()
    var timeDiff = endTime - startTime
    timeDiff /= 1000
    var seconds = timeDiff
    console.log(seconds + " seconds")
}


const fetch = require("node-fetch")
const fs = require('fs')
const getInfo = require("./getInfo.js")
const getText = require("./getText.js")
module.exports = {
    book: async function(fflink, ws) {

        var data = []    
        try {
            var resp = await fetch('https://www.fanfiction.net/s/' + fflink)
            ws.send('succmessage:Successfully connected to fanfiction.net server')
        } catch (err) {
            throw {
                name: 'Connection Error',
                message: 'Could not connect to fanfiction.net servers, try a different link or at another time',
                toSTring: function(){return this.name  + ': ' + this.message}
            }
        }
        var body = await resp.text()

        try {
            var info = getInfo.getFicInfo(body)
        } catch (err) {
            throw {
                name: 'Searching Error',
                message: 'Could not find information about fic',
                toSTring: function(){return this.name  + ': ' + this.message}
            }
        }

        data[0] = info
        if (fs.existsSync("./public/epub/" + info[0] + "[" + info[1] + "][" + info[3] + "].epub")) {
            ws.send("succmessage:File already on server")
            return ['exists already', info[0], info[1]];
        }

        for (var i = 1; i < info[3]+1; i++) {

                try {

                    var resp = await fetch('https://m.fanfiction.net/s/' + fflink + '/' + i)
                    ws.send('succmessage:Successfully connected to fanfiction.net server to fetch chapter:' + i + ' text and title')
                    var body = await resp.text()
                } catch (err) {
                    throw {
                        name: 'Connection Error',
                        message: 'Could not connect to fanfiction.net servers to fetch chapter text and title',
                        toSTring: function(){return this.name  + ': ' + this.message}
                    }
                }

                try {
                    var chapcontent = getText.getChapContent(body, i)
                } catch (err) {
                    throw {
                        name: 'Searching Error',
                        message: 'Could not find information or content of this fic',
                        toSTring: function(){return this.name  + ': ' + this.message}
                    }
                }
                data[i] = chapcontent
                ws.send("num:" + JSON.stringify([i, info[3]]))
        }

        var option = {
            'title': info[0],
            'author': info[1],
            'publisher': "fanfiction.net",
            'chapterCount': info[3],
            'description': info[2],
            'content': [
                {
                    'title': info[0],
                    'data':  "<h1>" + info[0] + "</h1><strong>written by: </strong>" + info[1] + "<br><strong>published on: fanfiction.net</strong>" + "<br><strong>Chapters: </strong>" + info[3] + "<br><strong>Tags: </strong>" + info[4] + "<br><strong>Description: </strong>" + info[2]
                }
            ]
        }
        for (var i = 1; i < data[0][3]+1; i++) {
            option.content[i] = {}
            option.content[i].title = data[i][0]
            option.content[i].data = data[i][1]
        }
        return option;
    }

}