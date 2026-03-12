const db=require("../config/db");

exports.getProjects=(req,res)=>{

db.query("SELECT * FROM projects",(err,data)=>{

res.json(data);

});

}

exports.createProject=(req,res)=>{

const {project_name,description}=req.body;

db.query(
"INSERT INTO projects(project_name,description) VALUES (?,?)",
[project_name,description],
(err)=>{

res.json("Project Created");

});

}

exports.updateProject=(req,res)=>{

const {id}=req.params;

const {project_name}=req.body;

db.query(
"UPDATE projects SET project_name=? WHERE id=?",
[project_name,id],
(err)=>{

res.json("Project Updated");

});

}

exports.deleteProject=(req,res)=>{

const {id}=req.params;

db.query("DELETE FROM projects WHERE id=?",[id]);

res.json("Project Deleted");

}