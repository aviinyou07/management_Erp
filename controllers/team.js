const Team = require("../models/Team");
const TeamMember = require("../models/TeamMember");

exports.createTeam = async (req,res)=>{
  try{

    const {teamName,projectName,leaderId} = req.body;
   
     if(req.role !== "admin"){
      return res.status(403).json({
        message:"Only admin "
      });
    }    
    const team = await Team.create({
      teamName,
      projectName,
      leaderId
    });

    await TeamMember.create({
      teamId:team.id,
      userId:leaderId,
      role:"leader"
    });

    res.json({
      message:"Team created",
      team
    });

  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.addMember = async (req,res)=>{
  try{

    const {teamId,userId} = req.body;
    const currentUser = req.userId;

    const team = await Team.findByPk(teamId);

    if(!team) return res.status(404).json({message:"Team not found"});

    if(req.role !== "admin" && team.leaderId !== currentUser){
      return res.status(403).json({
        message:"Only leader or admin can add members"
      });
    }

    const member = await TeamMember.create({
      teamId,
      userId,
      role:"member",
      by:req.role === "admin" ? "admin" : "leader"
    });

    res.json({
      message:"Member added",
      member
    });

  }catch(err){
    console.log(err);
    res.status(500).json({message:err.message});
  }
};