const router=require("express").Router();
const project=require("../controllers/projectController");

router.get("/",project.getProjects);
router.post("/",project.createProject);
router.put("/:id",project.updateProject);
router.delete("/:id",project.deleteProject);

module.exports=router;