const db=require("../config/db");

exports.getTasks=(req,res)=>{

db.query("SELECT * FROM tasks",(err,data)=>{

res.json(data);

});

}

exports.getTask=(req,res)=>{

const {id}=req.params;

db.query(
"SELECT * FROM tasks WHERE id=?",
[id],
(err,data)=>{

res.json(data);

});

}

exports.createTask=(req,res)=>{

const {task_name,project_id,priority,status}=req.body;

db.query(
"INSERT INTO tasks(task_name,project_id,priority,status) VALUES (?,?,?,?)",
[task_name,project_id,priority,status],
(err)=>{

res.json("Task Created");

});

}

exports.updateTask=(req,res)=>{

const {id}=req.params;

const {task_name,priority,status}=req.body;

db.query(
"UPDATE tasks SET task_name=?,priority=?,status=? WHERE id=?",
[task_name,priority,status,id],
(err)=>{

res.json("Task Updated");

});

}

exports.deleteTask=(req,res)=>{

const {id}=req.params;

db.query("DELETE FROM tasks WHERE id=?",[id]);

res.json("Task Deleted");

}

exports.bulkUpdate=(req,res)=>{

const {ids,status}=req.body;

db.query(
`UPDATE tasks SET status='${status}' WHERE id IN (${ids})`
);

res.json("Bulk Updated");

}