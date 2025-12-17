import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, FileText, CheckCircle } from 'lucide-react';
import { api } from '../api';
import AppLayout from '../layouts/AppLayout';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function TopicPage() {
    const { courseId, topicId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopicData = async () => {
            try {
                // Fetch the full course structure since we don't have a direct /api/topics/:id endpoint
                const res = await api.get(`/courses/${courseId}`);
                const courseData = res.data;
                setCourse(courseData);

                // Find the topic within sections or flat topics list
                let foundTopic = null;

                if (courseData.sections && courseData.sections.length > 0) {
                    for (const section of courseData.sections) {
                        const t = section.topics.find(t => t._id === topicId || t.id === topicId);
                        if (t) {
                            foundTopic = t;
                            break;
                        }
                    }
                } else if (courseData.topics && courseData.topics.length > 0) {
                    foundTopic = courseData.topics.find(t => t._id === topicId || t.id === topicId);
                }

                setTopic(foundTopic);
            } catch (error) {
                console.error('Failed to fetch topic data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId && topicId) {
            fetchTopicData();
        }
    }, [courseId, topicId]);

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Spinner size="xl" />
                </div>
            </AppLayout>
        );
    }

    if (!course || !topic) {
        return (
            <AppLayout>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Topic not found
                    </h2>
                    <Button variant="secondary" onClick={() => navigate(`/courses/${courseId}`)}>
                        Back to Course
                    </Button>
                </div>
            </AppLayout>
        );
    }

    // Simple Markdown Formatter
    const formatContent = (content) => {
        if (!content) return null;

        const lines = content.split('\n');
        const blocks = [];
        let currentList = [];

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('- ')) {
                // Add to current list
                currentList.push(trimmed.substring(2));
            } else {
                // If we were building a list, push it to blocks and clear
                if (currentList.length > 0) {
                    blocks.push({ type: 'list', items: [...currentList] });
                    currentList = [];
                }

                // Add paragraph or spacer
                if (trimmed.length === 0) {
                    blocks.push({ type: 'spacer' });
                } else {
                    blocks.push({ type: 'paragraph', text: trimmed });
                }
            }
        });

        // Push any remaining list
        if (currentList.length > 0) {
            blocks.push({ type: 'list', items: [...currentList] });
        }

        return blocks.map((block, index) => {
            if (block.type === 'list') {
                return (
                    <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
                        {block.items.map((item, i) => (
                            <li key={i} className="pl-1">
                                {renderInlineStyles(item)}
                            </li>
                        ))}
                    </ul>
                );
            }
            if (block.type === 'paragraph') {
                return (
                    <p key={index} className="mb-4 text-[var(--text-secondary)] leading-relaxed">
                        {renderInlineStyles(block.text)}
                    </p>
                );
            }
            return <div key={index} className="h-2"></div>;
        });
    };

    const renderInlineStyles = (text) => {
        // Handle **Bold**
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-[var(--text-primary)] font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <AppLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
                {/* Navigation Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="text-[var(--text-secondary)]"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Course
                    </Button>
                </div>

                {/* Main Content Card */}
                <div className="card-refined p-8 md:p-12">
                    <div className="flex items-start justify-between gap-6 mb-8 border-b border-[var(--border-color)] pb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-[var(--color-accent)] uppercase tracking-wider">
                                <FileText className="w-4 h-4" />
                                <span>Topic Explanation</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight">
                                {topic.title}
                            </h1>
                        </div>
                        {topic.completed && (
                            <div className="flex items-center gap-2 text-[var(--color-success)] bg-[var(--color-success)]/10 px-3 py-1 rounded-full text-sm font-medium">
                                <CheckCircle className="w-4 h-4" />
                                <span>Completed</span>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed">
                        {/* 
                            This is where the explanation content goes. 
                            If the content is markdown, we would use a markdown renderer here.
                            For now, we just display the text string.
                        */}
                        {topic.content ? (
                            <div>{formatContent(topic.content)}</div>
                        ) : (
                            <p className="italic text-[var(--text-tertiary)]">
                                No detailed explanation available for this topic.
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--surface-refined-elevated)] p-6 rounded-2xl border border-[var(--border-refined)]">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            Ready to practice?
                        </h3>
                        <p className="text-[var(--text-secondary)]">
                            Apply what you've learned in our interactive coding environment.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full md:w-auto min-w-[200px] shadow-lg shadow-[var(--color-primary)]/20"
                        onClick={() => navigate(`/lab?courseId=${courseId}&topicId=${topic._id || topic.id}`)}
                    >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Open Code Playground
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
