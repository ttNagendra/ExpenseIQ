import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { getSummary } from '../api/transactionApi';
import { formatCurrency } from '../utils/formatters';
import PageHeader from '../components/PageHeader';
import ChartContainer from '../components/ChartContainer';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#6366f1', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-card" style={{ padding: '10px 14px', minWidth: 130 }}>
            <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center justify-between gap-4 text-xs">
                    <span style={{ color: p.color }}>{p.name}</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ₹{p.value.toLocaleString()}
                    </span>
                </div>
            ))}
        </div>
    );
};

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await getSummary(year);
                setData(res.data.data);
            } catch { toast.error('Failed to load analytics'); }
            finally { setLoading(false); }
        })();
    }, [year]);

    if (loading) return <Spinner />;
    if (!data) return null;

    const monthlyData = MONTH_NAMES.map((name, i) => {
        const m = data.monthly.find((item) => item._id === i + 1);
        const income = m?.income || 0;
        const expense = m?.expense || 0;
        return { name, Income: income, Expense: expense, Savings: income - expense };
    });

    const expenseCategories = data.categoryBreakdown
        .filter((c) => c._id.type === 'expense')
        .map((c) => ({ name: c._id.category, value: c.total }));

    const incomeCategories = data.categoryBreakdown
        .filter((c) => c._id.type === 'income')
        .map((c) => ({ name: c._id.category, value: c.total }));

    const savingsRate = data.totalIncome > 0
        ? (((data.totalIncome - data.totalExpense) / data.totalIncome) * 100).toFixed(1)
        : 0;

    return (
        <div>
            {/* ── Page Header ── */}
            <PageHeader title="Analytics" subtitle="Deep dive into your financial patterns">
                <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}
                    className="input-field w-auto py-2" style={{ maxWidth: 120 }}>
                    {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
            </PageHeader>

            {/* ── Quick Stats — 4-col grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {[
                    { label: 'Total Income', value: formatCurrency(data.totalIncome), color: '#22c55e', icon: <HiArrowTrendingUp /> },
                    { label: 'Total Expenses', value: formatCurrency(data.totalExpense), color: '#ef4444', icon: <HiArrowTrendingDown /> },
                    { label: 'Net Savings', value: formatCurrency(data.balance), color: '#6366f1', icon: <HiArrowTrendingUp /> },
                    { label: 'Savings Rate', value: `${savingsRate}%`, color: '#f59e0b', icon: <HiArrowTrendingUp /> },
                ].map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="glass-card"
                        style={{ padding: 'var(--space-2)' }}>
                        <div className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                            <span className="text-sm" style={{ color: stat.color }}>{stat.icon}</span>
                            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</span>
                        </div>
                        <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Income vs Expense Trend — capped at 260px height ── */}
            <ChartContainer title="Income vs Expense Trend" delay={0.25}
                style={{ marginBottom: 'var(--space-3)' }}>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={monthlyData}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={2} fill="url(#colorIncome)" />
                        <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpense)" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* ── Bottom Row: Savings + Category breakdowns — 3-col ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--space-2)' }}>
                {/* Savings chart — capped at 180px */}
                <ChartContainer title="Monthly Savings" delay={0.35}>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={monthlyData} barSize={12}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="Savings" radius={[6, 6, 0, 0]}>
                                {monthlyData.map((entry, i) => (
                                    <Cell key={i} fill={entry.Savings >= 0 ? '#22c55e' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Expense pie — compact */}
                <ChartContainer title="Expense Categories" delay={0.4}>
                    {expenseCategories.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={36} outerRadius={58}
                                        paddingAngle={3} dataKey="value" stroke="none">
                                        {expenseCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                                {expenseCategories.slice(0, 4).map((cat, i) => (
                                    <div key={cat.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
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
                        <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No data</p>
                    )}
                </ChartContainer>

                {/* Income pie — compact */}
                <ChartContainer title="Income Sources" delay={0.45}>
                    {incomeCategories.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={140}>
                                <PieChart>
                                    <Pie data={incomeCategories} cx="50%" cy="50%" innerRadius={36} outerRadius={58}
                                        paddingAngle={3} dataKey="value" stroke="none">
                                        {incomeCategories.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                                {incomeCategories.slice(0, 4).map((cat, i) => (
                                    <div key={cat.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[(i + 3) % COLORS.length] }} />
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
                        <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No data</p>
                    )}
                </ChartContainer>
            </div>
        </div>
    );
};

export default AnalyticsPage;
