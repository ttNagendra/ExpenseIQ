const express = require('express');
const router = express.Router();
const {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getMonthlySummary,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Summary must come before /:id to avoid route conflict
router.get('/summary', getMonthlySummary);

router.route('/').get(getTransactions).post(addTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
