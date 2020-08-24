const express = require('express')
require('./db/mongoose')

const { ObjectID } = require('mongodb')
const { update } = require('./models/user')

const userroute =require('./routers/user')
const taskroute =require('./routers/task')

const app =express()
port = process.env.PORT 

app.get('/',(req,res)=>{
    res.send("MKC")
})
// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('GET request is disable')
//     }
//     else{
//         next()
//     }
    
// })



app.use(express.json())
app.use(userroute)
app.use(taskroute)


app.listen(port,()=>{
    console.log("Server is runnning "+port);
})

// const jwt=require('jsonwebtoken')
// const myFun = async() => {
//     const token =jwt.sign({_id:'abc123'},'thisisnewcorse',{expiresIn:'7 days'})
//     console.log(token)
    

//    const isVerify= jwt.verify(token,'thisisnewcorse')
//    console.log(isVerify);
// }
// myFun()

// const Task =require('./models/task')
// const User=require('./models/user')
// const main =async()=>{
//     // const task=await Task.findById('5f40c3b27b67130d44524b98')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);
     
//     //     const user=await User.findById('5f410162c75bb544685f99d9')
//     //   //  console.log(user);
//     // //await user.populate('tasks').execPopulate()
//     // console.log(user.tasks);
    

// } 

const erroeMiddelwre = (req,rec,next)=>{
    throw new Error('from my middelware')
}
const multer = require('multer')
const upload=multer({
   dest:'images' ,
   limits:{
       fileSize: 500000
   },
   fileFilter(req,file,cb){
    
    if(!file.originalname.endsWith('.jpg')){
        cb(new Error("File Must Be image"))
      
    }
    cb(undefined,true)
      //    cb(undefined,true)
   }
})

app.post('/upload',erroeMiddelwre,(req,res)=>{
    res.send(200)}
,(error,req,res,next)=>
{
    res.status(400).send({error:error.message})
})
