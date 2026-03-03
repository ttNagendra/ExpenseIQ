import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides user state + auth helpers.
 * Persists the user object (with JWT token) in localStorage.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hydrate from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
