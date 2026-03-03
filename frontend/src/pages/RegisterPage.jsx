import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiUser, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';

const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');

        setLoading(true);
        try {
            const { data } = await registerUser({
                name: form.name,
                email: form.email,
                password: form.password,
            });
            login(data.data);
            toast.success('Account created!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'var(--bg-primary)', backgroundImage: 'var(--gradient-mesh)' }}>
            {/* Decorative blobs — reduced */}
            <div className="absolute top-[-15%] right-[-8%] w-[400px] h-[400px] rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-[-15%] left-[-8%] w-[300px] h-[300px] rounded-full opacity-8"
                style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)', filter: 'blur(80px)' }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[400px] glass-card relative z-10"
                style={{ padding: 'var(--space-4) var(--space-3)' }}
            >
                <div className="text-center" style={{ marginBottom: 'var(--space-3)' }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl"
                        style={{ background: 'var(--gradient-accent)', boxShadow: '0 6px 16px rgba(99,102,241,0.25)', marginBottom: '12px' }}
                    >
                        🚀
                    </motion.div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        Start tracking your finances with ExpenseIQ
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="relative">
                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input type="text" placeholder="Full name" value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="input-field input-field-icon" />
                    </div>

                    <div className="relative">
                        <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input type="email" placeholder="Email address" value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="input-field input-field-icon" />
                    </div>

                    <div className="relative">
                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)" value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="input-field input-field-icon input-field-icon-right" />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5"
                            style={{ color: 'var(--text-tertiary)' }}>
                            {showPw ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="relative">
                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--text-tertiary)' }} />
                        <input type={showPw ? 'text' : 'password'} placeholder="Confirm password" value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            className="input-field input-field-icon" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="btn-primary w-full disabled:opacity-50 text-sm font-semibold"
                        style={{ padding: '14px', marginTop: '4px' }}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
