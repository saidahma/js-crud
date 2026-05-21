// routes/index.js

const express = require('express');
const router = express.Router();
const userRoutes = require('./users');

// User route'larini ulash
router.use('/users', userRoutes);
router.use('/api/users', userRoutes); // Ikkala yo'l bilan ham ishlaydi

// Home route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "User API ishga tushdi",
    endpoints: {
      "GET /users": "Barcha userlar",
      "GET /users?name=Ali": "Filter user",
      "GET /users/:id": "ID bo'yicha user",
      "POST /users": "Yangi user yaratish",
      "PUT /users/:id": "Userni to'liq yangilash",
      "PATCH /users/:id": "Userni qisman yangilash",
      "DELETE /users/:id": "Userni o'chirish",
      "PUT /users/name/:name": "Name bo'yicha yangilash",
      "DELETE /users/name/:name": "Name bo'yicha o'chirish"
    }
  });
});

// About route
router.get('/about', (req, res) => {
  res.json({ 
    success: true, 
    message: "User API v1.0.0",
    description: "Full CRUD operations with Express"
  });
});

module.exports = router;