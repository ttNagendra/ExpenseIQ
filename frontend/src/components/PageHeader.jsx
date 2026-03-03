import { motion } from 'framer-motion';

/**
 * Reusable page header — title + subtitle on the left, action slot on the right.
 * Uses the `.page-header` layout utility from index.css.
 */
const PageHeader = ({ title, subtitle, children }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-header"
    >
        <div>
            <h1 className="page-header__title">{title}</h1>
            {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
        {children && (
            <div className="page-header__actions">
                {children}
            </div>
        )}
    </motion.div>
);

export default PageHeader;
