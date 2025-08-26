'use client';

import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  status?: string;
  iconMap: Record<string, LucideIcon>;
  colorMap: Record<string, string>;
  statusBadgeMap: Record<string, React.ReactNode>;
  formatDate: (dateString: string) => string;
}

export default function ActivityItem({
  id,
  type,
  title,
  description,
  date,
  status,
  iconMap,
  colorMap,
  statusBadgeMap,
  formatDate
}: ActivityItemProps) {
  const Icon = iconMap[type] || iconMap.default;
  const colorClass = colorMap[type] || colorMap.default;

  return (
    <div key={id} className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{formatDate(date)}</p>
          {status && statusBadgeMap[status]}
        </div>
      </div>
    </div>
  );
}