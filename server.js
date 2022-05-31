const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//calls in api routes from other folders
app.use('/api', apiRoutes)

// Default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})