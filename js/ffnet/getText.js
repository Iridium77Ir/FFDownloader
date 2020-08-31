module.exports = {
    getChapContent: function(body, chapNum) {
        var title = getChapTitle(body, chapNum)
        var content = getChapText(body)
        return [title, content];
    }

}
function getChapTitle(body, chapNum) {
    var matches = body.match(/Chapter.*[0-9]*.*<br>/i);
    if (matches == null) {
        return "Chapter " + chapNum
    }
    return matches[0].substring(0, matches[0].length-4);
}
function getChapText(body) {
    var matches = body.match(/<div style='padding:5px 10px 5px 10px;' class='storycontent nocopy' id='storycontent' >([\s\S]+?)<\/div>/i)
    if (matches == null) {
        throw {}
    }
    var text = matches[1].replace("\'", "'")
    return text
}