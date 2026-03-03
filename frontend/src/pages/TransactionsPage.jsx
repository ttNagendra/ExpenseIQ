import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../api/transactionApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportCsv';
import TransactionModal from '../components/TransactionModal';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
    HiPlus, HiMagnifyingGlass, HiFunnel, HiArrowDownTray,
    HiPencilSquare, HiTrash, HiArrowTrendingUp, HiArrowTrendingDown,
} from 'react-icons/hi2';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (search) params.search = search;
            if (typeFilter) params.type = typeFilter;
            if (categoryFilter) params.category = categoryFilter;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await getTransactions(params);
            setTransactions(res.data.data);
            setPagination(res.data.pagination);
        } catch {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, [page, search, typeFilter, categoryFilter, startDate, endDate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        const timer = setTimeout(() => setPage(1), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleAdd = async (formData) => {
        await addTransaction(formData);
        toast.success('Transaction added');
        fetchData();
    };

    const handleUpdate = async (formData) => {
        await updateTransaction(editData._id, formData);
        toast.success('Transaction updated');
        setEditData(null);
        fetchData();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        await deleteTransaction(id);
        toast.success('Transaction deleted');
        fetchData();
    };

    const handleExport = async () => {
        try {
            const res = await getTransactions({ limit: 9999 });
            exportToCSV(res.data.data);
            toast.success('CSV downloaded');
        } catch { toast.error('Export failed'); }
    };

    return (
        <div>
            {/* ── Page Header: title left, actions right ── */}
            <PageHeader title="Transactions" subtitle={`${pagination.total} records found`}>
                <button onClick={handleExport} className="btn-ghost flex items-center gap-2">
                    <HiArrowDownTray className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                </button>
                <button
                    onClick={() => { setEditData(null); setModalOpen(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiPlus className="w-4 h-4" />
                    Add Transaction
                </button>
            </PageHeader>

            {/* ── Search & Filter Row ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card"
                style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-3)' }}
            >
                <div className="filter-row">
                    {/* Search (left, stretches) */}
                    <div className="filter-row__search relative">
                        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    {/* Filter toggle (right) */}
                    <div className="filter-row__controls">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                            style={{
                                background: showFilters ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                                color: showFilters ? '#fff' : 'var(--text-secondary)',
                                border: showFilters ? 'none' : '1.5px solid var(--border-color)',
                                boxShadow: showFilters ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                            }}
                        >
                            <HiFunnel className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Expanded filter controls */}
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                        style={{
                            gap: 'var(--space-1)',
                            marginTop: 'var(--space-2)',
                            paddingTop: 'var(--space-2)',
                            borderTop: '1px solid var(--border-color)',
                        }}
                    >
                        <select value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
                            className="input-field">
                            <option value="">All types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <input type="text" placeholder="Category" value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                            className="input-field" />
                        <input type="date" value={startDate}
                            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                            className="input-field" />
                        <input type="date" value={endDate}
                            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                            className="input-field" />
                    </motion.div>
                )}
            </motion.div>

            {/* ── Transaction Table / List ── */}
            {loading ? (
                <Spinner />
            ) : transactions.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    {/* Desktop table with sticky header */}
                    <div className="hidden md:block">
                        <DataTable delay={0.15}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {['Date', 'Type', 'Category', 'Description', 'Amount', 'Actions'].map((h) => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                            style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t, i) => (
                                    <motion.tr
                                        key={t._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="table-row group"
                                    >
                                        <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                                            {formatDate(t.date)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                                {t.type === 'income'
                                                    ? <HiArrowTrendingUp className="w-3 h-3" />
                                                    : <HiArrowTrendingDown className="w-3 h-3" />}
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {t.category}
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }}>
                                            {t.description || '—'}
                                        </td>
                                        <td className="px-6 py-4 font-bold"
                                            style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    onClick={() => { setEditData(t); setModalOpen(true); }}
                                                    className="p-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:scale-110"
                                                    style={{ color: 'var(--primary)' }}
                                                >
                                                    <HiPencilSquare className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    className="p-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-tertiary)] hover:scale-110"
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <HiTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </DataTable>
                    </div>

                    {/* Mobile cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="md:hidden glass-card overflow-hidden"
                    >
                        {transactions.map((t, i) => (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="flex items-center justify-between gap-3"
                                style={{
                                    padding: 'var(--space-2)',
                                    borderBottom: '1px solid var(--border-color)',
                                }}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{
                                            background: t.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: t.type === 'income' ? '#22c55e' : '#ef4444',
                                        }}>
                                        {t.type === 'income' ? <HiArrowTrendingUp className="w-4 h-4" /> : <HiArrowTrendingDown className="w-4 h-4" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                            {t.category}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{formatDate(t.date)}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold"
                                        style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </p>
                                    <div className="flex items-center gap-0.5 mt-1 justify-end">
                                        <button onClick={() => { setEditData(t); setModalOpen(true); }}
                                            className="p-1.5 rounded-lg" style={{ color: 'var(--primary)' }}>
                                            <HiPencilSquare className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(t._id)}
                                            className="p-1.5 rounded-lg" style={{ color: '#ef4444' }}>
                                            <HiTrash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {/* ── Pagination (right-aligned) ── */}
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />

            {/* ── Transaction Modal ── */}
            <TransactionModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditData(null); }}
                onSubmit={editData ? handleUpdate : handleAdd}
                editData={editData}
            />
        </div>
    );
};

export default TransactionsPage;
