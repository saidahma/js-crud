// controllers/userController.js

class UserController {
  // Constructor - class ishga tushganda birinchi ishlaydi
  constructor() {
    // Ma'lumotlar ombori (database o'rniga)
    this.users = [
      { id: 1, name: "Ali", age: 25, email: "ali@example.com" },
      { id: 2, name: "Vali", age: 30, email: "vali@example.com" },
      { id: 3, name: "Hasan", age: 28, email: "hasan@example.com" }
    ];
    this.nextId = 4;
  }

  // 1. CREATE - Yangi user yaratish
  async createUser(name, age, email) {
    return new Promise((resolve, reject) => {
      if (!name || !age || !email) {
        reject({ success: false, message: "Name, age va email kerak!" });
        return;
      }
      
      const existingUser = this.users.find(u => 
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
        id: this.nextId++,
        name: name,
        age: age,
        email: email,
        createdAt: new Date().toISOString()
      };
      
      this.users.push(newUser);
      
      resolve({
        success: true,
        message: `User ${name} successfully created`,
        user: newUser
      });
    });
  }

  // 2. READ - Userlarni o'qish
  async getUsers(filterName = null) {
    return new Promise((resolve) => {
      let result = this.users;
      
      if (filterName) {
        result = this.users.filter(user => 
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
  async getUserById(id) {
    return new Promise((resolve, reject) => {
      const user = this.users.find(u => u.id === id);
      
      if (user) {
        resolve({ success: true, user });
      } else {
        reject({ success: false, message: `User with ID ${id} not found` });
      }
    });
  }

  // 4. UPDATE - Userni yangilash (name bo'yicha)
  async updateUserByName(name, newName, newAge, newEmail) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex(u => 
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
        const existingUser = this.users.find(u => 
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
        ...this.users[userIndex],
        name: newName || this.users[userIndex].name,
        age: newAge !== undefined ? newAge : this.users[userIndex].age,
        email: newEmail || this.users[userIndex].email,
        updatedAt: new Date().toISOString()
      };
      
      this.users[userIndex] = updatedUser;
      
      resolve({
        success: true,
        message: `User ${name} successfully updated to ${updatedUser.name}`,
        user: updatedUser
      });
    });
  }

  // 5. UPDATE by ID - ID bo'yicha user yangilash
  async updateUserById(id, name, age, email) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        reject({ success: false, message: `User with ID ${id} not found` });
        return;
      }
      
      if (name && name !== this.users[userIndex].name) {
        const existingUser = this.users.find(u => 
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
        ...this.users[userIndex],
        name: name || this.users[userIndex].name,
        age: age !== undefined ? age : this.users[userIndex].age,
        email: email || this.users[userIndex].email,
        updatedAt: new Date().toISOString()
      };
      
      this.users[userIndex] = updatedUser;
      
      resolve({
        success: true,
        message: `User with ID ${id} successfully updated`,
        user: updatedUser
      });
    });
  }

  // 6. DELETE - Userni o'chirish (name bo'yicha)
  async deleteUserByName(name) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex(u => 
        u.name.toLowerCase() === name.toLowerCase()
      );
      
      if (userIndex === -1) {
        reject({
          success: false,
          message: `User ${name} not found`
        });
        return;
      }
      
      const deletedUser = this.users[userIndex];
      this.users.splice(userIndex, 1);
      
      resolve({
        success: true,
        message: `User ${name} successfully deleted`,
        deletedUser: deletedUser
      });
    });
  }

  // 7. DELETE by ID - ID bo'yicha user o'chirish
  async deleteUserById(id) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        reject({ success: false, message: `User with ID ${id} not found` });
        return;
      }
      
      const deletedUser = this.users[userIndex];
      this.users.splice(userIndex, 1);
      
      resolve({
        success: true,
        message: `User with ID ${id} successfully deleted`,
        deletedUser: deletedUser
      });
    });
  }

  // 8. PATCH - Qisman yangilash
  async patchUserById(id, updates) {
    return new Promise((resolve, reject) => {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        reject({ success: false, message: `User with ID ${id} not found` });
        return;
      }
      
      const updatedUser = {
        ...this.users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      this.users[userIndex] = updatedUser;
      
      resolve({
        success: true,
        message: `User with ID ${id} partially updated`,
        user: updatedUser
      });
    });
  }

  // 9. Qo'shimcha: Barcha userlarni olish (getter)
  getAllUsers() {
    return this.users;
  }

  // 10. Qo'shimcha: User sonini olish
  getUserCount() {
    return this.users.length;
  }
}

// Class ni export qilish
module.exports = UserController;