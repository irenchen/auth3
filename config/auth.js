// config/auth.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

async function fetchUser(id) {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, user) => {
            if(err) return reject(err);
            if(!user) return reject(new Error('not found'));
            resolve(user);
        });
    });
}

module.exports = function(passport) {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            var user = await fetchUser(id);
            done(null, user);
        } catch(e) {
            done(err);
        }
        // User.findById(id, (err, user) => done(err, user));
    });
    passport.use(new LocalStrategy(function(username, password, done) {
        User.authenticate(username, password, (err, user, info) => {
            done(err, user, err ? { messsage: info.message } : null);
        });
    }));
    
}


