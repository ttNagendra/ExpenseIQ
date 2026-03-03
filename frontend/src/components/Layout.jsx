import { NavLink, useNavigate } from 'react-router-dom';
import {
    HiHome,
    HiCurrencyRupee,
    HiChartBar,
    HiCog6Tooth,
    HiArrowRightOnRectangle,
    HiBars3,
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
    HiXMark,
    HiBell,
    HiMagnifyingGlass,
} from 'react-icons/hi2';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from './DarkModeToggle';

/* ── Navigation items grouped logically ── */
const mainNavItems = [
    { to: '/dashboard', icon: <HiHome className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/transactions', icon: <HiCurrencyRupee className="w-5 h-5" />, label: 'Transactions' },
    { to: '/analytics', icon: <HiChartBar className="w-5 h-5" />, label: 'Analytics' },
];

const settingsNavItems = [
    { to: '/settings', icon: <HiCog6Tooth className="w-5 h-5" />, label: 'Settings' },
];

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /** Renders a single nav link with active accent-bar indicator */
    const NavItem = ({ item }) => (
        <NavLink
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) =>
                isActive
                    ? {
                        background: 'var(--sidebar-active-bg)',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }
                    : { color: 'var(--sidebar-text)' }
            }
        >
            <span className="transition-transform duration-300">{item.icon}</span>
            {item.label}
        </NavLink>
    );

    const SidebarContent = () => (
        <div className="flex flex-col h-full" style={{ padding: 'var(--space-2) var(--space-2)' }}>
            {/* ── Logo ── */}
            <div className="flex items-center gap-3 px-3" style={{ marginBottom: 'var(--space-3)' }}>
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ background: 'var(--gradient-primary)', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}
                >
                    💰
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-tight">ExpenseIQ</h1>
                    <p
                        className="text-[10px] font-medium tracking-widest uppercase"
                        style={{ color: 'var(--sidebar-text)', opacity: 0.6 }}
                    >
                        Finance Tracker
                    </p>
                </div>
            </div>

            {/* ── Navigation Groups ── */}
            <nav className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {/* Main group */}
                <p className="sidebar-group-label">Menu</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {mainNavItems.map((item) => (
                        <NavItem key={item.to} item={item} />
                    ))}
                </div>

                {/* Settings group */}
                <p className="sidebar-group-label">Preferences</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {settingsNavItems.map((item) => (
                        <NavItem key={item.to} item={item} />
                    ))}
                </div>
            </nav>

            {/* ── Divider ── */}
            <div className="mx-3 h-px" style={{ background: 'var(--sidebar-divider)', margin: 'var(--space-2) 12px' }} />

            {/* ── User card ── */}
            <div
                className="rounded-2xl"
                style={{
                    padding: 'var(--space-1) 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    marginBottom: 'var(--space-1)',
                }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'var(--gradient-accent)' }}
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--sidebar-text)', opacity: 0.6 }}>
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 group"
                style={{ color: 'var(--sidebar-text)' }}
            >
                <HiArrowRightOnRectangle className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                Logout
            </button>
        </div>
    );

    return (
        <div className="flex min-h-screen noise-overlay">
            {/* ── Desktop Sidebar (fixed, collapsible) ── */}
            <aside
                className="hidden lg:flex flex-col fixed inset-y-0 z-30"
                style={{
                    background: 'var(--sidebar-bg)',
                    width: desktopCollapsed ? '0px' : '260px',
                    overflow: 'hidden',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div style={{ minWidth: '260px' }}>
                    <SidebarContent />
                </div>
            </aside>

            {/* ── Mobile Sidebar (drawer overlay) ── */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="relative w-[260px] h-full"
                            style={{ background: 'var(--sidebar-bg)' }}
                        >
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-5 right-4 text-white/60 hover:text-white p-1.5 rounded-lg transition-colors"
                            >
                                <HiXMark className="w-5 h-5" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Main content area ── */}
            <main
                className="flex-1 lg:transition-[margin-left] lg:duration-300 lg:ease-in-out"
                style={{ marginLeft: 'var(--main-ml, 0px)' }}
            >
                <style>{`
                    @media (min-width: 1024px) {
                        :root { --main-ml: ${desktopCollapsed ? '0px' : '260px'}; }
                    }
                `}</style>
                {/* Top navbar */}
                <header
                    className="sticky top-0 z-20 glass"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                    <div
                        className="flex items-center justify-between"
                        style={{ padding: 'var(--space-1) var(--space-3)' }}
                    >
                        {/* Left — sidebar toggles + search */}
                        <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
                            {/* Mobile sidebar toggle */}
                            <button
                                className="lg:hidden p-2 rounded-xl transition-all hover:bg-[var(--bg-tertiary)]"
                                style={{ color: 'var(--text-primary)' }}
                                onClick={() => setSidebarOpen(true)}
                            >
                                <HiBars3 className="w-5 h-5" />
                            </button>

                            {/* Desktop sidebar toggle */}
                            <button
                                className="hidden lg:flex items-center justify-center p-2 rounded-xl transition-all hover:bg-[var(--bg-tertiary)]"
                                style={{ color: 'var(--text-primary)' }}
                                onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                                title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            >
                                {desktopCollapsed ? (
                                    <HiChevronDoubleRight className="w-5 h-5" />
                                ) : (
                                    <HiChevronDoubleLeft className="w-5 h-5" />
                                )}
                            </button>

                            {/* Search bar (desktop) */}
                            <div
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl"
                                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                            >
                                <HiMagnifyingGlass className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                                <input
                                    type="text"
                                    placeholder="Search anything..."
                                    className="bg-transparent text-sm outline-none w-48"
                                    style={{ color: 'var(--text-primary)' }}
                                />
                                <kbd
                                    className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                                    style={{ background: 'var(--border-color)', color: 'var(--text-tertiary)' }}
                                >
                                    ⌘K
                                </kbd>
                            </div>
                        </div>

                        {/* Right — actions */}
                        <div className="flex items-center gap-2">
                            {/* Notification bell */}
                            <button
                                className="relative p-2.5 rounded-xl transition-all hover:bg-[var(--bg-tertiary)]"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <HiBell className="w-5 h-5" />
                                <span
                                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                                    style={{ background: '#ef4444', boxShadow: '0 0 0 2px var(--bg-primary)' }}
                                />
                            </button>

                            <DarkModeToggle />

                            {/* User avatar (desktop) */}
                            <div
                                className="hidden sm:flex items-center gap-2.5 pl-3 ml-1"
                                style={{ borderLeft: '1px solid var(--border-color)' }}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                    style={{ background: 'var(--gradient-primary)' }}
                                >
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                    {user?.name?.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content — 1280px max-width container */}
                <div className="container-main">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
