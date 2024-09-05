const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
    chatId : String,
    senderId : String,
    text : String
},{timestamps:true})

const MessageModel = mongoose.model('Message',MessageSchema)
module.exports = MessageModel