const User = require('../Model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const createToken = (_id) =>{
        const jwtkey = process.env.JWT_SECRET 
        return jwt.sign({_id},jwtkey,{expiresIn:'3d'})
}

const userController = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password } = req.body
            let user = await User.findOne({ email })
            if(user){
                return res.status(400).json({message:'Email already register. Please try another one'})
            }
            if(!name || !email || !password){
                return res.status(400).json({message:'Please enter all fields'})    
            }
            if(!validator.isEmail(email)){
                return res.status(400).json({message:'Please enter a valid email'})
            }
            if(!validator.isStrongPassword(password)){
                return res.status(400).json({message:'Please enter a strong password'})
            }

            user = new User({name, email, password})

            const salt = await bcrypt.genSalt()
            user.password = await bcrypt.hash(user.password, salt)
            await user.save()

            const token = createToken(user._id)
            return res.status(200).json({_id : user._id,name,email,token})
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({message:e.message})
        }
    },

    loginUser : async(req,res)=>{
        try {
            const {email,password} = req.body
            let user = await User.findOne({email})
            if(!user){
                return res.status(400).json({message:'User does not exist. Please register'})   
            }
            const  isValidPassword = await bcrypt.compare(password,user.password)
            if(!isValidPassword){
                return res.status(400).json({message:'Invalid credentials. Please try again'})
            }

            const token = createToken(user._id)
            return res.status(200).json({_id : user._id,name:user.name,email,token})

        } catch (e) {
            console.log(e.message);
            return res.status(500).json({message:e.message})
        }
    },

    findUser : async(req,res) =>{
        const id = req.params.id
        try {
            const user = await User.findById(id)
            return res.status(200).json(user)
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({message:e.message})
        }
    },

    getUser : async(req,res) =>{
        try {
            const user = await User.find()
            return res.status(200).json(user)
        } catch (e) {
            console.log(e.message);
            return res.status(500).json({message:e.message})
        }
    }
}

module.exports = userController