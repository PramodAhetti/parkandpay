const express=require('express')
const morgan=require('morgan');
const dotenv=require('dotenv').config()
const bodyparser=require('body-parser')
const cookieparser=require('cookie-parser')
let port=process.env.PORT||5000
const app=express();
app.use(cookieparser())
const use=1;
app.use(morgan('dev'));
const mongoose=require('mongoose')
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_DB,()=>{
    console.log("connected to db")
})
app.get('/home',(req,res)=>{
    res.send({home:"hi from backend"});
})
app.use(bodyparser.json())
app.use('/user',require('./routes/user/user'))

app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})