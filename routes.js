// controllers/userController.js

// Ma'lumotlar ombori (database o'rniga)
let users = [
  { id: 1, name: "Ali", age: 25, email: "ali@example.com" },
  { id: 2, name: "Vali", age: 30, email: "vali@example.com" },
  { id: 3, name: "Hasan", age: 28, email: "hasan@example.com" }
];

let nextId = 4;

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
      message: `User ${name} successfully created`,
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
        message: `Found ${result.length} user(s)`,
        users: result
      });
    }
  });
}

// 3. READ by ID - ID bo'yicha user olish
function getUserById(id) {
  return new Promise((resolve, reject) => {
    const user = users.find(u => u.id === id);
    
    if (user) {
      resolve({ success: true, user });
    } else {
      reject({ success: false, message: `User with ID ${id} not found` });
    }
  });
}

// 4. UPDATE - Userni yangilash (name bo'yicha)
function updateUserByName(name, newName, newAge, newEmail) {
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

// 5. UPDATE by ID - ID bo'yicha user yangilash
function updateUserById(id, name, age, email) {
  return new Promise((resolve, reject) => {
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      reject({ success: false, message: `User with ID ${id} not found` });
      return;
    }
    
    if (name && name !== users[userIndex].name) {
      const existingUser = users.find(u => 
        u.name.toLowerCase() === name.toLowerCase() && u.id !== id
      );
      
      if (existingUser) {
        reject({
          success: false,
          message: `User ${name} allaqachon mavjud!`
        });
        return;
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
    
    resolve({
      success: true,
      message: `User with ID ${id} successfully updated`,
      user: updatedUser
    });
  });
}

// 6. DELETE - Userni o'chirish (name bo'yicha)
function deleteUserByName(name) {
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

// 7. DELETE by ID - ID bo'yicha user o'chirish
function deleteUserById(id) {
  return new Promise((resolve, reject) => {
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      reject({ success: false, message: `User with ID ${id} not found` });
      return;
    }
    
    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    
    resolve({
      success: true,
      message: `User with ID ${id} successfully deleted`,
      deletedUser: deletedUser
    });
  });
}

// 8. PATCH - Qisman yangilash
function patchUserById(id, updates) {
  return new Promise((resolve, reject) => {
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      reject({ success: false, message: `User with ID ${id} not found` });
      return;
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    resolve({
      success: true,
      message: `User with ID ${id} partially updated`,
      user: updatedUser
    });
  });
}

module.exports = {
  users,
  createUser,
  getUsers,
  getUserById,
  updateUserByName,
  updateUserById,
  deleteUserByName,
  deleteUserById,
  patchUserById
};