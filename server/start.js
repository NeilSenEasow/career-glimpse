const { spawn } = require('child_process');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User.js");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');

let pythonProcess = null;

const startFlask = () => {
    console.log('Starting Flask server...');
    pythonProcess = spawn('venv\\Scripts\\python.exe', ['app.py'], {
        cwd: path.join(__dirname),
        stdio: 'inherit'
    });

    pythonProcess.on('error', (err) => {
        console.error('Flask API Error:', err);
    });

    pythonProcess.on('exit', (code) => {
        console.log(`Flask API exited with code ${code}`);
        // If Flask exits, gracefully shut down the Express server.
        // process.exit();
    });
};

// Express server logic (consolidated from server.js)
const app = express();
const PORT = process.env.PORT || 5001;
const PYTHON_API_URL = 'http://localhost:5002';

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/profile', verifyToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected for authentication"))
    .catch(err => console.error("MongoDB connection error:", err));

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

passport.use(new LocalStrategy(
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: "User not found" });

            const isMatch = await user.verifyPassword(password);
            if (!isMatch) return done(null, false, { message: "Incorrect password" });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.post("/auth/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send("Login failed");

        const isMatch = await user.verifyPassword(password);
        if (!isMatch) return res.status(401).send("Login failed");

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        return next(err);
    }
});

app.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Error registering user" });
    }
});

app.get("/auth/user", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const user = await User.findById(req.user.id).select('username email');
            if (!user) {
                return res.status(404).send("User not found");
            }
            return res.json({ username: user.username, email: user.email });
        } catch (err) {
            return res.status(500).send("Error retrieving user data");
        }
    } else {
        return res.status(401).send("Unauthorized");
    }
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route handlers
app.post('/generate-question', async (req, res) => {
    try {
        console.log('Received request for question generation:', req.body);
        const response = await axios.post(`${PYTHON_API_URL}/generate-question`, {
            previousQA: req.body.previousQA || []
        });
        console.log('Response from Flask:', response.data);
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        res.json(response.data);
    } catch (error) {
        console.error('Error generating question:', error.message);
        console.error('Full error:', error);
        res.status(500).json({
            error: 'Failed to generate question',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.post('/analyze-answers', async (req, res) => {
    try {
        console.log('Received analysis request:', req.body);
        const response = await axios.post(
            `${PYTHON_API_URL}/analyze-answers`,
            req.body, { timeout: 25000 }
        );
        console.log('Analysis response received:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error analyzing answers:', {
            message: error.message,
            code: error.code,
            response: error.response?.data
        });
        const errorMessage = error.code === 'ECONNABORTED' ?
            'Analysis request timed out' :
            error.response?.data?.error || error.message;

        res.status(500).json({
            error: errorMessage,
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/api/test-api', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/test-api`);
        res.json(response.data);
    } catch (error) {
        console.error('Error testing API:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/list-models', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_API_URL}/list-models`);
        res.json(response.data);
    } catch (error) {
        console.error('Error listing models:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/web-search', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/web-search`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error performing web search:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/search-web-careers', async (req, res) => {
    try {
        const response = await axios.post(`${PYTHON_API_URL}/search-web-careers`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Error searching web careers:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'An unexpected error occurred',
        details: err.message,
        timestamp: new Date().toISOString()
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
    console.log(`Connecting to Flask API at ${PYTHON_API_URL}`);
});

// Start the Flask server
startFlask();

// Handle process termination
process.on('SIGINT', () => {
    console.log('\nReceived SIGINT. Shutting down servers...');
    if (pythonProcess) pythonProcess.kill();
    process.exit();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    if (pythonProcess) pythonProcess.kill();
    process.exit(1);
});

console.log('Starting servers...');