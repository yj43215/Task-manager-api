const mongose=require('mongoose')
const validator=require("validator")
const bcryt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
const sharp =require('sharp')
const { deleteMany } = require('./task')
const userSchema= new mongose.Schema({
    name:{type:String},
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error("age is in positive")
            }
        }
       },
   email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            validate(value){
                if(!validator.isEmail(value)){
                   throw new Error("email is worng")  
                }
            }
        },
   password:{
           type:String,
            required:true,
            trim:true,
            minlength:7,
            validate(value){
                if (value.includes('password')){
                   throw new Error("pass is worng") 
                }
            }
        },
        tokens :[{
            token:{
                type:String,
                required:true
            }
        }],
        avatar:{type:Buffer}
    },
        {   timestamps:true })

userSchema.set('toJSON', { virtuals: true })
userSchema.virtual('tasks', {
    ref:'Task',
    localField:'_id',
    foreignField : 'owner'
})




userSchema.methods.generateAuthToken = async function() {
    const user= this
    const token = await  jwt.sign({_id:user._id},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}


userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials= async (email,pass) =>{
    const user=await User.findOne({email:email})
    
    if(!user){
        throw new Error("Unable to Login no user found")
    }
   
    const isMatch =await bcryt.compare(pass,user.password)
    if(!isMatch){
        throw new Error("Unable to Login")    
    }

    return user
}
userSchema.pre('save',async function(next){
    const user = this

    if(user.isModified('password')){
        user.password =await bcryt.hash(user.password,8)
    }

    next()
})

//delete user task when user is 

userSchema.pre('remove',async function(next){
    const user =this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongose.model('User',userSchema)

User.createIndexes()

module.exports =User