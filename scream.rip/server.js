const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dorsey83!',
    database: 'world'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const app = express();

let initialPath = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use(express.static(initialPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(initialPath, 'register.html'));
});

app.post('/register-user', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.json('Fill in all the fields');
    } else {
        db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
            (error, results) => {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        res.json('Email already exists');
                    } else {
                        console.error('Error registering user:', error);
                        res.json('An error occurred during registration');
                    }
                } else {
                    res.json({ name, email });
                }
            }
        );
    }
});

app.post('/login-user', (req, res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT email, name FROM users WHERE name = ? AND password = ?',
        [email, password],
        (error, results) => {
            if (error) {
                console.error('Error logging in:', error);
                res.json('An error occurred during login');
            } else if (results.length === 1) {
                res.json(results[0]);
            } else {
                res.json('Username or password is incorrect');
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Listening on port 3000......');
});