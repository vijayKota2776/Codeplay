import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[var(--color-dominant)] flex items-center justify-center px-4">
            <div className="text-center max-w-md animate-fadeInUp">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-[120px] font-extrabold text-gradient leading-none">
                        404
                    </div>
                    <div className="text-6xl mb-4">🔍</div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-3">
                    Page Not Found
                </h1>
                <p className="text-lg text-[var(--text-secondary)] mb-8">
                    Oops! The page you're looking for seems to have wandered off into the digital void.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/dashboard">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto">
                            Go to Dashboard
                        </Button>
                    </Link>
                    <Link to="/courses">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto">
                            Browse Courses
                        </Button>
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
                    <p className="text-sm text-[var(--text-tertiary)] mb-3">
                        Looking for something specific?
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <Link to="/ide" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">
                            Code Playground
                        </Link>
                        <Link to="/courses" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">
                            All Courses
                        </Link>
                        <Link to="/dashboard" className="text-[var(--color-accent)] hover:text-[var(--color-accent-light)]">
                            My Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
