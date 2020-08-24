const mongodb=require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const ObjectID =mongodb.ObjectID 

const id=new ObjectID()
console.log(id)

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>
{
    if(error){
        return console.log("Unable to Connect");
    }

    const db=client.db(databaseName)
    // db.collection('user').findOne({name : 'Jain'} ,( error,user) => {
    //     if(error){return console.log("eoor")}
    //     console.log(user);


    // })

//    const updatePromise= db.collection('user').updateOne({_id:new ObjectID("5f3e5469c408921e285f64d6")} , {$set:{name:'mike'}})
//    updatePromise.then((result)=>{
//        console.log(result);
//    }).catch((error)=>{console.log(error)})  


   const deletePromise= db.collection('user').deleteMany({_id:new ObjectID("5f3e5469c408921e285f64d6")})
   deletePromise.then((result)=>{
       console.log(result);
   }).catch((error)=>{console.log(error)})  
    //     db.collection('user').insertOne({
//         name:"Jain",
        
//         _id:id,
//         age:21
//     },(error,result)=>{
//         if(error){
//             return console.log('insert fail');
//         }
//         console.log(result.ops);
//     })


// db.collection('user').insertMany([{
//     name:"Jain",
//     age:21
// },{
//     name:'sachit',
//     age:15
// }],(error,result)=>{
//     if(error){
//         return console.log('insert fail');
//     }
//     console.log(result.ops);
// })

})

