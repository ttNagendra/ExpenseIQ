import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { HiUser, HiShieldCheck, HiPaintBrush, HiBell } from 'react-icons/hi2';

const SettingsPage = () => {
    const { user } = useAuth();

    const sections = [
        {
            title: 'Profile',
            icon: <HiUser className="w-5 h-5" />,
            items: [
                { label: 'Name', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Role', value: user?.role || 'User' },
            ],
        },
        {
            title: 'Security',
            icon: <HiShieldCheck className="w-5 h-5" />,
            items: [
                { label: 'Password', value: '••••••••' },
                { label: 'Two-Factor Auth', value: 'Not enabled' },
            ],
        },
    ];

    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your account and preferences" />

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-2)' }}>
                {sections.map((section, si) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: si * 0.08 }}
                        className="glass-card"
                        style={{ padding: 'var(--space-2) var(--space-3)' }}
                    >
                        <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-2)' }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ background: 'var(--bg-tertiary)', color: 'var(--primary)' }}>
                                {section.icon}
                            </div>
                            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {section.title}
                            </h3>
                        </div>

                        <div>
                            {section.items.map((item, i) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: '10px 0',
                                        borderBottom: i < section.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    }}
                                >
                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* Appearance */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                    className="glass-card"
                    style={{ padding: 'var(--space-2) var(--space-3)' }}
                >
                    <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-2)' }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--primary)' }}>
                            <HiPaintBrush className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Appearance
                        </h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Use the dark mode toggle in the top navbar to switch between light and dark themes.
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        Your preference is saved automatically.
                    </p>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="glass-card"
                    style={{ padding: 'var(--space-2) var(--space-3)' }}
                >
                    <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-2)' }}>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--bg-tertiary)', color: 'var(--primary)' }}>
                            <HiBell className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Notifications
                        </h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Email and push notification preferences coming soon.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsPage;
