import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroActionCard({
    title,
    description,
    ctaText = 'Get Started',
    icon: Icon,
    to,
    badge
}) {
    const content = (
        <div className="hero-card grid-card grid-3x1 cursor-pointer">
            <div className="flex items-center justify-between gap-6">

                <div className="flex items-center gap-6 flex-1 min-w-0">
                    {Icon && (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-success-refined)] to-[var(--color-success-refined-light)] flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-2xl font-semibold text-[var(--text-refined-primary)] truncate">
                                {title}
                            </h3>
                            {badge && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-accent-refined)]/10 text-[var(--color-accent-refined)] border border-[var(--color-accent-refined)]/20 flex-shrink-0">
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p className="text-refined text-base line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <Button variant="primary" size="lg">
                        <span className="flex items-center gap-2">
                            {ctaText}
                            <ArrowRight className="w-5 h-5 flex-shrink-0" />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );

    if (to) {
        return <Link to={to} className="block">{content}</Link>;
    }

    return content;
}
