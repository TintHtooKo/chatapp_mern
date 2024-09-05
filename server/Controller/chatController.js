// createChat, get user chat, find chat

const chatModel = require('../Model/chatModel')

const chatController = {
    createChat : async(req,res)=>{
        // two chat user id
        const {firstId,secondId} = req.body

        try {
            const chat = await chatModel.findOne({
                members : {$all:[firstId,secondId]}
            })

            if(chat){
                return res.status(200).json(chat)
            }

            const newChat = new chatModel({
                members : [firstId,secondId]
            })

            const response = await newChat.save()
            return res.status(200).json(response)

        } catch (error) {
            console.log(error);
            res.status(500).json({message:error.message})           
        }
    },

    findUserChat : async(req,res)=>{
        const userId = req.params.userId

        try {
            const chats = await chatModel.find({
                members : {$in : [userId]}
            })
            return res.status(200).json(chats)
        } catch (error) {
            return res.status(500).json({message:error.message})
        }

    },

    findChat : async(req,res)=>{
        const {firstId,secondId} = req.params

        try {
            const chat = await chatModel.find({
                members : {$all:[firstId,secondId]}
            })
            return res.status(200).json(chat)
        } catch (error) {
            return res.status(500).json({message:error.message})
        }

    },

}

module.exports = chatController
