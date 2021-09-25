const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    style: {
        type: String
    },
    measurements: {
        type: Object
    },
    status: {
        type: String,
        enum: ["pending", "delivered","returned"],
        default: "pending"
    },
    paymentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    },
    dueDelivery: Date,
    deliveryDate: Date,
    deliveryLocation: String,
},
{
    timestamps: true
});


const Order = mongoose.model('Order', orderSchema);
module.exports = Order