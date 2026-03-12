const router=require("express").Router();
const {stats}=require("../controllers/dashboardController");

router.get("/stats",stats);

module.exports=router;