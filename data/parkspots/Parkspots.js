const mongoose=require('mongoose');
let parkspots=mongoose.Schema({
    user_id:{type:String,required:true},
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    phoneno:{type:Number,required:true},
    status:{type:Boolean,required:true}
})
module.exports=mongoose.model('parkspots',parkspots);