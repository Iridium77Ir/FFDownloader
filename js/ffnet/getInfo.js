module.exports = {
    getFicInfo: function(body) {

        var title = getTitle(body)
        if (title == null) {
            throw {}
        }
        var author = getAuthor(body)
        if (author == null) {
            throw {}
        }
        var descr = getDescr(body)
        if (descr == null) {
            descr = "Description not found"
        }
        var ChapterCount = getChapterCount(body)
        if (ChapterCount == null) {
            ChapterCount = 1
        }
        var tags = getTags(body)
        if (tags == null) {
            tags = "No Tags"
        }
        return [title, author, descr, ChapterCount, tags]
    }

}
function getTitle(body) {
    var matches = body.match(/Follow\/Fav<\/button><b class='xcontrast_txt'>(.+?)<\/b>/i)
    if (matches == null)
        {
            return null;
        }
    return matches[1];
}
function getTags(body) {
    var matches = body.match(/<span.*class='xgray xcontrast_txt'>.*<\/span>/i)
    if (matches == null)
        {
            return null;
        }
    return matches[0];
}
function  getAuthor(body) {
    var matches = body.match(/By:<\/span> <a class='xcontrast_txt' href='\/u\/([0-9]+?)\/.*?'>(.+?)<\/a>/i)
    if (matches == null) {
            return null;
    }
    return matches[2];
}
function  getDescr(body) {
    var matches = body.match(/<div style='margin-top:2px' class='xcontrast_txt'>(.+?)<\/div>/i);
    if (matches == null ){
        return null;
    }
    return matches[1];
}
function getChapterCount(body) {
    var matches = body.match(/<option  value=.+?>/gi)
    if (matches == null) {
        return 1;
    }
    return matches.length / 2;
}