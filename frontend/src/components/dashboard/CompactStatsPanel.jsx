export default function CompactStatsPanel({ stats = [] }) {
    return (
        <div className="compact-card grid-card grid-1x2">
            <div className="h-full flex flex-col">
                <h3 className="text-sm font-semibold text-[var(--text-refined-primary)] mb-4 uppercase tracking-wide">
                    Quick Stats
                </h3>

                <div className="flex-1 flex flex-col justify-between gap-3">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-refined)] hover:border-[var(--border-refined-light)] hover:bg-[var(--surface-refined-elevated)] transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {stat.icon && (
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg || 'bg-[var(--surface-refined-elevated)]'}`}>
                                        {typeof stat.icon === 'string' ? (
                                            <span className="text-lg">{stat.icon}</span>
                                        ) : (
                                            stat.icon
                                        )}
                                    </div>
                                )}
                                <span className="text-sm text-refined">{stat.label}</span>
                            </div>
                            <span className="text-lg font-semibold text-[var(--text-refined-primary)]">
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
