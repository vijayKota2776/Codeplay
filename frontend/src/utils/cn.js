/**
 * Utility function to merge class names conditionally
 * Useful for combining Tailwind classes with conditional logic
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
