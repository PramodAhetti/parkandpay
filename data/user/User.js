const mongoose=require('mongoose')
let user=mongoose.Schema({
    name:String,
    username:String,
    password:String,    
    email:String,
})
module.exports=mongoose.model('userpark',user)