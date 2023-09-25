const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
    productName: {
        type: mongoose.Schema.Types.String,
        ref: 'Procurement'
    },
    quantity: {
        type: mongoose.Schema.Types.Number,
        ref: 'Procurement'
    },
    section: {
        type: Number,
        required: true,

    },
    category: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    usage: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 100
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },

},
    { timestamps: true }
);


module.exports = mongoose.model("Warehouse", warehouseSchema);