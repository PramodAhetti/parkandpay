const mongoose=require('mongoose');
let parkspots=mongoose.Schema({
    owned_id:{type:String,required:true},
    latitude:{type:Number,required:true},
    longitude:{type:Number,required:true},
    phoneno:{type:Number,required:true},
    status:{type:Boolean,required:true},
    bookedby:{type:String,required:true}
})
module.exports=mongoose.model('Parkspots',parkspots);