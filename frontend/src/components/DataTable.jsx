import { motion } from 'framer-motion';

/**
 * Generic table wrapper — glass-card with sticky header, horizontal scroll on mobile.
 * Pass table content (thead + tbody) as children.
 */
const DataTable = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass-card overflow-hidden"
    >
        <div className="table-sticky">
            <table className="w-full text-sm">
                {children}
            </table>
        </div>
    </motion.div>
);

export default DataTable;
