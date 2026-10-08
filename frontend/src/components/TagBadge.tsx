import { Tag } from '@/lib/types';

export default function TagBadge({ 
  tag, 
  onClick, 
  active = false 
}: { 
  tag: Tag | { id?: number | string; name: string } | string; 
  onClick?: () => void; 
  active?: boolean;
}) {
  const tagName = typeof tag === 'string' ? tag : tag.name;
  
  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        active 
          ? 'bg-primary-600 text-white shadow-sm' 
          : 'bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50 hover:border-primary-400'
      }`}
    >
      #{tagName}
    </span>
  );
}
