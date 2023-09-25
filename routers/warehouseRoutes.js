const express = require("express");
const router = express.Router();

const wareHouseController = require("../controllers/warehouseController");

router.post("/addProduct", wareHouseController.addProductName, wareHouseController.create);

router.patch("/:id/updateProduct", wareHouseController.update);
router.delete("/:id/deleteProduct", wareHouseController.remove);

router.get("/:id/getbyId", wareHouseController.readById);
router.get("/getAll", wareHouseController.readAll);


module.exports = router;
