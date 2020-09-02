module.exports = {
    createEpub: async function(option, path) {
        const fs = require('fs')
        const epubGenerator = require('epub-generator')

        var title = option.title
        var author = option.author
        var description = option.description

        var xhtml_title =  option.content[0].data

        var epubStream = epubGenerator({
            title: title,
            author: author,
            description: description,
            rights: 'Downloaded from Fanfiction.net'
        })
        epubStream.add('title.xhtml', xhtml_title, {
            title: title,
            toc: true
        })

        for (var i = 1; i < parseInt(option.chapterCount)+1; i++) {
            var xhtml_chapter = option.content[i].data
            epubStream.add('chapter_' + i + ".xhtml", xhtml_chapter, {
                title: "<h1>" + option.content[i].title + "</h1>" + option.content[i].title,
                toc: true
            })
        }
        
        epubStream.end().pipe( fs.createWriteStream(path) )

        epubStream.on('error', function(err){
            console.trace(err)
        })
    }
}