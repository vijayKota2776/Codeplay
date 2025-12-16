import { Link } from 'react-router-dom';

export default function ActionCard({ title, description, icon: Icon, to, onClick, variant = 'default' }) {
    const variantStyles = {
        default: 'from-[var(--color-slate-800)] to-[var(--color-slate-700)]',
        primary: 'from-[rgba(59,130,246,0.1)] to-[rgba(96,165,250,0.05)]',
        success: 'from-[rgba(16,185,129,0.1)] to-[rgba(52,211,153,0.05)]',
    };

    const iconBgStyles = {
        default: 'bg-[var(--surface-refined-elevated)] text-[var(--text-refined-secondary)]',
        primary: 'bg-[rgba(59,130,246,0.15)] text-[var(--color-primary-light)]',
        success: 'bg-[rgba(16,185,129,0.15)] text-[var(--color-success-refined-light)]',
    };

    const content = (
        <div className={`card-refined p-6 hover-refined h-full cursor-pointer bg-gradient-to-br ${variantStyles[variant]}`}>
            <div className="flex flex-col items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${iconBgStyles[variant]}`}>
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                <div className="min-w-0 w-full">
                    <h3 className="text-lg font-semibold text-[var(--text-refined-primary)] mb-1 truncate">
                        {title}
                    </h3>
                    <p className="text-sm text-refined line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );

    if (to) {
        return <Link to={to}>{content}</Link>;
    }

    return <div onClick={onClick}>{content}</div>;
}
