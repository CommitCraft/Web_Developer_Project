const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'movie_booking'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Create Tables
db.query(`
    CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100),
        PhoneNumber VARCHAR(15) UNIQUE
    );
`);
db.query(`
    CREATE TABLE IF NOT EXISTS Movies (
        MovieID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100),
        Price DECIMAL(5,2)
    );
`);
db.query(`
    CREATE TABLE IF NOT EXISTS Bookings (
        BookingID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT,
        MovieID INT,
        Seats VARCHAR(255),
        FOREIGN KEY (UserID) REFERENCES Users(UserID),
        FOREIGN KEY (MovieID) REFERENCES Movies(MovieID)
    );
`);

// Seed Movies
db.query(`
    INSERT IGNORE INTO Movies (Name, Price) VALUES
    ('The Big Lebowski', 10),
    ('Fargo', 12),
    ('O Brother', 8),
    ('No Country for Old Men', 9);
`);

// Register or Login User
app.post('/user', (req, res) => {
    const { name, phoneNumber } = req.body;
    const query = `
        INSERT INTO Users (Name, PhoneNumber) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE Name = ?;
    `;
    db.query(query, [name, phoneNumber, name], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send({ message: 'Internal Server Error' });
        } else {
            // If user already exists, retrieve their UserID
            if (result.insertId === 0 || result.affectedRows > 1) {
                const selectQuery = 'SELECT UserID FROM Users WHERE PhoneNumber = ?';
                db.query(selectQuery, [phoneNumber], (err, rows) => {
                    if (err) {
                        console.error('Database error:', err);
                        res.status(500).send({ message: 'Internal Server Error' });
                    } else {
                        res.send({ message: 'User registered or logged in.', userID: rows[0].UserID });
                    }
                });
            } else {
                res.send({ message: 'User registered or logged in.', userID: result.insertId });
            }
        }
    });
});

// Fetch Movies
app.get('/movies', (req, res) => {
    const query = 'SELECT * FROM Movies';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// Fetch Booked Seats
app.get('/booked-seats/:movieID', (req, res) => {
    const { movieID } = req.params;
    const query = `
        SELECT Seats FROM Bookings WHERE MovieID = ?;
    `;
    db.query(query, [movieID], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const bookedSeats = results
                .map(row => row.Seats.split(',').map(Number))
                .flat();
            res.send(bookedSeats);
        }
    });
});

// Book Seats
app.post('/book', (req, res) => {
    const { userID, movieID, seats } = req.body;
    const query = `
        INSERT INTO Bookings (UserID, MovieID, Seats) 
        VALUES (?, ?, ?);
    `;
    db.query(query, [userID, movieID, seats.join(',')], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Booking successful.', bookingID: result.insertId });
    });
});

// Start Server
app.listen(3002, () => console.log('Server running on port 3002...'));
