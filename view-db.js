// view-db.js

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./user_logs.db');

console.log('\n📊 SAVED QUERIES DATABASE\n');
console.log('='.repeat(50));

// ================= CREATE TABLE =================

db.run(`
    CREATE TABLE IF NOT EXISTS saved_queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query_name TEXT NOT NULL,
        search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address TEXT,
        user_agent TEXT
    )
`);

// ================= LOTS OF DATA =================

const fakeQueries = [

    ['Ali', '127.0.0.1', 'Chrome'],
    ['Vali', '192.168.0.1', 'Firefox'],
    ['Hasan', '10.0.0.1', 'Edge'],
    ['Husan', '172.16.0.1', 'Opera'],
    ['John', '8.8.8.8', 'Safari'],
    ['Mike', '1.1.1.1', 'Chrome'],
    ['Sarah', '192.168.1.5', 'Firefox'],
    ['Emma', '192.168.1.10', 'Edge'],
    ['Alex', '10.10.10.10', 'Chrome'],
    ['Tom', '127.0.0.2', 'Opera'],
    ['Bob', '172.20.0.1', 'Safari'],
    ['Alice', '192.168.50.1', 'Firefox'],
    ['Jack', '10.1.1.1', 'Chrome'],
    ['Rose', '192.168.100.1', 'Edge'],
    ['David', '172.30.0.1', 'Opera']

];

// ================= INSERT DATA =================

const insertQuery = `
    INSERT INTO saved_queries
    (query_name, ip_address, user_agent)
    VALUES (?, ?, ?)
`;

fakeQueries.forEach((item) => {

    db.run(insertQuery, item, function(err) {

        if (err) {

            console.error('❌ Insert error:', err.message);

        } else {

            console.log(`✅ Added ID ${this.lastID}`);

        }

    });

});

// ================= SHOW DATABASE =================

setTimeout(() => {

    db.all(
        `SELECT * FROM saved_queries ORDER BY search_time DESC`,
        [],
        (err, rows) => {

            if (err) {

                console.error('❌ Xato:', err.message);

            } else {

                console.table(rows);

                console.log(`\n✅ Jami: ${rows.length} ta query saqlangan\n`);

            }

            db.close();

        }
    );

}, 1000);