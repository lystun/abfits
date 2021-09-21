const mongoose = require('mongoose');

const styleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    description: {
        type: String,
    }
});

//populate the records in foreign models
styleSchema.pre(/find/, function(next){
    this.populate({
        path: 'category',
    });

    next();
});

const Style = mongoose.model('Style', styleSchema);
module.exports = Style