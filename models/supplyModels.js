const mongoose = require('mongoose');
const supplySchema = new mongoose.Schema({
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    procurement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Procurement',
    }
    ,
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    },

    production: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Production'
    },
    export: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Export'
    },
    approval: {
        type: String,
        required: true,
        enum: ['Approved', 'Rejected']
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

},
    { timestamps: true }
);


module.exports = mongoose.model('Supply', supplySchema);;
