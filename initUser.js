// initUser.js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/credentials');

const User = require('./models/user.js');

var user = new User({
    username: 'admin',
    password: 'admin'
});

user.save((err) => {
    if(err) return console.log(err);
    console.log('save one user');
});

setTimeout(() => {
    mongoose.connection.close();
}, 2000);

