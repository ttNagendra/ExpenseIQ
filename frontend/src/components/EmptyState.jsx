import { motion } from 'framer-motion';
import { HiInbox } from 'react-icons/hi2';

const EmptyState = ({
    title = 'No data yet',
    message = 'Start by adding your first transaction.',
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-20"
    >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
            }}>
            <HiInbox className="w-9 h-9" style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-sm max-w-[260px] text-center" style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </motion.div>
);

export default EmptyState;
