// server.js

const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Route'larni ulash
const mainRoutes = require('./routes');
app.use('/', mainRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: "Serverda xatolik yuz berdi!",
    error: err.message 
  });
});

// Serverni ishga tushirish
const PORT = 9998;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 SERVER ISHGA TUSHDI!");
  console.log("=".repeat(50));
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}`);
  console.log("\n📋 TEST QILISH:");
  console.log(`   GET    http://localhost:${PORT}/users`);
  console.log(`   GET    http://localhost:${PORT}/users?name=Ali`);
  console.log(`   GET    http://localhost:${PORT}/users/1`);
  console.log(`   POST   http://localhost:${PORT}/users`);
  console.log(`   PUT    http://localhost:${PORT}/users/1`);
  console.log(`   PATCH  http://localhost:${PORT}/users/1`);
  console.log(`   DELETE http://localhost:${PORT}/users/1`);
  console.log(`   PUT    http://localhost:${PORT}/users/name/Ali`);
  console.log(`   DELETE http://localhost:${PORT}/users/name/Ali`);
  console.log("\n📝 BODY FORMATLARI:");
  console.log('   POST: {"name":"Anvar","age":22,"email":"anvar@ex.com"}');
  console.log('   PUT:  {"name":"Alisher","age":26,"email":"alisher@ex.com"}');
  console.log("\n✅ UNIQLIK TEKSHIRUVLI");
  console.log("=".repeat(50) + "\n");
});