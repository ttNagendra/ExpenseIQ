import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';

/**
 * Animated counter that smoothly counts up to the target number.
 */
const AnimatedCounter = ({ value }) => {
    const [display, setDisplay] = useState(0);
    const prev = useRef(0);

    useEffect(() => {
        const start = prev.current;
        const end = value;
        const duration = 800;
        const startTime = Date.now();

        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        prev.current = end;
    }, [value]);

    return <span>{formatCurrency(display)}</span>;
};

const SummaryCard = ({ title, amount, icon, gradient, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
        className={`gradient-card ${gradient}`}
        style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
        {/* Icon row */}
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-white/20 backdrop-blur-sm">
                {icon}
            </div>
        </div>

        {/* Label — lighter weight, all-caps for hierarchy */}
        <p className="text-xs font-medium uppercase tracking-wider text-white/60" style={{ marginBottom: '4px' }}>
            {title}
        </p>

        {/* Amount — large, bold, clear */}
        <p className="text-2xl font-bold tracking-tight leading-none text-white">
            <AnimatedCounter value={amount} />
        </p>
    </motion.div>
);

export default SummaryCard;
