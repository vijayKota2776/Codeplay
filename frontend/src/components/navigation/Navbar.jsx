import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { Code, User, Menu, X, ChevronDown, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/courses', label: 'Courses' },
        { to: '/ide', label: 'Playground' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-[var(--z-sticky)] glass border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-xl font-bold text-gradient hover:scale-105 transition-transform"
                    >
                        <Code className="w-8 h-8 text-[var(--color-primary)]" />
                        <span>CODEPLAY</span>
                    </Link>

                    {!isMobile && (
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive(link.to)
                                        ? 'bg-[var(--color-accent)] text-[var(--text-on-accent)] shadow-md'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {!isMobile && user && (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--surface-primary)] transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] flex items-center justify-center text-sm font-bold">
                                        {user.name?.[0]?.toUpperCase() || <User size={16} />}
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {user.name}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {profileMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setProfileMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-48 bg-[var(--surface-primary)] rounded-lg shadow-xl border border-[var(--border-color)] py-2 z-20">
                                            <div className="px-4 py-2 border-b border-[var(--border-color)]">
                                                <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                                                <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left text-sm text-[var(--color-error)] hover:bg-[var(--surface-secondary)] transition-colors flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {isMobile && (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 text-[var(--text-primary)] hover:bg-[var(--surface-primary)] rounded-lg"
                            >
                                {mobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {isMobile && mobileMenuOpen && (
                    <div className="pb-4 animate-fadeInUp">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive(link.to)
                                    ? 'bg-[var(--color-accent)] text-[var(--text-on-accent)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-primary)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user && (
                            <>
                                <div className="px-4 py-3 mt-2 border-t border-[var(--border-color)]">
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                                    <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-[var(--color-error)] hover:bg-[var(--surface-secondary)] rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
