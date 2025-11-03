import  Express  from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SCRET } from "./config";
import { middleware } from "./middleware";
const app = Express();

app.post("/signup",(req,res)=>{
//    db call
 res.json({
    userId:"123"
 })
})
app.post("/signin",(req,res)=>{
const userId=1
  const token=  jwt.sign({
        userId

    },JWT_SCRET)
    res.json({
        token
    })
})
app.post("/room",middleware,(req,res)=>{
// db-call

 res.json({
  roomId:"123"
 })
})

app.listen(3001);