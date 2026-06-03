const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../usercrm.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Database error:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Create saved_queries table
        db.run(`
            CREATE TABLE IF NOT EXISTS saved_queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_name TEXT NOT NULL,
                search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                user_agent TEXT
            )
        `);

        // Create users table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER,
                email TEXT NOT NULL
            )
        `, (err) => {
            if (!err) migrateDataIfNeeded();
        });
    });
}

function migrateDataIfNeeded() {
    db.get('SELECT COUNT(*) AS total FROM users', [], (err, row) => {
        if (err) return console.error(err.message);

        if (row && row.total === 0) {
            console.log('⏳ Migrating initial array data to SQL...');
            const initialUsers = [
                { name: "Ali", age: 25, email: "ali@example.com" },
                { name: "Vali", age: 30, email: "vali@example.com" },
                { name: "Hasan", age: 28, email: "hasan@example.com" },
                { name: "Jamshid", age: 22, email: "jamshid4@example.com" },
                { name: "Dilshod", age: 27, email: "dilshod5@example.com" },
                { name: "Sardor", age: 31, email: "sardor6@example.com" },
                { name: "Aziz", age: 24, email: "aziz7@example.com" },
                { name: "Bekzod", age: 29, email: "bekzod8@example.com" },
                { name: "Islom", age: 26, email: "islom9@example.com" },
                { name: "Javlon", age: 23, email: "javlon10@example.com" }
                // ... Truncated for code brevity, add your other 70 users here
            ];

            db.serialize(() => {
                const stmt = db.prepare(`INSERT INTO users (name, age, email) VALUES (?, ?, ?)`);
                initialUsers.forEach(user => stmt.run([user.name, user.age, user.email]));
                stmt.finalize((err) => {
                    if (err) console.error('❌ Migration failed:', err.message);
                    else console.log('✅ Database populated successfully!');
                });
            });
        }
    });
}

module.exports = db;