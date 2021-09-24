const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderDetails: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "delivered","returned"]
    },
    amount: String,
    paymentId: String,
    dueDelivery: String,
    deliveryDate: Date,
    deliveryLocation: String,
},
{
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order