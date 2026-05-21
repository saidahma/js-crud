// routes/users.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ==================== ROUTES ====================

// 1. GET /users - Barcha userlar yoki filter
router.get('/', async (req, res) => {
  const name = req.query.name;
  const result = await userController.getUsers(name);
  res.status(result.success ? 200 : 404).json(result);
});

// 2. GET /users/:id - ID bo'yicha user
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.getUserById(id);
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

// 3. POST /users - Yangi user yaratish
router.post('/', async (req, res) => {
  try {
    const { name, age, email } = req.body;
    
    if (!name || !age || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, age va email kerak!" 
      });
    }
    
    const result = await userController.createUser(name, age, email);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 4. PUT /users/:id - ID bo'yicha to'liq yangilash
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, age, email } = req.body;
    
    const result = await userController.updateUserById(id, name, age, email);
    res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 5. PATCH /users/:id - Qisman yangilash
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const result = await userController.patchUserById(id, updates);
    res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 6. DELETE /users/:id - ID bo'yicha o'chirish
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.deleteUserById(id);
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

// ==================== ALTERNATIVE ROUTES (name bo'yicha) ====================

// PUT /users/name/:name - Name bo'yicha yangilash
router.put('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { newName, age, email } = req.body;
    
    const result = await userController.updateUserByName(name, newName, age, email);
    res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE /users/name/:name - Name bo'yicha o'chirish
router.delete('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await userController.deleteUserByName(name);
    res.json(result);
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;