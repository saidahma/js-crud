const express = require('express');
const userRoutes = require('./routes/userRoutes');
const queryRoutes = require('./routes/queryRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/saved', queryRoutes);

// Root Index Status Endpoint
app.get('/', (req, res) => {
    res.json({
        message: "✅ Production-Ready CRM API Operational",
        version: "2.0.0",
        features: ["MVC Architecture", "Joi Validation", "Pagination", "SQL Injection Protection"]
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Secure Server running on http://localhost:${PORT}`);
});