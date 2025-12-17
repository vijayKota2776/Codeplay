import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import AppLayout from '../layouts/AppLayout';
import Spinner from '../components/ui/Spinner';
import StatCard from '../components/dashboard/StatCard';
import ActionCard from '../components/dashboard/ActionCard';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import FeaturedStatCard from '../components/dashboard/FeaturedStatCard';
import HeroActionCard from '../components/dashboard/HeroActionCard';
import CompactStatsPanel from '../components/dashboard/CompactStatsPanel';
import {
    Clock,
    BookOpen,
    CheckCircle,
    Code,
    GraduationCap,
    Zap,
    BarChart2,
    Flame,
    Star,
    Trophy,
    Target
} from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                console.log('Fetching dashboard data...');
                const res = await api.get('/dashboard');
                console.log('Dashboard Response:', res.data);

                if (res.data.stats) {
                    setStats(res.data.stats);
                    setRecentActivity(res.data.recentActivity || []);
                } else {
                    console.error('Missing stats in response:', res.data);
                    setError('Received invalid data from server.');
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setError(error.message || 'Failed to load dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    };

    const generateChartData = (baseValue) => {
        return Array.from({ length: 7 }, (_, i) => ({
            label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
            value: baseValue + Math.floor(Math.random() * 10) - 5
        }));
    };



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
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </AppLayout>
        );
    }

    const compactStats = [
        { label: 'Active Streak', value: `${stats?.currentStreak || 0} days`, icon: <Flame className="w-5 h-5 text-orange-500" />, iconBg: 'bg-orange-500/10' },
        { label: 'XP Earned', value: stats?.totalXp ? stats.totalXp.toLocaleString() : '0', icon: <Star className="w-5 h-5 text-yellow-500" />, iconBg: 'bg-yellow-500/10' },
        { label: 'Rank', value: '#142', icon: <Trophy className="w-5 h-5 text-purple-500" />, iconBg: 'bg-purple-500/10' },
        { label: 'Accuracy', value: '94%', icon: <Target className="w-5 h-5 text-green-500" />, iconBg: 'bg-green-500/10' },
    ];

    return (
        <AppLayout>
            <div className="space-y-6 animate-fadeInUp">
                <div className="card-refined p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center text-xl font-bold text-white shadow-md">
                            {user?.userName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-[var(--text-refined-primary)]">
                                Good {getTimeOfDay()}, {user?.userName || user?.email?.split('@')[0]}
                            </h1>
                            <p className="text-sm text-refined">
                                Ready to continue your learning journey?
                            </p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <FeaturedStatCard
                        title="Total Learning Hours"
                        value={stats?.totalHours || 0}
                        unit="hrs"
                        trend="up"
                        change="+23%"
                        icon={Clock}
                        chartData={generateChartData(stats?.totalHours || 12)}
                    />

                    <div className="grid-1x1">
                        <StatCard
                            label="Courses Enrolled"
                            value={stats?.coursesEnrolled || 0}
                            icon={BookOpen}
                            variant="default"
                            trend="neutral"
                        />
                    </div>

                    <div className="grid-1x1">
                        <StatCard
                            label="Labs Completed"
                            value={stats?.labsCompleted || 0}
                            icon={CheckCircle}
                            variant="success"
                            trend="up"
                            trendValue="+12%"
                        />
                    </div>

                    <div className="grid-1x1">
                        <StatCard
                            label="Code Submissions"
                            value={stats?.submissions || 0}
                            icon={Code}
                            variant="primary"
                            trend="up"
                            trendValue="+8%"
                        />
                    </div>

                    <div className="grid-1x1">
                        <StatCard
                            label="Current Streak"
                            value={`${stats?.currentStreak || 0}`}
                            icon={Flame}
                            variant="default"
                            trend="up"
                            trendValue="days"
                        />
                    </div>

                    <HeroActionCard
                        title="Featured Course: Advanced React Patterns"
                        description="Master advanced React concepts including custom hooks, compound components, and performance optimization techniques"
                        ctaText="Start Learning"
                        icon={GraduationCap}
                        to="/courses"
                        badge="NEW"
                    />

                    <div className="grid-1x1">
                        <ActionCard
                            title="Browse Courses"
                            description="Explore new courses"
                            icon={GraduationCap}
                            to="/courses"
                            variant="primary"
                        />
                    </div>

                    <div className="grid-1x1">
                        <ActionCard
                            title="Code Playground"
                            description="Practice coding"
                            icon={Zap}
                            to="/ide"
                            variant="success"
                        />
                    </div>

                    <div className="grid-1x1">
                        <ActionCard
                            title="View Progress"
                            description="Track achievements"
                            icon={BarChart2}
                            to="#progress"
                            variant="default"
                        />
                    </div>

                    <div className="card-refined grid-card grid-2x1">
                        <h3 className="text-lg font-semibold text-[var(--text-refined-primary)] mb-4">
                            Recent Activity
                        </h3>
                        {recentActivity.length > 0 ? (
                            <ActivityTimeline activities={recentActivity.slice(0, 3)} />
                        ) : (
                            <ActivityTimeline activities={[]} />
                        )}
                    </div>

                    <CompactStatsPanel stats={compactStats} />
                </div>
            </div>
        </AppLayout>
    );
}