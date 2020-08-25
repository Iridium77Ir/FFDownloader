module.exports = {
    getChapContent: function(body, chapNum) {
        var title = getChapTitle(body, chapNum)
        var content = getChapText(body)
        return [title, content];
    }

}
function getChapTitle(body, chapNum) {
    var matches = body.match(/<option.*value=.* .*>.*/i);
    if (matches == null) {
        return "Chapter " + chapNum
    }
    return matches[chapNum];
}
function getChapText(body) {
    var matches = body.match(/<div.*class='storytext xcontrast_txt nocopy'.*>([\s\S]+?)<\/div>/i)
    if (matches == null) {
        throw {}
    }
    return matches[0]
}