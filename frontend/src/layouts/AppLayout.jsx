import Navbar from '../components/navigation/Navbar';

/**
 * Main Application Layout
 * Used for authenticated pages
 */
export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-[var(--color-dominant)]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="mt-auto border-t border-[var(--border-color)] py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-[var(--text-tertiary)]">
                        © {new Date().getFullYear()} Codeplay. Empowering developers through interactive learning.
                    </p>
                </div>
            </footer>
        </div>
    );
}
