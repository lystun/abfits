const mongoose = require('mongoose'); 
const validator = require('validator');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your full name." ]
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: [true, "Email already exists."],
        validate: [ validator.isEmail, 'Please provide a valid email.' ]
    },
    gender:{
        type: String,
        enum: ["male", "female"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        validate: {
            validator: (el) => validator.isStrongPassword(el),
            message: "Password must be have more than 8 characters, 1 Uppercase, 1 lowercase, 1 special character."
        },
    },
    confirmPassword: {
        type: String,
        required: [true, "Please enter password confirmation."],
        validate: {
            validator: function(el){
                return el === this.password
            },
            message: "Passwords do not match"
        }
    }
});

userSchema.pre('save', async function(next){
    this.confirmPassword = undefined;

    next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;