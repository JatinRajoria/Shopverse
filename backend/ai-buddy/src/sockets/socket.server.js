const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
// token cookies me atta hai isliye
const cookie = require('cookie');
const agent = require("../agent/agent");

async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {})

    io.use((socket, next) => {
        const cookies = socket.handshake.headers?.cookie;

        // token ko cookie me se nikal rhe honge
        const { token } = cookies ? cookie.parse(cookies) : {};

        if(!token){
            return next(new Error('Token not provided'));
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = decoded;
            socket.token = token;

            next();
        }
        catch(err){
            next(new Error("Invalid token"));
        }
    })

    io.on('connection', (socket) => {

        // security ke liye ek aur chiz console krwa rhe hai
        console.log(socket.user, socket.token);

        // console.log("A user connected");

        socket.on('message', async(data) => {
            // console.log("Recieved Message: ", data);

            const agentResponse = await agent.invoke({
                messages: [
                    {
                        role: "user",
                        content: data
                    }
                ]
            },{
                metadata: {
                    token: socket.token
                }
            })
            // console.log("Agent Response: ", agentResponse);

            const lastMessage = agentResponse.messages[ agentResponse.messages.length - 1 ]

            socket.emit('message', lastMessage.content)
        })
    })
}

module.exports = { initSocketServer };