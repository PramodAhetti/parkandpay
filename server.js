const express=require('express')
const dotenv=require('dotenv').config()
const bodyparser=require('body-parser')
let port=process.env.PORT||5000
const app=express();

const mongoose=require('mongoose')
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_DB,()=>{
    console.log("connected to db")
})

app.get('',(req,res)=>{
    res.send({message:'hello'})
})
app.use(bodyparser.json())
app.use('/user',require('./routes/user/user'))
app.use('/seller',require('./routes/seller/seller'))


app.listen(port,()=>{
    console.log(`server started at port ${port}`)
})