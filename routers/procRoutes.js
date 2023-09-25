const express = require("express");
const router = express.Router();

const procController = require("../controllers/procurementController");

router.post("/addProduct", procController.create);

router.patch("/:id/updateProduct", procController.update);
router.delete("/:id/deleteProduct", procController.remove);

router.get("/:id/getbyId", procController.readById);
router.get("/getAll", procController.readAll);


module.exports = router;
