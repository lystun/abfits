const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    amount: String,
    type: String,
    paymentId: String,
},
{
    timestamps: true
});

paymentSchema.pre(/find/, async function(next){
    this.populate({
        path: 'user',
        select: "name email"
    })
})

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment