import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock } from 'lucide-react';
import { api } from '../api';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Explicitly log the URL being requested for debugging
                console.log('Fetching courses from:', api.defaults.baseURL + '/courses');
                const res = await api.get('/courses');
                setCourses(res.data);
                setFilteredCourses(res.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setError(err.message || 'Failed to load courses. Please make sure the backend server is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const filtered = courses.filter(
            (course) =>
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(filtered);
    }, [searchTerm, courses]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Spinner size="xl" />
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Connection Error</h3>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6 animate-fadeInUp">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-extrabold text-gradient mb-2">
                        Explore Courses
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        Choose from {courses.length} courses to master your coding skills
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-xl">
                    <Input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search className="w-5 h-5" />}
                    />
                </div>

                {/* Courses Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Link key={course._id} to={`/courses/${course._id}`}>
                                <Card variant="glass" className="hover-lift h-full">
                                    <div className="space-y-4">
                                        {/* Course Icon */}
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center text-3xl">
                                            {course.icon || '📚'}
                                        </div>

                                        {/* Course Info */}
                                        <div>
                                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                                                {course.description}
                                            </p>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                                                <BookOpen className="w-4 h-4" />
                                                <span>
                                                    {(course.sections?.reduce((acc, sec) => acc + (sec.topics?.length || 0), 0) || 0) +
                                                        (course.topics?.length || 0)} modules
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[var(--text-tertiary)]">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration || 'Self-paced'}</span>
                                            </div>
                                        </div>

                                        {/* Level Badge */}
                                        <div>
                                            <Badge
                                                variant={
                                                    course.level === 'Beginner'
                                                        ? 'success'
                                                        : course.level === 'Intermediate'
                                                            ? 'warning'
                                                            : 'error'
                                                }
                                            >
                                                {course.level || 'All Levels'}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                        <p className="text-xl text-[var(--text-secondary)] mb-2">No courses found</p>
                        <p className="text-[var(--text-tertiary)]">Try adjusting your search term</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
