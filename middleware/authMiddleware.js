const jwt=require("jsonwebtoken");

exports.verifyToken=(req,res,next)=>{

const token=req.headers.authorization;

if(!token) return res.status(401).json("Access Denied");

try{

const verified=jwt.verify(token,"secret");

req.user=verified;

next();

}catch(err){

res.status(400).json("Invalid Token");

}

}