import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    PieChart, Pie, Cell,
} from 'recharts';
import { getSummary, getTransactions } from '../api/transactionApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import SummaryCard from '../components/SummaryCard';
import PageHeader from '../components/PageHeader';
import ChartContainer from '../components/ChartContainer';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
    HiArrowTrendingUp, HiArrowTrendingDown, HiBanknotes,
    HiArrowRight,
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COLORS = [
    '#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6',
    '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4',
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card p-3 text-sm" style={{ minWidth: 140 }}>
            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <span style={{ color: p.color }}>{p.name}</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ₹{p.value.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [recentTx, setRecentTx] = useState([]);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
    }, [year]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [summaryRes, txRes] = await Promise.all([
                getSummary(year),
                getTransactions({ limit: 5, sort: '-date' }),
            ]);
            setData(summaryRes.data.data);
            setRecentTx(txRes.data.data);
        } catch {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner />;
    if (!data) return null;

    const barData = MONTH_NAMES.map((name, i) => {
        const m = data.monthly.find((item) => item._id === i + 1);
        return { name, Income: m?.income || 0, Expense: m?.expense || 0 };
    });

    const expenseCategories = data.categoryBreakdown
        .filter((c) => c._id.type === 'expense')
        .map((c) => ({ name: c._id.category, value: c.total }));

    return (
        <div>
            {/* ── Page Header: title left, year selector right ── */}
            <PageHeader title="Dashboard" subtitle="Your financial overview at a glance">
                <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="input-field w-auto py-2"
                    style={{ maxWidth: 120 }}
                >
                    {[2024, 2025, 2026, 2027].map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </PageHeader>

            {/* ── Summary Cards: 3-col desktop / 2-col tablet / 1-col mobile ── */}
            <div className="summary-grid">
                <SummaryCard
                    title="Total Income"
                    amount={data.totalIncome}
                    icon={<HiArrowTrendingUp className="w-5 h-5" />}
                    gradient="gradient-income"
                    delay={0}
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={data.totalExpense}
                    icon={<HiArrowTrendingDown className="w-5 h-5" />}
                    gradient="gradient-expense"
                    delay={0.08}
                />
                <SummaryCard
                    title="Current Balance"
                    amount={data.balance}
                    icon={<HiBanknotes className="w-5 h-5" />}
                    gradient="gradient-balance"
                    delay={0.16}
                />
            </div>

            {/* ── Charts: 6+6 equal split (pie left, bar right) — stacks on mobile ── */}
            <div className="chart-grid">
                {/* Pie chart (left on desktop) */}
                <ChartContainer title="Expense Breakdown" delay={0.25}>
                    {expenseCategories.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={expenseCategories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={85}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {expenseCategories.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'var(--space-2)' }}>
                                {expenseCategories.slice(0, 5).map((cat, i) => (
                                    <div key={cat.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                            <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>
                                        </div>
                                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            ₹{cat.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-40">
                            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No expenses this year</p>
                        </div>
                    )}
                </ChartContainer>

                {/* Bar chart (right on desktop) */}
                <ChartContainer title="Monthly Overview" badge={year} delay={0.35}>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={barData} barGap={6} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-tertiary)', radius: 8 }} />
                            <Legend iconType="circle" iconSize={8}
                                wrapperStyle={{ fontSize: 12, paddingTop: 16, color: 'var(--text-secondary)' }} />
                            <Bar dataKey="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* ── Recent Transactions ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="glass-card"
                style={{ padding: 'var(--space-2) var(--space-3)' }}
            >
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Recent Transactions
                    </h3>
                    <Link to="/transactions"
                        className="flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
                        style={{ color: 'var(--primary)' }}>
                        View All <HiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recentTx.length > 0 ? (
                    <div>
                        {recentTx.map((t, i) => (
                            <div
                                key={t._id}
                                className="flex items-center justify-between py-3"
                                style={{ borderBottom: i < recentTx.length - 1 ? '1px solid var(--border-color)' : 'none' }}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                                        style={{
                                            background: t.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                            color: t.type === 'income' ? '#22c55e' : '#ef4444',
                                        }}>
                                        {t.type === 'income' ? <HiArrowTrendingUp className="w-4 h-4" /> : <HiArrowTrendingDown className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {t.category}
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                            {formatDate(t.date)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold"
                                    style={{ color: t.type === 'income' ? '#22c55e' : '#ef4444' }}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-center py-6" style={{ color: 'var(--text-tertiary)' }}>
                        No transactions yet
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default DashboardPage;
