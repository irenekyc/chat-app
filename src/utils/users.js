const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    //Clean the data (remove extra spaces)
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing users in the same room
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    
    // Vadliate username
    if (existingUser) {
        return { 
            error: 'username already existed in the chatroom'
        }
    }

    //store user
    const user = { id, username, room}
    users.push(user)
    return {user}

}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>
    { return user.id === id
    })

    if(index !==1) {
        return users.splice(index, 1)[0]
    }
}



const getUser = (id) => {
    return users.find((user)=> user.id === id)
}


const getUsersInRoom = (room) => {
    return users.filter((user)=> user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}