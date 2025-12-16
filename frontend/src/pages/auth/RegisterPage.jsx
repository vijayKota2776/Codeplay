import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import AuthLayout from '../../layouts/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            const res = await api.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || 'Registration failed. Please try again.';
            setErrors({ submit: msg });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const { password } = formData;
        if (!password) return { strength: 0, label: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', 'error', 'warning', 'success', 'success'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <AuthLayout>
            <div className="glass rounded-2xl p-8 shadow-2xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2">
                        Create Account
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        Join thousands of developers learning to code
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        required
                        icon={<User className="w-5 h-5" />}
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                        icon={<Mail className="w-5 h-5" />}
                    />

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            required
                            icon={<Lock className="w-5 h-5" />}
                        />
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                                ? `bg-[var(--color-${passwordStrength.color})]`
                                                : 'bg-[var(--surface-secondary)]'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                    Password strength: <span className={`text-[var(--color-${passwordStrength.color})]`}>
                                        {passwordStrength.label}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                        required
                        icon={<CheckCircle className="w-5 h-5" />}
                    />

                    {errors.submit && (
                        <div className="p-3 rounded-lg bg-[var(--color-error)]/10 border border-[var(--color-error)] text-sm text-[var(--color-error)]">
                            {errors.submit}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        className="w-full mt-6"
                    >
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)] font-semibold"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
