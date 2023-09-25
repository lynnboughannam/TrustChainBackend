const mongoose = require('mongoose');

const productExportSchema = new mongoose.Schema({
    packaging: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Production"
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalCost: {
        type: Number,
        required: true,
        min: 1
    },
    // exportDate: {
    //     type: Date,
    //     required: true
    // },
    country: {
        type: String,
        required: true,
    },
    countryId: {
        type: String,
        required: true,
    },
    exportType: {
        type: String,
        required: true,
    }
},
    { timestamps: true });

module.exports = mongoose.model('Export', productExportSchema);
