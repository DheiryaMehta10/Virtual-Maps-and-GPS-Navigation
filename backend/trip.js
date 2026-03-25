const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Local or Atlas)
mongoose.connect('mongodb://localhost:27017/gps_navigator')
    .then(() => console.log("Connected to MongoDB 🚀"))
    .catch(err => console.error("Connection error:", err));

// 2. Define the Trip Schema
const TripSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    deviceName: String,
    totalDistance: Number,
    avgSpeed: Number,
    // Store the Leaflet polyline points
    path: [{
        lat: Number,
        lng: Number
    }],
    metrics: {
        maxSpeed: Number,
        avgAccuracy: Number
    }
});

const Trip = mongoose.model('Trip', TripSchema);

// 3. API Route: Save a Live Session
app.post('/api/trips/save', async (req, res) => {
    try {
        const newTrip = new Trip(req.body);
        await newTrip.save();
        res.status(201).json({ message: "Trip archived in Database", id: newTrip._id });
    } catch (err) {
        res.status(500).json({ error: "Failed to save trip data" });
    }
});

// 4. API Route: Fetch History for the UI
app.get('/api/trips/history', async (req, res) => {
    const trips = await Trip.find().sort({ timestamp: -1 });
    res.json(trips);
});

app.listen(3000, () => console.log("Backend listening on port 3000"));
