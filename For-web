const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const secretKey = 'your_secret_key'; // Change this to a strong secret key

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Helmet middleware for securing HTTP headers
app.use(helmet());

// CORS middleware for allowing cross-origin requests
app.use(cors());

// Sample array of users (replace with database integration)
const users = [];

// Route to register a new user
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username or email already exists
        const existingUser = users.find(user => user.username === username || user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password before storing
        const hashedPassword = await hashPassword(password);

        const newUser = { id: uuidv4(), username, email, password: hashedPassword };
        users.push(newUser);
        res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to login and generate JWT token
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Route to get user profile (protected route)
app.get('/profile', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// Function to hash the password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
