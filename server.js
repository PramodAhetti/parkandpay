const express=require('express')
const dotenv=require('dotenv').config()
const bodyparser=require('body-parser')
const cookieparser=require('cookie-parser')
let port=process.env.PORT||5000
const app=express();
app.use(cookieparser())
const use=1;

const mongoose=require('mongoose')
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_DB,()=>{
    console.log("connected to db")
})
app.use(bodyparser.json())
app.use('/user',require('./routes/user/user'))
app.use('/seller',require('./routes/seller/seller'))

app.get('/home',(req,res)=>{
     res.send({"message":"testing"});
})
app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})