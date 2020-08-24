const express = require('express')
const User = require('../models/user')
const { update } = require('../models/user')
const router = new express.Router()
const multer = require('multer')
const auth = require('../middleware/auth')
const sharp = require('sharp')

router.post("/users", async (req, res) => {
    const data = new User(req.body)

    try {
        await data.save()
        const token = await data.generateAuthToken()

        res.status(201).send({ data, token })
    }
    catch (e) {
        res.status(400).send(e)
        console.log(e);
    }

})


router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
}
)
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        console.log(req.user);
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()


    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        console.log(req.user);
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send()

    }
})

router.get("/users", auth, async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    }
    catch (e) {
        res.status(500).send()
        console.log(e)
    }

})

// router.get("/users/:id",async (req,res)=>{
//     const id=req.params.id

//     try{
//         const user=await User.findById(id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.send(user)

//     }catch(e){
//         res.status(500).send(e)
//         console.log(e)
//     }

// })


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }
    catch (e) {
        res.status(404).send(e)
        console.log(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const key = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOp = key.every((data) => allowedUpdates.includes(data))
    if (!isValidOp) {
        return res.status(400).send({ error: "Invalid Update" })
    }
    try {
        const user = req.user
        key.forEach((update) => user[update] = req.body[update])
        await user.save()


        //const user=await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        return res.send(user)

    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
})

router.delete("/users/me", auth, async (req, res) => {

    try {
        //        const user=await User.findByIdAndDelete(req.user._id)

        await req.user.remove()
        return res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})




const upload = multer({
    limits: {
        fileSize: 500000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/.*\.(gif|jpe?g|bmp|png)$/igm)) {
            cb(new Error("File Must Be image"))

        }
        cb(undefined, true)
        //    cb(undefined,true)
    }

})

router.delete("/users/me/avtar", auth, async (req, res) => {
req.user.avatar =undefined
await req.user.save()
    res.send(req.user)
})

router.post('/users/me/avatar',auth, upload.single('avatar'),async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar =buffer
    await req.user.save()
    res.send(req.user)
},(error,req,res,next)=>
{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar' , async (req,res) => {
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar) 
    }catch(e){
        res.status(404).send()
    }
})
module.exports = router
