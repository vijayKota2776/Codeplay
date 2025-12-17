import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    Zap,
    GraduationCap,
    Container,
    BarChart,
    Rocket,
    Users,
    Code,
    Terminal
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: <Zap className="w-8 h-8 text-[var(--color-accent)]" />,
            title: 'Instant Cloud IDE',
            description: 'Write and run code directly in your browser with our powerful cloud-based development environment.',
        },
        {
            icon: <GraduationCap className="w-8 h-8 text-[var(--color-accent)]" />,
            title: 'Interactive Courses',
            description: 'Learn by doing with hands-on courses designed by industry experts.',
        },
        {
            icon: <Container className="w-8 h-8 text-[var(--color-accent)]" />,
            title: 'Docker Labs',
            description: 'Practice in real Docker environments with isolated, safe sandboxes.',
        },
        {
            icon: <BarChart className="w-8 h-8 text-[var(--color-accent)]" />,
            title: 'Track Progress',
            description: 'Monitor your learning journey with detailed analytics and achievements.',
        },
        {
            icon: <Rocket className="w-8 h-8 text-[var(--color-accent)]" />,
            title: 'Real Projects',
            description: 'Build portfolio-worthy projects that showcase your skills to employers.',
        },
        {
            icon: <Users className="w-8 h-8 text-[var(--color-accent)]" />,
            title: 'Peer Reviews',
            description: 'Get feedback from the community and learn from other developers.',
        },
    ];

    const stats = [
        { value: '10K+', label: 'Active Learners' },
        { value: '50+', label: 'Courses' },
        { value: '100+', label: 'Hands-on Labs' },
        { value: '95%', label: 'Success Rate' },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-dominant)]">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-[var(--z-sticky)] glass border-b border-[var(--border-color)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2 text-xl font-bold text-gradient">
                            <Code className="w-8 h-8 text-[var(--color-primary)]" />
                            <span>CODEPLAY</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-secondary)] rounded-full opacity-10 blur-3xl"
                        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                    />
                    <div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-accent)] rounded-full opacity-10 blur-3xl"
                        style={{ transform: `translateY(${scrollY * -0.15}px)` }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fadeInUp">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
                            <span className="text-gradient">Master Coding</span>
                            <br />
                            <span className="text-[var(--text-primary)]">Through Practice</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8">
                            Learn programming with interactive labs, real-time feedback, and hands-on projects.
                            Build your skills in a safe, cloud-based environment.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                                    Start Learning Free
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Explore Courses
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Code Animation */}
                    <div className="mt-16 glass rounded-2xl p-8 max-w-4xl mx-auto animate-fadeInUp">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-[var(--color-error)]" />
                            <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
                            <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                        </div>
                        <pre className="text-left font-mono text-sm text-[var(--text-primary)]">
                            <code>
                                {`const developer = {
  level: 'beginner',
  learn: async () => {
    await practice('coding');
    await build('projects');
    return 'job-ready developer';
  }
};

developer.learn(); // ✨ Start your journey`}
                            </code>
                        </pre>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-[var(--border-color)] bg-[var(--surface-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="text-4xl sm:text-5xl font-extrabold text-gradient mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-[var(--text-secondary)]">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                            Everything You Need to <span className="text-gradient">Succeed</span>
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Our platform provides all the tools and resources you need to become a confident developer.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <Card
                                key={i}
                                variant="glass"
                                className="hover-lift animate-fadeInUp"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)]">
                                        {feature.description}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-[var(--surface-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                            How It <span className="text-gradient">Works</span>
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)]">
                            Get started in minutes and begin your coding journey today
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Choose a Course',
                                description: 'Browse our library of courses and pick one that matches your goals.',
                            },
                            {
                                step: '02',
                                title: 'Code in Browser',
                                description: 'Write and run code directly in our cloud IDE - no setup required.',
                            },
                            {
                                step: '03',
                                title: 'Build & Deploy',
                                description: 'Complete projects, get feedback, and build your portfolio.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="relative animate-fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
                                <div className="text-6xl font-extrabold text-[var(--color-accent)] opacity-20 mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--text-secondary)]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="glass rounded-2xl p-12 animate-fadeInUp">
                        <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                            Ready to Start <span className="text-gradient">Coding?</span>
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)] mb-8">
                            Join thousands of developers learning and building amazing projects.
                        </p>
                        <Link to="/register">
                            <Button variant="primary" size="lg" className="glow">
                                Get Started for Free
                            </Button>
                        </Link>
                        <p className="text-sm text-[var(--text-tertiary)] mt-4">
                            No credit card required • 100% free to start
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border-color)] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-lg font-bold text-gradient">
                            <Terminal className="w-6 h-6 text-[var(--color-primary)]" />
                            <span>CODEPLAY</span>
                        </div>
                        <p className="text-sm text-[var(--text-tertiary)]">
                            © {new Date().getFullYear()} Codeplay. Empowering developers through practice.
                        </p>
                        <div className="flex gap-6 text-sm text-[var(--text-secondary)]">
                            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">About</Link>
                            <Link to="/courses" className="hover:text-[var(--color-accent)] transition-colors">Courses</Link>
                            <Link to="/" className="hover:text-[var(--color-accent)] transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
