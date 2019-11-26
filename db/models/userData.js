var mongoose = require('mongoose');
var userAuthSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        unique: true,
        minLength: 1,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});
var userAuth = mongoose.model('userData', userAuthSchema);
module.exports = userAuth;