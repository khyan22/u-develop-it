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

//shows all candidates
db.query(`SELECT * FROM candidates`, (err, rows) => {
    //! uncomment
    // console.log(rows);
});

// shows A single candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    if (err) {
        console.log(err);
    }
    //! uncomment
    // console.log(row);
});

// create candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
                VALUES (?,?,?,?)`;
const params = [1,'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
    if (err) {
        console.log(err);
    }
    console.log(result);
});

//delete candidate, the '?' is a place holder 
db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
    if (err) {
        console.log(err);
    }
    //! uncomment
    // console.log(result);
});


// Default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});