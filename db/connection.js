const mysql = require('mysql2');

//connects to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // personal mysql user
        user: 'root',
        //personal mysql password
        password: 'password',
        database: 'election'
    },
    console.log('Connection to election database established.')
);

module.exports = db