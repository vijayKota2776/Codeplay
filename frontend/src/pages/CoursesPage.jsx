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

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                setCourses(res.data);
                setFilteredCourses(res.data);
            } catch (error) {
                console.error('Failed to fetch courses:', error);
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
                                                <span>{course.topics?.length || 0} topics</span>
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
