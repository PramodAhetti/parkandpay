let mongoose=require('mongoose')
const history=mongoose.Schema({
    booked_by:{type:String,required:true},
    owner_id:{type:String,required:true},
    cost:{type:Number,required:true}
})
module.exports=mongoose.model('log',history)