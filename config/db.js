// ./config/db.js
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1:27017/credentials');

const conn = mongoose.connection;

conn.on('error', console.log);
    
conn.on('open', () => {
    console.log('connected to mongodb://127.0.0.1:27017/credentials');
});

