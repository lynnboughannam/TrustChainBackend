const Proc = require("../models/supplyModels");

const { handleCRUD } = require("./handleCRUD");
const { create, readAll, readById, update, remove } = handleCRUD(Proc);
module.exports = { create, readAll, readById, update, remove };