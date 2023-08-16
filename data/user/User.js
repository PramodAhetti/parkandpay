const mongoose=require('mongoose')
let user=mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true},      
    email:{type:String,required:true},
})
module.exports=mongoose.model('userpark',user) 