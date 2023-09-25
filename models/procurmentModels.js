const mongoose = require('mongoose');

const procurementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    description: {
        type: String,
        //required: true,
        minlength: 10,
        maxlength: 2000
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    supplier: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    status: {
        type: String,
        required: true,
        //  enum: ['Pending', 'Ordered', 'Received', 'Cancelled']
    },
    dateRequested: {
        type: Date,
        default: Date.now
    },
    // createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true,
    // },
    dateOrdered: {
        type: Date
    },
    dateReceived: {
        type: Date
    }
},
    { timestamps: true }
);



module.exports = mongoose.model('Procurement', procurementSchema);;
