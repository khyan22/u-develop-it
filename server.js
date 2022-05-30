const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

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
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM  candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.statusMessage(400).json({ error: err.message });
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

// shows A single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM  candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id
                 WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.statusMessage(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

//delete candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    
    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// create candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    
    if (errors) {
        res.status(400).json({ error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            date: body
        });
    });
});


// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });


// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });


// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 VALUES (?,?,?,?)`;
// const params = [1,'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// , the '?' is a place holder 
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
    // console.log(result);
// });


// Default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});