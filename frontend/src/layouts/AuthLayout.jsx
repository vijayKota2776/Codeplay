/**
 * Authentication Pages Layout
 * Split-screen design for login/register pages
 */
import { Code, Zap, Rocket, Target } from 'lucide-react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[var(--color-dominant)] flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col justify-center px-16">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Code className="w-12 h-12 text-white" />
                            <h1 className="text-4xl font-extrabold text-white">CODEPLAY</h1>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Master Coding Through Practice
                        </h2>
                        <p className="text-xl text-white/90">
                            Interactive labs, real-time collaboration, and hands-on learning for developers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: <Zap className="w-6 h-6" />, text: 'Instant cloud-based development environments' },
                            { icon: <Rocket className="w-6 h-6" />, text: 'Learn by building real projects' },
                            { icon: <Target className="w-6 h-6" />, text: 'Track your progress and achievements' },
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-white/90">
                                <span className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg backdrop-blur-sm">
                                    {feature.icon}
                                </span>
                                <span className="text-lg">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form Content */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
                        <Code className="w-10 h-10 text-[var(--color-accent)]" />
                        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">CODEPLAY</h1>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
