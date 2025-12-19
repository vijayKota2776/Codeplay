import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || 'Login failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="glass rounded-2xl p-8 shadow-2xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        Sign in to continue your coding journey
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        icon={<Mail className="w-5 h-5" />}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        error={error}
                        icon={<Lock className="w-5 h-5" />}
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-2 border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-dominant)]"
                            />
                            <span className="text-[var(--text-secondary)]">Remember me</span>
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-medium"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-semibold"
                        >
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
