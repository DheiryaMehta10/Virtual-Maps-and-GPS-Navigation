const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allows your HTML file to talk to this server
app.use(bodyParser.json());

// Mock Database (In a real app, use MongoDB or PostgreSQL)
let tripHistory = [];

/**
 * ROUTE: Save a completed trip
 */
app.post('/api/save-trip', (req, res) => {
    const { startTime, endTime, distance, coordinates } = req.body;
    
    if (!coordinates || coordinates.length === 0) {
        return res.status(400).json({ error: "No coordinates provided" });
    }

    const newTrip = {
        id: tripHistory.length + 1,
        startTime,
        endTime,
        distance,
        path: coordinates
    };

    tripHistory.push(newTrip);
    console.log(`Trip ${newTrip.id} saved successfully!`);
    res.status(201).json({ message: "Trip logged to cloud", tripId: newTrip.id });
});

/**
 * ROUTE: Get all previous trips
 */
app.get('/api/history', (req, res) => {
    res.json(tripHistory);
});

app.listen(PORT, () => {
    console.log(`🚀 Navigator Backend running at http://localhost:${PORT}`);
});
