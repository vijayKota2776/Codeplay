import { BookOpen, FlaskConical, FileCode, Trophy, Circle, ClipboardList } from 'lucide-react';
import Badge from '../ui/Badge';

export default function ActivityTimeline({ activities }) {
    const getActivityIcon = (type) => {
        const icons = {
            course: <BookOpen className="w-5 h-5 text-white" />,
            lab: <FlaskConical className="w-5 h-5 text-white" />,
            submission: <FileCode className="w-5 h-5 text-white" />,
            achievement: <Trophy className="w-5 h-5 text-white" />,
            default: <Circle className="w-5 h-5 text-white" />,
        };
        return icons[type] || icons.default;
    };

    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface-refined-elevated)] flex items-center justify-center">
                    <ClipboardList className="w-8 h-8 text-[var(--color-slate-500)]" />
                </div>
                <p className="text-refined mb-2">
                    No recent activity yet
                </p>
                <p className="text-sm text-refined-muted">
                    Start a course to begin your learning journey
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity, i) => (
                <div
                    key={i}
                    className="relative"
                >
                    {/* Timeline connector */}
                    {i < activities.length - 1 && (
                        <div className="absolute left-5 top-12 w-0.5 h-full bg-[var(--border-refined)]" />
                    )}

                    <div className="flex items-start gap-4">
                        {/* Timeline dot */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0 text-lg shadow-lg relative z-10">
                            {getActivityIcon(activity.type)}
                        </div>

                        {/* Activity content */}
                        <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-[var(--text-refined-primary)] font-medium mb-1">
                                        {activity.description}
                                    </p>
                                    <p className="text-sm text-refined-muted">
                                        {activity.time}
                                    </p>
                                </div>
                                {activity.badge && (
                                    <Badge variant={activity.badge.variant || 'default'}>
                                        {activity.badge.text}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
