const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({

    packaging: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    procurement: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Procurement' // Reference to the Procurement model
    }],
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 2000
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitCost: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true,
    },
},
    { timestamps: true }
);


module.exports = mongoose.model('Production', productionSchema);

