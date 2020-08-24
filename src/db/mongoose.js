const mongose=require('mongoose')
const validator=require("validator")
console.log(process.env.MONOGDB_URL);
mongose.connect(process.env.MONOGDB_URL,{
    useNewUrlParser : true,
    useCreateIndex:true
})
