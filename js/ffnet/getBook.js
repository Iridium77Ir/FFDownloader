const fetch = require("node-fetch")
const fs = require('fs')
const getInfo = require("./getInfo.js")
const getText = require("./getText.js")
module.exports = {
    book: async function(fflink, ws) {

        var data = []    
        try {
            var resp = await fetch(fflink)
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
        if (fs.existsSync("./public/epub/" + info[0] + "[" + info[1] + "].epub")) {
            ws.send("succmessage:File already on server")
            return ['exists already', info[0], info[1]];
        }
        fflink = fflink.split("/")
        fflink = fflink[0] + "/" + fflink[1] + "/" + fflink[2] + "/" + fflink[3] + "/" + fflink[4] + "/"

        for (var i = 1; i < info[3]+1; i++) {

                var resp = await fetch(fflink.concat(i))
                try {
                    var resp = await fetch(fflink.concat(i))
                    ws.send('succmessage:Successfully connected to fanfiction.net server to fetch chapter:' + i + ' text and title')
                } catch (err) {
                    throw {
                        name: 'Connection Error',
                        message: 'Could not connect to fanfiction.net servers to fetch chapter text and title',
                        toSTring: function(){return this.name  + ': ' + this.message}
                    }
                }
                var body = await resp.text()

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
        }

        var option = {
            'title': data[0][0],
            'author': data[0][1],
            'publisher': "fanfiction.net",
            'content': [
                {
                    'title': data[0][0],
                    'data': "written by: " + data[0][1] + "<br>published on: fanfiction.net" + "<br>Chapters: " + data[0][3]
                }
            ]
        }
        for (var i = 0; i < data[0][3]; i++) {
            option.content[i+1] = {}
            option.content[i+1].title = data[1][0]
            option.content[i+1].data = data[1][1]
        }

        return option;
    }

}