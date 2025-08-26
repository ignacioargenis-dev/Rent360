'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color?: string;
  count?: number;
}

export default function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  color = 'blue',
  count 
}: QuickActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer relative">
      <Link href={href}>
        <CardHeader className="pb-3">
          <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
            {count !== undefined && count > 0 && (
              <Badge variant="destructive" className="text-xs">
                {count}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
}