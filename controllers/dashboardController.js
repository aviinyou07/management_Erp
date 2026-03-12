const db=require("../config/db");

exports.stats=(req,res)=>{

let stats={};

db.query("SELECT COUNT(*) as total FROM tasks",(err,data)=>{

stats.total=data[0].total;

db.query(
"SELECT COUNT(*) as pending FROM tasks WHERE status='To Do'",
(e,d)=>{

stats.pending=d[0].pending;

db.query(
"SELECT COUNT(*) as progress FROM tasks WHERE status='In Progress'",
(e2,d2)=>{

stats.inProgress=d2[0].progress;

db.query(
"SELECT COUNT(*) as completed FROM tasks WHERE status='Completed'",
(e3,d3)=>{

stats.completed=d3[0].completed;

res.json(stats);

});

});

});

});

}