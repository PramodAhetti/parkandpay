const express=require('express')
const router=express.Router();
const userauth=require('../../middleware/userauth');


router.get('/new',userauth,(req,res)=>{
      res.send('hi');
})
module.exports=router;