const Exports = require("../models/exportModels");
const User = require("../models/userModels");

const { handleCRUD } = require("./handleCRUD");

const { create, readAll, readById, update, remove } = handleCRUD(Exports);

module.exports = { create, readAll, readById, update, remove };