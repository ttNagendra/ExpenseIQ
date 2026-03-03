const Transaction = require('../models/Transaction');

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
const addTransaction = async (req, res, next) => {
    try {
        const { type, category, amount, description, date } = req.body;

        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            category,
            amount,
            description,
            date: date || Date.now(),
        });

        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all transactions for the logged-in user (with filters & pagination)
 * @route   GET /api/transactions
 * @access  Private
 *
 * Query params:
 *   - type       : "income" | "expense"
 *   - category   : string
 *   - startDate  : ISO date string
 *   - endDate    : ISO date string
 *   - search     : search in description
 *   - page       : page number (default 1)
 *   - limit      : items per page (default 10)
 *   - sort       : sort field (default "-date")
 */
const getTransactions = async (req, res, next) => {
    try {
        const {
            type,
            category,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10,
            sort = '-date',
        } = req.query;

        // Build filter — always scoped to the authenticated user
        const filter = { userId: req.user._id };

        if (type) filter.type = type;
        if (category) filter.category = { $regex: category, $options: 'i' };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        if (search) {
            filter.description = { $regex: search, $options: 'i' };
        }

        // Pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const [transactions, total] = await Promise.all([
            Transaction.find(filter).sort(sort).skip(skip).limit(limitNum),
            Transaction.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/transactions/:id
 * @access  Private (owner only)
 */
const updateTransaction = async (req, res, next) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        // Ensure user owns this transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this transaction',
            });
        }

        transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private (owner only)
 */
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found',
            });
        }

        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this transaction',
            });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get monthly summary (aggregated income/expense per month)
 * @route   GET /api/transactions/summary
 * @access  Private
 *
 * Query params:
 *   - year : number (defaults to current year)
 */
const getMonthlySummary = async (req, res, next) => {
    try {
        const year = parseInt(req.query.year, 10) || new Date().getFullYear();

        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        type: '$type',
                    },
                    total: { $sum: '$amount' },
                },
            },
            {
                $group: {
                    _id: '$_id.month',
                    income: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
                        },
                    },
                    expense: {
                        $sum: {
                            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
                        },
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Also get category breakdown for current filters
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
                    },
                },
            },
            {
                $group: {
                    _id: { category: '$category', type: '$type' },
                    total: { $sum: '$amount' },
                },
            },
            { $sort: { total: -1 } },
        ]);

        // Compute totals
        const totals = await Transaction.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const totalIncome =
            totals.find((t) => t._id === 'income')?.total || 0;
        const totalExpense =
            totals.find((t) => t._id === 'expense')?.total || 0;

        res.status(200).json({
            success: true,
            data: {
                year,
                monthly: summary,
                categoryBreakdown,
                totalIncome,
                totalExpense,
                balance: totalIncome - totalExpense,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getMonthlySummary,
};
