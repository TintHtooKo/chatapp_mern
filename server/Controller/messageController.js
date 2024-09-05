const MessageModel = require('../Model/messageModel')

const messageController = {
    createMessage : async(req,res) =>{
        const {chatId,senderId,text} = req.body
        const message = new MessageModel({chatId,senderId,text})
        
        try {
            const response = await message.save()
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({message:error.message})
        }
    },

    getMessage : async(req,res) =>{
        const {chatId} = req.params

        try {
            const message = await MessageModel.find({chatId})
            return res.status(200).json(message)
        } catch (error) {
            return res.status(500).json({message:error.message})
        }
    }
}

module.exports = messageController