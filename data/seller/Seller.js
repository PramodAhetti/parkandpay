const mongoose=require('mongoose')
let seller=mongoose.Schema({
    username:String,
    password:String,
    phoneno:Number,
    latitude:Number,
    longitude:Number
})
module.exports=mongoose.model('sellerpark',seller)