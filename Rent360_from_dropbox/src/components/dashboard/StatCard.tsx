'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  bgColor,
  trend 
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${
                  trend.type === 'up' ? 'text-green-600' : 
                  trend.type === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}