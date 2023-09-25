const Proc = require("../models/procurmentModels");
const User = require("../models/userModels")
const { handleCRUD } = require("./handleCRUD");

const { create, readAll, readById, update, remove, checkAdmin } = handleCRUD(Proc);
module.exports = { create, readAll, readById, update, remove, checkAdmin };

