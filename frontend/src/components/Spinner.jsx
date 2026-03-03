import { motion } from 'framer-motion';

const Spinner = () => (
    <div className="flex items-center justify-center min-h-[240px]">
        <motion.div
            className="relative w-12 h-12"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
            <div className="absolute inset-0 rounded-full"
                style={{
                    border: '3px solid var(--border-color)',
                    borderTopColor: 'var(--primary)',
                }} />
        </motion.div>
    </div>
);

export default Spinner;
