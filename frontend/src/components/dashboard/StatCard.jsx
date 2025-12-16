export default function StatCard({ label, value, trend, trendValue, icon: Icon, variant = 'default' }) {
    const variantStyles = {
        default: 'icon-container-refined',
        primary: 'icon-container-refined-primary',
        success: 'icon-container-refined-success',
    };

    const trendColors = {
        up: 'text-[var(--color-success-refined)]',
        down: 'text-[var(--color-error-refined)]',
        neutral: 'text-[var(--text-refined-muted)]',
    };

    return (
        <div className="card-refined p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-refined-muted mb-1">{label}</p>
                    <p className="text-3xl font-semibold text-[var(--text-refined-primary)] truncate">
                        {value}
                    </p>
                </div>
                <div className={`${variantStyles[variant]} flex-shrink-0 overflow-hidden`}>
                    {Icon && <Icon className="w-5 h-5" />}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${trendColors[trend]}`}>
                        {trend === 'up' && '↑'}
                        {trend === 'down' && '↓'}
                        {trend === 'neutral' && '→'}
                        {trendValue && ` ${trendValue}`}
                    </span>
                    <span className="text-xs text-refined-muted">vs last week</span>
                </div>
            )}
        </div>
    );
}
