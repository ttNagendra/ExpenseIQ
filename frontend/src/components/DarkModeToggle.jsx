import { useEffect, useState } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi2';
import { motion } from 'framer-motion';

const DarkModeToggle = () => {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="relative p-2.5 rounded-xl transition-all duration-300 hover:bg-[var(--bg-tertiary)] overflow-hidden"
            style={{ color: 'var(--text-secondary)' }}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <motion.div
                key={dark ? 'sun' : 'moon'}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </motion.div>
        </button>
    );
};

export default DarkModeToggle;
