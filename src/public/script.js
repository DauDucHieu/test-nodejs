const socket = io()
const btn = document.querySelector('#click')
btn.onclick = () => {
    socket.emit('click')
}
