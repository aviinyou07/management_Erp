const router=require("express").Router();
const task=require("../controllers/taskController");

router.get("/",task.getTasks);
router.get("/:id",task.getTask);
router.post("/",task.createTask);
router.put("/:id",task.updateTask);
router.delete("/:id",task.deleteTask);
router.put("/bulk/update",task.bulkUpdate);

module.exports=router;