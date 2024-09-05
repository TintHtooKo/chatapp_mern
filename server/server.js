const express = require("express");
const cors = require('cors')
require("dotenv").config();
const mongoose = require("mongoose");
const mongoURL = process.env.mongoURL 
const User = require("./Route/userRoute");
const Chat = require("./Route/chatRoute")
const Message = require("./Route/messageRoute")
const app = express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

mongoose.connect(mongoURL).then(() => {
        console.log("connected to database");
        app.listen(process.env.PORT,()=>{
            console.log(`server running on port ${process.env.PORT}`)
        })  
})

app.use('/user',User)
app.use('/chat',Chat)
app.use('/message',Message)
     
