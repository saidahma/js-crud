const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

router.get('/', queryController.getSavedQueries);
router.get('/stats', queryController.getStats);
router.delete('/:id', queryController.deleteSavedQuery);

module.exports = router;