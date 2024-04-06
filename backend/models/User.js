const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        maxlength: 20,
        minlength: 6,
        unique: true // neu co usernam roi thi bao loi
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    admin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);