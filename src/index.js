const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 8000
server.listen(PORT)

const webpush = require('web-push')
const vapidKeys = {
    publicKey: 'BLEhkBvOZS6EytHNgRBPd3xF4k6iVzCQrjDOJHYPmsK_bQCL7r4homz5E2BPaLkDXPOJv5QdT5cvnT8E4lS5MI8',
    privateKey: 'cgQN28zcN7Z4hVu-qu7oUox0WT6W9pTLTYgOlfNk8Jc'
}
//console.log(webpush.generateVAPIDKeys())
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

// const pushSubscription = {
//     endpoint: '.....',
//     keys: {
//         auth: '.....',
//         p256dh: '.....'
//     }
// }

// webpush.sendNotification(pushSubscription, 'Test message!')



const path = require('path')
const fs = require('fs')

const data = {
    filePath: path.join(__dirname, 'data.txt'),
    get() {
        const d = fs.readFileSync(this.filePath).toString()
        if (!d) return []
        return JSON.parse(d)
    },
    write(nd) {
        const d = this.get()
        d.push(nd)
        fs.writeFileSync(this.filePath, JSON.stringify(d))
        return d
    }
}

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', socket => {
    socket.on('click', () => {
        data.get().forEach(pushSubscription => {
            webpush.sendNotification(pushSubscription, 'Test message!')
        })
    })
    socket.on('key', key => {
        data.write(JSON.parse(key))
    })
})
