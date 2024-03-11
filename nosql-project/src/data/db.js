// db.js
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'example',
    database: 'user',
});

module.exports = pool;
