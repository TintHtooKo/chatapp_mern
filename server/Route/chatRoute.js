const express = require('express')
const chatController = require('../Controller/chatController')
const router = express.Router()

router.post('/',chatController.createChat)
router.get('/:userId',chatController.findUserChat)
router.get('/find/:firstId/:secondId',chatController.findChat)

module.exports = router