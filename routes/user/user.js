let express=require('express')
let route=express.Router();
let users=require('../../data/user/User')
let sellers=require('../../data/seller/Seller')
let jwt=require('jsonwebtoken')

let authenticate=(req,res,next)=>{
     jwt.verify(req.body.auth_token,process.env.JWT_SECRET_KEY,(err,doc)=>{
          if(doc.username_user){
            req.body.username=doc.username_user;
            next();
          }else{
            res.status(400).send({error:"user  login required"})
          }
     })
}

route.post('/new',(req,res)=>{
    users.findOne({username:req.body.username},(err,doc)=>{
        if(doc){
            res.send({message:"user exists"})
        }else{
            let user=new users({
                    name:req.body.name,
                    username:req.body.username,
                    password:req.body.password,
                    email:req.body.email
            })
            user.save();
            res.send({message:"user saved"})
        }
    })

})

route.post('/login',(req,res)=>{
    users.findOne({username:req.body.username,password:req.body.password},(err,doc)=>{
        if(doc){
            jwt.sign({username_user:req.body.username},process.env.JWT_SECRET_KEY,(err,token)=>{
                res.send({"auth_token":token})
            },{expiresInseconds:5})
        }else{
            res.status(400).send({message:"user doesnt exists"})
        }
    })
})



route.post('/near',authenticate,(req,res)=>{
        sellers.find({latitude:{$gt:(req.body.latitude-req.body.radius),$lt:(req.body.latitude+req.body.radius)},longitude:{$gt:(req.body.longitude-req.body.radius),$lt:(req.body.longitude+req.body.radius)}},(err,docs)=>{
            res.send(docs);
         })
    })

module.exports=route;