import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { api } from '../api';
import AppLayout from '../layouts/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function CourseDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (error) {
                console.error('Failed to fetch course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Spinner size="xl" />
                </div>
            </AppLayout>
        );
    }

    if (!course) {
        return (
            <AppLayout>
                <div className="text-center py-20">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[var(--text-tertiary)]" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Course not found
                    </h2>
                    <Button variant="secondary" onClick={() => navigate('/courses')}>
                        Back to Courses
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-8 animate-fadeInUp">
                {/* Course Header */}
                <div className="glass rounded-2xl p-8">
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] flex items-center justify-center text-4xl">
                                    {course.icon || '📚'}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
                                        {course.title}
                                    </h1>
                                    <Badge variant="success" className="mt-2">
                                        {course.level || 'All Levels'}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-lg text-[var(--text-secondary)]">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Topics/Modules */}


                {/* Course Topics/Modules */}
                {(course.sections && course.sections.length > 0) || (course.topics && course.topics.length > 0) ? (
                    <div className="space-y-6">
                        {/* Check if we have sections (new structure) or just topics (old structure) */}
                        {course.sections && course.sections.length > 0 ? (
                            course.sections.map((section, sIndex) => (
                                <div key={section._id || sIndex} className="space-y-3">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] px-2">
                                        {section.title}
                                    </h3>
                                    <div className="space-y-3">
                                        {section.topics.map((topic, tIndex) => (
                                            <Card
                                                key={topic._id || tIndex}
                                                variant="glass"
                                                className="hover-lift cursor-pointer"
                                                onClick={() => navigate(`/courses/${id}/topics/${topic._id || topic.id}`)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="w-10 h-10 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center font-bold text-[var(--color-accent)] text-sm">
                                                            {sIndex + 1}.{tIndex + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-bold text-[var(--text-primary)]">
                                                                {topic.title}
                                                            </h4>
                                                            {topic.content && (
                                                                <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">
                                                                    {topic.content}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Fallback for flat topics structure */
                            <div className="space-y-3">
                                {course.topics.map((topic, index) => (
                                    <Card
                                        key={topic._id || index}
                                        variant="glass"
                                        className="hover-lift cursor-pointer"
                                        onClick={() => navigate(`/courses/${id}/topics/${topic._id || topic.id}`)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-lg bg-[var(--surface-secondary)] flex items-center justify-center font-bold text-[var(--color-accent)]">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                                        {topic.title}
                                                    </h3>
                                                    {topic.description && (
                                                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                                                            {topic.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {topic.hasLab && (
                                                    <Badge variant="accent" dot>
                                                        Lab Available
                                                    </Badge>
                                                )}
                                                {topic.completed && (
                                                    <div className="text-[var(--color-success)]">
                                                        <CheckCircle className="w-6 h-6 fill-current" />
                                                    </div>
                                                )}
                                                <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Card variant="glass">
                        <div className="text-center py-12">
                            <p className="text-[var(--text-secondary)]">
                                Course content coming soon...
                            </p>
                        </div>
                    </Card>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button variant="primary" size="lg" className="flex-1">
                    Continue Learning
                </Button>
                <Button variant="outline" onClick={() => navigate('/courses')}>
                    Back to Courses
                </Button>
            </div>
        </AppLayout>
    );
}
