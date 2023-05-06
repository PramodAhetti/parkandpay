let express=require('express')
let route=express.Router();
let users=require('../../data/user/User')
let jwt=require('jsonwebtoken');
const Parkspots = require('../../data/parkspots/Parkspots');
const history = require('../../data/log/history.js');

function costofpark(date1, date2) {
    const diffInMilliseconds = Math.abs(date2 - date1);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    return diffInMinutes;
  }
let authenticate=(req,res,next)=>{
      if(req.cookies.auth_token){
        jwt.verify(req.cookies.auth_token,process.env.JWT_SECRET_KEY,(err,doc)=>{
            if(!err){
              req.body.user_id=doc.user_id;
              next();
            }else{
              res.status(401).json({message:"Login required token is invalid"});
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
                console.log(user.id)
                res.send({auth_token:token,user_id:user.id})
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
            jwt.sign({user_id:doc.id},process.env.JWT_SECRET_KEY,{expiresIn:'1h'},(err,token)=>{
                      if(err){
                        res.status(500).send({error:"try again"});
                      }else{
                        res.cookie("auth_token",token);
                        res.send({auth_token:token,user_id:doc.id});
                        console.log(doc.id);
                      }
            })
        }else{
            res.status(400).send({message:"user doesnt exists"})
        }
    })
})

route.post('/sell',authenticate,(req,res)=>{
    Parkspots.findOne({owned_id:req.body.user_id},(err,docs)=>{
        if(err){
            res.status(500).send({message:"try again"});
        }
        if(!docs){
           let newspot=new Parkspots({
            owned_id:req.body.user_id,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            bookedby:"null",
            bookedtime:Date.now(),
            status:0
           })
           newspot.save();
           res.send({message:'saved parking spot'});
        }else{
           res.send({message:'You are already selling a parking spot'});
        }
    });
})


route.post('/book',authenticate,(req,res)=>{
        try{
        Parkspots.findOne({bookedby:req.body.user_id},(err,doc)=>{
            if(doc){
                res.send({message:"You have booking already"})
            }else{
                Parkspots.findOne({owned_id:req.body.owned_id},(err,docs)=>{
                    if(err){
                        res.status(500).send({error:"try again"});
                    }
                    if(docs){
                        if(docs.status==0){
                            Parkspots.updateOne({owned_id:req.body.owned_id},{$set:{status:"1",bookedby:req.body.user_id,bookedtime:Date.now()}},(err,doc)=>{
                                if(err){
                                    res.status(400).send({message:"try again"});
                                }
                                res.send({message:"Booked the parking spot"})
                            }); 
                        }else{
                            res.status(400).json({message:"This spot is already booked by someone "})
                        }
                    }else{
                        res.status(400).json({message:"Enter correct owner_id"});
                    }
                });
            }
        });
        }catch(error){
            res.status(400).send({message:"try again"});
        }
})

route.post('/cancel',authenticate,(req,res)=>{
    Parkspots.findOne({bookedby:req.body.user_id},(err,data)=>{
        if(err){
            res.status(500).send({error:"try again"});
        }else{
            if(data){
                let timeofbooking=data.bookedtime;
                Parkspots.updateOne({bookedby:req.body.user_id},{$set:{status:"0",bookedby:"",bookedtime:Date.now()}},(err,doc)=>{
                    if(err){
                        res.status(500).send({error:"try again"});
                    }else{      
                        let log=new history({
                            booked_by:req.body.user_id,
                            owner_id:data.owned_id,
                            cost:process.env.cost*costofpark(Date.now(),timeofbooking)
                        })
                        log.save();
                        res.send({message:`Cancelled the parking spot`});
                    }
                })
            }else{
                res.status(400).send({message:"You havent booked any parking space"});
            }
        }
    }); 
})

route.post('/near',authenticate,(req,res)=>{
        Parkspots.find({$or:[{status:0},{bookedby:req.body.user_id}],owned_id:{$ne:req.body.user_id},latitude:{$gt:(req.body.latitude-req.body.radius),$lt:(req.body.latitude+req.body.radius)},longitude:{$gt:(req.body.longitude-req.body.radius),$lt:(req.body.longitude+req.body.radius)}},(err,docs)=>{
            if(!err){
                console.log(docs);
                res.send(docs);
            }else{
                res.status(400).json({message:"No parking spots found near you"});
            }
         })
    })

module.exports=route;