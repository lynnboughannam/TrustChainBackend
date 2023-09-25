const Production = require("../models/productionModel");
const Procurement = require("../models/procurmentModels")
const { handleCRUD } = require("./handleCRUD");

const mongoose = require("mongoose");
const { create, readAll, readById, update, remove } = handleCRUD(Production);

module.exports = { create, readAll, readById, update, remove };

