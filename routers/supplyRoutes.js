const express = require("express");
const router = express.Router();

const supplyController = require("../controllers/supplyController");

router.post("/addProduct", supplyController.create);

router.patch("/:id/updateProduct", supplyController.update);
router.delete("/:id/deleteProduct", supplyController.remove);

router.get("/:id/getbyId", supplyController.readById);
router.get("/getAll", supplyController.readAll);


module.exports = router;
