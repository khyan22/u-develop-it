const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// Default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});