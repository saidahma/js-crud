const express = require('express');
const app = express();

// Middleware - JSON body ni o'qish uchun
app.use(express.json());

// ==================== MA'LUMOTLAR OMbori ====================
let users = [
  { id: 1, name: "Ali", age: 25, email: "ali@example.com" },
  { id: 2, name: "Vali", age: 30, email: "vali@example.com" },
  { id: 3, name: "Hasan", age: 28, email: "hasan@example.com" }
];

let nextId = 4;

// ==================== FUNKSIYALAR ====================

// 1. CREATE - Yangi user yaratish
function createUser(name, age, email) {
  return new Promise((resolve, reject) => {
    if (!name || !age || !email) {
      reject({ success: false, message: "Name, age va email kerak!" });
      return;
    }
    
    const existingUser = users.find(u => 
      u.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingUser) {
      reject({ 
        success: false, 
        message: `User ${name} allaqachon mavjud! Boshqa ism tanlang.`
      });
      return;
    }
    
    const newUser = {
      id: nextId++,
      name: name,
      age: age,
      email: email,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    resolve({
      success: true,
      message: `User ${name} success created`,
      user: newUser
    });
  });
}

// 2. READ - Userlarni o'qish
function getUsers(filterName = null) {
  return new Promise((resolve) => {
    let result = users;
    
    if (filterName) {
      result = users.filter(user => 
        user.name.toLowerCase() === filterName.toLowerCase()
      );
    }
    
    if (result.length === 0) {
      resolve({
        success: false,
        message: `User ${filterName} not found`,
        users: []
      });
    } else {
      resolve({
        success: true,
        message: `Response ${result[0]?.name || filterName}`,
        users: result
      });
    }
  });
}

// 3. UPDATE - Userni yangilash
function updateUser(name, newName, newAge, newEmail) {
  return new Promise((resolve, reject) => {
    const userIndex = users.findIndex(u => 
      u.name.toLowerCase() === name.toLowerCase()
    );
    
    if (userIndex === -1) {
      reject({
        success: false,
        message: `User ${name} not found`
      });
      return;
    }
    
    if (newName && newName.toLowerCase() !== name.toLowerCase()) {
      const existingUser = users.find(u => 
        u.name.toLowerCase() === newName.toLowerCase()
      );
      
      if (existingUser) {
        reject({
          success: false,
          message: `User ${newName} allaqachon mavjud! Boshqa ism tanlang.`
        });
        return;
      }
    }
    
    const updatedUser = {
      ...users[userIndex],
      name: newName || users[userIndex].name,
      age: newAge !== undefined ? newAge : users[userIndex].age,
      email: newEmail || users[userIndex].email,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    resolve({
      success: true,
      message: `User ${name} successfully updated to ${updatedUser.name}`,
      user: updatedUser
    });
  });
}

// 4. DELETE - Userni o'chirish
function deleteUser(name) {
  return new Promise((resolve, reject) => {
    const userIndex = users.findIndex(u => 
      u.name.toLowerCase() === name.toLowerCase()
    );
    
    if (userIndex === -1) {
      reject({
        success: false,
        message: `User ${name} not found`
      });
      return;
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    resolve({
      success: true,
      message: `User ${name} successfully deleted`,
      deletedUser: deletedUser
    });
  });
}

// ==================== EXPRESS ROUTING ====================

// 1. GET /users - Barcha userlarni olish yoki filter
app.get('/users', async (req, res) => {
  const name = req.query.name;
  const result = await getUsers(name);
  res.status(result.success ? 200 : 404).json(result);
});

// 2. GET /users/:id - ID bo'yicha user olish
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: `User with ID ${id} not found` });
  }
});

// 3. POST /users - Yangi user yaratish
app.post('/users', async (req, res) => {
  try {
    const { name, age, email } = req.body;
    
    if (!name || !age || !email) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, age va email kerak!" 
      });
    }
    
    const result = await createUser(name, age, email);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
});

// 4. PUT /users/:id - ID bo'yicha user yangilash
app.put('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, age, email } = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: `User with ID ${id} not found` 
      });
    }
    
    // Name uniqligini tekshirish
    if (name && name !== users[userIndex].name) {
      const existingUser = users.find(u => 
        u.name.toLowerCase() === name.toLowerCase() && u.id !== id
      );
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: `User ${name} allaqachon mavjud!`
        });
      }
    }
    
    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      age: age !== undefined ? age : users[userIndex].age,
      email: email || users[userIndex].email,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    res.json({
      success: true,
      message: `User with ID ${id} successfully updated`,
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. DELETE /users/:id - ID bo'yicha user o'chirish
app.delete('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: `User with ID ${id} not found` 
      });
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    res.json({
      success: true,
      message: `User with ID ${id} successfully deleted`,
      deletedUser: deletedUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 6. PATCH /users/:id - Qisman yangilash
app.patch('/users/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: `User with ID ${id} not found` 
      });
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    res.json({
      success: true,
      message: `User with ID ${id} partially updated`,
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ==================== ROUTE AYRATISH (Alohida faylga o'tkazish uchun) ====================

// usersRouter - alohida router
const usersRouter = express.Router();

// Router ichidagi barcha route'lar
usersRouter.route('/')
  .get(async (req, res) => {
    const result = await getUsers(req.query.name);
    res.status(result.success ? 200 : 404).json(result);
  })
  .post(async (req, res) => {
    try {
      const { name, age, email } = req.body;
      const result = await createUser(name, age, email);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json(err);
    }
  });

usersRouter.route('/:id')
  .get(async (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    user ? res.json({ success: true, user }) 
         : res.status(404).json({ success: false, message: `User ${id} not found` });
  })
  .put(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, age, email } = req.body;
      
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: `User ${id} not found` });
      }
      
      const updatedUser = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        age: age !== undefined ? age : users[userIndex].age,
        email: email || users[userIndex].email,
        updatedAt: new Date().toISOString()
      };
      
      users[userIndex] = updatedUser;
      res.json({ success: true, user: updatedUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: `User ${id} not found` });
      }
      
      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);
      res.json({ success: true, deletedUser });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

// Router ni ishlatish
app.use('/api/users', usersRouter);

// ==================== BOSHQA ROUTELAR ====================

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "User API ishga tushdi",
    endpoints: {
      "GET /users": "Barcha userlar",
      "GET /users?name=Ali": "Filter user",
      "GET /users/:id": "ID bo'yicha user",
      "POST /users": "Yangi user yaratish",
      "PUT /users/:id": "Userni yangilash",
      "PATCH /users/:id": "Qisman yangilash",
      "DELETE /users/:id": "Userni o'chirish"
    }
  });
});

// About route
app.get('/about', (req, res) => {
  res.json({ success: true, message: "User API v1.0.0" });
});

// 404 - Route topilmadi
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

// ==================== SERVERNI ISHGA TUSHIRISH ====================
const PORT = 9998;
app.listen(PORT, () => {
  console.log("🚀 Express Server running on http://localhost:" + PORT);
  console.log("\n📋 API TEST QILISH:");
  console.log("   GET    /users");
  console.log("   GET    /users?name=Ali");
  console.log("   GET    /users/1");
  console.log("   POST   /users");
  console.log("   PUT    /users/1");
  console.log("   PATCH  /users/1");
  console.log("   DELETE /users/1");
  console.log("   GET    /api/users (Router bilan)");
  console.log("\n📝 BODY FORMATLARI:");
  console.log("   POST: {\"name\":\"Anvar\",\"age\":22,\"email\":\"anvar@ex .com\"}");
  console.log("   PUT:  {\"name\":\"Alisher\",\"age\":26,\"email\":\"alisher@ex.com\"}");
  console.log("\n✅ UNIQLIK TEKSHIRUVLI");
  console.log("\n");
});