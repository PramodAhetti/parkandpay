let express=require('express')
let route=express.Router();
let users=require('../../data/user/User')
let sellers=require('../../data/seller/Seller')
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
            jwt.sign({user_id:doc.id},process.env.JWT_SECRET_KEY,{expiresIn:'2h'},(err,token)=>{
                      if(err){
                        res.status(500).send({error:"try again"});
                      }else{
                        res.cookie("auth_token",token);
                        res.send({user:req.body.username})
                      }
            })
        }else{
            res.status(400).send({message:"user doesnt exists"})
        }
    })
})

route.post('/sell',authenticate,(req,res)=>{
    Parkspots.findOne({owned_id:req.body.user_id},(err,docs)=>{
        if(!docs){
           let newspot=new Parkspots({
            owned_id:req.body.user_id,
            latitude:req.body.latitude,
            longitude:req.body.longitude,
            phoneno:req.body.phoneno,
            bookedby:"null",
            bookedtime:Date.now(),
            status:0
           })
           newspot.save();
           res.send('saved parking spot');
        }else{
           res.send('Parking spot exists already');
        }
    });
})


route.post('/book',authenticate,(req,res)=>{
        Parkspots.findOne({owned_id:req.body.owned_id},(err,docs)=>{
            if(err){
                res.status(500).send({error:"try again"});
            }
            if(docs){
                if(docs.status==0){
                    Parkspots.updateOne({owned_id:req.body.owned_id},{$set:{status:"1",bookedby:req.body.user_id,bookedtime:Date.now()}},(err,doc)=>{
                        if(err){
                            res.status(500).send({error:"try again"});
                        }
                        res.send({message:"Booked the parking spot"})
                    }); 
                }else{
                    res.send({message:"This spot is already booked by someone "})
                }
            }else{
                res.send({message:"Enter correct owner_id"});
            }
        });
})

route.post('/cancel',authenticate,(req,res)=>{
    Parkspots.findOne({bookedby:req.body.user_id},(err,data)=>{
        if(err){
            res.status(500).send({error:"try again"});
        }else{
            if(data ){
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
                        res.send(`Cancelled the spot owned by ${data.owned_id} you have to pay `+process.env.cost*(costofpark(Date.now(),timeofbooking)));
                    }
                })
            }else{
                res.send({message:"You havent booked any parking space"});
            }
        }
    }); 
})

route.post('/near',authenticate,(req,res)=>{
        Parkspots.find({latitude:{$gt:(req.body.latitude-req.body.radius),$lt:(req.body.latitude+req.body.radius)},longitude:{$gt:(req.body.longitude-req.body.radius),$lt:(req.body.longitude+req.body.radius)}},(err,docs)=>{
            res.send(docs);
         })
    })

module.exports=route;