const express=require('express')
const Task = require('../models/task')
const app = new express.Router()
const auth=require('../middleware/auth')
app.post("/task",auth, async (req,res)=>{
    const data=new Task({
        ...req.body,
        owner:req.user._id
    })
    
   try{

        await data.save()
        res.status(201).send(data)
    }catch(e){
        res.status(400).send(e)
    }
})

app.get("/task",auth, async (req,res)=>{
    const match={ }
    try{
        var task,limit,skip
        var sortBy ={}

        if(req.query.limit){
            limit = Number(req.query.limit)
        }

        if(req.query.skip){
          skip = Number(req.query.skip)
        }

        if(req.query.sortBy){
            var val = req.query.sortBy.split(':')
            sortBy[val[0]]= val[1] === 'desc' ? -1 : 1
        }
        console.log(sortBy);
        if(req.query.completed){
            match.completed =req.query.completed ==='true'
             task = await Task.find({owner:req.user._id,completed:match.completed}).limit(limit).skip(skip).sort(sortBy)
        }

        else{
             task = await Task.find({owner:req.user._id}).limit(limit).skip(skip).sort(sortBy)
            
        }
        
      
    //    await req.user.populate('tasks').execPopulate() 
    //    res.send(req.user.task)
            res.send(task)

    }catch(e){
        res.status(500).send(e)
        console.log(e);
    }
})

app.get("/task/:id",auth,async (req,res)=>{
    const _id=req.params.id
    try{
        //const task=await Task.findById(id)
        const task =await Task.findOne({_id,owner:req.user._id}) 
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
 
})

app.patch('/task/:id',auth,async (req,res)=>{
    const id=req.params.id
    const key=Object.keys(req.body)
    const allowedUpdates=['completed','description']
    const isValidOp = key.every((data)=>allowedUpdates.includes(data))
    if(!isValidOp){
        return res.status(400).send({error:"Invalid Update"})
    }
    try{
       const task =await Task.findOne({id:req.params.id,owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }
        key.forEach((update)=>task[update]=req.body[update])
        await task.save()
        return res.send(task)

    }catch(e){
        res.status(400).send(e)
    }
})



app.delete("/task/:id",auth,async (req,res)=>{

    try{
        const task =await Task.findOne({id:req.params.id,owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }
        
        await Task.deleteOne(req.params.id)
       
        return res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports=app