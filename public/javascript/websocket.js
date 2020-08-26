const wspath  = 'ws://' + window.location.hostname + ':8080/download'
const socket = new WebSocket(wspath)

socket.addEventListener('open', (event) => {
    console.log('Connected')
})
socket.addEventListener('message', (event) => {
    if (event.data.match(/succmessage:.*/i)) {
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(12, event.data.length)
        status.style.color = 'lightgreen'
        document.getElementById('statusul').appendChild(status)
    }
    if (event.data.match(/conmessage:.*/i)) {
        document.getElementById('nocon').remove()
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(11, event.data.length)
        status.style.color = 'lightgreen'
        document.getElementById('statusul').appendChild(status)
    }
    
    if (event.data.match(/errmessage:.*/i)) {
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(11, event.data.length)
        status.style.color = 'red'
        document.getElementById('statusul').appendChild(status)
    }
    if (event.data.match(/path:.*/i)) {
        var link = event.data.substring(5, event.data.length)
        var downloadlink = document.createElement('a')
        downloadlink.href = link
        downloadlink.innerText = 'Download'
        document.getElementById('downloadlink').appendChild(downloadlink)
        document.getElementById('sendbutton').disabled = false
    }
})
function sendpath() {
    document.getElementById('statusul').innerHTML = ""
    document.getElementById('downloadlink').innerHTML = ""
    var link = document.getElementById('link').value

    if (link.match(/https:\/\/.*fanfiction\.net/i) == null) {
        alert('Please enter a valid url\nIt looks like this "https://fanfiction.net/s/..."')
    }

    socket.send('link:' + link)
    document.getElementById('sendbutton').disabled = true
}
function expand(i, id) {
    var ps = document.getElementsByClassName('p')
    if (document.getElementById(id).style.display === "none") {
        document.getElementById(id).style.display = 'block'
        ps[i].style.borderRadius = "10px 10px 0 0"
    } else {
        document.getElementById(id).style.display = 'none'
        ps[i].style.borderRadius = "10px 10px 10px 10px"
    }
}