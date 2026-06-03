const db = require('../config/database');

// GET /users with pagination and advanced filtering
const getUsers = (req, res) => {
    const { name, minAge, maxAge, page = 1, limit = 10 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let query = `SELECT * FROM users WHERE 1=1`;
    let params = [];

    // Advanced Filtering
    if (name) {
        query += ` AND name LIKE ?`;
        params.push(`%${name}%`);

        // Log search query securely
        db.run(
            `INSERT INTO saved_queries (query_name, ip_address, user_agent) VALUES (?, ?, ?)`,
            [name, req.ip, req.headers['user-agent']]
        );
    }
    if (minAge) {
        query += ` AND age >= ?`;
        params.push(parseInt(minAge));
    }
    if (maxAge) {
        query += ` AND age <= ?`;
        params.push(parseInt(maxAge));
    }

    // Add Pagination parameters safely
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Get total count for pagination metadata
        db.get(`SELECT COUNT(*) as total FROM users`, [], (err, countRow) => {
            res.json({
                metadata: {
                    total_records: countRow ? countRow.total : 0,
                    page: parseInt(page),
                    limit: parseInt(limit)
                },
                data: rows
            });
        });
    });
};

const getUserById = (req, res) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "User not found" });
        res.json(row);
    });
};

const createUser = (req, res) => {
    const { name, age, email } = req.body;
    db.run(
        `INSERT INTO users (name, age, email) VALUES (?, ?, ?)`,
        [name, age, email],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, age, email });
        }
    );
};

const updateUser = (req, res) => {
    const { name, age, email } = req.body;
    const { id } = req.params;

    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "User not found" });

        db.run(
            `UPDATE users SET name = ?, age = ?, email = ? WHERE id = ?`,
            [name || row.name, age || row.age, email || row.email, id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "User updated successfully" });
            }
        );
    });
};

const deleteUser = (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };