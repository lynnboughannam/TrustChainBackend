const Warehouse = require("../models/warehouseModel");
const Procurement = require("../models/procurmentModels");
const { handleCRUD } = require("./handleCRUD");

const addProductName = async (req, res, next) => {
    try {
        const procurement = await Procurement.findOne({ productName: req.body.productName, });

        if (!procurement) {
            return res.status(404).json({ message: "Product not found" });
        }
        Warehouse.productName = req.body.productName;
        Warehouse.quantity = req.body.quantity;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const { create, readAll, readById, update, remove } = handleCRUD(Warehouse);

module.exports = {

    addProductName,
    create,
    readAll,
    readById,
    update,
    remove,
};
