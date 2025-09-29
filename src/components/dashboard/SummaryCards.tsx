import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, TestTube, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardSummary } from '@/utils/dataStore';

interface SummaryCardsProps {
  summary: DashboardSummary;
  isLoading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, isLoading }) => {
  const cards = [
    {
      title: 'Flow Usage',
      value: summary.flow_usage,
      unit: 'm³',
      delta: summary.flow_delta,
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Chemical Usage',
      value: summary.chemical_usage,
      unit: 'kg',
      delta: summary.chemical_delta,
      icon: TestTube,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Electric Usage',
      value: summary.electric_usage,
      unit: 'kWh',
      delta: summary.electric_delta,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const formatValue = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const renderDelta = (delta: number) => {
    if (delta === 0) return null;
    
    const isPositive = delta > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = isPositive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

    return (
      <Badge variant="secondary" className={`${colorClass} text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {isPositive ? '+' : ''}{formatValue(Math.abs(delta))}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-card">
            <CardHeader className="animate-pulse">
              <div className="h-4 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardContent className="animate-pulse">
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {formatValue(card.value)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.unit}
                </p>
              </div>
              {renderDelta(card.delta)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;