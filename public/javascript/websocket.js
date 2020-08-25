const wspath  = 'ws://' + window.location.hostname + ':8080/download'
const socket = new WebSocket(wspath)

socket.addEventListener('open', (event) => {
    console.log('Connected')
})
socket.addEventListener('message', (event) => {
    if (event.data.match(/succmessage:.*/i)) {
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(12, event.data.length)
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
        document.getElementById('status').style.display = 'none'
    }
})
function sendpath() {
    var link = document.getElementById('link').value
    socket.send('link:' + link)
}