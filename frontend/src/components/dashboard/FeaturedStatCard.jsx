export default function FeaturedStatCard({
    title,
    value,
    unit = '',
    trend = 'up',
    change = '',
    icon: Icon,
    chartData = []
}) {
    const trendColors = {
        up: 'text-[var(--color-success-refined)]',
        down: 'text-[var(--color-error-refined)]',
        neutral: 'text-[var(--color-slate-400)]',
    };


    const max = Math.max(...chartData.map(d => d.value || 0));
    const min = Math.min(...chartData.map(d => d.value || 0));
    const range = max - min || 1;

    return (
        <div className="featured-card grid-card grid-2x2">
            <div className="h-full flex flex-col justify-between">

                <div className="flex items-start justify-between mb-6 gap-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-refined-muted mb-2">{title}</p>
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <h2 className="text-5xl font-bold text-[var(--text-refined-primary)]">
                                {value}
                            </h2>
                            {unit && (
                                <span className="text-xl text-refined-muted flex-shrink-0">{unit}</span>
                            )}
                        </div>
                    </div>
                    {Icon && (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                            <Icon className="w-7 h-7 text-white" />
                        </div>
                    )}
                </div>

                {change && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`text-lg font-semibold ${trendColors[trend]}`}>
                            {trend === 'up' && '↑'}
                            {trend === 'down' && '↓'}
                            {trend === 'neutral' && '→'}
                            {' '}{change}
                        </span>
                        <span className="text-sm text-refined-muted">from last month</span>
                    </div>
                )}

                    {chartData.length > 0 && (
                    <div className="mt-auto">
                        <div className="h-20 flex items-end gap-1">
                            {chartData.map((point, i) => {
                                const height = ((point.value - min) / range) * 100;
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-t-sm opacity-70 hover:opacity-100 transition-opacity"
                                        style={{ height: `${height}%`, minHeight: '4px' }}
                                        title={`${point.label}: ${point.value}`}
                                    />
                                );
                            })}
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-refined-muted">
                                {chartData[0]?.label}
                            </span>
                            <span className="text-xs text-refined-muted">
                                {chartData[chartData.length - 1]?.label}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
