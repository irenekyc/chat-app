const socket = io()
//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $message = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')


//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
//ignore queryprefix is to delete "?"

const autoscroll = ()=>{
    // new message
    const $newMessage = $message.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    console.log(newMessageMargin)

    //visible height
    const visibleHeight = $message.offsetHeight

    //Height of message container
    const containerHeight = $message.scrollHeight

    // How far have I scroll from top
    const scrollOffset = $message.scrollTop + visibleHeight

    // how far am i from the bottom
    if(containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
        //this is to set the scroll to the bottom all the way

    }


}

socket.on('message', (msg)=>{
    //render template using mustache templates 
    //message is the variable from the html and msg 
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
        //moment library
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

socket.on('locationMessage', (message)=>{
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
    
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })

//dilvered is the callback function to acknowledge the event (communicate between chat and index)
})

$locationButton.addEventListener('click', ()=>{
    
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your broswer')
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, ()=>{
            $locationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})
    

socket.emit('join', { username, room }, (error)=>{
    if(error) {
        alert(error)
        location.href ='/'
    }
})
