const db=require("../config/db");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

exports.register=(req,res)=>{

const {name,email,password}=req.body;

const hash=bcrypt.hashSync(password,10);

db.query(
"INSERT INTO users(name,email,password) VALUES (?,?,?)",
[name,email,hash],
(err,result)=>{

if(err) return res.json(err);

res.json("User Registered");

});

}

exports.login=(req,res)=>{

const {email,password}=req.body;

db.query(
"SELECT * FROM users WHERE email=?",
[email],
(err,data)=>{

if(data.length===0)
return res.json("User not found");

const valid=bcrypt.compareSync(password,data[0].password);

if(!valid) return res.json("Wrong password");

const token=jwt.sign({id:data[0].id},"secret");

res.json({token});

});

}