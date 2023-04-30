let express=require('express')
let route=express.Router();
let users=require('../../data/user/User')
let sellers=require('../../data/seller/Seller')
let park=require('../../data/parkspots/Parkspots')
let jwt=require('jsonwebtoken')
let authenticate=(req,res,next)=>{
      if(req.cookies.auth_token){
        jwt.verify(req.cookies.auth_token,process.env.JWT_SECRET_KEY,(err,doc)=>{
            if(!err){
              req.body.user_id=doc.user_id;
              next();
            }else{
              res.status(500).send({error:"Invalid token"});
            }
       })
      }else{
        res.status(500).send({message:"Login required"});
      }
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
            jwt.sign({username_user:req.body.username},process.env.JWT_SECRET_KEY,(err,token)=>{
                user.save();
                res.cookie("auth_token",token);
                res.send({message:"user saved"})
            },{expiresInseconds:5})
        }
    })

})

route.post('/login',(req,res)=>{
    users.findOne({username:req.body.username,password:req.body.password},(err,doc)=>{
        if(err){
            res.status(500).send({error:"try again"});
        }
        if(doc){
            jwt.sign({user_id:doc.id},process.env.JWT_SECRET_KEY,(err,token)=>{
                      if(err){
                        res.status(500).send({error:"try again"});
                      }else{
                        res.cookie("auth_token",token);
                        res.send({user:req.body.username})
                      }
            },{expiresInseconds:5})
        }else{
            res.status(400).send({message:"user doesnt exists"})
        }
    })
})

route.post('/sell',authenticate,(req,res)=>{
    park.findOne({user_id:req.body.user_id},(err,docs)=>{
        if(!docs){
           let newspot=new park({
            user_id:req.body.user_id,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            phoneno:req.body.phoneno,
            status:0
           })
           newspot.save();
           res.send('saved parking spot');
        }else{
           res.send('Parking spot exists already');
        }
    })
})

route.post('/near',authenticate,(req,res)=>{
        sellers.find({latitude:{$gt:(req.body.latitude-req.body.radius),$lt:(req.body.latitude+req.body.radius)},longitude:{$gt:(req.body.longitude-req.body.radius),$lt:(req.body.longitude+req.body.radius)}},(err,docs)=>{
            res.send(docs);
         })
    })

module.exports=route;