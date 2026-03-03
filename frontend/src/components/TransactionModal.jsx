import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const CATEGORIES = {
    income: ['Salary', 'Freelance', 'Investments', 'Business', 'Rental', 'Other'],
    expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Rent', 'Other'],
};

const TransactionModal = ({ isOpen, onClose, onSubmit, editData }) => {
    const [form, setForm] = useState({
        type: 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setForm({
                type: editData.type,
                category: editData.category,
                amount: editData.amount.toString(),
                description: editData.description || '',
                date: new Date(editData.date).toISOString().split('T')[0],
            });
        } else {
            setForm({
                type: 'expense',
                category: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    const validate = () => {
        const errs = {};
        if (!form.category) errs.category = 'Category is required';
        if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid amount';
        if (!form.date) errs.date = 'Date is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSubmit({ ...form, amount: parseFloat(form.amount) });
            onClose();
        } catch {
            // handled by parent
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal — 500px max-width */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative modal-centered rounded-2xl glass-card"
                        style={{ padding: 'var(--space-4)', boxShadow: '0 32px 64px rgba(0,0,0,0.2)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
                            <div>
                                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                                    {editData ? 'Edit Transaction' : 'New Transaction'}
                                </h2>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                                    {editData ? 'Update your transaction details' : 'Add a new income or expense'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl transition-all duration-200 hover:bg-[var(--bg-tertiary)]"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {/* Type toggle */}
                            <div className="flex rounded-xl p-1" style={{ background: 'var(--bg-tertiary)' }}>
                                {['income', 'expense'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm({ ...form, type: t, category: '' })}
                                        className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300"
                                        style={{
                                            background: form.type === t
                                                ? (t === 'income' ? 'var(--gradient-income)' : 'var(--gradient-danger)')
                                                : 'transparent',
                                            color: form.type === t ? '#fff' : 'var(--text-tertiary)',
                                            boxShadow: form.type === t ? 'var(--shadow-md)' : 'none',
                                        }}
                                    >
                                        {t === 'income' ? '↑ Income' : '↓ Expense'}
                                    </button>
                                ))}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES[form.type].map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-xs font-medium" style={{ color: 'var(--danger)', marginTop: '6px' }}>{errors.category}</p>
                                )}
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="input-field text-lg font-bold"
                                />
                                {errors.amount && (
                                    <p className="text-xs font-medium" style={{ color: 'var(--danger)', marginTop: '6px' }}>{errors.amount}</p>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>Description</label>
                                <input
                                    type="text"
                                    placeholder="What was this for?"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            {/* Action buttons — right-aligned, Cancel + Submit */}
                            <div className="flex items-center justify-end" style={{ gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary px-6 py-3 text-sm disabled:opacity-50"
                                >
                                    {submitting ? 'Saving…' : editData ? 'Update Transaction' : 'Add Transaction'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TransactionModal;
