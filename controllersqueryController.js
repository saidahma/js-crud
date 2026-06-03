const db = require('../config/database');

const getSavedQueries = (req, res) => {
    db.all(`SELECT * FROM saved_queries ORDER BY search_time DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const getStats = (req, res) => {
    db.all(`
        SELECT query_name, COUNT(*) as search_count, MAX(search_time) as last_searched
        FROM saved_queries
        GROUP BY query_name
        ORDER BY search_count DESC
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const deleteSavedQuery = (req, res) => {
    db.run(`DELETE FROM saved_queries WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Query log not found" });
        res.json({ message: "Search log cleared" });
    });
};

module.exports = { getSavedQueries, getStats, deleteSavedQuery };