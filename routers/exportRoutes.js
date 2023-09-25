const express = require("express");
const router = express.Router();

const exportController = require("../controllers/exportsController");

router.post("/addProduct", exportController.create);

router.patch("/:id/updateProduct", exportController.update);
router.delete("/:id/deleteProduct", exportController.remove);

router.get("/:id/getbyId", exportController.readById);
router.get("/getAll", exportController.readAll);


module.exports = router;
