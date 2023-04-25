let express=require('express')
let route=express.Router();
let sellerdb=require('../../data/seller/Seller')
let jwt=require('jsonwebtoken')


let authenticate=(req,res,next)=>{
    jwt.verify(req.cookies.auth_token,process.env.JWT_SECRET_KEY,(err,doc)=>{
         if(doc.username_seller){
           req.body.username=doc.username_seller;
           next();
         }else{
           res.status(400).send({error:"seller login required"})
         }
    })
}


route.post('/new',(req,res)=>{
    sellerdb.findOne({username:req.body.username},(err,doc)=>{
        if(doc){
           res.send({error:"seller exists"})
        }else{
            let seller=new sellerdb({
                username:req.body.username,
                password:req.body.password,
                phoneno:req.body.phoneno,
                latitude:req.body.latitude,
                longitude:req.body.longitude,
            })
            seller.save();
            res.send({message:"saved seller"})           
        }
    })

})

route.post('/login',(req,res)=>{
    sellerdb.findOne({username:req.body.username,password:req.body.password},(err,doc)=>{
        if(doc){
            jwt.sign({username_seller:req.body.username},process.env.JWT_SECRET_KEY,(err,token)=>{
                res.cookie("auth_token",token);
                res.send({seller:req.body.username});
            },{expiresInseconds:5})
        }else{
            res.status(400).send({message:"seller doesnt exists"})
        }
    })
})



module.exports=route;