const wspath  = 'wss://' + window.location.hostname + ':443/download'
const socket = new WebSocket(wspath)

socket.addEventListener('open', (event) => {
    console.log('Connected')
})
socket.addEventListener('message', (event) => {
    if (event.data.match(/num:.*/i)){
        var data = event.data.substring(4, event.data.length) 
        data = JSON.parse(data)
        loading(data[0], data[1], "")
    }
    else if (event.data.match(/succmessage:.*/i)) {
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(12, event.data.length)
        status.style.color = 'lightgreen'
        document.getElementById('statusul').appendChild(status)
    }
    else if (event.data.match(/conmessage:.*/i)) {
        document.getElementById('nocon').remove()
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(11, event.data.length)
        status.style.color = 'lightgreen'
        document.getElementById('statusul').appendChild(status)
    }
    
    else if (event.data.match(/errmessage:.*/i)) {
        var status = document.createElement('li')
        status.innerHTML = event.data.substring(11, event.data.length)
        status.style.color = 'red'
        document.getElementById('statusul').appendChild(status)
        loading(1, 1, "error")
    }
    else if (event.data.match(/path:.*/i)) {
        document.getElementById('progress_num').style.display = "none"
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
    document.getElementById('downloadlink').innerHTML = ' <p id="progress_num"></p>'
    var link = document.getElementById('link').value

    if (link.match(/https:\/\/.*fanfiction\.net/i) == null) {
        alert('Please enter a valid url\nIt looks like this "https://fanfiction.net/s/..."')
    }

    socket.send('link:' + link)
    document.getElementById('sendbutton').disabled = true

    loading(10, 1000, "")
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
function loading(done, total, status) {
    var width = done/total*100  
    if (status == "error") {
        document.getElementById('progress_num').innerText = "Error"
        document.getElementById('progress_num').style.color = "red"
        document.getElementById('loading').style.border = "3px solid var(--error-color)"
    }
    if (status == "success") {
        document.getElementById('loading').style.border = "3px solid var(--success-color)"
    }
    if (status == "") {
        if (total != 1000) {
            document.getElementById('progress_num').innerText = done + "/" + total + " Chapters"
            document.getElementById('progress_num').style.color = "var(--contrast-color)"
            document.getElementById('loading').style.border = "3px solid var(--contrast-color)"
        }
        document.getElementById('loading').style.border = "3px solid var(--contrast-color)"
    }
    document.getElementById('loading').style.width = width+ "vw"
}