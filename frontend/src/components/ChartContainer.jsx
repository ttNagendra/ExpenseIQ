import { motion } from 'framer-motion';

/**
 * Wrapper for chart sections — glass-card with consistent padding, title, and optional badge.
 * Max height capped at 400px for desktop to prevent stretching.
 */
const ChartContainer = ({ title, badge, delay = 0, children, style = {} }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card"
        style={{ padding: 'var(--space-2) var(--space-3)', ...style }}
    >
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {title}
            </h3>
            {badge && (
                <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                    {badge}
                </span>
            )}
        </div>
        {children}
    </motion.div>
);

export default ChartContainer;
