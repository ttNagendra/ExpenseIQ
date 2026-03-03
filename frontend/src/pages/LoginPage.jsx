import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return toast.error('Please fill in all fields');
        setLoading(true);
        try {
            const { data } = await loginUser(form);
            login(data.data);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'var(--bg-primary)', backgroundImage: 'var(--gradient-mesh)' }}>
            {/* Decorative blobs — reduced opacity */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] rounded-full opacity-8"
                style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)', filter: 'blur(80px)' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[400px] glass-card relative z-10"
                style={{ padding: 'var(--space-4) var(--space-3)' }}
            >
                {/* Logo */}
                <div className="text-center" style={{ marginBottom: 'var(--space-3)' }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl"
                        style={{ background: 'var(--gradient-primary)', boxShadow: '0 6px 16px rgba(99,102,241,0.25)', marginBottom: '12px' }}
                    >
                        💰
                    </motion.div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Welcome Back
                    </h1>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        Sign in to your ExpenseIQ account
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="relative">
                        <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="input-field input-field-icon"
                        />
                    </div>

                    <div className="relative">
                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type={showPw ? 'text' : 'password'}
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="input-field input-field-icon input-field-icon-right"
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5"
                            style={{ color: 'var(--text-tertiary)' }}>
                            {showPw ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 text-sm font-semibold"
                        style={{ padding: '14px', marginTop: '4px' }}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
