// ./models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Hash = require('password-hash'); // may use bcrypt too

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        set: function(newValue) {
            return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
        },
        required: true,
    },
});

userSchema.statics.authenticate = function(username, password, callback) {
    this.findOne({ username: username }, (err, user) => {
        if(err) return callback(err, null);
        if(!user) return callback(null, false, 'not found');
        if(user && Hash.verify(password, user.password)) {
            return callback(null, user);
        } else {
            // var error = new Error('incorrect, please try again');
            // return callback(error, null);
            return callback(null, false, 'incorrect password');
        }
    });
};

userSchema.methods.verifyPassword = function(password) {
    if(Hash.verify(password, this.password)) {
        return true;
    } else {
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);

